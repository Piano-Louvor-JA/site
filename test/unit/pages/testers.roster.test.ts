import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('useAppHead', vi.fn())

// useTesters (gviz) mockado — nesta suíte testamos só a integração API do roster tester.
const { computed, ref } = await import('vue')
vi.mock('~/composables/useTesters', () => ({
  useTestersRoster: () => ({
    testers: ref([
      {
        id: 'sheettester',
        name: 'Tester Da Sheet',
        avatar: 'https://github.com/sheettester.png?size=96',
        focus: ['community'],
        links: [],
      },
    ]),
    sheetBios: ref({}),
    sinceById: ref({}),
    pending: ref(false),
    enabled: ref(true),
  }),
  useTestersReports: () => ({
    reports: ref(null),
    positiveReports: ref(null),
    pending: ref(false),
    hasReports: computed(() => false),
    hasPositiveReports: computed(() => false),
    enabled: ref(false),
  }),
}))

import TestersPage from '~/pages/testers.vue'
import pt from '../../../i18n/pt-BR.json'

const tester = {
  id: 'jeydson',
  name: 'Jeydson Gomes',
  avatar_url: 'https://github.com/jeydson.png?size=96',
  bio: 'Testa em condições reais',
  github: 'jeydson',
  since: '2026-01-15T00:00:00Z',
  roles: ['tester'],
}

function mountPage() {
  const i18n = createI18n({ legacy: false, locale: 'pt', messages: { pt } })
  return mount(TestersPage, { global: { plugins: [i18n], stubs: ['i'] } })
}

describe('página /testers lê roster tester da API (SPEC Comunidade D3)', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('renderiza membros do roster tester da API junto do fallback gviz', async () => {
    fetchMock.mockResolvedValue({ data: [tester] })
    const wrapper = mountPage()
    await flushPromises()
    const html = wrapper.html()
    expect(html).toContain('Jeydson Gomes')
    expect(html).toContain('Tester Da Sheet') // gviz fallback continua visível
    expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('role=tester'))).toBe(true)
  })

  it('API falha: fallback gviz sozinho, erro honesto exposto no VM', async () => {
    fetchMock.mockRejectedValue(new Error('network'))
    const wrapper = mountPage()
    await flushPromises()
    expect(wrapper.vm.apiTesterNames).toEqual([])
    expect(wrapper.vm.apiError).toBe(true)
    expect(wrapper.html()).toContain('Tester Da Sheet')
  })

  it('roster API vazio sem erro: gviz fallback mantido', async () => {
    fetchMock.mockResolvedValue({ data: [] })
    const wrapper = mountPage()
    await flushPromises()
    expect(wrapper.vm.apiTesterNames).toEqual([])
    expect(wrapper.vm.apiError).toBe(false)
    expect(wrapper.html()).toContain('Tester Da Sheet')
  })

  it('dedupe: tester presente na API e na sheet aparece uma vez só', async () => {
    fetchMock.mockResolvedValue({
      data: [{ ...tester, name: 'Tester Da Sheet', github: 'sheettester' }],
    })
    const wrapper = mountPage()
    await flushPromises()
    const html = wrapper.html()
    expect(html.split('Tester Da Sheet').length - 1).toBe(1)
  })
})
