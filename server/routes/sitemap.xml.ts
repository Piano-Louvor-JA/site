import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildSitemap } from '../utils/sitemap'

/** Páginas de doc pt-BR criadas no build — injetadas via nuxt.config hooks (F2.5). */
const DOC_PAGES: Array<{ slug: string; lastmod: string | null }> = (() => {
  try {
    const raw = readFileSync(resolve('./content/docs-index.json'), 'utf8')
    return JSON.parse(raw) as Array<{ slug: string; lastmod: string | null }>
  } catch {
    return []
  }
})()

/**
 * GET /sitemap.xml — sitemap dinâmico com todas as rotas × locales + lastmod + docs.
 * No SSG o arquivo final é gravado em public/ pelo hook nuxt.config (nitro:build:before);
 * esta rota serve dev/teste.
 */
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return buildSitemap(DOC_PAGES)
})
