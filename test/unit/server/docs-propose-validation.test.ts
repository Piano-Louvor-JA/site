import { describe, expect, it, beforeEach } from 'vitest'
import {
  allowDocsEdit,
  resetDocsRateLimit,
  validateProposal,
} from '~~/server/utils/docs-propose-validation'

describe('validateProposal', () => {
  const valid = { slug: 'manual', title: 'Manual do PIANO', markdown: '# Manual', images: [] }

  it('accepts a minimal valid proposal', () => {
    expect(validateProposal(valid)).toEqual([])
  })

  it('rejects invalid slug and title', () => {
    expect(validateProposal({ ...valid, slug: '../secrets', title: 'x' })).toEqual(
      expect.arrayContaining(['slug inválido', 'título deve ter entre 3 e 120 caracteres']),
    )
  })

  it('rejects markdown larger than 64KB', () => {
    expect(validateProposal({ ...valid, markdown: 'a'.repeat(65_537) })).toContain(
      'texto excede 64KB',
    )
  })

  it('rejects more than six images', () => {
    const image = { name: 'tela.png', type: 'image/png', data: 'a', size: 1 }
    expect(
      validateProposal({ ...valid, images: Array.from({ length: 7 }, () => image) }),
    ).toContain('máximo de 6 imagens')
  })

  it('rejects disallowed or oversized images', () => {
    expect(
      validateProposal({
        ...valid,
        images: [{ name: 'x.gif', type: 'image/gif', data: 'a', size: 5_242_881 }],
      }),
    ).toEqual(expect.arrayContaining(['formato de imagem inválido', 'imagem excede 5MB']))
  })
})

describe('allowDocsEdit', () => {
  beforeEach(resetDocsRateLimit)

  it('allows first proposal then blocks same user for ten minutes', () => {
    expect(allowDocsEdit('uid-1', 1_000)).toBe(true)
    expect(allowDocsEdit('uid-1', 1_001)).toBe(false)
    expect(allowDocsEdit('uid-1', 601_001)).toBe(true)
  })

  it('keeps limits isolated by uid', () => {
    expect(allowDocsEdit('uid-1', 1_000)).toBe(true)
    expect(allowDocsEdit('uid-2', 1_001)).toBe(true)
  })
})
