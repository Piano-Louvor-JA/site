import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * SPEC: piano-site-community-row-fix v1.0.0 (frozen)
 * pending.get.ts lê range A2 (dados a partir da linha FÍSICA 2) mas mapeava
 * row: i + 1 → primeiro registro recebia row=1 e o review rejeitava (row < 2);
 * linhas 3+ eram gravadas off-by-one (status na linha de cima).
 *
 * A1: primeiro registro → row 2 (era 1 — bug)
 * A2: segundo registro → row 3 (era 2 — off-by-one)
 * A3: registro além de linhas com status pendente → row físico preservado
 *
 * Padrão Nitro do repo: defineEventHandler/$fetch/requireAuth são auto-imports
 * — stubados com vi.stubGlobal; handler importado após os stubs.
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

// $fetch global: responde o range A2:L200 da aba testadores com 3 registros.
// Linha FÍSICA de cada registro: 2, 3 e 4.
const mockFetch = vi.fn(async () => ({
  values: [
    // linha física 2 — Jeydson (pendende, deve ter row=2)
    [
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
    // linha física 3 — outro pendente (deve ter row=3)
    [
      'Maria',
      'maria@test.com',
      '',
      '',
      'web',
      '',
      '',
      '',
      '',
      'FALSE',
      '',
      'pendente',
    ],
    // linha física 4 — já aprovado (NÃO entra nos pendentes)
    [
      'José',
      'jose@test.com',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'TRUE',
      '',
      'aprovado',
    ],
  ],
}))
vi.stubGlobal('$fetch', mockFetch)

vi.stubGlobal('requireAuth', vi.fn(async () => 'uid-admin'))

process.env.TESTERS_SHEET_ID = 'test-sheet-id'
process.env.GOOGLE_CLIENT_ID = 'client-id'
process.env.GOOGLE_CLIENT_SECRET = 'client-secret'
process.env.GOOGLE_REFRESH_TOKEN = 'refresh-token'

const handler = (await import('@@/server/api/admin/community/pending.get.ts')).default as (
  event: unknown,
) => Promise<{
  testersPendentes: Array<{ row: number; nome: string }>
  devsPendentes: unknown[]
  relatosNovos: unknown[]
}>

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SPEC piano-site-community-row-fix — row = linha física da sheet', () => {
  it('A1: primeiro registro do range A2 → row 2 (não 1)', async () => {
    const res = await handler({})
    expect(res.testersPendentes[0]!.nome).toBe('Jeydson')
    expect(res.testersPendentes[0]!.row).toBe(2)
  })

  it('A2: segundo registro → row 3 (off-by-one corrigido)', async () => {
    const res = await handler({})
    expect(res.testersPendentes[1]!.nome).toBe('Maria')
    expect(res.testersPendentes[1]!.row).toBe(3)
  })

  it('A3: apenas pendentes listados; aprovado (linha 4) não entra e não desloca rows', async () => {
    const res = await handler({})
    expect(res.testersPendentes).toHaveLength(2)
    expect(res.testersPendentes.map((t) => t.row)).toEqual([2, 3])
  })
})
