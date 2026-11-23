import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

/**
 * SPEC central-tickets B2 (SPEC-B2.md §2.1): useTicketsApi chama a API custom
 * do PIANO (pianoApiBase) client-side com Bearer do Firebase ID token.
 * 401 repassado; intake público sem token.
 */

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)
vi.stubGlobal(
  'useRuntimeConfig',
  vi.fn(() => ({ public: { pianoApiBase: 'https://api.test.local' } })),
)

const { useTicketsApi } = await import('~/composables/useTicketsApi')

function jsonResponse(body: unknown, status = 200) {
  return { ok: status < 400, status, json: async () => body } as Response
}

describe('useTicketsApi', () => {
  let getToken: () => Promise<string | null>

  beforeEach(() => {
    fetchMock.mockReset()
    getToken = vi.fn(async () => 'fb-id-token')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createIntake: POST público /v1/tickets-intake sem Bearer', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1, protocol: 'PRC-ABC' }, 201))
    const api = useTicketsApi({ getToken })
    const r = await api.createIntake({
      name: 'Maria',
      email: 'maria@test.local',
      subject: 'Dúvida plano',
      message: 'Olá',
    })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets-intake')
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined()
    expect(r.protocol).toBe('PRC-ABC')
  })

  it('intakeStatus: GET /v1/tickets-intake/status/:protocol sem Bearer', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ protocol: 'PRC-ABC', status: 'pending' }))
    const api = useTicketsApi({ getToken })
    await api.intakeStatus('PRC-ABC')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets-intake/status/PRC-ABC')
    expect(init.method).toBe('GET')
  })

  it('listTickets: GET /v1/tickets com Bearer', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }))
    const api = useTicketsApi({ getToken })
    await api.listTickets()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets')
    expect(init.method).toBe('GET')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer fb-id-token')
  })

  it('createTicket: POST /v1/tickets com Bearer', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ id: 7, public_ref: 'TKT-1', status: 'open' }, 201),
    )
    const api = useTicketsApi({ getToken })
    const r = await api.createTicket({ subject: 'Erro no app', priority: 'P2', message: 'detalhe' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets')
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer fb-id-token')
    expect(JSON.parse(init.body).priority).toBe('P2')
    expect(r.public_ref).toBe('TKT-1')
  })

  it('getTicket/listMessages/postMessage usam /v1/tickets/:id', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 7 }))
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }))
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 30 }, 201))
    const api = useTicketsApi({ getToken })
    await api.getTicket(7)
    await api.listMessages(7)
    await api.postMessage(7, 'resposta')
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/7')
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.test.local/v1/tickets/7/messages')
    expect(fetchMock.mock.calls[2][0]).toBe('https://api.test.local/v1/tickets/7/messages')
    expect(fetchMock.mock.calls[2][1].method).toBe('POST')
  })

  it('setStatus: POST /v1/tickets/:id/status', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))
    const api = useTicketsApi({ getToken })
    await api.setStatus(7, 'resolved')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets/7/status')
    expect(JSON.parse(init.body).status).toBe('resolved')
  })

  it('triageIntake: POST /v1/tickets-intake/:id/triage', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ticket_id: 9 }, 201))
    const api = useTicketsApi({ getToken })
    await api.triageIntake(3, { priority: 'P2', note: 'convertido' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets-intake/3/triage')
    expect(JSON.parse(init.body).priority).toBe('P2')
  })

  it('listIntake: GET /v1/tickets/intake (agent+)', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }))
    const api = useTicketsApi({ getToken })
    await api.listIntake()
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets/intake')
  })

  it('aiSuggestion: POST opt_in true', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ suggestion: null, confidence: 0 }))
    const api = useTicketsApi({ getToken })
    await api.aiSuggestion(7)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets/7/ai-suggestion')
    expect(JSON.parse(init.body)).toEqual({ opt_in: true })
  })

  it('KB: list e artigo por slug', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ items: [] }))
    fetchMock.mockResolvedValueOnce(jsonResponse({ slug: 'como-abrir' }))
    const api = useTicketsApi({ getToken })
    await api.listKb()
    await api.getKbArticle('como-abrir')
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test.local/v1/tickets-kb')
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.test.local/v1/tickets-kb/como-abrir')
  })

  it('401 lança UnauthorizedError para UI tratar sessão expirada', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Unauthorized' }, 401))
    const api = useTicketsApi({ getToken })
    await expect(api.listTickets()).rejects.toThrow(/sessão expirada|unauthorized/i)
  })

  it('sem token em rota autenticada lança antes do fetch', async () => {
    getToken = vi.fn(async () => null)
    const api = useTicketsApi({ getToken })
    await expect(api.listTickets()).rejects.toThrow(/não autenticado|autenticado/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
