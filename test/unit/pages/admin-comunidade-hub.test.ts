import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * PLAN §3.2 — hub /admin/comunidade com 3 abas (Pendentes/Membros/Equipe)
 * e redirect de /admin/membros → /admin/comunidade?tab=membros.
 * AC2: roles multi via checkboxes; flag gm visível só para GM.
 * Filhos (AdminMembersTab/AdminTeamTab) montam de verdade — integração
 * hub → componente → composable → fetch.
 */

vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useHead', vi.fn())
vi.stubGlobal('defineNuxtRouteMiddleware', (fn: (...args: unknown[]) => unknown) => fn)

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
}))

const adminMember = (over: Partial<Record<string, unknown>> = {}) => ({
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

/** CSV mínimo que o parseCommunityPending aceita (só cabeçalhos = listas vazias) */
const sheetText = () => 'nome,email,status\n'

/** hub lê ?tab= para escolher a aba inicial */
let routeQuery: Record<string, string> = {}
const routerPush = vi.fn()
vi.stubGlobal('useRoute', () => ({ path: '/admin/comunidade', query: routeQuery, params: {} }))
vi.stubGlobal('useRouter', () => ({ push: routerPush, replace: routerPush }))
// sheet configurada — o fluxo de pendentes precisa dela para existir
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    pianoApiBase: 'https://api-stg.pianolouvorja.com.br',
    testersSheetUrl: 'https://sheets.test.local/gviz',
  },
}))

async function mountHub() {
  const [{ default: Hub }, { default: Pending }, { default: Members }, { default: Team }] =
    await Promise.all([
      import('~/pages/admin/comunidade.vue'),
      import('~/components/admin/AdminPendingTab.vue'),
      import('~/components/admin/AdminMembersTab.vue'),
      import('~/components/admin/AdminTeamTab.vue'),
    ])
  const wrapper = mount(Hub, {
    global: {
      components: { AdminPendingTab: Pending, AdminMembersTab: Members, AdminTeamTab: Team },
    },
  })
  await flushPromises()
  return wrapper
}

function tabButton(w: ReturnType<typeof mount>, name: string) {
  return w.findAll('.admin-comunidade__tab').find((b) => b.text().toLowerCase().includes(name))!
}

describe('hub /admin/comunidade (3 abas)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeQuery = {}
    fetchMock.mockImplementation((url: string) => {
      if (String(url).includes('sheet=')) return Promise.resolve(sheetText())
      if (String(url).includes('/v1/custom/admin/members')) {
        return Promise.resolve({ data: [adminMember()], next_cursor: null })
      }
      return Promise.resolve({})
    })
  })

  it('renderiza as três abas: Pendentes, Membros, Equipe', async () => {
    const w = await mountHub()
    const labels = w.findAll('.admin-comunidade__tab').map((b) => b.text().toLowerCase())
    expect(labels.some((l) => l.includes('pendentes'))).toBe(true)
    expect(labels.some((l) => l.includes('membros'))).toBe(true)
    expect(labels.some((l) => l.includes('equipe'))).toBe(true)
    expect(w.findAll('.admin-comunidade__tab')).toHaveLength(3)
  })

  it('aba Pendentes (default) mantém o fluxo da Sheet de moderação', async () => {
    await mountHub()
    const sheetCalls = fetchMock.mock.calls.filter(([u]) => String(u).includes('sheet='))
    expect(sheetCalls).toHaveLength(3) // testadores + desenvolvedores + relatos
  })

  it('aba Membros lista membros do domínio via API admin', async () => {
    const w = await mountHub()
    await tabButton(w, 'membros').trigger('click')
    await flushPromises()
    expect(w.find('.membros-tab').exists()).toBe(true)
    const membersCalls = fetchMock.mock.calls.filter(([u]) =>
      String(u).includes('/v1/custom/admin/members'),
    )
    expect(membersCalls.length).toBeGreaterThanOrEqual(1)
    expect(w.text()).toContain('Alice')
  })

  it('aba Equipe monta painel de staff', async () => {
    const w = await mountHub()
    await tabButton(w, 'equipe').trigger('click')
    await flushPromises()
    expect(w.find('.equipe-tab').exists()).toBe(true)
  })

  it('deep-link ?tab=membros abre direto na aba Membros', async () => {
    routeQuery = { tab: 'membros' }
    const w = await mountHub()
    await flushPromises()
    expect(w.find('.membros-tab').exists()).toBe(true)
  })

  it('?tab inválido cai na aba default (pendentes), sem quebrar', async () => {
    routeQuery = { tab: 'qualquer-coisa' }
    const w = await mountHub()
    await flushPromises()
    expect(w.find('.membros-tab').exists()).toBe(false)
    expect(w.text()).toContain('Testadores')
  })

  it('trocar de aba atualiza a URL (?tab=) sem recarregar', async () => {
    const w = await mountHub()
    await tabButton(w, 'equipe').trigger('click')
    await flushPromises()
    expect(routerPush).toHaveBeenCalledWith(expect.objectContaining({ query: { tab: 'equipe' } }))
  })
})

describe('/admin/membros redirect', () => {
  it('middleware redireciona para /admin/comunidade?tab=membros', async () => {
    const navMock = vi.fn((x: unknown) => x)
    vi.stubGlobal('navigateTo', navMock)
    const { default: middleware } = await import('~/middleware/redirect-membros')
    middleware({ path: '/admin/membros', query: {} } as never, { path: '/' } as never)
    expect(navMock).toHaveBeenCalledWith({ path: '/admin/comunidade', query: { tab: 'membros' } })
  })
})
