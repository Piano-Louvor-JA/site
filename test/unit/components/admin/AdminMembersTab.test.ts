import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * AC2 — aba Membros: roles MULTI via checkboxes (nunca radios);
 * status aprovar/inativar/reativar via PATCH; estados honestos.
 */

vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useHead', vi.fn())

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { pianoApiBase: 'https://api-stg.pianolouvorja.com.br' },
}))

const member = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 'm1',
  tenant_id: 'pianolouvorja',
  email: 'alice@test.local',
  name: 'Alice',
  avatar_url: null,
  bio: null,
  github: null,
  roles: ['dev'],
  status: 'aprovado',
  gm: false,
  since: '2026-01-01T00:00:00Z',
  ...over,
})

async function mountTab(listResponse = { data: [member()], next_cursor: null }) {
  const { default: MembersTab } = await import('~/components/admin/AdminMembersTab.vue')
  fetchMock.mockResolvedValue(listResponse)
  const wrapper = mount(MembersTab)
  await flushPromises()
  return wrapper
}

describe('AdminMembersTab (AC2 + PLAN §3.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock.mockResolvedValue({ data: [member()], next_cursor: null })
  })

  it('carrega membros via GET /v1/custom/admin/members e renderiza nome/email', async () => {
    const w = await mountTab()
    await flushPromises()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/v1/custom/admin/members?limit=50'),
      expect.anything(),
    )
    expect(w.text()).toContain('Alice')
    expect(w.text()).toContain('alice@test.local')
  })

  it('renderiza as 5 roles como CHECKBOXES multi (nenhum radio)', async () => {
    const w = await mountTab()
    await flushPromises()
    const checks = w.findAll('input[type="checkbox"]')
    const radios = w.findAll('input[type="radio"]')
    expect(checks.length).toBeGreaterThanOrEqual(5)
    expect(radios).toHaveLength(0)
    const labels = w.findAll('.membros-tab__role').map((l) => l.text())
    // 1 checkbox por role do enum fechado (5), rótulos traduzidos
    expect(labels).toHaveLength(5)
    expect(new Set(labels).size).toBe(5)
    expect(w.findAll('.membros-tab__role input[type="checkbox"]')).toHaveLength(5)
  })

  it('marca as roles atuais do membro nos checkboxes', async () => {
    const w = await mountTab({
      data: [member({ roles: ['dev', 'tester'] })],
      next_cursor: null,
    })
    await flushPromises()
    const checked = w
      .findAll('input[type="checkbox"]')
      .filter((c) => (c.element as HTMLInputElement).checked)
    expect(checked).toHaveLength(2)
  })

  it('membro com 2 roles aparece com as duas marcadas (AC2)', async () => {
    const w = await mountTab({
      data: [member({ name: 'Bob', roles: ['dev', 'conteudo'] })],
      next_cursor: null,
    })
    await flushPromises()
    const checkedVals = w
      .findAll('input[type="checkbox"]')
      .filter((c) => (c.element as HTMLInputElement).checked)
      .map((c) => (c.element as HTMLInputElement).value)
    expect(checkedVals).toEqual(['dev', 'conteudo'])
  })

  it('Salvar envia PATCH com o conjunto multi de roles', async () => {
    fetchMock.mockResolvedValueOnce({ data: [member()], next_cursor: null })
    const w = await mountTab()
    await flushPromises()
    // adiciona a role tester
    const testerCheck = w
      .findAll('input[type="checkbox"]')
      .find((c) => (c.element as HTMLInputElement).value === 'tester')!
    await testerCheck.setValue(true)
    expect(w.find('.membros-tab__salvar').attributes('disabled')).toBeUndefined()
    fetchMock.mockResolvedValueOnce(member({ roles: ['dev', 'tester'] }))
    await w.find('.membros-tab__salvar').trigger('click')
    await flushPromises()
    const patchCall = fetchMock.mock.calls.find(
      ([u, opts]) =>
        String(u).endsWith('/members/m1') && (opts as { method?: string }).method === 'PATCH',
    )
    expect(patchCall).toBeTruthy()
    expect((patchCall![1] as { body: unknown }).body).toEqual({ roles: ['dev', 'tester'] })
  })

  it('membro pendente tem Aprovar; aprovado tem Inativar; inativo tem Reativar', async () => {
    const wAprovado = await mountTab() // status default: aprovado
    await flushPromises()
    expect(wAprovado.find('.membros-tab__inativar').exists()).toBe(true)
    expect(wAprovado.find('.membros-tab__aprovar').exists()).toBe(false)

    const wPendente = await mountTab({ data: [member({ status: 'pendente' })], next_cursor: null })
    await flushPromises()
    expect(wPendente.find('.membros-tab__aprovar').text()).toContain('Aprovar')

    const wInativo = await mountTab({ data: [member({ status: 'inativo' })], next_cursor: null })
    await flushPromises()
    expect(wInativo.find('.membros-tab__aprovar').text()).toContain('Reativar')
  })

  it('aprovar pendente envia PATCH status=aprovado', async () => {
    const w = await mountTab({ data: [member({ status: 'pendente' })], next_cursor: null })
    await flushPromises()
    fetchMock.mockResolvedValueOnce(member({ status: 'aprovado' }))
    await w.find('.membros-tab__aprovar').trigger('click')
    await flushPromises()
    const patchCall = fetchMock.mock.calls.find(
      ([, opts]) => (opts as { method?: string }).method === 'PATCH',
    )
    expect((patchCall![1] as { body: unknown }).body).toEqual({ status: 'aprovado' })
  })

  it('erro de fetch vira mensagem de erro honesta, não empty-state', async () => {
    fetchMock.mockRejectedValue(new Error('403 sem GM'))
    const { default: MembersTab } = await import('~/components/admin/AdminMembersTab.vue')
    const w = mount(MembersTab)
    await flushPromises()
    expect(w.find('.membros-tab__erro').exists()).toBe(true)
    expect(w.text()).toContain('403')
    expect(w.text()).not.toContain('🎉')
  })

  it('lista vazia sem erro mostra estado vazio neutro (sem parabéns)', async () => {
    const w = await mountTab({ data: [], next_cursor: null })
    await flushPromises()
    expect(w.find('.membros-tab__vazio').exists()).toBe(true)
    expect(w.text()).not.toContain('🎉')
  })
})

