import { buildLlmsFull, readUserManual, type LlmsDoc } from '../utils/llms-full'

/**
 * GET /llms-full.txt — conteúdo integral da documentação em texto puro (llmstxt.org).
 * No SSG o arquivo final é gravado em public/ pelo hook nuxt.config (nitro:build:before);
 * esta rota serve dev/teste.
 */
export default defineEventHandler(async () => {
  let pages: LlmsDoc[] = []
  try {
    const { queryCollection } = (await import(
      // @ts-expect-error virtual module do @nuxt/content (nitro)
      '#content/collections'
    )) as {
      queryCollection: (name: 'docs_ptBR') => {
        order: (
          field: string,
          dir: 'ASC' | 'DESC',
        ) => {
          all: () => Promise<LlmsDoc[]>
        }
      }
    }
    const rows = await queryCollection('docs_ptBR').order('nav_order', 'ASC').all()
    pages = rows.map((r) => ({
      title: r.title,
      slug: r.slug,
      reviewed_at: r.reviewed_at,
      body: r.body,
    }))
  } catch {
    // Coleção indisponível (vitest sem nitro) — só o cabeçalho, suficiente p/ testes
  }
  return buildLlmsFull(pages, readUserManual())
})
