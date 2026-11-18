import { defineEventHandler } from 'h3'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE_URL = 'https://pianolouvorja.com.br'

const ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/download', changefreq: 'monthly', priority: '0.9' },
  { path: '/releases', changefreq: 'weekly', priority: '0.8' },
  { path: '/docs', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'yearly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
]

const LOCALES = ['', '/en', '/es', '/ru', '/uk', '/fr']

/** Páginas de doc pt-BR criadas no build — injetadas via nuxt.config hooks (F2.5). */
const DOC_PAGES: Array<{ slug: string; lastmod: string | null }> = (() => {
  try {
    const raw = readFileSync(resolve('./content/docs-index.json'), 'utf8')
    return JSON.parse(raw) as Array<{ slug: string; lastmod: string | null }>
  } catch {
    return []
  }
})()

/** lastmod: reviewed_at do frontmatter; senão mtime do repo (revisão do conteúdo). */
function lastmodFor(path: string): string | null {
  const m = path.match(/^\/(?:en\/|es\/)?docs\/(.+)$/)
  if (!m) return null
  return DOC_PAGES.find((p) => p.slug === m[1])?.lastmod ?? null
}

/**
 * GET /sitemap.xml
 * Gera sitemap dinamico com todas as rotas x locales + lastmod + páginas de docs.
 */
export default defineEventHandler((event) => {
  const allRoutes = [
    ...ROUTES,
    ...DOC_PAGES.map((p) => ({ path: `/docs/${p.slug}`, changefreq: 'monthly', priority: '0.6' })),
  ]

  const urls = allRoutes.flatMap((route) =>
    LOCALES.map((locale) => {
      const url = `${SITE_URL}${locale}${route.path === '/' ? (locale ? '' : '/') : route.path}`
      const lastmod = lastmodFor(route.path)
      return `  <url>
    <loc>${url}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    }),
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return xml
})
