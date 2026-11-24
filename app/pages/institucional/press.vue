<script setup lang="ts">
  const { t } = useI18n()

  // SEO
  useAppHead({
    title: t('press.meta.title'),
    description: t('press.meta.description'),
    path: '/institucional/press',
  })

  function printPage(): void {
    if (typeof window !== 'undefined') window.print()
  }
</script>

<template>
  <div class="press-page" data-testid="press-page">
    <!-- Hero -->
    <section class="press-hero">
      <div class="press-hero__container">
        <h1 class="press-hero__title">
          {{ $t('press.title') }}
        </h1>
        <p class="press-hero__lede">
          {{ $t('press.lede') }}
        </p>
        <button
          type="button"
          class="press-hero__btn"
          data-testid="press-print-btn"
          @click="printPage"
        >
          {{ $t('press.printCta') }}
        </button>
      </div>
    </section>

    <!-- P1–P4 -->
    <section class="press-content">
      <div class="press-content__container">
        <!-- P1 Sobre -->
        <article class="press-block" data-testid="press-about">
          <h2>{{ $t('institucional.s1.title') }}</h2>
          <p>{{ $t('press.about') }}</p>
        </article>

        <!-- P2 Mensagem-chave -->
        <article class="press-block" data-testid="press-keypoints">
          <ul>
            <li v-for="(point, i) in $tm('press.keyPoints')" :key="i">
              {{ point }}
            </li>
          </ul>
        </article>

        <!-- P3 Onde encontrar -->
        <article class="press-block" data-testid="press-where">
          <h2>{{ $t('press.where.title') }}</h2>
          <ul>
            <li v-for="(item, i) in $tm('press.where.items')" :key="i">
              {{ item }}
            </li>
          </ul>
        </article>

        <!-- P4 Contato -->
        <article class="press-block" data-testid="press-contact">
          <p>{{ $t('press.contact') }}</p>
        </article>
      </div>
    </section>

    <!-- Rodapé do material -->
    <footer class="press-footer">
      <p>{{ $t('press.footer') }}</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
  .press-page {
    min-height: 100vh;
    background: var(--piano-bg-primary);
  }

  .press-hero {
    padding: 0 1.5rem 3rem;
    text-align: center;

    &__container {
      max-width: 720px;
      margin: 0 auto;
    }

    &__title {
      color: var(--piano-text-primary);
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    &__lede {
      color: var(--piano-text-secondary);
      margin-bottom: 1.5rem;
    }

    &__btn {
      background: var(--piano-accent);
      color: var(--piano-bg-primary);
      border: none;
      padding: 0.8rem 1.8rem;
      border-radius: var(--piano-radius);
      font-weight: 700;
      cursor: pointer;

      &:hover {
        filter: brightness(1.1);
      }
    }
  }

  .press-content {
    padding: 0 1.5rem 3rem;

    &__container {
      max-width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  }

  .press-block {
    border: 1px solid var(--piano-border);
    border-radius: var(--piano-radius);
    padding: 1.5rem;
    background: var(--piano-bg-secondary);

    h2 {
      color: var(--piano-text-primary);
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
    }

    p,
    li {
      color: var(--piano-text-secondary);
      line-height: 1.7;
    }

    ul {
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
  }

  .press-footer {
    padding: 2rem 1.5rem 4rem;
    text-align: center;
    color: var(--piano-text-secondary);
    font-size: 0.9rem;
  }

  // ── Impressão (R-13) ─────────────────────────
  @media print {
    :global(.header),
    :global(.footer),
    :global(.cookie-banner),
    .press-hero__btn,
    :global(.skip-link) {
      display: none !important;
    }

    .press-page,
    .press-block {
      background: #fff !important;
    }

    .press-block h2,
    .press-block p,
    .press-block li,
    .press-hero__title,
    .press-hero__lede,
    .press-footer {
      color: #111 !important;
      print-color-adjust: exact;
    }
  }
</style>
