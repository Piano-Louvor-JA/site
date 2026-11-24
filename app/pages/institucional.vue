<script setup lang="ts">
  const { t } = useI18n()
  const localePath = useLocalePath()

  // SEO
  useAppHead({
    title: t('institucional.meta.title'),
    description: t('institucional.meta.description'),
    path: '/institucional',
  })

  const sections = [
    { key: 's1', icon: 'ti-piano' },
    { key: 's2', icon: 'ti-device-desktop' },
    { key: 's3', icon: 'ti-share' },
    { key: 's4', icon: 'ti-mail' },
  ] as const
</script>

<template>
  <div class="inst-page" data-testid="institucional-page">
    <!-- Hero -->
    <section class="inst-hero">
      <div class="inst-hero__container">
        <h1 class="inst-hero__title">
          {{ $t('institucional.title') }}
        </h1>
        <p class="inst-hero__lede">
          {{ $t('institucional.lede') }}
        </p>
      </div>
    </section>

    <!-- S1–S4 -->
    <section class="inst-content">
      <div class="inst-content__container">
        <article
          v-for="s in sections"
          :key="s.key"
          class="inst-card"
          :data-testid="`institucional-${s.key}`"
        >
          <i :class="`ti ${s.icon}`" class="inst-card__icon" aria-hidden="true" />
          <h2 class="inst-card__title">
            {{ $t(`institucional.${s.key}.title`) }}
          </h2>
          <p class="inst-card__body">
            {{ $t(`institucional.${s.key}.body`) }}
          </p>
          <a v-if="s.key === 's2'" :href="localePath('/download')" class="inst-card__link">{{
            $t('nav.download')
          }}</a>
          <a v-if="s.key === 's3'" :href="localePath('/institucional/press')" class="inst-card__link">{{
            $t('institucional.cta.press')
          }}</a>
          <a v-if="s.key === 's4'" :href="localePath('/contact')" class="inst-card__link">{{
            $t('nav.contact')
          }}</a>
        </article>
      </div>
    </section>

    <!-- CTA press -->
    <section class="inst-cta">
      <div class="inst-cta__container">
        <a :href="localePath('/institucional/press')" class="inst-cta__btn" data-testid="institucional-press-cta">
          {{ $t('institucional.cta.press') }}
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
  .inst-page {
    min-height: 100vh;
  }

  // ── Hero ─────────────────────────────────────
  .inst-hero {
    background: var(--piano-bg-primary);
    padding: 0 1.5rem 4rem;
    text-align: center;

    &__container {
      max-width: 760px;
      margin: 0 auto;
    }

    &__title {
      color: var(--piano-text-primary);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      margin-bottom: 1rem;
    }

    &__lede {
      color: var(--piano-text-secondary);
      font-size: 1.125rem;
      line-height: 1.7;
      max-width: 640px;
      margin: 0 auto;
    }
  }

  // ── Cards S1–S4 ──────────────────────────────
  .inst-content {
    background: var(--piano-bg-secondary);
    padding: 4rem 1.5rem;

    &__container {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }
  }

  .inst-card {
    background: var(--piano-bg-primary);
    border: 1px solid var(--piano-border);
    border-radius: var(--piano-radius);
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__icon {
      font-size: 2rem;
      color: var(--piano-accent);
    }

    &__title {
      color: var(--piano-text-primary);
      font-size: 1.25rem;
      font-weight: 600;
    }

    &__body {
      color: var(--piano-text-secondary);
      line-height: 1.7;
      flex: 1;
    }

    &__link {
      color: var(--piano-accent);
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  // ── CTA ──────────────────────────────────────
  .inst-cta {
    background: var(--piano-bg-primary);
    padding: 3rem 1.5rem 5rem;
    text-align: center;

    &__container {
      max-width: 760px;
      margin: 0 auto;
    }

    &__btn {
      display: inline-block;
      background: var(--piano-accent);
      color: var(--piano-bg-primary);
      padding: 0.9rem 2rem;
      border-radius: var(--piano-radius);
      font-weight: 700;
      text-decoration: none;

      &:hover {
        filter: brightness(1.1);
      }
    }
  }
</style>
