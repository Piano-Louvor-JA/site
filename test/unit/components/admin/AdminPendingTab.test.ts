import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PendingTab from '~/components/admin/AdminPendingTab.vue'

const mocks = vi.hoisted(() => ({ parse: vi.fn() }))
vi.mock('~/utils/community-pending', () => ({ parseCommunityPending: mocks.parse }))
const fetch = vi.fn()
const getToken = vi.fn()
const config = {
  public: { testersSheetUrl: 'https://sheet.test/csv', pianoApiBase: 'https://api.test/' },
}
const base = { row: 2, nome: 'Alice', email: 'alice@test.local', status: 'pendente' }
const lists = (filled = false) => ({
  testers: [
    { ...base, bio: filled ? 'Bio' : '', foco: filled ? 'TV' : '', links: filled ? 'Link' : '' },
  ],
  devs: [
    {
      ...base,
      github: filled ? 'dev' : '',
      portfolio: filled ? 'Site' : '',
      stack: filled ? 'Vue' : '',
      areas: filled ? 'App' : '',
      disponibilidade: filled ? 'Hoje' : '',
      bio: filled ? 'Bio' : '',
    },
  ],
  relatos: [
    {
      ...base,
      tipo: 'Bug',
      modulo: filled ? 'App' : '',
      versao: filled ? '1.0' : '',
      descricao: filled ? 'Erro' : '',
      passos: filled ? 'Abrir' : '',
    },
  ],
})

beforeEach(() => {
  vi.stubGlobal('$fetch', fetch)
  vi.stubGlobal('useRuntimeConfig', () => config)
  vi.stubGlobal('useFirebaseAuth', () => ({ getToken }))
  config.public.testersSheetUrl = 'https://sheet.test/csv'
  config.public.pianoApiBase = 'https://api.test/'
  fetch.mockReset().mockResolvedValue('csv')
  getToken.mockReset().mockResolvedValue('token')
  mocks.parse.mockReset().mockReturnValue(lists())
})
async function open() {
  const w = mount(PendingTab)
  await flushPromises()
  return w
}

