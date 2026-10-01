import { startGithubSync } from '../utils/github-sync'

/**
 * Plugin Nitro: inicia o sincronizador GitHub→snapshot uma vez no boot.
 * O loop roda a cada 30min com requisição condicional (ETag).
 * Falhas são silenciosas — o site sempre serve do snapshot local.
 */
export default defineNitroPlugin(() => {
  startGithubSync()
})
