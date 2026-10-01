import { describe, it, expect } from 'vitest'
import { getCountryFromEvent, hashIp } from '../../server/utils/geo'
import type { H3Event } from 'h3'

// RF-01: headers de país de múltiplas CDNs (hcdn = Hostinger, cf = Cloudflare,
// vercel, x-geo = custom proxy) — ordem de prioridade
// RF-02 [EXTRA do RF]: hashIp com salt vazio deve lançar (LGPD: hash sem salt é reversível)

function makeEvent(headers: Record<string, string | string[]>): H3Event {
  return {
    node: { req: { headers } },
  } as unknown as H3Event
}

describe('getCountryFromEvent — RF-01 (multi-CDN)', () => {
  it('lê cf-ipcountry (Cloudflare)', () => {
    expect(getCountryFromEvent(makeEvent({ 'cf-ipcountry': 'BR' }))).toBe('BR')
  })

  it('lê x-hcdn-country (Hostinger CDN — novo, RF-01)', () => {
    expect(getCountryFromEvent(makeEvent({ 'x-hcdn-country': 'PT' }))).toBe('PT')
  })

  it('lê x-visitor-country (genérico — novo, RF-01)', () => {
    expect(getCountryFromEvent(makeEvent({ 'x-visitor-country': 'JP' }))).toBe('JP')
  })

  it('lê x-vercel-ip-country (Vercel)', () => {
    expect(getCountryFromEvent(makeEvent({ 'x-vercel-ip-country': 'US' }))).toBe('US')
  })

  it('lê x-geo-country (proxy custom)', () => {
    expect(getCountryFromEvent(makeEvent({ 'x-geo-country': 'DE' }))).toBe('DE')
  })

  it('prioridade: cf-ipcountry vence x-hcdn-country quando ambos presentes', () => {
    const ev = makeEvent({ 'cf-ipcountry': 'BR', 'x-hcdn-country': 'PT' })
    expect(getCountryFromEvent(ev)).toBe('BR')
  })

  it('prioridade: x-hcdn-country vence x-vercel-ip-country', () => {
    const ev = makeEvent({ 'x-hcdn-country': 'PT', 'x-vercel-ip-country': 'US' })
    expect(getCountryFromEvent(ev)).toBe('PT')
  })

  it('header array usa primeiro valor', () => {
    expect(getCountryFromEvent(makeEvent({ 'cf-ipcountry': ['BR', 'PT'] }))).toBe('BR')
  })

  it('códigos reservados XX/T1 = unknown', () => {
    expect(getCountryFromEvent(makeEvent({ 'cf-ipcountry': 'XX' }))).toBe('unknown')
    expect(getCountryFromEvent(makeEvent({ 'cf-ipcountry': 'T1' }))).toBe('unknown')
  })

  it('sem headers de país = unknown', () => {
    expect(getCountryFromEvent(makeEvent({}))).toBe('unknown')
  })

  it('código de 1 letra = unknown (não é ISO alpha-2)', () => {
    expect(getCountryFromEvent(makeEvent({ 'x-hcdn-country': 'B' }))).toBe('unknown')
  })

  it('normaliza para uppercase', () => {
    expect(getCountryFromEvent(makeEvent({ 'x-hcdn-country': 'br' }))).toBe('BR')
  })
})

describe('hashIp — RF-02 (LGPD guard)', () => {
  it('mesmo ip+salt = mesmo hash (determinístico)', () => {
    expect(hashIp('1.2.3.4', 'salt')).toBe(hashIp('1.2.3.4', 'salt'))
  })

  it('ips diferentes = hashes diferentes', () => {
    expect(hashIp('1.2.3.4', 'salt')).not.toBe(hashIp('5.6.7.8', 'salt'))
  })

  it('hash é hex sha256 (64 chars)', () => {
    expect(hashIp('1.2.3.4', 'salt')).toMatch(/^[a-f0-9]{64}$/)
  })
})