describe('Pending moderation', () => {
  it.each([false, true])('shows all three inboxes and their data (filled=%s)', async (filled) => {
    mocks.parse.mockReturnValue(lists(filled))
    const w = await open()
    expect(w.text()).toContain('Alice')
    expect(w.findAll('.pendentes-tab__badge').map((x) => x.text())).toEqual(['1', '1', '1'])
    await w.findAll('.pendentes-tab__subtab')[1]!.trigger('click')
    expect(w.text()).toContain(filled ? 'Vue' : '—')
    await w.findAll('.pendentes-tab__subtab')[2]!.trigger('click')
    expect(w.text()).toContain(filled ? 'App' : 'geral')
    expect(w.text()).toContain(filled ? '1.0' : '?')
    w.unmount()
  })
  it('shows neutral empty messages in each inbox', async () => {
    mocks.parse.mockReturnValue({ testers: [], devs: [], relatos: [] })
    const w = await open()
    for (const button of w.findAll('.pendentes-tab__subtab')) {
      await button.trigger('click')
      expect(w.find('.pendentes-tab__vazio').exists()).toBe(true)
    }
    w.unmount()
  })
  it('hides lists when sheet is not configured', async () => {
    config.public.testersSheetUrl = ''
    const w = await open()
    expect(w.text()).toContain('não configurada')
    expect(fetch).not.toHaveBeenCalled()
    expect(w.find('.pendentes-tab__lista').exists()).toBe(false)
    w.unmount()
  })
  it('reports load errors and recovers on reload', async () => {
    fetch.mockRejectedValueOnce(new Error('offline'))
    const w = await open()
    expect(w.text()).toContain('Erro ao carregar pendentes')
    expect(w.find('.pendentes-tab__lista').exists()).toBe(false)
    await w.find('.pendentes-tab__recarregar').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Alice')
    w.unmount()
  })
  it('keeps current entries visible while reloading and normalizes nontext sheet responses', async () => {
    config.public.testersSheetUrl += '?export=csv'
    const w = await open()
    let resolve!: (value: unknown) => void
    fetch.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r
        }),
    )
    await w.find('.pendentes-tab__recarregar').trigger('click')
    expect(w.find('[role="status"]').exists()).toBe(true)
    resolve({})
    await flushPromises()
    expect(mocks.parse).toHaveBeenLastCalledWith('', 'csv', 'csv')
    expect(fetch.mock.calls[0]![0]).toContain('&sheet=testadores')
    fetch.mockResolvedValue(null)
    await w.find('.pendentes-tab__recarregar').trigger('click')
    await flushPromises()
    expect(mocks.parse).toHaveBeenLastCalledWith('', '', '')
    w.unmount()
  })
  it.each([
    [0, '.pendentes-tab__aprovar', 'testadores', 'aprovar', { emailEnviado: true }],
    [
      0,
      '.pendentes-tab__rejeitar',
      'testadores',
      'rejeitar',
      { emailEnviado: false, emailErro: 'SMTP' },
    ],
    [1, '.pendentes-tab__aprovar', 'desenvolvedores', 'aprovar', { emailEnviado: false }],
    [1, '.pendentes-tab__rejeitar', 'desenvolvedores', 'rejeitar', { emailEnviado: true }],
    [2, '.pendentes-tab__aprovar', 'relatos', 'resolver', { emailEnviado: false }],
    [2, '.pendentes-tab__rejeitar', 'relatos', 'rejeitar', { emailEnviado: true }],
  ] as const)(
    'submits action %s %s and refreshes the inbox',
    async (tab, button, name, action, response) => {
      const w = await open()
      await w.findAll('.pendentes-tab__subtab')[tab]!.trigger('click')
      fetch.mockResolvedValueOnce(response)
      await w.find(button).trigger('click')
      await flushPromises()
      expect(fetch).toHaveBeenCalledWith(
        'https://api.test/v1/custom/admin/community/review',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer token' },
          body: { tab: name, row: 2, acao: action },
        }),
      )
      expect(mocks.parse).toHaveBeenCalledTimes(2)
      w.unmount()
    },
  )
  it.each([
    [{ statusCode: 403, statusMessage: 'Negado' }, 'Erro 403: Negado'],
    [{ statusCode: 400, message: 'Inválido' }, 'Erro 400: Inválido'],
    [{ statusCode: 500 }, 'Erro 500'],
    [new Error('offline'), 'Erro ao processar'],
    [null, 'Erro ao processar'],
    ['offline', 'Erro ao processar'],
    [{ statusMessage: '' }, 'Erro ao processar'],
  ])('shows structured review errors %j', async (error, message) => {
    config.public.pianoApiBase = ''
    getToken.mockResolvedValue(null)
    const w = await open()
    fetch.mockRejectedValueOnce(error)
    await w.find('.pendentes-tab__aprovar').trigger('click')
    await flushPromises()
    expect(w.find('.pendentes-tab__feedback').text()).toBe(message)
    expect(w.find('.pendentes-tab__feedback').classes()).toContain('--erro')
    expect(fetch).toHaveBeenCalledWith(
      'https://api.pianolouvorja.com.br/v1/custom/admin/community/review',
      expect.objectContaining({ headers: {} }),
    )
    w.unmount()
  })
})

it('uses default settings when public environment variables are absent', async () => {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: {} }))
  const w = await open()
  expect(w.text()).toContain('não configurada')
  w.unmount()
})

it('uses default API when only the sheet is configured', async () => {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { testersSheetUrl: 'https://sheet.test' } }))
  const w = await open()
  fetch.mockResolvedValueOnce({ emailEnviado: true })
  await w.find('.pendentes-tab__aprovar').trigger('click')
  await flushPromises()
  expect(fetch).toHaveBeenCalledWith(
    'https://api.pianolouvorja.com.br/v1/custom/admin/community/review',
    expect.anything(),
  )
  w.unmount()
})
