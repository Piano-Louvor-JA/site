<script setup lang="ts">
  const { t } = useI18n()
  const { raw, has } = useLocaleMessages()

  // SEO
  useHead({
    title: () => `${t('privacy.title')} — PIANO LouvorJA`,
    meta: [
      { name: 'description', content: () => t('privacy.metaDescription') },
      { name: 'robots', content: 'index, follow' },
    ],
  })

  // Sections keyed by privacy.sections.*
  const sections = [
    { id: 'data', icon: 'ti-database' },
    { id: 'purpose', icon: 'ti-target' },
    { id: 'sharing', icon: 'ti-share' },
    { id: 'international', icon: 'ti-world' },
    { id: 'rights', icon: 'ti-shield-lock' },
    { id: 'security', icon: 'ti-lock' },
    { id: 'retention', icon: 'ti-clock' },
    { id: 'cookies', icon: 'ti-cookie' },
    { id: 'children', icon: 'ti-child' },
    { id: 'changes', icon: 'ti-edit' },
    { id: 'dpo', icon: 'ti-mail' },
    { id: 'anpd', icon: 'ti-building' },
  ]
</script>

<template>
  <div class="legal-page">
    <div class="legal-page__container">
      <header class="legal-page__header">
        <h1 class="legal-page__title">
          {{ $t('privacy.title') }}
        </h1>
        <p class="legal-page__updated">
          {{ $t('privacy.lastUpdated') }}
        </p>
      </header>

      <div class="legal-page__intro">
        <p>{{ $t('privacy.intro') }}</p>
      </div>

      <nav class="legal-page__toc" :aria-label="$t('privacy.tocLabel')">
        <ul>
          <li v-for="section in sections" :key="section.id">
            <a :href="`#${section.id}`">
              <i :class="`ti ${section.icon}`" />
              {{ $t(`privacy.sections.${section.id}.title`) }}
            </a>
          </li>
        </ul>
      </nav>

      <article class="legal-page__content">
        <section
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="legal-page__section"
        >
          <h2 class="legal-page__section-title">
            {{ $t(`privacy.sections.${section.id}.title`) }}
          </h2>
          <div class="legal-page__section-body">
            <table
              v-if="(raw<unknown[]>(`privacy.sections.${section.id}.table.rows`) ?? []).length"
              class="legal-page__cookie-table"
            >
              <thead>
                <tr>
                  <th>{{ $t(`privacy.sections.${section.id}.table.header.cookie`) }}</th>
                  <th>{{ $t(`privacy.sections.${section.id}.table.header.type`) }}</th>
                  <th>{{ $t(`privacy.sections.${section.id}.table.header.purpose`) }}</th>
                  <th>{{ $t(`privacy.sections.${section.id}.table.header.duration`) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in raw<
                    { name: string; type: string; purpose: string; duration: string }[]
                  >(`privacy.sections.${section.id}.table.rows`)"
                  :key="i"
                >
                  <td>{{ row.name }}</td>
                  <td>{{ row.type }}</td>
                  <td>{{ row.purpose }}</td>
                  <td>{{ row.duration }}</td>
                </tr>
              </tbody>
            </table>
            <LegalBodyItem
              v-for="(line, i) in raw<string[]>(`privacy.sections.${section.id}.body`)"
              :key="i"
              :message="line"
              :link-url="
                has(`privacy.sections.${section.id}.link`)
                  ? $t(`privacy.sections.${section.id}.link.url`)
                  : undefined
              "
              :link-text="
                has(`privacy.sections.${section.id}.link`)
                  ? $t(`privacy.sections.${section.id}.link.text`)
                  : undefined
              "
              :external="
                has(`privacy.sections.${section.id}.link`)
                  ? ($t(`privacy.sections.${section.id}.link.url`) as string).startsWith('http')
                  : false
              "
            />
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .legal-page {
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
      margin-bottom: 3rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--piano-text-primary);
      margin: 0 0 0.5rem;
    }

    &__updated {
      font-size: 0.9rem;
      color: var(--piano-text-muted);
      margin: 0;
    }

    &__intro {
      background: var(--piano-accent-soft);
      border-radius: var(--piano-radius-md);
      padding: 1.5rem;
      margin-bottom: 3rem;
      border-left: 4px solid var(--piano-accent);
    }

    &__toc {
      background: var(--piano-bg-secondary);
      border-radius: var(--piano-radius-md);
      padding: 1.5rem;
      margin-bottom: 3rem;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.5rem;
      }

      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--piano-text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        padding: 0.5rem;
        border-radius: var(--piano-radius-sm);
        transition: all 0.2s;

        &:hover {
          background: var(--piano-accent-soft);
          color: var(--piano-accent);
        }

        i {
          font-size: 1rem;
          color: var(--piano-accent);
        }
      }
    }

    &__section {
      margin-bottom: 3rem;

      &:target {
        scroll-margin-top: 2rem;
      }
    }

    &__section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--piano-text-primary);
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--piano-border-subtle);
    }

    &__section-body {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--piano-text-secondary);

      p {
        margin: 0 0 0.75rem;
      }

      .legal-page__subsection {
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--piano-text-primary);
        margin-top: 1.5rem;
      }

      .legal-page__cookie-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 0 1.5rem;
        font-size: 0.85rem;

        th,
        td {
          padding: 0.6rem 0.75rem;
          text-align: left;
          border: 1px solid var(--piano-border);
        }

        th {
          background: var(--piano-accent-soft);
          color: var(--piano-text-primary);
          font-weight: 600;
        }

        td {
          color: var(--piano-text-secondary);
        }

        @media (max-width: 600px) {
          font-size: 0.75rem;

          th,
          td {
            padding: 0.4rem 0.5rem;
          }
        }
      }

      a {
        color: var(--piano-accent);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 600px) {
      padding: 0 1rem 2rem;

      &__title {
        font-size: 1.75rem;
      }

      &__toc ul {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
