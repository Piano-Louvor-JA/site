import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSiteApiFetch, installSiteApiIdentity } from '../../shared/utils/site-api-identity'

const config = {
  staging: 'plj_site_stg_teste',
  production: 'plj_site_prod_teste',
  version: '1.2.3',
}

describe('identidade do site', () => {
  afterEach(() => vi.unstubAllGlobals())
  it('integra o transporte real do ofetch, incluindo raw, create e hooks', async () => {
    const require = createRequire(import.meta.url)
    const module = require.resolve('ofetch', {
      paths: [dirname(require.resolve('nuxt/package.json'))],
    })
    const { createFetch } = await import(pathToFileURL(module).href)
    const original = vi
      .fn()
      .mockImplementation(
        async () =>
          new Response('{"ok":true}', { headers: { 'content-type': 'application/json' } }),
      )
    vi.stubGlobal('fetch', original)
    vi.stubGlobal('$fetch', createFetch({ fetch: original, Headers, AbortController }))
    installSiteApiIdentity(config)
    const hook = vi.fn()
    const client = globalThis.$fetch.create({ onRequest: hook })
    const response = await client.raw('https://api-stg.pianolouvorja.com.br/v1/custom', {
      headers: { Authorization: 'Bearer sessão' },
    })
    expect(response._data).toEqual({ ok: true })
    expect(hook).toHaveBeenCalledOnce()
    const headers = original.mock.calls[0]?.[1].headers
    expect(headers.get('X-Partner-Key')).toBe(config.staging)
    expect(headers.get('Authorization')).toBe('Bearer sessão')
  })
  it('preserva o transporte interno do Nitro em rotas relativas', async () => {
    const require = createRequire(import.meta.url)
    const module = require.resolve('ofetch', {
      paths: [dirname(require.resolve('nuxt/package.json'))],
    })
    const { createFetch } = await import(pathToFileURL(module).href)
    const external = vi.fn().mockRejectedValue(new Error('transporte externo não deve ser usado'))
    const internal = vi
      .fn()
      .mockImplementation(
        async () =>
          new Response('{"local":true}', { headers: { 'content-type': 'application/json' } }),
      )
    vi.stubGlobal('fetch', external)
    vi.stubGlobal('$fetch', createFetch({ fetch: internal, Headers, AbortController }))
    installSiteApiIdentity(config)
    expect(await globalThis.$fetch('/api/local')).toEqual({ local: true })
    expect(internal).toHaveBeenCalledOnce()
    expect(external).not.toHaveBeenCalled()
  })
  it.each([
    ['https://api-stg.pianolouvorja.com.br/v1/custom', config.staging],
    ['https://api.pianolouvorja.com.br/v1/custom', config.production],
    ['http://localhost:3100/v1/custom', config.staging],
  ])('identifica o site em %s e preserva autenticação', async (url, key) => {
    const original = vi.fn().mockResolvedValue(new Response())
    const fetch = createSiteApiFetch(original, config)
    await fetch(url, {
      method: 'POST',
      body: 'conteúdo',
      headers: { Authorization: 'Bearer sessão', 'X-Tenant': 'piano' },
    })
    const [input, options] = original.mock.calls[0] ?? []
    expect(input).toBe(url)
    expect(options.method).toBe('POST')
    expect(options.body).toBe('conteúdo')
    expect(
      Object.fromEntries(
        Array.from(options.headers as Headers, ([name, value]) => [name.toLowerCase(), value]),
      ),
    ).toMatchObject({
      authorization: 'Bearer sessão',
      'x-tenant': 'piano',
      'x-client-platform': 'site',
      'x-client-version': config.version,
      'x-partner-key': key,
    })
  })
  it.each([
    'https://googleapis.com/auth',
    'https://api.louvorja.com.br/v1',
    'https://api.pianolouvorja.com.br.evil.test/v1',
    'http://api.pianolouvorja.com.br/v1',
  ])('mantém %s intacto', async (url) => {
    const original = vi.fn().mockResolvedValue(new Response())
    const options = { headers: { Authorization: 'Bearer externo' } }
    await createSiteApiFetch(original, config)(url, options)
    expect(original).toHaveBeenCalledWith(url, options)
  })
  it('preserva Request e headers explícitos, sem consumir o corpo', async () => {
    const original = vi.fn().mockResolvedValue(new Response())
    const request = new Request('https://api-stg.pianolouvorja.com.br/v1', {
      method: 'POST',
      body: 'conteúdo',
      headers: { 'X-Partner-Key': 'plj_explicita' },
    })
    await createSiteApiFetch(original, config)(request)
    expect(original.mock.calls[0]?.[0]).toBe(request)
    expect(original.mock.calls[0]?.[1].headers.get('X-Partner-Key')).toBe('plj_explicita')
    expect(await request.text()).toBe('conteúdo')
  })
  it('no-cors não é alterado e ausência de chave não bloqueia', async () => {
    const original = vi.fn().mockResolvedValue(new Response())
    const fetch = createSiteApiFetch(original, { version: config.version })
    const options = { mode: 'no-cors' as const }
    await fetch('https://api-stg.pianolouvorja.com.br/v1', options)
    expect(original.mock.calls[0]?.[1]).toBe(options)
    await fetch('https://api-stg.pianolouvorja.com.br/v1')
    expect(original.mock.calls[1]?.[1].headers.has('X-Partner-Key')).toBe(false)
  })
})
