import { installSiteApiIdentity } from '~~/shared/utils/site-api-identity'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  installSiteApiIdentity({
    staging: config.pianoPartnerKeyStg,
    production: config.pianoPartnerKeyProd,
    version: config.siteVersion,
  })
})
