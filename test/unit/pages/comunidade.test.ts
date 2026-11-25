import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('useAppHead', vi.fn())

import ComunidadePage from '~/pages/comunidade.vue'
import pt from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'

const member = (id: string, name: string, roles: string[]) => ({
  id,
  name,
  avatar_url: `https://github.com/${id}.png?size=96`,
  bio: null,
  github: id,
  since: '2026-01-01T00:00:00Z',
  roles,
})

function mountPage(locale = 'pt', messages = pt) {
  const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
  return mount(ComunidadePage, { global: { plugins: [i18n], stubs: ['i'] } })
}

describe('página /comunidade — corpo vivo por role (SPEC D3)', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('busca os 5 roles da API em calls diretas (nunca rota relativa)', async () => {
    fetchMock.mockResolvedValue({ data: [] })
    mountPage()
    await flushPromises()
    const urls = fetchMock.mock.calls.map((c) => String(c[0]))
    expect(urls).toHaveLength(5)
    for (const role of ['dev', 'tester', 'conteudo', 'curador', 'staff']) {
      expect(urls.some((u) => u.endsWith(`?role=${role}`) && /^https?:\/\//.test(u))).toBe(true)
    }
    expect(urls.every((u) => !u.startsWith('/api/'))).toBe(true)
  })

  it('agrupa membros por role com selos de todas as roles (AC2)', async () => {
    fetchMock.mockImplementation(async (url: unknown) => {
      const u = String(url)
      if (u.includes('role=dev')) return { data: [member('felipehj', 'Felipe', ['dev'])] }
      if (u.includes('role=tester'))
        return {
          data: [
            member('felipehj', 'Felipe', ['dev', 'tester']),
            member('jeydson', 'Jeydson', ['tester']),
          ],
        }
      return { data: [] }
    })
    const wrapper = mountPage()
    await flushPromises()
    const html = wrapper.html()
    expect(html).toContain('Felipe')
    expect(html).toContain('Jeydson')
    // Felipe aparece com selos dev+tester (múltiplas roles visíveis)
    const felipeCard = wrapper.find('[data-member-id="felipehj"]')
    expect(felipeCard.exists()).toBe(true)
    // Selos traduzidos de ambas as roles (AC2: multi-role visível)
    expect(felipeCard.text().toLowerCase()).toContain('dev')
    expect(felipeCard.text().toLowerCase()).toContain('testador')
  })

  it('dedupe visual por member id: Felipe (dev+tester) aparece uma vez', async () => {
    fetchMock.mockImplementation(async (url: unknown) => {
      const u = String(url)
      if (u.includes('role=dev')) return { data: [member('felipehj', 'Felipe', ['dev', 'tester'])] }
      if (u.includes('role=tester'))
        return { data: [member('felipehj', 'Felipe', ['dev', 'tester'])] }
      return { data: [] }
    })
    const wrapper = mountPage()
    await flushPromises()
    expect(wrapper.findAll('[data-member-id="felipehj"]')).toHaveLength(1)
  })

  it('loading: enquanto pending, seções não renderizam lista', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    const wrapper = mountPage()
    expect(wrapper.findAll('[data-member-id]').length).toBe(0)
  })

  it('erro honesto: seção dinâmica oculta quando API falha (sem empty-state comemorativo)', async () => {
    fetchMock.mockRejectedValue(new Error('down'))
    const wrapper = mountPage()
    await flushPromises()
    expect(wrapper.findAll('[data-member-id]').length).toBe(0)
    expect(wrapper.find('[data-testid="comunidade-error"]').exists()).toBe(true)
  })

  it('i18n pt/en/es: título traduz sem chave crua no template', async () => {
    fetchMock.mockResolvedValue({ data: [] })
    for (const [locale, messages] of [
      ['pt', pt],
      ['en', en],
      ['es', es],
    ] as const) {
      const wrapper = mountPage(locale, messages)
      await flushPromises()
      const title = wrapper.find('[data-testid="comunidade-title"]').text()
      expect(title.length).toBeGreaterThan(3)
      expect(title).not.toMatch(/^comunidade\./)
    }
  })
})
