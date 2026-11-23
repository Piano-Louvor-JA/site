import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * SPEC central-tickets B2 §3 (SPEC-B2.md): páginas existem, intake público sem
 * middleware, portal/admin exigem auth, NENHUMA rota Nitro de tickets.
 */

const pages = resolve(__dirname, '../../app/pages')
const read = (p: string) => readFileSync(resolve(pages, p), 'utf8')

describe('B2 — páginas tickets', () => {
  it('/suporte (intake público) existe e SEM middleware auth', () => {
    const src = read('suporte/index.vue')
    expect(src).toBeTruthy()
    expect(src).not.toMatch(/middleware/)
    // honeypot + consent LGPD obrigatórios (SPEC §2.2)
    expect(src).toMatch(/honeypot/)
    expect(src).toMatch(/consent/)
  })

  it('/suporte/meus-tickets exige middleware auth', () => {
    const src = read('suporte/meus-tickets.vue')
    expect(src).toMatch(/middleware:\s*'auth'/)
  })

  it('/admin/tickets exige middleware auth', () => {
    const src = read('admin/tickets.vue')
    expect(src).toMatch(/middleware:\s*'auth'/)
  })

  it('ACEITE B2: nenhuma rota Nitro/server de tickets (client-side direto)', () => {
    const serverDir = resolve(__dirname, '../../server')
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = resolve(dir, e.name)
        if (e.isDirectory()) walk(full)
        else if (/ticket/i.test(e.name)) offenders.push(full)
      }
    }
    if (existsSync(serverDir)) walk(serverDir)
    expect(offenders).toEqual([])
  })

  it('useTicketsApi usa pianoApiBase (sem proxy relativo)', () => {
    const src = readFileSync(resolve(__dirname, '../../app/composables/useTicketsApi.ts'), 'utf8')
    expect(src).toMatch(/pianoApiBase/)
    expect(src).not.toMatch(/server\/api/)
  })

  it('nav /suporte presente (footer) e i18n 6 locales têm tickets.*', () => {
    const site = readFileSync(resolve(__dirname, '../../app/data/site.ts'), 'utf8')
    expect(site).toMatch(/'\/suporte'/)
    for (const loc of ['pt-BR', 'en', 'es', 'fr', 'ru', 'uk']) {
      const i18n = JSON.parse(
        readFileSync(resolve(__dirname, `../../i18n/${loc}.json`), 'utf8'),
      ) as { tickets?: unknown; nav?: Record<string, string> }
      expect(i18n.tickets, `${loc} sem tickets.*`).toBeTruthy()
      expect(i18n.nav?.support, `${loc} sem nav.support`).toBeTruthy()
    }
  })
})
