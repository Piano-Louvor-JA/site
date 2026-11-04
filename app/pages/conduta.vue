<script setup lang="ts">
  const { t } = useI18n()

  // SEO
  useHead({
    title: () => `${t('conduct.title')} — PIANO LouvorJA`,
    meta: [
      { name: 'description', content: () => t('conduct.metaDescription') },
      { name: 'robots', content: 'index, follow' },
    ],
  })

  // Sections keyed by conduct.sections.*
  const sections = [
    { id: 'celebrate', icon: 'ti-heart' },
    { id: 'notAllowed', icon: 'ti-alert-triangle' },
    { id: 'moderation', icon: 'ti-flag' },
    { id: 'gameMasters', icon: 'ti-users' },
    { id: 'transparency', icon: 'ti-eye' },
    { id: 'invitation', icon: 'ti-music' },
  ]
</script>

<template>
  <div class="legal-page">
    <div class="legal-page__container">
      <header class="legal-page__header">
        <h1 class="legal-page__title">
          {{ $t('conduct.title') }}
        </h1>
        <p class="legal-page__updated">
          {{ $t('conduct.lastUpdated') }}
        </p>
      </header>

      <div class="legal-page__intro">
        <p>{{ $t('conduct.intro') }}</p>
        <blockquote class="legal-page__quote">
          {{ $t('conduct.purposeQuote') }}
        </blockquote>
      </div>

      <nav class="legal-page__toc" :aria-label="$t('conduct.tocLabel')">
        <ul>
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`">
              {{ $t(`conduct.sections.${section.id}.title`) }}
            </a>
          </li>
        </ul>
      </nav>

      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="legal-page__section"
      >
        <h2>
          <i :class="`ti ${section.icon}`" aria-hidden="true" />
          {{ $t(`conduct.sections.${section.id}.title`) }}
        </h2>
        <p
          v-for="(paragraph, index) in $tm(`conduct.sections.${section.id}.body`) as string[]"
          :key="index"
        >
          {{ paragraph }}
        </p>
        <blockquote v-if="section.id === 'invitation'" class="legal-page__quote">
          {{ $t('conduct.sections.invitation.quote') }}
        </blockquote>
      </section>
    </div>
  </div>
</template>
