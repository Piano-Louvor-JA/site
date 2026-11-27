import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const { install } = vi.hoisted(() => ({ install: vi.fn() }))
vi.mock('../../shared/utils/site-api-identity', () => ({ installSiteApiIdentity: install }))

beforeEach(() => {
  install.mockClear()
  vi.stubGlobal('defineNuxtPlugin', (callback: () => void) => callback)
  vi.stubGlobal('defineNitroPlugin', (callback: () => void) => callback)
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      pianoPartnerKeyStg: 'plj_site_stg_teste',
      pianoPartnerKeyProd: 'plj_site_prod_teste',
      siteVersion: '1.2.3',
    },
  }))
})
afterEach(() => vi.unstubAllGlobals())

it('instala a identidade antes dos plugins de rede do navegador', async () => {
  const { default: bootstrap } = await import('../../app/plugins/00.api-identity.client')
  ;(bootstrap as unknown as () => void)()
  expect(install).toHaveBeenCalledWith({
    staging: 'plj_site_stg_teste',
    production: 'plj_site_prod_teste',
    version: '1.2.3',
  })
})
it('instala a mesma identidade nas chamadas do Nitro', async () => {
  const { default: bootstrap } = await import('../../server/plugins/api-identity')
  ;(bootstrap as unknown as () => void)()
  expect(install).toHaveBeenCalledWith({
    staging: 'plj_site_stg_teste',
    production: 'plj_site_prod_teste',
    version: '1.2.3',
  })
})
