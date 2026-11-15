# Auditoria de Coverage — piano-site (05/10)

Medição: `npx vitest run --coverage --coverage.include='**/{components,composables,layouts,pages,plugins,server,utils}/**'` na branch feat/site-brand.

## Números reais

| Métrica    | Valor                  | Meta |
| ---------- | ---------------------- | ---- |
| Lines      | **59.43%** (1739/2926) | 100  |
| Functions  | **62.78%** (410/653)   | 100  |
| Statements | **53.86%**             | 100  |
| Branches   | **49.13%**             | 100  |

129 arquivos. Suíte passando (site não teve quebra nesta rodada).

## Achados

1. **Gate de 100% configurado e FALHANDO** (vitest exibe ERROR de threshold) — ou o CI não roda coverage, ou roda e ignora. Verificar workflow: se o job existe, está sendo tolerado vermelho.
2. **Zonas 0%**: páginas admin (conteudo, newsletter), server/api de community/github (register, review, pending, all-downloads, voidbr-iso), download/releases (páginas públicas!), usePlatformsCarousel.
3. server/api a 0% é risco real: são endpoints públicos com input de usuário (newsletter, community register).

## Plano pra 100

1. Decidir o destino do gate: ou o CI roda e falha de verdade, ou o threshold é ratchet honesto (piso 59.43%).
2. Onda 1: server/api community+newsletter (input público).
3. Onda 2: páginas públicas (download, releases) — Playwright E2E cobre comportamento; unidade cobre lógica.
4. Mutation (Stryker configurado): baseline após coverage ≥80%.
