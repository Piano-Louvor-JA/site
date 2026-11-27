# Changelog

All notable changes to this project are documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.17.0](https://github.com/Piano-Louvor-JA/site/compare/v1.16.0...v1.17.0) (2026-11-27)

### Features

- **admin:** mapa do Brasil real e contagem alinhada na telemetria ([b83f338](https://github.com/Piano-Louvor-JA/site/commit/b83f338760bf59431a6c28b0a36d5e6d92eabccb))

### Tests

- cobre TelemetryBrazilMap e useTelemetryHistory para promoção a main ([5a4bee0](https://github.com/Piano-Louvor-JA/site/commit/5a4bee0e965f19b3b0d2e97db7846e6596ed8ab9))

## [1.16.0](https://github.com/Piano-Louvor-JA/site/compare/v1.15.0...v1.16.0) (2026-11-27)

### Features

- **admin:** rankings e mapa BR na telemetria (90d) ([2fe86f3](https://github.com/Piano-Louvor-JA/site/commit/2fe86f36cc9583b1d40cde27a42d40c41e9a4eb3))

### Bug Fixes

- **assets:** favicon.svg arte oficial transparente ([b3a69d0](https://github.com/Piano-Louvor-JA/site/commit/b3a69d0e4267a9fc2fb5a5ad272eca7a576c7d40))

### Tests

- **admin:** cobre TelemetryBrazilMap e useTelemetryHistory ([f20aadb](https://github.com/Piano-Louvor-JA/site/commit/f20aadb81121655a71bd0fba0b9e3d87a050a529))

### Continuous Integration

- bump Node 24.18.0 → 26 (semantic-release exige >=26.13) ([6dc8ddc](https://github.com/Piano-Louvor-JA/site/commit/6dc8ddcf6e859796c14dc95235162f5559565dac))

### Miscellaneous Chores

- integra origin/staging (pós site[#185](https://github.com/Piano-Louvor-JA/site/issues/185)) em feat/telemetry-history-map ([8b12637](https://github.com/Piano-Louvor-JA/site/commit/8b126374e4bb938e35e595c7d092a4d79332f23f))
- integra origin/staging em feat/telemetry-history-map ([feee415](https://github.com/Piano-Louvor-JA/site/commit/feee4153f64c08164d3d76bbfdac70ff6057c99f))
- **sync:** main → staging após v1.15.0 ([07d6524](https://github.com/Piano-Louvor-JA/site/commit/07d65241d9f2e40ee5cc66d7616b7b3dcb364fbe))

## [1.15.0](https://github.com/Piano-Louvor-JA/site/compare/v1.14.0...v1.15.0) (2026-11-27)

### Features

- **admin:** card Sem token na telemetria de dispositivos ([dcf81fb](https://github.com/Piano-Louvor-JA/site/commit/dcf81fbe5e5f56c0814858abdeacab31d6150cc5))
- **admin:** visão total de conteúdo + dono (SPEC v1.1.0) ([6ad8d5a](https://github.com/Piano-Louvor-JA/site/commit/6ad8d5acc0a2d2de2c5d7cb2c99d473db69bbf19))
- **api:** identifica requisições do portal com parceiro próprio ([79b664b](https://github.com/Piano-Louvor-JA/site/commit/79b664b76b18278ce54b443d7d4e00c3063989fb))
- **i18n:** Onda 4 — it/nl/pl (catálogos, docs, wiring, testes) ([aa6f881](https://github.com/Piano-Louvor-JA/site/commit/aa6f881b1a74868b73b4621bb34c655288efedbf))
- **roster:** Corrigido AC3 i18n e deduplicado roster dinâmico v1.1.0 [e3856d2] ([4712892](https://github.com/Piano-Louvor-JA/site/commit/47128925d5dc915d8f466650e534a41065face79))
- **team:** hierarquia People — ordem curada team.ts (Ezequias 1º, Rafael 2º), demais alfabético ([87c150f](https://github.com/Piano-Louvor-JA/site/commit/87c150faf031d1e5f41a6cf087fc228b2fb97756))
- **team:** subseção devs na home via roster role=dev (SPEC v1.1.0) ([e3856d2](https://github.com/Piano-Louvor-JA/site/commit/e3856d2d1fdef4e32745ed0b8fb5d05ed0ef108d))

### Bug Fixes

- **ci:** fixa semantic-release em ^25 compatível com Node 24 ([3e6582d](https://github.com/Piano-Louvor-JA/site/commit/3e6582d8d9fbdd983d158c95b4032153537d8ae8))
- **content:** collections docs_it/docs_nl/docs_pl + gates verdes ([25dd2fa](https://github.com/Piano-Louvor-JA/site/commit/25dd2fae56f4e6092226cb865da91cc4ef1cede6))
- **i18n:** completa team.devs e default.role em it/nl/pl ([6e328f8](https://github.com/Piano-Louvor-JA/site/commit/6e328f8e0855f1aa2fbb346e96edc3c391d9d7b1))
- normalizar bio undefined no TeamSection ([a0ae019](https://github.com/Piano-Louvor-JA/site/commit/a0ae019403254e7adb581293d58d6abac3aaaf8b))

### Documentation

- **i18n:** documentação italiana (14 páginas, registro formal cristão) ([d0dd521](https://github.com/Piano-Louvor-JA/site/commit/d0dd5217c824cf67ffd06f320eb0264dfc7a6da2))
- **i18n:** documentação neerlandesa (14 páginas, registro formal cristão) ([5549430](https://github.com/Piano-Louvor-JA/site/commit/5549430dd5dd28f3eda7e3c39c309d650cbbfce3))

### Tests

- fecha gaps de cobertura em telemetria e admin collections ([f46cd91](https://github.com/Piano-Louvor-JA/site/commit/f46cd91e0712afd0ae70bd11daf9c2159596e5a5))
- **i18n:** parity e routing para it/nl/pl (G1 RED) ([92447a9](https://github.com/Piano-Louvor-JA/site/commit/92447a9fa92cc8d279f744a5b1735b302769277e))
- **team:** cobre clique Saiba mais da subseção devs ([17bf049](https://github.com/Piano-Louvor-JA/site/commit/17bf0496aa536f3d6d3193675f8e42e9da290e9a))

### Styles

- format TeamSection e i18n do roster ([1473fa0](https://github.com/Piano-Louvor-JA/site/commit/1473fa04e40fe9896997a345137dbd1efde8fa78))
- prettier i18n/pl.json + docs nl (format:check verde) ([3ee6080](https://github.com/Piano-Louvor-JA/site/commit/3ee6080b6f163ab338777126ad6ee20513b390a2))

### Miscellaneous Chores

- **assets:** favicon.svg transparente (sem fundo preto) ([99e20dc](https://github.com/Piano-Louvor-JA/site/commit/99e20dcf02649166af91bbcae60997edd2ae7170))
- **deps:** bump SonarSource/sonarqube-scan-action from 8.5.0 to 8.5.1 ([c53ec36](https://github.com/Piano-Louvor-JA/site/commit/c53ec36eb1f55cc0bf06166c427720ac164746e1))
- **deps:** bump the npm-dependencies group with 19 updates ([b447413](https://github.com/Piano-Louvor-JA/site/commit/b447413885202573df0983d16b133525366928a0))
- dispara CI da sync main → staging (v1.14.0) ([d1e7f30](https://github.com/Piano-Louvor-JA/site/commit/d1e7f306f30ed19f4886764038f60a1e732b4e29))
- merge staging into dependabot/github_actions/staging/SonarSource/sonarqube-scan-action-8.5.1 ([9a41396](https://github.com/Piano-Louvor-JA/site/commit/9a413968cfb35433029cb6ed2c1dcc70b814e01f))
- merge staging into dependabot/npm_and_yarn/staging/npm-dependencies-a91292eeab ([740df4e](https://github.com/Piano-Louvor-JA/site/commit/740df4e4e278c7e3e90f9f963a43eb440f3d122c))
- merge staging into dependabot/npm_and_yarn/staging/npm-dependencies-a91292eeab ([b34c05b](https://github.com/Piano-Louvor-JA/site/commit/b34c05baca88a9eb6ddb189f0ecfce664ea301bc))
- merge staging into feat/admin-conteudo-global ([bce4674](https://github.com/Piano-Louvor-JA/site/commit/bce46742313140994c1249bf5fab3bfefee3ef09))
- merge staging into feat/admin-conteudo-global ([712327b](https://github.com/Piano-Louvor-JA/site/commit/712327b91a5ae7254a394688fabac61633c2a5d7))
- merge staging into feat/admin-conteudo-global ([d3fc643](https://github.com/Piano-Louvor-JA/site/commit/d3fc643d5b0c16f5008e1b956d6cbe44279614bb))
- merge staging into feat/admin-conteudo-global ([0285d7d](https://github.com/Piano-Louvor-JA/site/commit/0285d7dfe27043143517e2e46914b090cd75f0b3))
- merge staging into feat/complete-client-identification ([0a59d76](https://github.com/Piano-Louvor-JA/site/commit/0a59d760ef4f53daa366b05fada1701bb6ad01ae))
- merge staging into feat/complete-client-identification ([bc9adf8](https://github.com/Piano-Louvor-JA/site/commit/bc9adf823ddd7bdb3373394bed6df64a50665d1a))
- merge staging into feat/complete-client-identification ([357cf43](https://github.com/Piano-Louvor-JA/site/commit/357cf43ca4f140160314cbf6e4b488f8cac0628c))
- merge staging into feat/complete-client-identification ([381df82](https://github.com/Piano-Louvor-JA/site/commit/381df82ad8bca6110c1f314ad1e0192ea9958f64))
- merge staging into feat/complete-client-identification ([8b9b6cd](https://github.com/Piano-Louvor-JA/site/commit/8b9b6cd242fe15106f31474a37e8e27f8e160dbe))
- merge staging into feat/roster-people-v1.1.0 ([1cfbb92](https://github.com/Piano-Louvor-JA/site/commit/1cfbb9205bf28d19a41140c081d6b61af9af31a6))
- merge staging into feat/roster-people-v1.1.0 ([96155c0](https://github.com/Piano-Louvor-JA/site/commit/96155c0877b7348316c06f9df20df2af660b4ae6))
- merge staging into feat/roster-people-v1.1.0 ([d531c03](https://github.com/Piano-Louvor-JA/site/commit/d531c030ffc04630a49b51e72475590132ae8401))
- merge staging into feat/roster-people-v1.1.0 ([b738700](https://github.com/Piano-Louvor-JA/site/commit/b738700ae7e457ae9c0c0f6eca1ac4bdf3d1495c))

## [1.14.0](https://github.com/Piano-Louvor-JA/site/compare/v1.13.0...v1.14.0) (2026-11-26)

### Features

- **api:** identifica requisições do portal com parceiro próprio ([#168](https://github.com/Piano-Louvor-JA/site/issues/168)) ([83b69a0](https://github.com/Piano-Louvor-JA/site/commit/83b69a0681b31339d5867a7a1e550d962c89383f))

### Miscellaneous Chores

- sync main → staging após release v1.13.0 ([6e30d61](https://github.com/Piano-Louvor-JA/site/commit/6e30d61fd93e8eb7f9067f43836b14b943996d03))

## [1.13.0](https://github.com/Piano-Louvor-JA/site/compare/v1.12.0...v1.13.0) (2026-11-26)

### Features

- **admin:** painel de Telemetria — dispositivos online ([122fe53](https://github.com/Piano-Louvor-JA/site/commit/122fe53c2bcc41881ff276de3c0b09164c1bacab))
- **i18n:** convite_catalogo no estado de catalogo vazio por idioma ([78d306a](https://github.com/Piano-Louvor-JA/site/commit/78d306a51130a9e6b53f0c127b3c05d2a4371414))
- **libras:** fatia 4 web — paridade LibrasPlayer/useLibrasLyrics, cache IDB, tradução VLibras real (sem mock) ([c28b48e](https://github.com/Piano-Louvor-JA/site/commit/c28b48e5b5b06abcf4e2ea65d182541d8aa21505))

### Bug Fixes

- **libras:** complete reactive player and handle cache failures ([415ecd7](https://github.com/Piano-Louvor-JA/site/commit/415ecd7660d106268ea84271dc903619ab0c894a))
- **libras:** useCookie dentro do composable (instância Nuxt) — remove imports duplicados e handleLibrasReady quebrado ([ee5d2f4](https://github.com/Piano-Louvor-JA/site/commit/ee5d2f4915f8c3105205501bce4b6dce251cc2ed))

### Tests

- **libras:** coverage 100% para promoção v1.13.0 ([#166](https://github.com/Piano-Louvor-JA/site/issues/166)) ([30e6650](https://github.com/Piano-Louvor-JA/site/commit/30e6650e2ebf4024c8b92cd5978f350adff38b44))

## [1.12.0](https://github.com/Piano-Louvor-JA/site/compare/v1.11.0...v1.12.0) (2026-11-24)

### Features

- **admin:** hub Comunidade unificado — Pendentes/Membros/Equipe (PLAN §3.2) ([c9f9cc3](https://github.com/Piano-Louvor-JA/site/commit/c9f9cc344ddd08c353d778893e246d6db652cf25)), references [#274](https://github.com/Piano-Louvor-JA/site/issues/274)
- **brand:** add email signature logo PNG (350px + 700px retina) from logo-louvor-agrupado.svg ([03e237c](https://github.com/Piano-Louvor-JA/site/commit/03e237c1914769b85ecdb7dd66d7c5ae1784e55b))
- **comunidade:** roster dinâmico via API em People, /testers e página /comunidade ([e371f82](https://github.com/Piano-Louvor-JA/site/commit/e371f82b9508083dbdad2ec6820973f5b8a0df39))
- **docs:** add complete English documentation (14 pages) — wave 3 F3 ([bba974c](https://github.com/Piano-Louvor-JA/site/commit/bba974c2467c2812be3b9fb7f5d0378c7571bf4e))
- **docs:** add guided section editor with preview ([e96dc22](https://github.com/Piano-Louvor-JA/site/commit/e96dc22aa2be4acc085ec41e71e471f8ae4b7a34))
- **docs:** add reviewed editor for volunteers ([9d46fcd](https://github.com/Piano-Louvor-JA/site/commit/9d46fcdbac0d258a3ec994f5afa213a13631dc09))
- **docs:** ar documentation (14 pages) — wave 3 F4 ([957f126](https://github.com/Piano-Louvor-JA/site/commit/957f1262f00e2d7d677bc127eb6a293ee357d1a3))
- **docs:** english install guides (7 pages) — wave 3 F3 partial ([757a320](https://github.com/Piano-Louvor-JA/site/commit/757a3202d4b8a3f13f6049a568562c7682512660))
- **docs:** es documentation (14 pages) — wave 3 F4 ([799c594](https://github.com/Piano-Louvor-JA/site/commit/799c594ba4fab89f77feb80dce549cdcc48f7f36))
- **docs:** fr documentation (14 pages) — wave 3 F4 ([b9f68c9](https://github.com/Piano-Louvor-JA/site/commit/b9f68c9f3b76207c4edea4262364c6487b725ed7))
- **docs:** hi documentation (14 pages) — wave 3 F4 ([574a02a](https://github.com/Piano-Louvor-JA/site/commit/574a02a1e9a48be80202f11d50d7e04df4abee78))
- **docs:** ja documentation (14 pages) — wave 3 F4 ([6f94eb2](https://github.com/Piano-Louvor-JA/site/commit/6f94eb2c2a6c89790d8dba74b90b11fe5b68122c))
- **docs:** ko documentation (14 pages) — wave 3 F4 ([f7efc84](https://github.com/Piano-Louvor-JA/site/commit/f7efc84d2fbaee95ca0b54376c3f102482de09f7))
- **docs:** localized doc routes for 11 locales with pt-BR fallback (wave 3 F2) ([70245c9](https://github.com/Piano-Louvor-JA/site/commit/70245c9698dded79ddb9622fdae4edcc3a348443))
- **docs:** ru documentation (14 pages) — wave 3 F4 ([cf19cec](https://github.com/Piano-Louvor-JA/site/commit/cf19cec23e6a27d37ecfcea840cbfee937d80565))
- **docs:** tr documentation (14 pages) — wave 3 F4 ([4124fcb](https://github.com/Piano-Louvor-JA/site/commit/4124fcb221f7fed708e86ecee722da9200fa115a))
- **docs:** uk documentation (14 pages) — wave 3 F4 ([4f1c505](https://github.com/Piano-Louvor-JA/site/commit/4f1c505d449a20dc236ef5a37a3815cf11272da8))
- **docs:** zh documentation (14 pages) — wave 3 F4 ([c2ad0ea](https://github.com/Piano-Louvor-JA/site/commit/c2ad0ead4161320aee5bcc5354edaedfca206ce4))
- **email:** i18n de e-mails transacionais em 12 locales (TDD) ([4fa5d43](https://github.com/Piano-Louvor-JA/site/commit/4fa5d4347fc7d3cf6b00c58e6787cfdb0a59a0f7))
- **i18n:** add ar hi locales (wave 2) ([089915e](https://github.com/Piano-Louvor-JA/site/commit/089915ebb96f3f80fa1dd28d0e89f473e8c8c93a))
- **i18n:** add ja ko zh tr locales (wave 1) ([e5ce67b](https://github.com/Piano-Louvor-JA/site/commit/e5ce67b399b8a053ff302b9686d7f0b1e6c978c4))
- **i18n:** add ja, ko, zh, tr, ar, hi assets locales (site, 367 keys) ([9801ac3](https://github.com/Piano-Louvor-JA/site/commit/9801ac3b3c8230c19cca825c6be77993f4180c6f))
- **i18n:** catalogos institucional + press nos 6 locales (F2) ([f38b15c](https://github.com/Piano-Louvor-JA/site/commit/f38b15c52907a75995ba3747d45daa36e80481d0))
- **i18n:** wire ar hi locales with RTL support and llms.txt update ([b5127f5](https://github.com/Piano-Louvor-JA/site/commit/b5127f5a35169357e7d23317b0e3ecbfc2140005))
- **institucional:** pagina líderes, press kit, SEO e SSG (F3-F4) ([2b86cb7](https://github.com/Piano-Louvor-JA/site/commit/2b86cb7e81d22ee39f22094fd43d680f44166c73))
- **site:** replace legacy favicon assets with LouvorJA brand ([2bd1715](https://github.com/Piano-Louvor-JA/site/commit/2bd17157a31360cf0ed0aebb5a3a8818dccb29e4))
- **tickets:** central de tickets B2 no site (intake público + portal + admin) ([82cb783](https://github.com/Piano-Louvor-JA/site/commit/82cb7833f5512996095855a7956b4ca38a86f55b))

### Bug Fixes

- **brand:** use logo-louvor-ja.svg (correct logo) for email signature PNGs ([fa7845c](https://github.com/Piano-Louvor-JA/site/commit/fa7845cea6f529c60d521d678abc2800ced5f35a))
- **community:** prioritize API tester profile over sheet fallback ([cfe8143](https://github.com/Piano-Louvor-JA/site/commit/cfe814357ae298fa4e23e89d14ec8239e545bf18))
- **docs:** localePath nos cards do índice e breadcrumb — /xx/docs linka /xx/docs/* ([78ba8f8](https://github.com/Piano-Louvor-JA/site/commit/78ba8f8a9553f766c22bfc3fd7a1323f5919808c))
- **docs:** preserve detail routing in community admin branch ([1c5c8db](https://github.com/Piano-Louvor-JA/site/commit/1c5c8dbea265361d0c9513736a3f87cdeaf9d7df))
- **docs:** preserve frontmatter in proposed edits ([d3a3bcf](https://github.com/Piano-Louvor-JA/site/commit/d3a3bcf8c4c0f407dc21d0d7c70eb579b5b39ae2))
- **docs:** preserve localized navigation across locale changes and hydration ([547fd3e](https://github.com/Piano-Louvor-JA/site/commit/547fd3e33826a0e46c0a69e59e0626f74229ce56))
- **docs:** sidebar links com prefixo docs/<locale> duplicado — docLinkFor ([1928909](https://github.com/Piano-Louvor-JA/site/commit/192890937c5a247ce62e37545f615c383561bdb6))
- **docs:** track proposal API route ([ca055e5](https://github.com/Piano-Louvor-JA/site/commit/ca055e5717ba39c41bd47c359093a7a29c2213d1))
- **i18n:** add ja ko zh tr to LocaleCode type in header ([c07b080](https://github.com/Piano-Louvor-JA/site/commit/c07b080439aa1d1a83c4ff0381509916054ea407))
- **i18n:** add missing es shortcut items 8-9 (wave 3 AC1) ([eb8e2c7](https://github.com/Piano-Louvor-JA/site/commit/eb8e2c727e8e3056d13640b58e8a2a7c6d937088))
- **i18n:** admin comunidade sem literais hardcoded — + chaves title/tabsAriaLabel nos 6 locales (P2 reviewer [#170](https://github.com/Piano-Louvor-JA/site/issues/170)) ([a0c10ea](https://github.com/Piano-Louvor-JA/site/commit/a0c10ea40fa53f6fcf04707937b4317bc873e15e))
- **i18n:** docs guide cards PT residue + links localized per language + editOnGithub translated and locale-aware ([5035c75](https://github.com/Piano-Louvor-JA/site/commit/5035c757b71f8e29cdb7e8fdc01a2db260bcf531))
- **i18n:** ko hymnal glossary compliance per SPEC R2 ([3ed96ed](https://github.com/Piano-Louvor-JA/site/commit/3ed96ed20b78e0bed2a380daa15caefa4262c755))
- **i18n:** load nested raw catalogues for all supported locales ([1396b65](https://github.com/Piano-Louvor-JA/site/commit/1396b653f6905cc5c741534c6799f20327bac473))
- **i18n:** translate docs guide cards and localize hardcoded links ([3e9c826](https://github.com/Piano-Louvor-JA/site/commit/3e9c8269cb5cf610a137e75887cff994e1109612)), references [download#tv](https://github.com/download/issues/tv)
- **site:** use official PIANO app icon as favicon brand source ([6c16dcb](https://github.com/Piano-Louvor-JA/site/commit/6c16dcbbe2059e7688db619dd05f30c4df770652))
- **tickets:** align supported site flows with existing API contract ([15b2be6](https://github.com/Piano-Louvor-JA/site/commit/15b2be6f4c5956ce670fe80436f91c2c42fd4371))

### Tests

- **admin:** generate evidence inside the current checkout ([bb808f5](https://github.com/Piano-Louvor-JA/site/commit/bb808f50f13f95d44fcb41b22e11757b395abc3d))
- complete production coverage for localized docs and community admin ([5c82b6e](https://github.com/Piano-Louvor-JA/site/commit/5c82b6e61091cea9828d089ebc9847f3eda39fca))
- **evidence:** dump HTML das abas do hub para screenshots (fixtures reais) ([3d4d5b8](https://github.com/Piano-Louvor-JA/site/commit/3d4d5b8122f6d2009dc9adc8771946d09b9229d6))
- **i18n:** locale-switch admin comunidade — 6 locales incl. RU/UK (8 specs) ([3d2acfb](https://github.com/Piano-Louvor-JA/site/commit/3d2acfba8be984d83d7531138cadbf3c082054f1))
- **institucional:** red - paginas institucional/press + header link (F1) ([5524859](https://github.com/Piano-Louvor-JA/site/commit/5524859dff519b12e80b64b07b365436d284f8bf))

### Styles

- **docs:** match admin dark theme on editor form ([7b7b03e](https://github.com/Piano-Louvor-JA/site/commit/7b7b03e82fa00ed999a32e0b49a849da15fb5a98))
- **i18n:** prettier format assets locales ([5fc812d](https://github.com/Piano-Louvor-JA/site/commit/5fc812d22f991f0ff191a1a34d836cd8f39a1cba))
- **i18n:** prettier format institucional.vue ([f58c409](https://github.com/Piano-Louvor-JA/site/commit/f58c409bb31613b10e4d7cac2bcceef8b61e27bf))
- prettier nos arquivos do PR — CI format:check verde sem tocar dívida fora do escopo ([e9b0eca](https://github.com/Piano-Louvor-JA/site/commit/e9b0eca265123acae5bdea34f37554266e558bf6))

### Miscellaneous Chores

- ignora .evidence/ (dumps locais de screenshot) ([f74560f](https://github.com/Piano-Louvor-JA/site/commit/f74560f3a550c915474d5df4f99345a45ee3296c))
- synchronize main v1.11.0 into staging ([43c05e2](https://github.com/Piano-Louvor-JA/site/commit/43c05e24b5526fcbc6a681b3a5d3f656fd1ed939))

## [1.11.0](https://github.com/Piano-Louvor-JA/site/compare/v1.10.0...v1.11.0) (2026-11-20)

### Features

- **telemetria:** geo-visit via API + prerender SEO 6 locales ([1236460](https://github.com/Piano-Louvor-JA/site/commit/12364609ff82f0e12c80b8de80596d45ea4a0ed7))

### Bug Fixes

- **admin:** gráfico timeseries aponta pra API do PIANO (rota Nitro não existe em SSG) ([419b044](https://github.com/Piano-Louvor-JA/site/commit/419b0446020abda1192cd6ad91dcf3ef102d4ab2))
- **admin:** moderação comunidade via API direta (fim do 404 SSG) ([7e7e6fd](https://github.com/Piano-Louvor-JA/site/commit/7e7e6fd5e44c703e869d6895da9b5f5368642501))
- **ci:** retain semantic-release compatible with Node 24 ([daf9b6e](https://github.com/Piano-Louvor-JA/site/commit/daf9b6e7a959e85921efb3bd4ea44e348aade906))
- **docs:** corrige gates de review do PR [#122](https://github.com/Piano-Louvor-JA/site/issues/122) — SSG, SEO, E2E e i18n ([fcc7505](https://github.com/Piano-Louvor-JA/site/commit/fcc75056c064289c05fcfc42f1873f28251d1ada))
- **download:** exibir tamanho real do apk android ([5b5e024](https://github.com/Piano-Louvor-JA/site/commit/5b5e0245e394ec1e191562175fe178f8ecb40b8d))
- **quality:** libera gate de lint ([0afcba0](https://github.com/Piano-Louvor-JA/site/commit/0afcba0cd7d7c1890b9c9ff788284c1d4d802f1d))

### Tests

- **admin:** assert configured API timeseries endpoint ([0a706b7](https://github.com/Piano-Louvor-JA/site/commit/0a706b7df9e9bddf58d611dbdd7aa254ae62439f))
- **site:** cover telemetry and Nuxt development error paths ([5fc058a](https://github.com/Piano-Louvor-JA/site/commit/5fc058a4fa2c9321a8898871c131b327ff77930a))

### Styles

- prettier (CI format check) ([a491b58](https://github.com/Piano-Louvor-JA/site/commit/a491b58bd3996a179abc934bff1f5bb460e67600))

### Miscellaneous Chores

- **deps:** bump SonarSource/sonarqube-scan-action from 8.4.1 to 8.5.0 ([e8f1183](https://github.com/Piano-Louvor-JA/site/commit/e8f118365336b3111106118eb6c6a91a8441836c))
- **deps:** bump the npm-dependencies group with 26 updates ([d3feddc](https://github.com/Piano-Louvor-JA/site/commit/d3feddc776277a01014a5f03e03f0e2724bddcc3))

## [1.10.0](https://github.com/Piano-Louvor-JA/site/compare/v1.9.0...v1.10.0) (2026-11-19)

### Features

- **download:** seção Mídias com CTA para /midias ([3ff4c28](https://github.com/Piano-Louvor-JA/site/commit/3ff4c2880904975636f2d926ade2ce24b435c9fe))

### Bug Fixes

- usa node:sqlite no Content para o build Hostinger ([9f1a59c](https://github.com/Piano-Louvor-JA/site/commit/9f1a59c70c8abdc17866636f4a77eca04b5584b2))

### Miscellaneous Chores

- sync main v1.9.0 into staging ([495a3e0](https://github.com/Piano-Louvor-JA/site/commit/495a3e047fe917d57fa0eaf56c12c89b89d00106))

## [1.9.0](https://github.com/Piano-Louvor-JA/site/compare/v1.8.0...v1.9.0) (2026-11-18)

### Features

- **i18n:** add russian ukrainian and french locales ([a38b8dd](https://github.com/Piano-Louvor-JA/site/commit/a38b8dd3010f47e6e54748502513f98858446c54))
- **seo:** international sitemap hreflang x-default and llms.txt for ru uk fr ([d3b0159](https://github.com/Piano-Louvor-JA/site/commit/d3b01595793cc921019667db34349db6fe9e0661))

### Bug Fixes

- **admin:** painel gestao chama a API direto (client-side) + CSS do login ([fbbf715](https://github.com/Piano-Louvor-JA/site/commit/fbbf7156d564677452ad59d2a2b196087fd5dcaa)), references [#43474e](https://github.com/Piano-Louvor-JA/site/issues/43474e)
- **admin:** pendentes da comunidade via sheet gviz pública (rota Nitro 404 em SSG) ([758c745](https://github.com/Piano-Louvor-JA/site/commit/758c7453f6c98dc7135beb11973e704d84a0edb7))
- **ci:** passa GITHUB_TOKEN no prerender e evita 500 no SSG ([c736a2a](https://github.com/Piano-Louvor-JA/site/commit/c736a2ac1c940866bd98787c73a0e4c1415dc115))
- **downloads:** expor somente apk universal ([900438a](https://github.com/Piano-Louvor-JA/site/commit/900438aa54b94dafe26967da8a9be5fb47fbbb12))
- **security:** ignora GHSA-fc5q-39xc-vjpf (picomatch ReDoS) até o fix sair ([94d9417](https://github.com/Piano-Louvor-JA/site/commit/94d94174918ac64668c2785af3500738a6aa5618))

### Tests

- **api:** cobre branches de pianoApiBase em usePianoApi ([ac4c0a5](https://github.com/Piano-Louvor-JA/site/commit/ac4c0a5cb3293ccd9bfa743c0b88374b1742e330))
- **downloads:** alinhar testes legados ao contrato apk universal ([c736cbb](https://github.com/Piano-Louvor-JA/site/commit/c736cbb114a7ce52a64b8b0b6c8a51e88dbeb977))

### Styles

- **admin:** formata mensagem de env da Comunidade (CI [#127](https://github.com/Piano-Louvor-JA/site/issues/127)) ([1be2224](https://github.com/Piano-Louvor-JA/site/commit/1be2224e5778d902dda321d6f59d9bbbab8becb4))
- **i18n:** format translated locale files with prettier ([30c4040](https://github.com/Piano-Louvor-JA/site/commit/30c4040197a288495c121dad71a4924d11ffd120))
- prettier no teste de downloads ([5929e51](https://github.com/Piano-Louvor-JA/site/commit/5929e51f976ec16983b8d76c8a577edd52afb44a))

### Miscellaneous Chores

- remove artefato gerado docs-index.json do commit (review P1) e gitignore ([1d365fb](https://github.com/Piano-Louvor-JA/site/commit/1d365fb07dd5a7cc884c6aadfe3cfc29796abbba))

## [1.8.0](https://github.com/Piano-Louvor-JA/site/compare/v1.7.0...v1.8.0) (2026-11-15)

### Features

- **admin:** página /admin/gestao — eventos sazonais CRUD + pool de tasks semanais (SPEC piano-admin-panel v1.1.0) ([6b68cf1](https://github.com/Piano-Louvor-JA/site/commit/6b68cf1799aa217f2eb3fa97fc729fb1638cb2b2))
- **docs:** fases 1+2 @nuxt/content e 14 páginas pt-BR ([cd5e571](https://github.com/Piano-Louvor-JA/site/commit/cd5e571e56e88a5915e6a1b7f532235cc68f131d))
- **midias:** página /midias com download de mídias via Google Drive ([d8e1295](https://github.com/Piano-Louvor-JA/site/commit/d8e129577951377a92e32a04c3f9a7553dee3333))
- **site:** ranking público da comunidade + refit /conduta no layout (SPEC piano-site-public v1.0.0) ([ed64395](https://github.com/Piano-Louvor-JA/site/commit/ed64395f47c2f4d607fcc437e3f9dbc9d991f44f))

### Bug Fixes

- **admin:** map community rows to physical sheet lines ([370f3a4](https://github.com/Piano-Louvor-JA/site/commit/370f3a40f0fccfa557fb47faaae24b316990fa21))
- **docs:** compatibiliza build e testes do conteúdo ([c911ee4](https://github.com/Piano-Louvor-JA/site/commit/c911ee45224cb85ea4676a40f41d004b74ef43e3))
- **docs:** tipa frontmatter da página de conteúdo ([d098205](https://github.com/Piano-Louvor-JA/site/commit/d0982057b42c8e76a5c1b6161f59cdcd292fd354))
- **lint:** remove unused vars no ranking.vue e ranking.test.ts (pre-push eslint) ([a835497](https://github.com/Piano-Louvor-JA/site/commit/a8354977d3378a2dabac63a22310a0e030a38691))
- **ranking:** TS2558 — doFetch não recebe type argument (typecheck do CI) ([652288e](https://github.com/Piano-Louvor-JA/site/commit/652288e8453ee9fced3a832cf116edb756f9ae03))
- **security:** ignora GHSA do Zod 3 falso positivo via @nuxt/content ([955fa9a](https://github.com/Piano-Louvor-JA/site/commit/955fa9ae0fcfe724fe6684e9bcb80362a9a73efa))

### Styles

- **cms:** formata configuração decap ([ba99b89](https://github.com/Piano-Louvor-JA/site/commit/ba99b894ac12bf679afb8c07f896fb8d3fe2c963))
- format community-pending-row test with Prettier ([05b1d7f](https://github.com/Piano-Louvor-JA/site/commit/05b1d7f6054a2204cb74202c26d3324fcec52872))
- prettier nos arquivos novos (ranking/conduta/footer/i18n) ([373004b](https://github.com/Piano-Louvor-JA/site/commit/373004babddc79e06fb0e49d096f927cda78b12c))

### Miscellaneous Chores

- **deps:** bump the npm-dependencies group with 17 updates ([d1262cc](https://github.com/Piano-Louvor-JA/site/commit/d1262ccca7a312fb820f07a5b8bffc98ca69cefd))
- merge staging into dependabot após site[#118](https://github.com/Piano-Louvor-JA/site/issues/118) ([8b9e553](https://github.com/Piano-Louvor-JA/site/commit/8b9e55384dff4d30ea0f71afb21d49ee2b862c83))
- merge staging into feat/media-drive-section ([6b7e879](https://github.com/Piano-Louvor-JA/site/commit/6b7e87930d14bb3e3cb99c876ad9b31e84092b4f))
- merge staging into feat/site-public-ranking ([b8e0cfa](https://github.com/Piano-Louvor-JA/site/commit/b8e0cfaf40b73a8b45008a5d8492e2fd1d2fc5b2))
- merge staging into feat/site-public-ranking após [#118](https://github.com/Piano-Louvor-JA/site/issues/118)/[#119](https://github.com/Piano-Louvor-JA/site/issues/119) ([3a934bd](https://github.com/Piano-Louvor-JA/site/commit/3a934bd867641dfa75a1175a7bc3668f04be4ad5))
- resolve conflito de merge com staging (deps dependabot) ([5d36327](https://github.com/Piano-Louvor-JA/site/commit/5d363273f9669116c1dd5c92fc6d056fa6b92748))
- resolve merge staging — footer ranking + midias ([1b353bc](https://github.com/Piano-Louvor-JA/site/commit/1b353bc16c1ebdae0847f595ef481e65853364a3))
- retrigger CI com base staging (limpa checks órfãos de main) ([0c0b6f4](https://github.com/Piano-Louvor-JA/site/commit/0c0b6f4cc353f67da621c95f349f1c65d5427918))

## [1.7.0](https://github.com/Piano-Louvor-JA/site/compare/v1.6.2...v1.7.0) (2026-11-09)

### Features

- **coc:** página /conduta com CoC v1.0 integral (pt/en/es) + link no footer ([78f4088](https://github.com/Piano-Louvor-JA/site/commit/78f4088f9dc46a6d7f7f8bd9db9eb050797041fa))

### Bug Fixes

- **admin:** isolamento do sendmail na moderacao e erro estruturado na ui ([d6fbf39](https://github.com/Piano-Louvor-JA/site/commit/d6fbf396f925f6eda3a91a01030a3fb046088d5e))
- **deps:** patch security advisories and validate conduct translations ([68cecc1](https://github.com/Piano-Louvor-JA/site/commit/68cecc1100903285b82a1f90c056966bbbec5144))
- **deps:** resolve active high severity advisories ([4ab3510](https://github.com/Piano-Louvor-JA/site/commit/4ab35107fcdc22ea7fb551ba3fbc21861fc0feda))
- **deps:** resolve active high severity advisories ([70a7af6](https://github.com/Piano-Louvor-JA/site/commit/70a7af681accdb9404ba471254b99e45ee458dc2))
- **deps:** resolve active high severity advisories ([58d97c0](https://github.com/Piano-Louvor-JA/site/commit/58d97c077ff64f57370c0831b6beb185d7877817))

### Styles

- **coc:** prettier ([78afaee](https://github.com/Piano-Louvor-JA/site/commit/78afaee0e4fc332440cbd9409762920a3aa4b728))

### Miscellaneous Chores

- **deps:** bump SonarSource/sonarqube-scan-action from 8.3.0 to 8.4.1 ([1f6de6d](https://github.com/Piano-Louvor-JA/site/commit/1f6de6de5745b7fd61d1ee14d64d0f5b0633b629))
- **deps:** bump the npm-dependencies group across 1 directory with 29 updates ([3b7f77f](https://github.com/Piano-Louvor-JA/site/commit/3b7f77f1f13e2ee483b84d4025c68e586d6ba685))
- merge staging after dependency updates ([31a0a1d](https://github.com/Piano-Louvor-JA/site/commit/31a0a1db1fc68d61357fd8d6e6c9667d5bd1f6e6))
- merge staging after dependency updates ([cecb89c](https://github.com/Piano-Louvor-JA/site/commit/cecb89c83cc69013645b1aacd698b3c71e09cc83))
- merge staging after dependency updates ([b8b0d00](https://github.com/Piano-Louvor-JA/site/commit/b8b0d004fe941cb84a5c3f85b868a4aac53ab4de))
- sync main v1.6.2 into staging ([4713f7a](https://github.com/Piano-Louvor-JA/site/commit/4713f7a4cab7b5a455c2769b42f2586ba6aa4a0f))

## [1.6.2](https://github.com/Piano-Louvor-JA/site/compare/v1.6.1...v1.6.2) (2026-10-17)

### Bug Fixes

- **ci:** align Stryker test filters with Vitest 5 ([1041d3e](https://github.com/Piano-Louvor-JA/site/commit/1041d3e97b7e4c7b4598949b6f168825b3c39e2c))
- **site:** use empty Flathub verification marker ([ad4aafc](https://github.com/Piano-Louvor-JA/site/commit/ad4aafc0844767c65d46ce4f7fd4ff4312699645))

### Tests

- **deps:** verify upgraded runtime contracts ([31241de](https://github.com/Piano-Louvor-JA/site/commit/31241dee3bc127866e670d55b0908e7a407e1f2c))

### Miscellaneous Chores

- **deps:** adapt grouped upgrades to current tooling ([cdccd63](https://github.com/Piano-Louvor-JA/site/commit/cdccd639f4a59ed839de8dfab4664ecbd421a8f4))
- **deps:** bump actions/checkout from 4 to 7 ([d95c693](https://github.com/Piano-Louvor-JA/site/commit/d95c6931a657d34802acffc2244fc3d2088a0b3b))
- **deps:** bump actions/download-artifact from 7 to 8 ([a3b2428](https://github.com/Piano-Louvor-JA/site/commit/a3b242888d58720b839c7c49c6439c9bc28c74f1))
- **deps:** bump actions/setup-node from 4 to 7 ([7da8fd5](https://github.com/Piano-Louvor-JA/site/commit/7da8fd5da0efa4af048c347a3baf13d9ffd37bef))
- **deps:** bump actions/upload-artifact from 6 to 7 ([39bd899](https://github.com/Piano-Louvor-JA/site/commit/39bd8993d2e908f6cf964b9ccbacad7b88eb9413))
- **deps:** bump the npm-dependencies group with 24 updates ([7caf2fb](https://github.com/Piano-Louvor-JA/site/commit/7caf2fb42d15e0936a7f7549efc45f1d5d9d2802))
- **site:** add Flathub domain verification file ([7fe7e74](https://github.com/Piano-Louvor-JA/site/commit/7fe7e740f57fb98caeaf6e0f91608176c937d68f))
- **sync:** bring main v1.6.1 back to staging ([6d08ffc](https://github.com/Piano-Louvor-JA/site/commit/6d08ffc7ed84d4683ad29ba53832644c2b83f0ef))

## [1.6.1](https://github.com/Piano-Louvor-JA/site/compare/v1.6.0...v1.6.1) (2026-10-09)

### Bug Fixes

- **ci:** restore compatible Vitest mutation testing ([c6c0012](https://github.com/Piano-Louvor-JA/site/commit/c6c00126e1d64ee64277c2f79825fbd348f1dbc2))
- **ci:** restore release notes preset compatibility ([44c0dd1](https://github.com/Piano-Louvor-JA/site/commit/44c0dd11cb349787db43923ed8f668ce29663373))
- **test:** keep Vue props macro compatible with mutation runner ([cd82438](https://github.com/Piano-Louvor-JA/site/commit/cd824381ba4ccc6af77b94c55f390ef848173bd1))

## [1.6.0](https://github.com/Piano-Louvor-JA/site/compare/v1.5.0...v1.6.0) (2026-10-09)

## [1.5.0](https://github.com/Piano-Louvor-JA/site/compare/v1.4.0...v1.5.0) (2026-10-01)

## [Unreleased]

### piano-site (este repo)

#### Added (F0 — 29/09/2026)

- Contador dinâmico de instalações na home e /download — soma de downloads de TODOS os repos do ecossistema (app + apk + palco-receiver), via `/api/github/total-downloads`
- Endpoint público `/api/github/total-downloads` com cache de 5 min
- Stat "95+ Funcionalidades do ecossistema" na home (antes "8+", estático)
- Camada de resiliência GitHub: snapshot persistente em disco (`.data/github-snapshots.json`) + sincronizador background com ETag condicional (30 min) — o site serve dados locais e NUNCA depende da API GitHub no caminho do visitante
- Fallback hardcoded (snapshots reais datados) como último recurso em total-downloads e latest-app-release

#### Fixed (29/09/2026)

- Owner GitHub atualizado `pianolouvorja` → `Piano-Louvor-JA` em 38 arquivos (PR #60, migração da org)
- Seções Mobile/TV/VoidBR restauradas na /download (cards de download reais no lugar do "coming soon")
- VoidBR ISO: URL canônica nova (`voidbr-live-plasma-louvorja-piano-current.iso`) + listagem via `/iso/` (o `/iso/current/` antigo retorna 301)
- `download.vue`: script reconstruído (conflitos de merge haviam triplicado onMounted e apagado declarações)
- i18n: paridade pt-BR/en/es (653 keys) + 21 keys faltantes (tv.features, apkNote, releases.repos)
- Footer: removido canal dev-form (Google Forms antigo); Telegram re-rotulado para "Comunidade"
- Parser de release notes: reconhece seções "Novos recursos/Melhorias/Correções" + renderiza markdown inline (bold/links) sanitizado

## [1.4.0](https://github.com/pianolouvorja/site/compare/v1.3.0...v1.4.0) (2026-09-25)

### Site (institucional)

**Comunidade**

- Seção Comunidade reformulada: WhatsApp (suporte) + Telegram, SEO e PWA
- Painel admin de membros: gestão completa (roles, ban, auditoria, export CSV)
- Endpoints admin `/community/*` com custom claims (requireRole server-side)
- Migração do roster de testadores: Google Sheets → Firestore
- `/testers`: galeria de testadores com modal e relatos dinâmicos da sheet
- Formulário `/contact` com select de assunto (geral/testador/dev/bug)
- Endpoint `community/register` com gravação em Sheets e moderação

**Admin & UX**

- Navegação entre painéis no layout admin + nav do admin no layout público
- Ícone Pix real na seção "Apoie o projeto"
- Limpeza de nav redundante no dashboard

**Correções**

- Layout `default` restaurado após merge com staging
- `/testers` restaurado no nav; SSR das rotas admin corrigido
- SVG do Pix visível (CSS estilizava apenas `i`, não `svg`)
- Sass migrado de `sass-embedded` para JS puro (build travava no fallback)
- Vitest: workers limitados (Node 24 derrubava IPC em suites longas)

**Web (app PWA)**

#### 25 de setembro de 2026

- Entrega da Comunidade no Web App: coletâneas compartilhadas, ranking e moderação (paridade com desktop)

**Web (app PWA)**

- Comunidade entregue no Web App (25/09/2026): coletâneas compartilhadas, ranking e moderação — paridade com o desktop

## [1.3.0](https://github.com/pianolouvorja/site/compare/v1.2.0...v1.3.0) (2026-09-23)

## [1.2.0](https://github.com/pianolouvorja/site/compare/v1.1.0...v1.2.0) (2026-09-12)

## 1.0.0 (2026-08-22)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-30

### Added

- Landing page completa com seções: Hero, Funcionalidades, Plataformas, Como Funciona, Sobre, FAQ, CTA
- Suporte a internacionalização (i18n) com PT-BR (padrão) e EN
- Seletor de idioma interativo no header
- Página de documentação (/docs)
- Formulário de contato via Web3Forms
- SEO: OpenGraph, Twitter Cards, meta tags dinâmicas
- Acessibilidade: WCAG AA, navegação por teclado, ARIA labels
- Design system com tokens SCSS (cores, tipografia, espaçamento)
- Responsivo: mobile-first com breakpoints alinhados ao Vuetify
- Build estático (SSG) via `nuxt generate`

### Technical

- Nuxt 4 + Vue 3 + TypeScript
- @nuxtjs/i18n v10
- @tabler/icons-webfont
- Vitest + Playwright para testes
- ESLint + Prettier + Husky + lint-staged
