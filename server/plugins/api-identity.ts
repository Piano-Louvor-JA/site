import { installSiteApiIdentity } from '../../shared/utils/site-api-identity'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig().public
  installSiteApiIdentity({
    staging: config.pianoPartnerKeyStg,
    production: config.pianoPartnerKeyProd,
    version: config.siteVersion,
  })
})
