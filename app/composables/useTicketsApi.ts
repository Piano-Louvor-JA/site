/**
 * central-tickets B2 — cliente da API de tickets (SPEC-B2.md §2.1).
 * Client-side direto (site é SSG): fetch + Bearer Firebase ID token.
 * 401 → UnauthorizedError (UI trata sessão expirada). Sem proxy Nitro.
 */
import { useFirebaseAuth } from './useFirebaseAuth'

export class UnauthorizedError extends Error {
  constructor() {
    super('Sessão expirada (401) — faça login novamente')
    this.name = 'UnauthorizedError'
  }
}

export class NotAuthenticatedError extends Error {
  constructor() {
    super('Usuário não autenticado')
    this.name = 'NotAuthenticatedError'
  }
}

export type IntakeCreateInput = {
  name: string
  email: string
  subject: string
  message: string
}

export type TicketCreateInput = {
  subject: string
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  message: string
}

export type Ticket = {
  id: number
  public_ref: string
  subject: string
  priority: string
  status: string
  first_response_due_at?: string | null
  resolve_due_at?: string | null
}

export type TicketMessage = {
  id: number
  ticket_id: number
  author_type: string
  author_uid: string | null
  body: string
  created_at?: string
}

export type IntakeItem = {
  id: number
  protocol: string
  name: string
  email: string
  subject: string
  message: string
  status: string
}

export type KbArticle = {
  id?: number
  slug: string
  title: string
  content?: string
}

type GetToken = () => Promise<string | null>

async function request(
  base: string,
  path: string,
  init: RequestInit & { auth?: boolean },
  getToken: GetToken,
): Promise<unknown> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }
  if (init.auth !== false) {
    const token = await getToken()
    if (!token) throw new NotAuthenticatedError()
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${base}${path}`, { ...init, headers })
  if (res.status === 401) throw new UnauthorizedError()
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `API error ${res.status}`)
  }
  return res.json()
}

/**
 * @param opts.getToken injetável para testes; default usa useFirebaseAuth().
 */
export function useTicketsApi(opts: { getToken?: GetToken } = {}) {
  const config = useRuntimeConfig()
  const base = config.public.pianoApiBase as string
  const getToken: GetToken = opts.getToken ?? (() => useFirebaseAuth().getToken())

  const json = (method: string) => ({ method })

  return {
    // público — sem Bearer
    createIntake: (input: IntakeCreateInput) =>
      request(
        base,
        '/v1/tickets-intake',
        { method: 'POST', body: JSON.stringify(input), auth: false },
        getToken,
      ) as Promise<{ id: number; protocol: string }>,
    intakeStatus: (protocol: string) =>
      request(
        base,
        `/v1/tickets-intake/status/${encodeURIComponent(protocol)}`,
        { method: 'GET', auth: false },
        getToken,
      ) as Promise<{ protocol: string; status: string }>,

    // portal autenticado
    listTickets: () =>
      request(base, '/v1/tickets', json('GET'), getToken) as Promise<{ items: Ticket[] }>,
    createTicket: (input: TicketCreateInput) =>
      request(
        base,
        '/v1/tickets',
        { method: 'POST', body: JSON.stringify(input) },
        getToken,
      ) as Promise<{ id: number; public_ref: string; status: string }>,
    getTicket: (id: number) =>
      request(base, `/v1/tickets/${id}`, json('GET'), getToken) as Promise<Ticket>,
    listMessages: (id: number) =>
      request(base, `/v1/tickets/${id}/messages`, json('GET'), getToken) as Promise<{
        items: TicketMessage[]
      }>,
    postMessage: (id: number, body: string) =>
      request(
        base,
        `/v1/tickets/${id}/messages`,
        { method: 'POST', body: JSON.stringify({ body }) },
        getToken,
      ) as Promise<{ id: number }>,

    // agent+
    setStatus: (id: number, status: string) =>
      request(
        base,
        `/v1/tickets/${id}/status`,
        { method: 'POST', body: JSON.stringify({ status }) },
        getToken,
      ) as Promise<unknown>,
    listIntake: () =>
      request(base, '/v1/tickets/intake', json('GET'), getToken) as Promise<{
        items: IntakeItem[]
      }>,
    triageIntake: (id: number, input: { priority: string; note?: string }) =>
      request(
        base,
        `/v1/tickets-intake/${id}/triage`,
        { method: 'POST', body: JSON.stringify(input) },
        getToken,
      ) as Promise<{ ticket_id?: number }>,
    aiSuggestion: (id: number) =>
      request(
        base,
        `/v1/tickets/${id}/ai-suggestion`,
        { method: 'POST', body: JSON.stringify({ opt_in: true }) },
        getToken,
      ) as Promise<{ suggestion: string | null; confidence: number; reason?: string }>,

    // KB (autenticada client role)
    listKb: () =>
      request(base, '/v1/tickets-kb', json('GET'), getToken) as Promise<{ items: KbArticle[] }>,
    getKbArticle: (slug: string) =>
      request(
        base,
        `/v1/tickets-kb/${encodeURIComponent(slug)}`,
        json('GET'),
        getToken,
      ) as Promise<KbArticle>,
  }
}
