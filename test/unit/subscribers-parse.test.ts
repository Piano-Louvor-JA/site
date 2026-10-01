import { describe, it, expect } from 'vitest'
import { parseSubscriber } from '../../server/utils/subscribers'

// SITE-NEWSLETTER: contrato do parseSubscriber com o shape real da Buttondown API
// (docs.buttondown.com — changelog 2026-02-06: email_address é o campo atual;
// email/creation_date são shapes legados mantidos por compat)

describe('parseSubscriber — contrato Buttondown', () => {
  it('parse do shape atual (email_address + created_at)', () => {
    const sub = parseSubscriber({
      email_address: 'teste@exemplo.com',
      created_at: '2026-09-28T12:00:00Z',
      type: 'regular',
      tags: ['site'],
    })
    expect(sub.email).toBe('teste@exemplo.com')
    expect(sub.createdAt).toBe('2026-09-28T12:00:00Z')
    expect(sub.active).toBe(true)
    expect(sub.tags).toEqual(['site'])
  })

  it('parse do shape legado (email + creation_date)', () => {
    const sub = parseSubscriber({
      email: 'legado@exemplo.com',
      creation_date: '2025-01-15',
    })
    expect(sub.email).toBe('legado@exemplo.com')
    expect(sub.createdAt).toBe('2025-01-15')
  })

  it('type irregular = inativo', () => {
    const sub = parseSubscriber({ email_address: 'a@b.com', type: 'unsubscribed' })
    expect(sub.active).toBe(false)
  })

  it('secondary_type unpaid = ativo (fallback legado)', () => {
    const sub = parseSubscriber({ email_address: 'a@b.com', secondary_type: 'regular' })
    expect(sub.active).toBe(true)
  })

  it('sem email = string vazia (não crasha)', () => {
    const sub = parseSubscriber({})
    expect(sub.email).toBe('')
  })

  it('metadata.locale default pt-BR', () => {
    expect(parseSubscriber({ email_address: 'a@b.com' }).locale).toBe('pt-BR')
    expect(parseSubscriber({ email_address: 'a@b.com', metadata: { locale: 'en' } }).locale).toBe(
      'en',
    )
  })

  it('engagement fields (changelog 2026-02-06) não quebram o parse', () => {
    const sub = parseSubscriber({
      email_address: 'a@b.com',
      delivered_count: 12,
      open_rate: 0.58,
    })
    expect(sub.email).toBe('a@b.com')
  })
})
