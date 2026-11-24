import { beforeEach, describe, expect, it, vi } from 'vitest'

const { calls, mockOctokit } = vi.hoisted(() => {
  const calls = {
    getRef: vi.fn(),
    createRef: vi.fn(),
    createOrUpdateFileContents: vi.fn(),
    create: vi.fn(),
  }
  const mockOctokit = vi.fn(function MockOctokit() {
    return {
      rest: {
        git: { getRef: calls.getRef, createRef: calls.createRef },
        repos: { createOrUpdateFileContents: calls.createOrUpdateFileContents },
        pulls: { create: calls.create },
      },
    }
  })
  return { calls, mockOctokit }
})

vi.mock('@octokit/rest', () => ({ Octokit: mockOctokit }))

import { DocsGithubUnavailable, createDocsPullRequest } from '~~/server/utils/docs-propose'

describe('createDocsPullRequest', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.GITHUB_DOCS_TOKEN = 'test-token'
    calls.getRef.mockResolvedValue({ data: { object: { sha: 'base-sha' } } })
    calls.createRef.mockResolvedValue({})
    calls.createOrUpdateFileContents.mockResolvedValue({})
    calls.create.mockResolvedValue({
      data: { number: 42, html_url: 'https://github.com/Piano-Louvor-JA/site/pull/42' },
    })
  })

  it('creates branch, files and review PR from staging', async () => {
    const result = await createDocsPullRequest({
      slug: 'manual',
      title: 'Manual atualizado',
      markdown: '# Manual',
      author: 'Ana',
      images: [{ name: 'tela.png', type: 'image/png', data: 'YWJj', size: 3 }],
      now: new Date('2026-11-20T12:00:00Z'),
    })

    expect(result).toEqual({
      prNumber: 42,
      prUrl: 'https://github.com/Piano-Louvor-JA/site/pull/42',
      branch: 'docs/edit-manual-20261120120000',
    })
    expect(calls.getRef).toHaveBeenCalledWith({
      owner: 'Piano-Louvor-JA',
      repo: 'site',
      ref: 'heads/staging',
    })
    expect(calls.createRef).toHaveBeenCalledWith(
      expect.objectContaining({
        ref: 'refs/heads/docs/edit-manual-20261120120000',
        sha: 'base-sha',
      }),
    )
    expect(calls.createOrUpdateFileContents).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'public/uploads/docs/20261120120000-1.png',
        branch: 'docs/edit-manual-20261120120000',
      }),
    )
    expect(calls.createOrUpdateFileContents).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'content/docs/pt-BR/manual.md',
        branch: 'docs/edit-manual-20261120120000',
      }),
    )
    expect(calls.create).toHaveBeenCalledWith(
      expect.objectContaining({
        base: 'staging',
        head: 'docs/edit-manual-20261120120000',
        body: expect.stringContaining('Ana'),
      }),
    )
  })

  it('fails gracefully when token is absent', async () => {
    delete process.env.GITHUB_DOCS_TOKEN
    delete process.env.GITHUB_TOKEN
    await expect(
      createDocsPullRequest({
        slug: 'manual',
        title: 'Manual',
        markdown: '#',
        author: 'Ana',
        images: [],
        now: new Date(),
      }),
    ).rejects.toBeInstanceOf(DocsGithubUnavailable)
  })
})
