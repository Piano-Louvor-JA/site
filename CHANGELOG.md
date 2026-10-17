# Changelog

All notable changes to this project are documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
