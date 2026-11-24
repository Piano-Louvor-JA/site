import { getQuery, createError, defineEventHandler } from 'h3'
import { getGuideMarkdown } from '../../utils/docs-propose'
import { SLUG_RE } from '../../utils/docs-propose-validation'

/**
 * GET /api/docs/guide?slug=manual
 * Markdown atual do guia (staging) para o editor carregar seções. SPEC v1.3.
 */
export default defineEventHandler(async (event) => {
  await requireRole(event, 'member')
  const slug = String(getQuery(event).slug ?? '')
  if (!SLUG_RE.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'Guia inválido.' })
  }
  return { markdown: await getGuideMarkdown(slug) }
})
