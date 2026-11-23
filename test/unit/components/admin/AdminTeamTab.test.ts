import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * PLAN §3.2 — aba Equipe: staff do tenant; toggle gm visível SOMENTE
 * quando o operador é GM (registro próprio com gm:true na lista);
 * não-GM vê apenas o selo gm em quem já tem. Fail-closed.
 */

vi.stubGlobal('definePageMeta', vi.fn())

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { pianoApiBase: 'https://api-stg.pianolouvorja.com.br' },
}))

const gmUser = { email: 'chefia@test.local', uid: 'u1' }
const staff = (over: Partial<Record<string, unknown>>[] = []) => ({
  data: [
    {
      id: 's1',
      tenant_id: 'pianolouvorja',
      email: 'chefia@test.local',
      name: 'Chefia',
      avatar_url: null,
      bio: null,
      github: null,
      roles: ['staff'],
      status: 'aprovado',
      gm: true,
      since: '2026-01-01T00:00:00Z',
    },
    {
      id: 's2',
      tenant_id: 'pianolouvorja',
      email: 'staff2@test.local',
      name: 'Staff Dois',
      avatar_url: null,
      bio: null,
      github: null,
      roles: ['staff', 'curador'],
      status: 'aprovado',
      gm: false,
      since: '2026-02-01T00:00:00Z',
    },
    ...over,
  ],
  next_cursor: null,
})

async function mountTab(listResponse = staff()) {
  // useFirebaseAuth retorna o usuário logado (email decide GM no client)
  const authUser = {
    value: listResponse.data.some((m) => m.gm) ? gmUser : { email: 'normal@test.local' },
  }
  vi.stubGlobal('useFirebaseAuth', () => ({ user: authUser }))
  const { default: TeamTab } = await import('~/components/admin/AdminTeamTab.vue')
  const wrapper = mount(TeamTab)
  fetchMock.mockResolvedValue(listResponse)
  await flushPromises()
  await flushPromises()
  return wrapper
}

describe('AdminTeamTab (gate gm)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock.mockResolvedValue(staff())
  })

  it('lista somente membros com role staff', async () => {
    const w = await mountTab()
    await flushPromises()
    expect(w.findAll('.equipe-tab__card')).toHaveLength(2)
    expect(w.text()).toContain('Chefia')
    expect(w.text()).toContain('Staff Dois')
  })

  it('operador GM vê o toggle gm nos cards', async () => {
    const w = await mountTab()
    await flushPromises()
    const toggles = w.findAll('.equipe-tab__gm input[type="checkbox"]')
    expect(toggles.length).toBe(2)
    const checked = toggles.filter((t) => (t.element as HTMLInputElement).checked)
    expect(checked).toHaveLength(1) // só Chefia
  })

  it('operador NÃO-GM não vê toggle — apenas selo nos que já são gm', async () => {
    const noGm = staff().data.map((m) => ({ ...m, gm: false }))
    const w = await mountTab({ data: noGm, next_cursor: null })
    await flushPromises()
    expect(w.findAll('.equipe-tab__gm input[type="checkbox"]')).toHaveLength(0)
    expect(w.find('.equipe-tab__gm-badge').exists()).toBe(false)
  })

  it('membro gm:true sem ser operador mostra selo gm para não-GM', async () => {
    const data = staff().data // Chefia gm:true
    vi.stubGlobal('useFirebaseAuth', () => ({ user: { value: { email: 'normal@test.local' } } }))
    const { default: TeamTab } = await import('~/components/admin/AdminTeamTab.vue')
    fetchMock.mockResolvedValue({ data, next_cursor: null })
    const w = mount(TeamTab)
    await flushPromises()
    await flushPromises()
    expect(w.findAll('.equipe-tab__gm input[type="checkbox"]')).toHaveLength(0)
    const badges = w.findAll('.equipe-tab__gm-badge')
    expect(badges).toHaveLength(1)
  })

  it('toggle gm (operador GM) envia PATCH gm boolean', async () => {
    const w = await mountTab()
    await flushPromises()
    fetchMock.mockResolvedValueOnce({ ...staff().data[1], gm: true })
    const toggle = w.findAll('.equipe-tab__gm input[type="checkbox"]')[1]!
    await toggle.setValue(true)
    await flushPromises()
    const patchCall = fetchMock.mock.calls.find(
      ([, opts]) => (opts as { method?: string }).method === 'PATCH',
    )
    expect(patchCall).toBeTruthy()
    expect((patchCall![1] as { body: unknown }).body).toEqual({ gm: true })
  })

  it('erro de fetch vira erro honesto, sem empty-state', async () => {
    vi.stubGlobal('useFirebaseAuth', () => ({ user: { value: gmUser } }))
    const { default: TeamTab } = await import('~/components/admin/AdminTeamTab.vue')
    fetchMock.mockRejectedValue(new Error('500'))
    const w = mount(TeamTab)
    await flushPromises()
    await flushPromises()
    expect(w.find('.equipe-tab__erro').exists()).toBe(true)
    expect(w.find('.equipe-tab__vazio').exists()).toBe(false)
  })
})
