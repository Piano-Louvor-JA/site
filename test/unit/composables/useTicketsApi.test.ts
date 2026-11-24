import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useTicketsApi } from '~/composables/useTicketsApi'

vi.mock('~/composables/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({ getToken: async () => 'default-token' }),
}))
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)
vi.stubGlobal('useRuntimeConfig', () => ({ public: { pianoApiBase: 'https://api.test.local/' } }))
const response = (body: unknown, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => body,
})

describe('tickets API contract implemented by api#278', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })
  const api = () => useTicketsApi({ getToken: async () => 'id-token' })

  it('public intake sends the actual consent and requester fields without authentication', async () => {
    fetchMock.mockResolvedValue(response({ protocol: 'PROTO-20261124-AABBCCDD' }, 201))
    const input = {
      requester_name: 'Maria',
      requester_email: 'maria@example.org',
      subject: 'Ajuda',
      message: 'Preciso de ajuda',
      consent_lgpd: true as const,
    }
    expect(await api().createIntake(input)).toEqual({ protocol: 'PROTO-20261124-AABBCCDD' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets/public/intake')
    expect(JSON.parse(init.body)).toEqual(input)
    expect(init.headers.Authorization).toBeUndefined()
  })

  it('portal list preserves data envelopes and UUIDs with a Bearer token', async () => {
    const result = {
      data: [
        { id: 'uuid-ticket', tenant_id: 'org', subject: 'Ajuda', status: 'new', priority: 'P3' },
      ],
    }
    fetchMock.mockResolvedValue(response(result))
    expect(await api().listTickets()).toEqual(result)
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/portal/tickets')
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer id-token')
  })

  it('ticket creation sends description and accepts the actual response', async () => {
    fetchMock.mockResolvedValue(response({ id: 'uuid-ticket', tenant_id: 'org' }, 201))
    const input = { subject: 'Ajuda', description: 'Descrição completa', priority: 'P2' as const }
    expect(await api().createTicket(input)).toEqual({ id: 'uuid-ticket', tenant_id: 'org' })
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/portal/tickets')
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(input)
  })

  it('details and messages use encoded string identifiers; replies are public', async () => {
    fetchMock.mockResolvedValue(response({ data: [] }))
    await api().getTicket('uuid/a')
    await api().listMessages('uuid/a')
    await api().postMessage('uuid/a', 'Resposta')
    expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
      'https://api.test.local/v1/tickets/portal/tickets/uuid%2Fa',
      'https://api.test.local/v1/tickets/portal/tickets/uuid%2Fa/messages',
      'https://api.test.local/v1/tickets/portal/tickets/uuid%2Fa/messages',
    ])
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      body: 'Resposta',
      visibility: 'public',
    })
  })

  it('admin triage uses an explicit organization and no unsupported priority override', async () => {
    fetchMock.mockResolvedValue(response({ data: [] }))
    await api().listIntake()
    await api().triageIntake('triage/id', { tenant_id: 'organization', note: 'Revisado' })
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/admin/triage')
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.test.local/v1/tickets/admin/triage/triage%2Fid/convert',
    )
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      tenant_id: 'organization',
      note: 'Revisado',
    })
  })

  it('draft review uses the existing fail-closed endpoint', async () => {
    const result = {
      suggestion: 'Rascunho',
      decision: 'draft',
      blockedReasons: ['source_not_approved'],
    }
    fetchMock.mockResolvedValue(response(result))
    expect(await api().aiSuggestion('Rascunho')).toEqual(result)
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/ai/suggest')
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ draft: 'Rascunho' })
  })

  it('KB listing is public and preserves its data envelope', async () => {
    fetchMock.mockResolvedValue(response({ data: [{ id: 'kb', title: 'Guia', version: 1 }] }))
    expect((await api().listKb()).data[0].id).toBe('kb')
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/kb')
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('does not expose functions that have no server endpoint', () => {
    expect(api()).not.toHaveProperty('intakeStatus')
    expect(api()).not.toHaveProperty('setStatus')
    expect(api()).not.toHaveProperty('getKbArticle')
  })

  it('401 is an explicit expired session error', async () => {
    fetchMock.mockResolvedValue(response({}, 401))
    await expect(api().listTickets()).rejects.toThrow(/Sessão expirada/)
  })

  it('missing token prevents authenticated network calls', async () => {
    await expect(useTicketsApi({ getToken: async () => null }).listTickets()).rejects.toThrow(
      /não autenticado/,
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('uses Firebase token by default and reports server errors', async () => {
    fetchMock.mockResolvedValue(response({ error: 'sem acesso' }, 403))
    await expect(useTicketsApi().listTickets()).rejects.toThrow('sem acesso')
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer default-token')
  })

  it('handles non-JSON errors without hiding the HTTP status', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('HTML')
      },
    })
    await expect(api().listTickets()).rejects.toThrow('API error 502')
  })
})
