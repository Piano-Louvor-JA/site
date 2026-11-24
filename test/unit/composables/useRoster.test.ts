import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  runtimeConfig: { public: { pianoApiBase: 'https://api-stg.example' } as Record<string, unknown> },
  fetchMock: vi.fn(),
}))

vi.stubGlobal('useRuntimeConfig', () => mocks.runtimeConfig)
vi.stubGlobal('$fetch', mocks.fetchMock)
vi.stubGlobal('onMounted', (fn: () => void) => fn())

import { useRoster } from '~/composables/useRoster'
import type { RosterMember } from '~/composables/useRoster'

const member: RosterMember = {
  id: 'abc',
  name: 'Felipe',
  avatar_url: null,
  bio: null,
  github: 'felipehj',
  since: '2026-11-20T00:00:00Z',
  roles: ['dev'],
}

describe('useRoster', () => {
  it('fetches roster from pianoApiBase with role query and X-Tenant header', async () => {
    mocks.fetchMock.mockResolvedValue({ data: [member] })
    const { members, pending, error } = useRoster('staff')
    await vi.waitFor(() => expect(pending.value).toBe(false))
    expect(mocks.fetchMock).toHaveBeenCalledWith(
      'https://api-stg.example/v1/custom/community/roster?role=staff',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Tenant': 'pianolouvorja' }),
      }),
    )
    expect(members.value).toEqual([member])
    expect(error.value).toBe(false)
  })

  it('falls back to hardcoded team members for staff when API fails (env not confirmed in prod)', async () => {
    mocks.fetchMock.mockRejectedValue(new Error('network'))
    const { members, pending, error } = useRoster('staff')
    await vi.waitFor(() => expect(pending.value).toBe(false))
    expect(error.value).toBe(true)
    expect(members.value.length).toBeGreaterThan(0)
    expect(members.value[0]?.name).toBe('Ezequias Fonseca')
  })

  it('keeps empty roster as honest empty state (no fake members) for tester role', async () => {
    mocks.fetchMock.mockResolvedValue({ data: [] })
    const { members, pending, error } = useRoster('tester')
    await vi.waitFor(() => expect(pending.value).toBe(false))
    expect(members.value).toEqual([])
    expect(error.value).toBe(false)
  })

  it('marks error when payload shape is invalid', async () => {
    mocks.fetchMock.mockResolvedValue({ unexpected: true })
    const { members, pending, error } = useRoster('dev')
    await vi.waitFor(() => expect(pending.value).toBe(false))
    expect(error.value).toBe(true)
    expect(members.value).toEqual([])
  })

  it('encodes role query param', async () => {
    mocks.fetchMock.mockResolvedValue({ data: [] })
    const { pending } = useRoster('conteudo')
    await vi.waitFor(() => expect(pending.value).toBe(false))
    expect(mocks.fetchMock).toHaveBeenCalledWith(
      'https://api-stg.example/v1/custom/community/roster?role=conteudo',
      expect.anything(),
    )
  })

  it('accepts fallback only for staff role; tester/dev get honest error', async () => {
    mocks.fetchMock.mockRejectedValue(new Error('network'))
    const t = useRoster('tester')
    await vi.waitFor(() => expect(t.pending.value).toBe(false))
    expect(t.members.value).toEqual([])
    expect(t.error.value).toBe(true)
    expect(mocks.fetchMock).toHaveBeenCalledWith(
      'https://api-stg.example/v1/custom/community/roster?role=tester',
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Tenant': 'pianolouvorja' }),
      }),
    )
  })
})

it.each([
  null,
  { data: [null] },
  { data: [1] },
  { data: [{ id: 1 }] },
  { data: [{ id: 'x', name: 2 }] },
  { data: [{ id: 'x', name: 'X', roles: null }] },
])('rejects malformed roster %j', async (payload) => {
  mocks.fetchMock.mockResolvedValue(payload)
  const api = useRoster('dev')
  expect(api.isEmpty.value).toBe(false)
  await vi.waitFor(() => expect(api.pending.value).toBe(false))
  expect(api.error.value).toBe(true)
  expect(api.isEmpty.value).toBe(false)
})

it('uses default API when Nuxt config is missing and reports an honest empty roster', async () => {
  vi.stubGlobal('useRuntimeConfig', () => {
    throw new Error('outside Nuxt')
  })
  mocks.fetchMock.mockResolvedValue({ data: [] })
  const api = useRoster('dev')
  await vi.waitFor(() => expect(api.pending.value).toBe(false))
  expect(api.isEmpty.value).toBe(true)
  expect(mocks.fetchMock).toHaveBeenLastCalledWith(
    'https://api.pianolouvorja.com.br/v1/custom/community/roster?role=dev',
    expect.anything(),
  )
})

it.each([undefined, {}, { public: {} }, { public: { pianoApiBase: '' } }])(
  'uses default API for incomplete config %j',
  async (config) => {
    vi.stubGlobal('useRuntimeConfig', () => config)
    mocks.fetchMock.mockResolvedValue({ data: [] })
    const api = useRoster('dev')
    await vi.waitFor(() => expect(api.pending.value).toBe(false))
    expect(api.error.value).toBe(false)
  },
)
