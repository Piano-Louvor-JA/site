import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const frontmatter = z.object({
  title: z.string(),
  description: z.string().min(120).max(180),
  nav_order: z.number().int().min(1),
  platform: z.enum([
    'windows',
    'macos',
    'linux',
    'android',
    'tizen',
    'webos',
    'androidtv',
    'pwa',
    'web',
  ]),
  reviewed_at: z.string(),
  toc: z.boolean().default(true),
})

export default defineContentConfig({
  collections: {
    docs_ptBR: defineCollection({
      type: 'page',
      source: 'docs/pt-BR/**',
      schema: frontmatter,
    }),
    docs_en: defineCollection({
      type: 'page',
      source: 'docs/en/**',
      schema: frontmatter,
      // en/es nascem vazias; catch-all faz fallback pt-BR
    }),
    docs_es: defineCollection({
      type: 'page',
      source: 'docs/es/**',
      schema: frontmatter,
    }),
    // Onda 3 — docs localizadas (SPEC piano-site-i18n-onda3): coleções nascem vazias;
    // fallback pt-BR via docDirFor() quando a locale ainda não tem páginas.
    docs_ru: defineCollection({ type: 'page', source: 'docs/ru/**', schema: frontmatter }),
    docs_uk: defineCollection({ type: 'page', source: 'docs/uk/**', schema: frontmatter }),
    docs_fr: defineCollection({ type: 'page', source: 'docs/fr/**', schema: frontmatter }),
    docs_ja: defineCollection({ type: 'page', source: 'docs/ja/**', schema: frontmatter }),
    docs_ko: defineCollection({ type: 'page', source: 'docs/ko/**', schema: frontmatter }),
    docs_zh: defineCollection({ type: 'page', source: 'docs/zh/**', schema: frontmatter }),
    docs_tr: defineCollection({ type: 'page', source: 'docs/tr/**', schema: frontmatter }),
    docs_ar: defineCollection({ type: 'page', source: 'docs/ar/**', schema: frontmatter }),
    docs_hi: defineCollection({ type: 'page', source: 'docs/hi/**', schema: frontmatter }),
  },
})
