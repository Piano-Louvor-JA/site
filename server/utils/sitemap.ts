import { SITE_URL } from './seo-constants'

/** Rotas de página existentes (sem prefixo de locale). */
export const ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/download', changefreq: 'monthly', priority: '0.9' },
  { path: '/releases', changefreq: 'weekly', priority: '0.8' },
  { path: '/docs', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'yearly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
]

export const LOCALES = ['', '/en', '/es', '/ru', '/uk', '/fr', '/ja', '/ko', '/zh', '/tr']

/** Sitemap XML completo (rotas × locales + docs). `docPages` vem do índice do build. */
export function buildSitemap(
  docPages: Array<{ slug: string; lastmod: string | null }> = [],
): string {
  const lastmodFor = (path: string): string | null => {
    const m = path.match(/^\/(?:en\/|es\/)?docs\/(.+)$/)
    if (!m) return null
    return docPages.find((p) => p.slug === m[1])?.lastmod ?? null
  }

  const allRoutes = [
    ...ROUTES,
    // Docs só existem em pt-BR (default) — não anunciar /en/docs/* (404 real)
    ...docPages.map((p) => ({
      path: `/docs/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      docsOnly: true,
    })),
  ].map((r) => ({ ...r, docsOnly: (r as { docsOnly?: boolean }).docsOnly ?? false }))

  const urls = allRoutes.flatMap((route) =>
    // rotas de docs: apenas locale default
    (route.docsOnly ? [''] : LOCALES).map((locale) => {
      const url = `${SITE_URL}${locale}${route.path === '/' ? (locale ? '' : '/') : route.path}`
      const lastmod = lastmodFor(route.path)
      return `  <url>
    <loc>${url}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    }),
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}
