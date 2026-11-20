export interface DocsImageInput {
  name: string
  type: string
  data: string
  size: number
}

export interface DocsProposalInput {
  slug: string
  title: string
  markdown: string
  images: DocsImageInput[]
}

const MAX_MARKDOWN_BYTES = 64 * 1024
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_IMAGES = 6
const EDIT_WINDOW_MS = 10 * 60 * 1000
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const edits = new Map<string, number>()

export function validateProposal(input: DocsProposalInput): string[] {
  const errors: string[] = []
  if (!SLUG_RE.test(input.slug)) errors.push('slug inválido')
  if (input.title.trim().length < 3 || input.title.trim().length > 120) {
    errors.push('título deve ter entre 3 e 120 caracteres')
  }
  if (new TextEncoder().encode(input.markdown).byteLength > MAX_MARKDOWN_BYTES) {
    errors.push('texto excede 64KB')
  }
  if (input.images.length > MAX_IMAGES) errors.push('máximo de 6 imagens')
  for (const image of input.images) {
    if (!ALLOWED_MIME_TYPES.has(image.type)) errors.push('formato de imagem inválido')
    if (image.size > MAX_IMAGE_BYTES) errors.push('imagem excede 5MB')
  }
  return [...new Set(errors)]
}

export function allowDocsEdit(uid: string, now = Date.now()): boolean {
  const lastEdit = edits.get(uid)
  if (lastEdit !== undefined && now - lastEdit < EDIT_WINDOW_MS) return false
  edits.set(uid, now)
  return true
}

export function resetDocsRateLimit(): void {
  edits.clear()
}

export function extensionForMime(mime: string): 'png' | 'jpg' | 'webp' {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/webp') return 'webp'
  return 'png'
}
