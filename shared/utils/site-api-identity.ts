export interface SiteApiIdentity {
  staging?: string
  production?: string
  version?: string
}

/** Transporte comum a fetch e $fetch; autenticação e hooks do chamador permanecem. */
export function createSiteApiFetch(
  original: typeof globalThis.fetch,
  config: SiteApiIdentity,
): typeof globalThis.fetch {
  return (input, init) => {
    let next = init
    try {
      const request = input instanceof Request ? input : undefined
      const url = new URL(
        request ? request.url : String(input),
        typeof location === 'undefined' ? undefined : location.href,
      )
      const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
      const piano = ['api-stg.pianolouvorja.com.br', 'api.pianolouvorja.com.br'].includes(
        url.hostname,
      )
      const allowed =
        (piano || local) && (url.protocol === 'https:' || (local && url.protocol === 'http:'))
      if (
        allowed &&
        !url.username &&
        !url.password &&
        (init?.mode ?? request?.mode) !== 'no-cors'
      ) {
        const headers = new Headers(init?.headers ?? request?.headers)
        if (!headers.has('X-Client-Platform')) headers.set('X-Client-Platform', 'site')
        if (config.version && !headers.has('X-Client-Version'))
          headers.set('X-Client-Version', config.version)
        const key =
          (url.hostname === 'api.pianolouvorja.com.br'
            ? config.production
            : config.staging
          )?.trim() ?? ''
        if (/^plj_[A-Za-z0-9_-]+$/.test(key) && !headers.has('X-Partner-Key'))
          headers.set('X-Partner-Key', key)
        next = { ...init, headers }
        // Uma chave de parceiro não pode seguir redirects para serviços externos.
        if (headers.has('X-Partner-Key')) next.redirect = 'error'
      }
    } catch {
      /* O transporte original valida entradas inválidas. */
    }
    return original(input, next)
  }
}

export function installSiteApiIdentity(config: SiteApiIdentity): void {
  const identified = createSiteApiFetch(globalThis.fetch.bind(globalThis), config)
  globalThis.fetch = identified
  // O ofetch guarda seu transporte na criação; trocar só o fetch global não basta.
  // create preserva raw/native/create e os hooks específicos de cada chamada.
  if (typeof $fetch === 'function' && typeof $fetch.create === 'function') {
    // O tipo estreito do Nuxt omite o segundo argumento público do ofetch.
    const create = $fetch.create as unknown as (
      defaults: Record<string, unknown>,
      transport: { fetch: typeof globalThis.fetch },
    ) => typeof $fetch
    // No Nitro, native também resolve rotas internas relativas. Não substituí-lo
    // pelo fetch global do Node, que só aceita URLs absolutas.
    const ofetch = $fetch as unknown as { native: typeof globalThis.fetch }
    const native = ofetch.native.bind($fetch)
    globalThis.$fetch = create({}, { fetch: createSiteApiFetch(native, config) })
  }
}
