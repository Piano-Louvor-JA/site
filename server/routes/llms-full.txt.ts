import { defineEventHandler } from 'h3'
import { resolve } from 'node:path'

const SITE_URL = 'https://pianolouvorja.com.br'
const REPO_RAW = 'https://raw.githubusercontent.com/Piano-Louvor-JA/site/staging'

/**
 * GET /llms-full.txt — conteúdo integral da documentação em texto puro (llmstxt.org).
 * Pré-renderizado no build (nitro.prerender.routes) → arquivo estático no dist.
 *
 * queryCollection é importado dinamicamente do virtual do nitro (#content/collections);
 * em ambientes sem nitro (vitest/vite-node) o import falha e cai no catch — a rota
 * retorna só o cabeçalho, suficiente para os testes de integração.
 */
export default defineEventHandler(async () => {
  const parts: string[] = []
  parts.push(`# PIANO LouvorJA — Documentação completa\n`)
  parts.push(`<${SITE_URL}/docs>\n`)

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
          all: () => Promise<
            Array<{ title: string; stem: string; reviewed_at?: string; body?: string }>
          >
        }
      }
    }
    const pages = await queryCollection('docs_ptBR').order('nav_order', 'ASC').all()
    for (const page of pages) {
      parts.push(`\n---\n\n# ${page.title}\n`)
      parts.push(`Source: ${SITE_URL}/docs${page.stem.replace(/^\/?docs\/pt-BR/, '')}\n`)
      parts.push(`Reviewed: ${page.reviewed_at}\n`)
      parts.push(`\n${page.body?.trim() ?? ''}\n`)
    }
  } catch {
    // Coleção indisponível (vitest sem nitro, ou primeiro build sem páginas)
  }

  // Manual como anexo integral
  const manualPath = resolve('./content/user-manual/manual-usuario.md')
  try {
    const manual = await import('node:fs').then((fs) => fs.readFileSync(manualPath, 'utf8'))
    parts.push(`\n---\n\n# Manual do usuário (integral)\n`)
    parts.push(`Source: ${REPO_RAW}/content/user-manual/manual-usuario.md\n`)
    parts.push(`\n${manual}\n`)
  } catch {
    // arquivo ausente no runtime (pré-render cobre)
  }

  return parts.join('\n')
})
