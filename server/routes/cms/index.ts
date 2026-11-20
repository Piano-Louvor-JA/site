/**
 * Redirect /cms/ → /admin/ 301 — Decap removido (SPEC v1.2 editor-leigo).
 */
export default defineEventHandler((event) => {
  return sendRedirect(event, '/admin/documentacao', 301)
})
