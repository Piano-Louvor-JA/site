import { readBody, createError } from 'h3'
import {
  allowDocsEdit,
  validateProposal,
  type DocsProposalInput,
} from '../../utils/docs-propose-validation'
import { createDocsPullRequest, DocsGithubUnavailable } from '../../utils/docs-propose'

/**
 * POST /api/docs/propose — voluntário leigo propõe edição de guia.
 * Auth Firebase (role mínima member). Valida, aplica rate-limit por uid e
 * cria branch+commit+PR no GitHub por conta de serviço. Merge permanece humano.
 */
export default defineEventHandler(async (event) => {
  const auth = await requireRole(event, 'member')

  const body = (await readBody(event)) as Partial<DocsProposalInput>
  const input: DocsProposalInput = {
    slug: typeof body.slug === 'string' ? body.slug : '',
    title: typeof body.title === 'string' ? body.title : '',
    markdown: typeof body.markdown === 'string' ? body.markdown : '',
    images: Array.isArray(body.images) ? body.images : [],
  }

  const errors = validateProposal(input)
  if (errors.length > 0) {
    throw createError({ statusCode: 400, statusMessage: errors.join('; ') })
  }

  if (!allowDocsEdit(auth.uid)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Aguarde alguns minutos antes de enviar outra revisão.',
    })
  }

  try {
    const result = await createDocsPullRequest({
      slug: input.slug,
      title: input.title,
      markdown: input.markdown,
      images: input.images,
      author: auth.email,
    })
    return { prUrl: result.prUrl }
  } catch (error) {
    if (error instanceof DocsGithubUnavailable) {
      throw createError({ statusCode: 503, statusMessage: error.message })
    }
    throw createError({
      statusCode: 502,
      statusMessage: 'Falha ao criar a revisão. Tente novamente.',
    })
  }
})
