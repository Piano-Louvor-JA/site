# Changelog

All notable changes to this project are documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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