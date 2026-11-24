import { describe, expect, it, vi, beforeEach } from 'vitest'

/**
 * PLAN §2.3 — cliente dos endpoints admin do domínio Membro.
 * Toda chamada é fetch direto na API pública (NUXT_PUBLIC_PIANO_API_BASE),
 * nunca rota Nitro relativa (regra SSG do plano). Token Firebase via
 * Authorization; X-Tenant explícito (default pianolouvorja).
 */

vi.stubGlobal('$fetch', vi.fn())
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { pianoApiBase: 'https://api.test.local' },
}))

const adminMember = {
  id: 'abc',
  tenant_id: 'pianolouvorja',
  email: 'a@b.c',
  name: 'Alice',
  avatar_url: null,
  bio: null,
  github: null,
  roles: ['dev'],
  status: 'aprovado',
  gm: false,
  since: '2026-01-01T00:00:00Z',
}

describe('useMembersAdmin', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('$fetch', vi.fn())
  })

  it('listMembers busca /v1/custom/admin/members com Bearer, X-Tenant e filtros', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ data: [adminMember], next_cursor: 'cur1' })
    vi.stubGlobal('$fetch', fetchMock)
    const { useMembersAdmin } = await import('@/composables/useMembersAdmin')
    const api = useMembersAdmin()
    await api.listMembers({ status: 'pendente', role: 'dev', cursor: 'c0', limit: 25 })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test.local/v1/custom/admin/members?status=pendente&role=dev&cursor=c0&limit=25',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer tok',
          'X-Tenant': 'pianolouvorja',
        }),
      }),
    )
    expect(api.members.value).toHaveLength(1)
    expect(api.nextCursor.value).toBe('cur1')
    expect(api.loading.value).toBe(false)
    expect(api.error.value).toBe('')
  })

  it('listMembers sem filtros monta query vazia e usa limite default', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ data: [], next_cursor: null })
    vi.stubGlobal('$fetch', fetchMock)
    const { useMembersAdmin } = await import('@/composables/useMembersAdmin')
    const api = useMembersAdmin()
    await api.listMembers()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test.local/v1/custom/admin/members?limit=50',
      expect.anything(),
    )
    expect(api.members.value).toEqual([])
    expect(api.nextCursor.value).toBeNull()
    expect(api.exhausted.value).toBe(true)
  })

  it('listMembers grava error honesto quando o fetch falha', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(new Error('403')))
    const { useMembersAdmin } = await import('@/composables/useMembersAdmin')
    const api = useMembersAdmin()
    await api.listMembers()
    expect(api.error.value).toBe('403')
    expect(api.loading.value).toBe(false)
  })

  it('updateMember faz PATCH no id do membro e atualiza a lista local', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ data: [adminMember], next_cursor: null })
      .mockResolvedValueOnce({ ...adminMember, roles: ['dev', 'tester'] })
    vi.stubGlobal('$fetch', fetchMock)
    const { useMembersAdmin } = await import('@/composables/useMembersAdmin')
    const api = useMembersAdmin()
    await api.listMembers()
    const updated = await api.updateMember('abc', { roles: ['dev', 'tester'] })
    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://api.test.local/v1/custom/admin/members/abc',
      expect.objectContaining({
        method: 'PATCH',
        body: { roles: ['dev', 'tester'] },
      }),
    )
    expect(updated.roles).toEqual(['dev', 'tester'])
    expect(api.members.value[0]?.roles).toEqual(['dev', 'tester'])
  })

  it('updateMember propaga erro com statusCode para feedback honesto', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue({ statusCode: 403, message: 'sem GM' }))
    const { useMembersAdmin } = await import('@/composables/useMembersAdmin')
    const api = useMembersAdmin()
    await expect(api.updateMember('abc', { status: 'inativo' })).rejects.toMatchObject({
      statusCode: 403,
    })
  })

  it('lança quando não há token (fail-closed, sem chamada)', async () => {
    vi.stubGlobal('useNuxtApp', () => ({ $firebaseAuth: { currentUser: null } }))
    const fetchMock = vi.fn()
    vi.stubGlobal('$fetch', fetchMock)
    const { useMembersAdmin } = await import('@/composables/useMembersAdmin')
    const api = useMembersAdmin()
    await expect(api.listMembers()).rejects.toThrow('não autenticado')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

it('preserva filtros na paginação e encerra sem chamadas extras', async () => {
  vi.stubGlobal('useNuxtApp', () => ({
    $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
  }))
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { pianoApiBase: 'https://api.test.local/' } }))
  const fetch = vi
    .fn()
    .mockResolvedValueOnce({ data: [adminMember], next_cursor: 'next' })
    .mockResolvedValueOnce({ data: [{ ...adminMember, id: 'two' }], next_cursor: null })
  vi.stubGlobal('$fetch', fetch)
  const { useMembersAdmin } = await import('~/composables/useMembersAdmin')
  const api = useMembersAdmin()
  expect(api.hasMembers.value).toBe(false)
  await api.loadMore()
  expect(fetch).not.toHaveBeenCalled()
  await api.listMembers({ status: 'aprovado', role: 'dev', limit: 10 })
  expect(api.hasMembers.value).toBe(true)
  api.loading.value = true
  await api.loadMore()
  expect(fetch).toHaveBeenCalledTimes(1)
  api.loading.value = false
  await api.loadMore()
  expect(fetch.mock.calls[1]![0]).toContain('status=aprovado&role=dev&cursor=next&limit=10')
  expect(api.members.value.map((m) => m.id)).toEqual(['abc', 'two'])
  await api.loadMore()
  expect(fetch).toHaveBeenCalledTimes(2)
})

it('trata erros não Error e atualização de registro fora da página', async () => {
  vi.stubGlobal('useNuxtApp', () => ({
    $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
  }))
  vi.stubGlobal('useRuntimeConfig', () => ({ public: {} }))
  const fetch = vi.fn().mockRejectedValueOnce('offline').mockResolvedValueOnce(adminMember)
  vi.stubGlobal('$fetch', fetch)
  const { useMembersAdmin } = await import('~/composables/useMembersAdmin')
  const api = useMembersAdmin()
  await api.listMembers({ status: '', role: '' })
  expect(api.error.value).toBe('Erro ao carregar membros')
  await expect(api.updateMember('a/b', {})).resolves.toEqual(adminMember)
  expect(fetch.mock.calls[1]![0]).toBe('/v1/custom/admin/members/a%2Fb')
  expect(api.members.value).toEqual([])
})
