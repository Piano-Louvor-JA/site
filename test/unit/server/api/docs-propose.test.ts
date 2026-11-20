import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage?: string }) => {
  const err = new Error(opts.statusMessage ?? 'error') as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})
vi.stubGlobal('readBody', async () => mockBody)
vi.mock('h3', async (importOriginal) => {
  const original = await importOriginal<typeof import('h3')>()
  return {
    ...original,
    readBody: vi.fn(async () => mockBody),
    createError: (opts: { statusCode: number; statusMessage?: string }) => {
      const err = new Error(opts.statusMessage ?? 'error') as Error & { statusCode: number }
      err.statusCode = opts.statusCode
      return err
    },
  }
})
vi.stubGlobal('isError', (e: unknown) => e instanceof Error && 'statusCode' in e)

let mockBody: Record<string, unknown> = {}

const requireRoleMock = vi.fn()
vi.stubGlobal('requireRole', (...args: unknown[]) => requireRoleMock(...args))

vi.mock('~~/server/utils/docs-propose-validation', async (importOriginal) => {
  const original = await importOriginal<typeof import('~~/server/utils/docs-propose-validation')>()
  return {
    ...original,
    validateProposal: vi.fn(original.validateProposal),
    allowDocsEdit: vi.fn(),
  }
})
vi.mock('~~/server/utils/docs-propose', async (importOriginal) => {
  const original = await importOriginal<typeof import('~~/server/utils/docs-propose')>()
  return { ...original, createDocsPullRequest: vi.fn() }
})

import { allowDocsEdit } from '~~/server/utils/docs-propose-validation'
import { createDocsPullRequest, DocsGithubUnavailable } from '~~/server/utils/docs-propose'

const validBody = {
  slug: 'manual',
  title: 'Manual atualizado',
  markdown: '# Manual',
  images: [],
}

describe('POST /api/docs/propose', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBody = { ...validBody }
    requireRoleMock.mockResolvedValue({ uid: 'uid-1', email: 'ana@exemplo.com', role: 'member' })
    vi.mocked(allowDocsEdit).mockReturnValue(true)
  })

  afterEach(() => {
    mockBody = { ...validBody }
  })

  async function callHandler() {
    const mod = await import('~~/server/api/docs/propose.post')
    return mod.default({} as never)
  }

  it('returns the PR url on success', async () => {
    vi.mocked(createDocsPullRequest).mockResolvedValue({
      prNumber: 42,
      prUrl: 'https://github.com/Piano-Louvor-JA/site/pull/42',
      branch: 'docs/edit-manual-1',
    })
    const result = await callHandler()
    expect(result).toEqual({ prUrl: 'https://github.com/Piano-Louvor-JA/site/pull/42' })
    expect(createDocsPullRequest).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'manual', author: 'ana@exemplo.com' }),
    )
  })

  it('rejects invalid payload with 400', async () => {
    mockBody = { ...validBody, slug: '../etc' }
    await expect(callHandler()).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rejects repeated proposal within window with 429', async () => {
    vi.mocked(allowDocsEdit).mockReturnValue(false)
    await expect(callHandler()).rejects.toMatchObject({ statusCode: 429 })
  })

  it('returns 503 when the docs token is absent', async () => {
    vi.mocked(createDocsPullRequest).mockImplementation(() => {
      throw new DocsGithubUnavailable()
    })
    await expect(callHandler()).rejects.toMatchObject({ statusCode: 503 })
  })

  it('passes role requirement member', async () => {
    await callHandler().catch(() => {})
    expect(requireRoleMock).toHaveBeenCalledWith(expect.anything(), 'member')
  })
})
