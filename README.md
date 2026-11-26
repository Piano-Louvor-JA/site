# PIANO LouvorJA — Site

Site oficial do **PIANO LouvorJA**, sistema de gerenciamento de cultos da Igreja Adventista do Sétimo Dia. Bíblia, hinário, liturgia, projeção multi-tela, cronômetro e mais — tudo em uma plataforma web gratuita e open-source.

[**Acessar o app**](https://app.pianolouvorja.com.br) · [**Documentação**](https://pianolouvorja.com.br/docs)

## Stack

- **[Nuxt 4](https://nuxt.com)** + **[Vue 3](https://vuejs.org)** — SSG (Static Site Generation) com prerender
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org)** — 3 idiomas: pt-BR (padrão), en, es
- **[Tabler Icons](https://tabler-icons.io)** — iconografia
- **[Vitest](https://vitest.dev)** + **Istanbul** — testes unitários com 100% coverage
- **[Stryker](https://stryker-mutator.io)** — mutation testing com 100% score
- **[Playwright](https://playwright.dev)** — testes E2E
- **[Storybook](https://storybook.js.org)** — catálogo de componentes
- **[Semantic Release](https://semantic-release.gitbook.io)** — versionamento automatizado
- **[ESLint](https://eslint.org) 9** + **[Biome](https://biomejs.dev)** — lint e formato

## Pré-requisitos

- **Node.js 24** (ver `.nvmrc`)
- **pnpm 11+**

```bash
nvm use        # instala/use a versão correta do Node
corepack enable pnpm
```

## Começando

```bash
pnpm install
pnpm dev       # servidor de desenvolvimento em http://localhost:3000
```

## Scripts

| Script               | Descrição                                         |
| -------------------- | ------------------------------------------------- |
| `pnpm dev`           | Servidor de desenvolvimento                       |
| `pnpm build`         | Build de produção                                 |
| `pnpm generate`      | SSG — gera arquivos estáticos em `.output/public` |
| `pnpm preview`       | Pré-visualiza o build de produção                 |
| `pnpm test`          | Testes unitários (watch mode)                     |
| `pnpm test:coverage` | Testes + relatório de coverage (threshold 100%)   |
| `pnpm test:e2e`      | Testes E2E com Playwright                         |
| `pnpm test:mutation` | Mutation testing com Stryker                      |
| `pnpm typecheck`     | Verificação de tipos TypeScript                   |
| `pnpm lint`          | Lint com ESLint                                   |
| `pnpm format`        | Formatação com Biome (write)                      |
| `pnpm format:check`  | Verifica formatação sem alterar arquivos          |
| `pnpm storybook`     | Inicia o Storybook                                |

## Estrutura

```
app/
├── app.vue                 # Root — SEO defaults via useAppHead()
├── error.vue               # Página de erro 404/500
├── assets/css/             # Estilos globais (main.scss)
├── components/             # 10 componentes Vue
│   ├── HeroSection.vue
│   ├── FeaturesSection.vue
│   ├── HowItWorksSection.vue
│   ├── StatsSection.vue
│   ├── PlatformsSection.vue
│   ├── CtaSection.vue
│   ├── AboutSection.vue
│   ├── LegalBodyItem.vue
│   ├── TheHeader.vue
│   └── TheFooter.vue
├── composables/
│   ├── useAppHead.ts       # SEO: Open Graph, Twitter Card, JSON-LD, canonical
│   └── useLocaleMessages.ts
├── data/
│   └── site.ts             # Config do site, features, nav links
├── layouts/
│   └── default.vue
└── pages/
    ├── index.vue           # Landing page
    ├── contact.vue         # Formulário de contato
    ├── docs.vue            # Documentação do app
    ├── privacy.vue         # Política de privacidade
    └── terms.vue           # Termos de uso

i18n/locales/
├── pt-BR.json              # Português (Brasil) — padrão
├── en.json                 # English
└── es.json                 # Español

test/                       # Testes unitários (Vitest)
e2e/                        # Testes E2E (Playwright)
.github/workflows/          # CI/CD (ci.yml, deploy.yml, release.yml)
```

## Internacionalização

3 idiomas com estratégia `prefix_except_default`:

| Idioma             | URL   | Código |
| ------------------ | ----- | ------ |
| Português (padrão) | `/`   | pt-BR  |
| Inglês             | `/en` | en     |
| Espanhol           | `/es` | es     |

Cookie: `piano_lang`

## SEO

O composable `useAppHead()` centraliza toda a configuração SEO:

- Open Graph + Twitter Card tags
- Links canônicos e alternados (`hreflang`) para cada locale
- JSON-LD structured data
- Titles e descriptions reativos por página

## Qualidade

Este projeto mantém padrões rigorosos de qualidade:

- **100% code coverage** — todas as linhas, branches, funções e statements
- **100% mutation score** — Stryker verifica que os testes realmente detectam mutações
- **TypeScript strict mode**
- **Conventional Commits** — commits seguem o padrão [Angular Convention](https://www.conventionalcommits.org/)
- **lint-staged + husky** — pre-commit hooks garantem código limpo

## CI/CD

A esteira de CI/CD é composta por 3 workflows:

### ci.yml

Roda em todo push e PR. 4 jobs paralelos (após `quality`):

1. **quality** — lint, format check, typecheck, testes + coverage artifact
2. **sonar** — análise SonarQube (precisa `SONAR_TOKEN` + `SONAR_HOST_URL`)
3. **build** — `pnpm generate` valida o SSG
4. **mutation** — Stryker (apenas em PRs, precisa `STRYKER_DASHBOARD_API_KEY`)

### release.yml

Roda em push para `main` ou `staging`. Semantic-release cria tags e releases:

- Push em `main` → release estável (`1.x.x`)
- Push em `staging` → prerelease beta (`1.x.x-beta.x`)

### deploy.yml

Roda em push para `main` ou release publicado. Deploy para produção.

## Fluxo Git

```
feature/xxx → staging (prerelease beta) → main (release estável + deploy)
```

1. Criar branch a partir de `staging`: `feat/descricao`, `fix/descricao`, etc.
2. Abrir PR para `staging` — CI roda completo (quality + sonar + mutation)
3. Após aprovação e CI verde, merge para `staging` — gera prerelease beta
4. PR de `staging` → `main` para promover para produção
5. Merge em `main` dispara release estável + deploy

## Plataformas

| Plataforma  | Status     | Descrição                                                          |
| ----------- | ---------- | ------------------------------------------------------------------ |
| **Desktop** | Disponível | App Electron multi-tela                                            |
| **Web**     | Disponível | PWA — [app.pianolouvorja.com.br](https://app.pianolouvorja.com.br) |
| **Mobile**  | Em breve   | Flutter (planejado)                                                |

## Licença

[MIT](LICENSE) © 2026 Equipe LouvorJA

## Identificação do site na API Piano

O site usa `X-Client-Platform: site`, a versão do pacote em
`X-Client-Version` e uma chave própria de parceiro em `X-Partner-Key`.
O transporte é aplicado ao `fetch` e ao `$fetch` (incluindo `raw`, `create`
e hooks), no navegador e no Nitro. `Authorization`, `X-Tenant`, corpo e
headers explícitos são preservados. Google/Firebase, upstream e terceiros
não recebem a chave; requisições `no-cors` não são alteradas.

Configure `NUXT_PUBLIC_PIANO_PARTNER_KEY_STG` na hospedagem de staging e
`NUXT_PUBLIC_PIANO_PARTNER_KEY_PROD` na produção antes do build/generate.
No GitHub, os nomes dos secrets são `PARTNER_KEY_STG` e `PARTNER_KEY_PROD`.
Eles devem conter chaves próprias “LouvorJA Portal Piano”, distintas das do web
operador, desktop e palco. Sem chave, o acesso atual continua funcionando.
Como o site é distribuído também por SSG, esses valores são identificadores
públicos e revogáveis incorporados ao build; não são credenciais de usuário.

A chave é escolhida pela URL efetiva e só é enviada à API Piano HTTPS ou
à API local em localhost/127.0.0.1. Chamadas com chave recusam redirects para
não encaminhá-la a outra origem. O deploy da hospedagem precisa receber
suas próprias variáveis: secrets do GitHub não são copiados automaticamente.

Os workflows de validação, incluindo CI Main e Homologation, usam staging
para evitar tráfego de testes em produção. O workflow Deploy gera o artefato
público com a chave de produção; o destino de publicação desse workflow ainda
é um TODO no repositório. A hospedagem que compila o código do Git precisa
receber as variáveis no próprio painel antes do novo build.

Confirme também `NUXT_PUBLIC_PIANO_API_BASE`: em staging use
`https://api-stg.pianolouvorja.com.br`; na produção,
`https://api.pianolouvorja.com.br`. A chave não modifica a base da API.
