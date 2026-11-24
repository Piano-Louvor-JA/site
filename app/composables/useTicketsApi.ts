/** Client-side adapter for the existing /v1/tickets API. */
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
export type Priority = 'P1' | 'P2' | 'P3' | 'P4'
export type IntakeCreateInput = {
  requester_name: string
  requester_email: string
  subject: string
  message: string
  consent_lgpd: true
}
export type TicketCreateInput = {
  subject: string
  priority: Priority
  description: string
  category?: string
}
export type Ticket = {
  id: string
  tenant_id: string
  subject: string
  priority: string
  status: string
  description?: string
  first_response_due_at?: string | null
  resolution_due_at?: string | null
}
export type TicketMessage = {
  id: string
  author_type: string
  author_ref: string
  body: string
  visibility: string
  created_at?: string
}
export type IntakeItem = {
  id: string
  protocol: string
  requester_name: string
  subject: string
  status: string
  tenant_id: string | null
}
export type KbArticle = {
  id: string
  title: string
  scope: string
  tenant_id: string | null
  version: number
}
type GetToken = () => Promise<string | null>

export function useTicketsApi(opts: { getToken?: GetToken } = {}) {
  const base = String(useRuntimeConfig().public.pianoApiBase).replace(/\/$/, '')
  const getToken = opts.getToken ?? (() => useFirebaseAuth().getToken())
  async function request<T>(
    path: string,
    method = 'GET',
    body?: unknown,
    authenticated = true,
  ): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authenticated) {
      const token = await getToken()
      if (!token) throw new NotAuthenticatedError()
      headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(`${base}/v1/tickets${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    if (res.status === 401) throw new UnauthorizedError()
    if (!res.ok) {
      const error = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(error.error ?? `API error ${res.status}`)
    }
    return res.json() as Promise<T>
  }
  const ticketPath = (id: string) => `/portal/tickets/${encodeURIComponent(id)}`
  return {
    createIntake: (input: IntakeCreateInput) =>
      request<{ protocol: string }>('/public/intake', 'POST', input, false),
    listTickets: () => request<{ data: Ticket[] }>('/portal/tickets'),
    createTicket: (input: TicketCreateInput) =>
      request<{ id: string; tenant_id: string }>('/portal/tickets', 'POST', input),
    getTicket: (id: string) => request<Ticket>(ticketPath(id)),
    listMessages: (id: string) => request<{ data: TicketMessage[] }>(`${ticketPath(id)}/messages`),
    postMessage: (id: string, body: string) =>
      request<{ id: string }>(`${ticketPath(id)}/messages`, 'POST', { body, visibility: 'public' }),
    listIntake: () => request<{ data: IntakeItem[] }>('/admin/triage'),
    triageIntake: (id: string, input: { tenant_id: string; note?: string }) =>
      request<{ ticket_id: string }>(
        `/admin/triage/${encodeURIComponent(id)}/convert`,
        'POST',
        input,
      ),
    aiSuggestion: (draft: string) =>
      request<{
        suggestion: string
        decision: 'draft' | 'blocked'
        blockedReasons: string[]
        requiresHumanReview: true
        runId: string
      }>('/ai/suggest', 'POST', { draft }),
    listKb: () => request<{ data: KbArticle[] }>('/kb', 'GET', undefined, false),
  }
}
