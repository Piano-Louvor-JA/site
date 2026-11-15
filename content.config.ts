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
  },
})
