import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage?: string }) => {
  const err = new Error(opts.statusMessage ?? 'error') as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

let mockQuery: Record<string, unknown> = {}
vi.mock('h3', async (importOriginal) => {
  const original = await importOriginal<typeof import('h3')>()
  return { ...original, getQuery: () => mockQuery }
})
vi.stubGlobal('getQuery', () => mockQuery)

const requireRoleMock = vi.fn()
vi.stubGlobal('requireRole', (...args: unknown[]) => requireRoleMock(...args))

vi.mock('~~/server/utils/docs-propose', async (importOriginal) => {
  const original = await importOriginal<typeof import('~~/server/utils/docs-propose')>()
  return { ...original, getGuideMarkdown: vi.fn() }
})

import { getGuideMarkdown } from '~~/server/utils/docs-propose'

const handler = (await import('../../../../server/api/docs/guide.get')).default

describe('GET /api/docs/guide', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireRoleMock.mockResolvedValue({ uid: 'u1', role: 'member' })
  })

  it('retorna markdown do guia', async () => {
    mockQuery = { slug: 'manual' }
    vi.mocked(getGuideMarkdown).mockResolvedValue('---\ntitle: Manual\n---\n\ncorpo')
    expect(await handler({} as never)).toEqual({ markdown: '---\ntitle: Manual\n---\n\ncorpo' })
    expect(getGuideMarkdown).toHaveBeenCalledWith('manual')
  })

  it('slug inválido → 400', async () => {
    mockQuery = { slug: '../etc/passwd' }
    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 400 })
    expect(getGuideMarkdown).not.toHaveBeenCalled()
  })

  it('sem slug → 400', async () => {
    mockQuery = {}
    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('sem auth → 401', async () => {
    requireRoleMock.mockRejectedValue({ statusCode: 401 })
    mockQuery = { slug: 'manual' }
    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 401 })
    expect(getGuideMarkdown).not.toHaveBeenCalled()
  })
})
