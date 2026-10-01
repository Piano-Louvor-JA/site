import { startGithubSync } from '../utils/github-sync'

/**
 * Plugin Nitro: inicia o sincronizador GitHub→snapshot uma vez no boot.
 * O loop roda a cada 30min com requisição condicional (ETag).
 * Falhas são silenciosas — o site sempre serve do snapshot local.
 */
export default defineNitroPlugin(() => {
  // `nuxt generate` sobe o Nitro para pré-renderizar. O interval segurava o
  // processo depois do "Generated public" e o job de SSG no CI não terminava.
  if (import.meta.prerender) return
  startGithubSync()
})
