# PIANO LouvorJA Site — Development Guide

## Stack

- **Framework**: Nuxt 4 SSG (Vue 3 + Vue Router)
- **Language**: TypeScript strict
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Coverage**: 100% em todos os thresholds (lines, functions, branches, statements)
- **Pre-commit**: Husky + lint-staged
- **Package Manager**: pnpm

## Responsive Design Pattern

Este projeto usa dois pares complementares para responsividade:

### 1. `useDisplay` ou composables — para lógica JS/template

```vue
<script setup lang="ts">
  const isMobile = ref(false)

  onMounted(() => {
    isMobile.value = window.innerWidth < 768
  })
</script>
```

### 2. `@media` queries (CSS) — para mudanças visuais

```scss
.component {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 430px) {
    font-size: 0.875rem;
  }
}
```

### Breakpoints padrão

| Token  | Value  | Uso              |
| ------ | ------ | ---------------- |
| mobile | 430px  | Mobile pequeno   |
| sm     | 600px  | Mobile → tablet  |
| md     | 768px  | Tablet → desktop |
| lg     | 1280px | Desktop → large  |

## TDD Workflow

**RED → GREEN → REFACTOR**

1. Escrever o teste primeiro (arquivo `*.test.ts` ou `*.spec.ts`)
2. Rodar `pnpm test` — teste deve FALHAR (RED)
3. Implementar o mínimo de código para o teste passar (GREEN)
4. Refatorar mantendo os testes verdes (REFACTOR)
5. Repetir

### Comandos

```bash
pnpm test           # Roda testes unitários uma vez
pnpm test:watch     # Modo watch
pnpm test:coverage  # Gera relatório de cobertura
pnpm test:e2e       # Roda testes E2E (Playwright)
pnpm test:all       # Tudo: unit + coverage + e2e
pnpm typecheck      # Verificação de tipos
pnpm build          # Build de produção (SSG)
```

### Cobertura

A cobertura mínima é **100%** em todos os thresholds. O CI vai falhar se qualquer
metrica cair abaixo. Testes sem coverage de uma linha, branch ou função = bloqueado.

## Estrutura de Pastas

```
app/
  components/     # Componentes Vue (atomic design)
  composables/    # Composables reutilizáveis
  pages/          # Páginas/routing
  assets/         # CSS, imagens
test/
  unit/           # Testes unitários
  setup.ts        # Setup global do Vitest
e2e/              # Testes E2E (Playwright)
```

## Commits e Branches

- **Branch padrão**: `main` (protegida)
- **Fluxo**: feature branch → PR → review → merge
- **Pre-commit hook**: roda lint-staged (eslint + typecheck nos arquivos alterados)
- **Commit message**: convencional (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`)

## ⚠️ Decisão de Design Pendente de Implementação — Brand Alignment (30/09/2026)

**Direção validada pelo Rafael**: o site deve usar os tokens de cor do PRODUTO
(hoje usa uma família azul/ciano que não existe nos apps). Antes de mexer em
qualquer cor/estilo, ler a decisão completa em:

- **Doc-mestre (Obsidian)**: `04-Projects/PIANO Site — Redesign Identidade e Carrossel de Plataformas.md`
- Resumo técnico também em `docs/DESIGN-BRAND-ALIGNMENT.md` (não versionado — docs/ é gitignored)

Resumo dos tokens-alvo (verificados no código do produto):

| Camada       | Tokens                                                                              |
| ------------ | ----------------------------------------------------------------------------------- |
| Marca/logo   | azul `#2196F3` + amarelo `#F8C800`                                                  |
| UI/interação | neutros dark `#131313` / light `#F8F9FF` + laranja `#E0895A` (defaultAccent do app) |
| Auxiliares   | teal `#78D6D2`                                                                      |

Fontes da verdade no produto: `pianolouvorja/app/src/design-system/themes/accents.ts`
(defaultAccent orange `#E0895A`) e `tokens/colors.ts`. Dark/Light no site deve
espelhar os temas Ethereal Lumens / Luminous Clarity.

**Fila de implementação**: (1) paleta+hero → (2) dark/light toggle → (3) carrossel
de 6 plataformas com prints reais + GSAP (substituir PlatformsSection). Detalhes,
regras anti-AI-slop e arquivo-por-arquivo no doc-mestre.
