# Changelog

All notable changes to this project are documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
