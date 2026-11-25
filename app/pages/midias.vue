<script setup lang="ts">
  /**
   * SPEC piano-site-drive-midias v1.0.0: página /midias — download das
   * mídias do LouvorJA (coletâneas/áudios) hospedadas no Google Drive,
   * independente da API. Link configurável via runtimeConfig
   * (NUXT_PUBLIC_DRIVE_MEDIA_URL); vazio = seção mostra indisponível.
   */
  const { t } = useI18n()

  const config = useRuntimeConfig()
  const driveUrl = String(config.public.driveMediaUrl ?? '')

  useHead({
    title: () => `${t('midias.title')} — PIANO LouvorJA`,
    meta: [
      { name: 'description', content: () => t('midias.metaDescription') },
      { name: 'robots', content: 'index, follow' },
    ],
  })
</script>

<template>
  <div class="midias-page">
    <div class="midias-page__container">
      <header class="midias-page__header">
        <h1 class="midias-page__title">
          {{ $t('midias.title') }}
        </h1>
        <p class="midias-page__subtitle">
          {{ $t('midias.subtitle') }}
        </p>
      </header>

      <section class="midias-page__body">
        <p>{{ $t('midias.description') }}</p>
        <ul class="midias-page__notes">
          <li>{{ $t('midias.noteOffline') }}</li>
          <li>{{ $t('midias.noteBackup') }}</li>
        </ul>

        <a
          v-if="driveUrl"
          :href="driveUrl"
          class="midias-page__download"
          data-testid="midias-download"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="ti ti-cloud-download" aria-hidden="true" />
          {{ $t('midias.downloadButton') }}
        </a>
        <!--
          SPEC pianolouvorja-locale-convite v1.1: catálogo vazio para o locale
          ativo → convite à comunidade (midias.convite_catalogo), não erro.
        -->
        <p v-else class="midias-page__unavailable" data-testid="midias-convite" role="status">
          {{ $t('midias.convite_catalogo') }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .midias-page {
    background: var(--piano-bg-primary);
    color: var(--piano-text-primary);
    min-height: 100vh;
    padding: 0 1.5rem 4rem;

    &__container {
      max-width: 800px;
      margin: 0 auto;
    }

    &__header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--piano-text-primary);
      margin: 0 0 0.5rem;
    }

    &__subtitle {
      font-size: 1rem;
      color: var(--piano-text-muted);
      margin: 0;
    }

    &__body {
      background: var(--piano-bg-secondary);
      border-radius: var(--piano-radius-md);
      padding: 2rem;
      border-left: 4px solid var(--piano-accent);

      p {
        color: var(--piano-text-secondary);
        line-height: 1.6;
      }
    }

    &__notes {
      padding-left: 1.25rem;
      color: var(--piano-text-muted);

      li {
        margin-bottom: 0.35rem;
      }
    }

    &__download {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding: 0.85rem 1.75rem;
      background: var(--piano-accent);
      color: var(--piano-bg-primary);
      font-weight: 600;
      border-radius: var(--piano-radius-md);
      text-decoration: none;

      &:hover {
        filter: brightness(1.1);
      }
    }

    &__unavailable {
      margin-top: 1.5rem;
      color: var(--piano-text-muted);
      font-style: italic;
    }

    @media (max-width: 600px) {
      padding: 0 1rem 2rem;

      &__title {
        font-size: 1.75rem;
      }
    }
  }
</style>
