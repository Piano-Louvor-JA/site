import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * SPEC: piano-site-admin-review-fix v1.0.0 (frozen)
 * A1: PUT sheet confirmado + SMTP falho/rejeitando → 200 {ok:true, emailEnviado:false, emailErro}
 * A2: PUT sheet falho → erro (sem ok:true)
 * A3: falha SMTP não desfaz/reverte a moderação persistida
 *
 * Padrão Nitro do repo: defineEventHandler/readBody/createError são auto-imports
 * — stubados globalmente aqui (vi.stubGlobal), handler importado após os stubs.
 */

const globalCreateError = vi.fn(
  (opts: { statusCode?: number; statusMessage?: string; message?: string }) => {
    const err = new Error(opts?.message || opts?.statusMessage || 'erro') as Error & {
      statusCode?: number
      statusMessage?: string
    }
    err.statusCode = opts?.statusCode
    err.statusMessage = opts?.statusMessage
    return err
  },
)

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('createError', globalCreateError)

const mockSendMail = vi.fn()
const mockRender = vi.fn(() => ({ subject: 's', html: '<p>h</p>' }))

// Auto-imports do Nitro (server/utils são injetados pelo Nuxt em runtime).
// Em Vitest, seguir o padrão do repo: vi.stubGlobal para cada auto-import.
vi.stubGlobal('sendMail', mockSendMail)
vi.stubGlobal('renderModeracao', mockRender)

// estado compartilhado do mock de $fetch
const fetchState = vi.hoisted(() => ({
  putOk: true,
  putCalls: [] as Array<{ url: string; body: unknown }>,
}))

// $fetch global do Nitro: GET lê linha, PUT grava status
const mockFetch = vi.fn(async (url: string, opts?: { method?: string; body?: unknown }) => {
  if (String(url).includes('oauth2.googleapis.com'))
    return { access_token: 'tok', expires_in: 3600 }
  if (opts?.method === 'PUT') {
    fetchState.putCalls.push({ url, body: opts.body })
    if (!fetchState.putOk) {
      const err = new Error('sheet put failed') as Error & { statusCode?: number }
      err.statusCode = 502
      throw err
    }
    return {}
  }
  // GET linha A..L do testador Jeydson
  return {
    values: [
      'Jeydson',
      'garciajeydson@gmail.com',
      '',
      'bio',
      'app-desktop',
      '',
      '',
      '',
      '',
      'FALSE',
      '',
      'pendente',
    ],
  }
})
vi.stubGlobal('$fetch', mockFetch)

vi.stubGlobal(
  'readBody',
  vi.fn(async () => ({ tab: 'testadores', row: 2, acao: 'aprovar' })),
)

// requireAuth auto-import — stub via módulo mockado é impossível (auto-import);
// o handler chama requireAuth(event) que vem do auto-import de server/utils.
// Como o Vitest do Nuxt resolve auto-imports de server via import no runtime,
// aqui seguimos o padrão do repo: stub global.
vi.stubGlobal(
  'requireAuth',
  vi.fn(async () => 'uid-admin'),
)

// envs exigidas pelo handler (SPEC: OAuth/Sheet são pré-condições do PUT)
process.env.TESTERS_SHEET_ID = 'test-sheet-id'
process.env.GOOGLE_CLIENT_ID = 'client-id'
process.env.GOOGLE_CLIENT_SECRET = 'client-secret'
process.env.GOOGLE_REFRESH_TOKEN = 'refresh-token'
process.env.NUXT_PUBLIC_WHATSAPP_URL = 'https://chat.whatsapp.com/test'

// handler importado após os stubs de auto-imports
const handler = (await import('@@/server/api/admin/community/review.post.ts')).default as (
  event: unknown,
) => Promise<Record<string, unknown>>

beforeEach(() => {
  vi.clearAllMocks()
  fetchState.putOk = true
  fetchState.putCalls = []
})

describe('SPEC piano-site-admin-review-fix — moderação não quebra com SMTP', () => {
  it('A1a: sendMail resolve com {success:false} → 200 {ok:true, emailEnviado:false, emailErro}', async () => {
    mockSendMail.mockResolvedValueOnce({ success: false, error: 'SMTP não configurado' })
    const res = await handler({})
    expect(res.ok).toBe(true)
    expect(res.status).toBe('aprovado')
    expect(res.emailEnviado).toBe(false)
    expect(res.emailErro).toBe('SMTP não configurado')
    // A3: moderação persistida — PUT do status aconteceu ANTES do email
    expect(fetchState.putCalls.length).toBeGreaterThanOrEqual(1)
    expect(fetchState.putCalls[0]!.url).toContain('testadores!L2')
  })

  it('A1b: sendMail REJEITA (throw inesperado) → 200 {ok:true, emailEnviado:false, emailErro com msg}', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('getTransporter crashed'))
    const res = await handler({})
    expect(res.ok).toBe(true)
    expect(res.emailEnviado).toBe(false)
    expect(String(res.emailErro)).toContain('getTransporter crashed')
  })

  it('A1c: renderModeracao rejeita → 200 {ok:true} e emailErro preenchido', async () => {
    mockRender.mockImplementationOnce(() => {
      throw new Error('template render failed')
    })
    const res = await handler({})
    expect(res.ok).toBe(true)
    expect(res.emailEnviado).toBe(false)
    expect(String(res.emailErro)).toContain('template render failed')
  })

  it('A1d: aprovar testador também grava ativo=TRUE (coluna J) após aprovação', async () => {
    mockSendMail.mockResolvedValueOnce({ success: true })
    await handler({})
    const ativoPut = fetchState.putCalls.find((c) => c.url.includes('testadores!J2'))
    expect(ativoPut).toBeTruthy()
    expect((ativoPut!.body as { values: string[][] }).values[0]![0]).toBe('TRUE')
  })

  it('A2: PUT da sheet falha → propaga erro (sem ok:true)', async () => {
    fetchState.putOk = false
    await expect(handler({})).rejects.toThrow('sheet put failed')
    // email NEM é tentado quando a sheet falha (ordem: sheet primeiro)
    expect(mockSendMail).not.toHaveBeenCalled()
  })

  it('A3: ordem de operações — PUT status antes de sendMail (persistência nunca revertida)', async () => {
    const ordem: string[] = []
    mockFetch.mockImplementation(async (url: string, opts?: { method?: string }) => {
      if (String(url).includes('oauth2.googleapis.com'))
        return { access_token: 'tok', expires_in: 3600 }
      if (opts?.method === 'PUT') {
        ordem.push('PUT')
        return {}
      }
      ordem.push('GET')
      return {
        values: [
          'Jeydson',
          'garciajeydson@gmail.com',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          'FALSE',
          '',
          'pendente',
        ],
      }
    })
    mockSendMail.mockImplementation(async () => {
      ordem.push('MAIL')
      return { success: false, error: 'smtp down' }
    })
    const res = await handler({})
    expect(res.ok).toBe(true)
    expect(ordem.indexOf('PUT')).toBeLessThan(ordem.indexOf('MAIL'))
  })
})
