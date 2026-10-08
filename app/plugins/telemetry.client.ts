/**
 * Telemetria de erros — Glitchtip/Sentry.
 *
 * Client-only. Sem DSN (NUXT_PUBLIC_TELEMETRIA_DSN vazio) fica 100% inativa:
 * nenhuma rede, nenhum evento. Com DSN, captura erros de runtime (Vue +
 * window/unhandledrejection via SDK) e erros manuais via reportTelemetryError.
 * Nunca propaga erro próprio: telemetria é opcional, o site segue de pé.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const dsn = useRuntimeConfig().public.telemetriaDsn as string
  if (!dsn) return

  const report = (error: unknown): void => {
    try {
      void import('@sentry/browser').then(({ captureException }) => captureException(error))
    } catch {
      /* telemetria nunca quebra o site */
    }
  }

  nuxtApp.hook('vue:error', report)
  nuxtApp.hook('app:error', report)

  void import('@sentry/browser').then(({ init }) => {
    init({
      dsn,
      environment: import.meta.dev ? 'development' : 'production',
      release: 'louvorja-site',
      sendDefaultPii: false,
      tracesSampleRate: 0,
    })
  })
})
