/**
 * Beacon de visita (SPEC piano-site-telemetria-v2 v1.0.0, RF-S1).
 *
 * Client-only. 1× por carga da app em rota pública: POST fire-and-forget
 * para {pianoApiBase}/v1/geo/visit. O país/IP são extraídos server-side
 * (headers da CDN), o navegador não envia dado nenhum. Falha silenciosa:
 * telemetria nunca bloqueia nem polui o console.
 *
 * Exclui /admin (painel não conta audiência) e /api.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.pianoApiBase ?? '').replace(/\/$/, '')
  if (!apiBase) return

  nuxtApp.hook('page:finish', () => {
    const path = window.location.pathname
    if (path.startsWith('/admin') || path.startsWith('/api')) return

    try {
      void fetch(`${apiBase}/v1/geo/visit`, {
        method: 'POST',
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* beacon é best-effort */
    }
  })
})