it.each([
  [{ statusCode: 403, message: 'Negado' }, 'Erro 403: Negado'],
  [{ statusCode: 500 }, 'Erro 500'],
  [null, 'Erro ao salvar'],
  ['offline', 'Erro ao salvar'],
  [new Error('offline'), 'Erro ao salvar'],
])('keeps roles and status intact when PATCH fails %j', async (error, expected) => {
  const w = await mountTab()
  await w.findAll('input[type="checkbox"]')[1]!.setValue(true)
  fetchMock.mockRejectedValueOnce(error)
  await w.find('.membros-tab__salvar').trigger('click')
  await flushPromises()
  expect(w.find('.membros-tab__feedback').classes()).toContain('--erro')
  if (String(expected).startsWith('Erro ')) expect(w.text()).toContain(String(expected))
  fetchMock.mockRejectedValueOnce(error)
  await w.find('.membros-tab__inativar').trigger('click')
  await flushPromises()
  expect(w.find('.membros-tab__feedback').classes()).toContain('--erro')
  expect(w.find('.membros-tab__status').text()).toBe('aprovado')
  w.unmount()
})

it('changes filters, reloads and deactivates members successfully', async () => {
  const w = await mountTab()
  await w.find('select').setValue('aprovado')
  await flushPromises()
  expect(fetchMock).toHaveBeenLastCalledWith(
    expect.stringContaining('status=aprovado'),
    expect.anything(),
  )
  fetchMock.mockResolvedValueOnce(member({ status: 'inativo' }))
  await w.find('.membros-tab__inativar').trigger('click')
  await flushPromises()
  expect(w.find('.membros-tab__status').text()).toBe('inativo')
  expect(w.find('.membros-tab__feedback').classes()).not.toContain('--erro')
  w.unmount()
})

it('loads another page and reactivates an inactive member', async () => {
  const { default: MembersTab } = await import('~/components/admin/AdminMembersTab.vue')
  fetchMock.mockResolvedValueOnce({ data: [member({ status: 'inativo' })], next_cursor: 'next' })
  const w = mount(MembersTab)
  await flushPromises()
  fetchMock.mockResolvedValueOnce({ data: [member({ id: 'm2', roles: [] })], next_cursor: null })
  await w.find('.membros-tab__mais').trigger('click')
  await flushPromises()
  expect(w.findAll('.membros-tab__card')).toHaveLength(2)
  expect(w.find('.membros-tab__mais').exists()).toBe(false)
  fetchMock.mockResolvedValueOnce(member())
  await w.find('.membros-tab__aprovar').trigger('click')
  await flushPromises()
  expect(w.find('.membros-tab__status').text()).toBe('aprovado')
  w.unmount()
})

it('handles stale member IDs and missing drafts safely', async () => {
  const w = await mountTab()
  const state = w.vm.$.setupState as unknown as {
    dirty(id: string): boolean
    salvar(id: string): Promise<void>
    rascunhos: Record<string, string[]>
  }
  expect(state.dirty('removed')).toBe(false)
  delete state.rascunhos.m1
  expect(state.dirty('m1')).toBe(true)
  fetchMock.mockResolvedValueOnce(member({ roles: [] }))
  await state.salvar('m1')
  expect(fetchMock).toHaveBeenLastCalledWith(
    expect.stringContaining('/members/m1'),
    expect.objectContaining({ body: { roles: [] } }),
  )
  w.unmount()
})
