import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// --- Mocks ---

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage?: string }) => {
  const err = new Error(opts.statusMessage ?? 'error') as Error & {
    statusCode: number
    statusMessage?: string
  }
  err.statusCode = opts.statusCode
  err.statusMessage = opts.statusMessage
  return err
})
vi.stubGlobal('setHeader', () => {})
vi.stubGlobal('isError', (e: unknown) => e instanceof Error && 'statusCode' in e)

// requireAuth é auto-importado pelo Nitro no runtime — em teste, injeta o
// mock direto no global que o auto-import resolvia.
const requireAuthMock = vi.fn()
vi.stubGlobal('requireAuth', (...args: unknown[]) => requireAuthMock(...args))

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', { raw: fetchMock })

function makeEvent() {
  return { node: { req: { headers: { authorization: 'Bearer x' } } } }
}

describe('GET /api/admin/infra', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.INFRA_TOKEN = 'tok-teste'
    requireAuthMock.mockResolvedValue('uid-1')
  })

  afterEach(() => {
    delete process.env.INFRA_TOKEN
  })

  async function callHandler() {
    const mod = await import('~~/server/api/admin/infra.get')
    return mod.default(makeEvent() as never)
  }

  it('autentica antes de qualquer fetch externo', async () => {
    fetchMock.mockResolvedValue({
      status: 200,
      _data: { generated_at: 1 },
    })
    await callHandler()
    expect(requireAuthMock).toHaveBeenCalledTimes(1)
  })

  it('retorna payload da Oracle em sucesso', async () => {
    const payload = {
      generated_at: 1790965195,
      ram: { total: 1, available: 2, used_pct: 77.2 },
      disk: { total: 3, free: 4, used_pct: 96.4 },
      load1: 2.83,
      containers_running: '49',
      services: { grafana: '200' },
    }
    fetchMock.mockResolvedValue({ status: 200, _data: payload })
    const result = await callHandler()
    expect(result).toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('100.124.203.116:3020/infra'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Infra-Token': 'tok-teste' }),
      }),
    )
  })

  it('502 amigável quando INFRA_TOKEN não está configurado', async () => {
    delete process.env.INFRA_TOKEN
    await expect(callHandler()).rejects.toMatchObject({ statusCode: 502 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('502 amigável quando a Oracle responde não-200', async () => {
    fetchMock.mockResolvedValue({ status: 401, _data: null })
    await expect(callHandler()).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'infra inacessível',
    })
  })

  it('502 amigável quando o fetch estoura timeout/rede', async () => {
    fetchMock.mockRejectedValue(new Error('network unreachable'))
    await expect(callHandler()).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'infra inacessível',
    })
  })
})
