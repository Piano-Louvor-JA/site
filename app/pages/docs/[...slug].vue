<script setup lang="ts">
  import type { Collections, PageCollectionItemBase } from '@nuxt/content'
  // auto-import do módulo, exposto via virtual #imports (eslint-safe)
  import { queryCollection } from '#imports'

  const route = useRoute()
  const { locale, t } = useI18n()

  // Slug pt-BR canônico — en/es caem no conteúdo pt-BR (fallback) até serem traduzidos
  const localeDir = computed(() => (locale.value === 'pt-BR' ? 'pt-BR' : 'pt-BR'))
  const slugPath = computed(() => String(route.params.slug ?? ''))
  const collectionName = computed<keyof Collections>(
    () => `docs_${localeDir.value.replace('-', '')}` as keyof Collections,
  )

  const { data: page, error } = await useAsyncData(
    `docs-${slugPath.value}-${locale.value}`,
    () =>
      queryCollection(collectionName.value)
        .path(`/docs/${localeDir.value}/${slugPath.value}`)
        .first() as unknown as Promise<PageCollectionItemBase | null>,
  )

  if (error.value || !page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Doc not found', fatal: true })
  }

  // TOC + navegação lateral (todas as páginas pt-BR, ordem nav_order)
  const { data: nav } = await useAsyncData(
    `docs-nav-${locale.value}`,
    () =>
      queryCollection(collectionName.value).order('nav_order', 'ASC').all() as unknown as Promise<
        Array<{ title: string; stem: string; nav_order: number; platform?: string }>
      >,
  )

  const docSlug = computed(() => slugPath.value.replace(/^docs\//, ''))

  // SEO: frontmatter → head + JSON-LD (TechArticle + BreadcrumbList)
  useAppHead({
    title: page.value.title,
    description: page.value.description,
    path: `/docs/${docSlug.value}`,
  })

  const SITE_URL = 'https://pianolouvorja.com.br'
  const REPO_BLOB = 'https://github.com/Piano-Louvor-JA/site/blob/staging/content/docs/pt-BR'

  const breadcrumbJsonLd = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Documentação', item: `${SITE_URL}/docs` },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.value!.title,
        item: `${SITE_URL}/docs/${docSlug.value}`,
      },
    ],
  }))

  const articleJsonLd = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.value!.title,
    description: page.value!.description,
    inLanguage: locale.value,
    dateModified: page.value!.reviewed_at,
    author: { '@type': 'Organization', name: 'PIANO LouvorJA', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'PIANO LouvorJA', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/docs/${docSlug.value}`,
  }))

  useHead({
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd.value) },
      { type: 'application/ld+json', innerHTML: JSON.stringify(articleJsonLd.value) },
    ],
  })

  const editUrl = computed(() => `${REPO_BLOB}/${docSlug.value}.md`)

  const isFallback = computed(() => locale.value !== 'pt-BR')

  // Ícones por plataforma (Tabler, já usado no site)
  const platformIcons: Record<string, string> = {
    windows: 'ti-brand-windows',
    macos: 'ti-brand-apple',
    linux: 'ti-brand-linux',
    android: 'ti-brand-android',
    tizen: 'ti-device-tv',
    webos: 'ti-device-tv',
    androidtv: 'ti-device-tv',
    pwa: 'ti-world',
    web: 'ti-world',
  }

  // Sanity do conteúdo: título/descrição no head já cobertos; escopo QA B4
  const hasToc = computed(() => Boolean(page.value?.toc))
</script>

<template>
  <div class="doc-page">
    <section class="doc-hero">
      <div class="doc-hero__container">
        <nav class="doc-breadcrumb" :aria-label="t('docs.breadcrumb') || 'Você está em'">
          <NuxtLink to="/docs">{{ t('nav.docs') }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <span>{{ page?.title }}</span>
        </nav>
        <h1 class="doc-hero__title">
          {{ page?.title }}
        </h1>
        <p class="doc-hero__description">
          {{ page?.description }}
        </p>
        <div v-if="isFallback" class="doc-fallback-note" role="status">
          {{
            t('docs.fallbackNotice') ||
            'Esta página ainda não foi traduzida — exibindo em português.'
          }}
        </div>
      </div>
    </section>

    <div class="doc-layout">
      <aside v-if="nav && nav.length" class="doc-sidebar">
        <nav
          class="doc-sidebar__nav"
          :aria-label="t('docs.sidebarLabel') || 'Índice da documentação'"
        >
          <NuxtLink
            v-for="item in nav"
            :key="item.stem"
            class="doc-sidebar__link"
            :class="{
              'doc-sidebar__link--active': item.stem.endsWith(slugPath.replace(/^docs\//, '')),
            }"
            :to="`/docs/${item.stem.replace(/^.*docs\/pt-BR\/?/, '')}`"
          >
            <i :class="['ti', platformIcons[item.platform ?? 'web'] ?? 'ti-file-text']" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </nav>
      </aside>

      <article class="doc-content">
        <div v-if="hasToc && page?.body?.toc?.links?.length" class="doc-toc" :aria-label="'Índice'">
          <h2>Índice</h2>
          <ul>
            <li v-for="link in page.body.toc.links" :key="link.id">
              <a :href="`#${link.id}`">{{ link.text }}</a>
            </li>
          </ul>
        </div>
        <ContentRenderer :value="page">
          <template #empty>
            <p>{{ t('docs.empty') || 'Conteúdo não encontrado.' }}</p>
          </template>
        </ContentRenderer>

        <footer class="doc-footer">
          <a :href="editUrl" class="doc-footer__edit" target="_blank" rel="noopener">
            <i class="ti ti-pencil" />
            {{ t('docs.editOnGithub') || 'Editar esta página no GitHub' }}
          </a>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .doc-page {
    min-height: 100vh;
  }

  .doc-hero {
    background: var(--piano-bg-primary);
    padding: 4rem 1.5rem 3rem;

    &__container {
      max-width: 780px;
      margin: 0 auto;
    }
  }

  .doc-breadcrumb {
    display: flex;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--piano-accent-text);
    margin-bottom: 1rem;

    a {
      color: var(--piano-accent-text);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .doc-hero__title {
    font-size: 2.6rem;
    font-weight: 800;
    color: var(--piano-text-primary);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .doc-hero__description {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
  }

  .doc-fallback-note {
    margin-top: 1rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    background: rgba(255, 200, 0, 0.12);
    border: 1px solid rgba(255, 200, 0, 0.35);
    color: #ffd75e;
    font-size: 0.9rem;
    display: inline-block;
  }

  .doc-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 3rem;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  .doc-sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    position: sticky;
    top: 2rem;
  }

  .doc-sidebar__link {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 0.92rem;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }

    &--active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-weight: 600;
    }
  }

  .doc-toc {
    margin-bottom: 2rem;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.5rem;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      list-style: none;
    }

    a {
      color: var(--piano-accent-text);
      text-decoration: none;
      font-size: 0.92rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .doc-content {
    min-width: 0;

    :deep(h1) {
      display: none;
    }

    :deep(h2) {
      font-size: 1.6rem;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      color: var(--piano-text-primary);
    }

    :deep(p),
    :deep(li) {
      line-height: 1.75;
      color: rgba(255, 255, 255, 0.88);
    }

    :deep(ol),
    :deep(ul) {
      padding-left: 1.5rem;
      margin-bottom: 1rem;

      li {
        margin-bottom: 0.4rem;
      }
    }

    :deep(a) {
      color: var(--piano-accent-text);
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;

      th,
      td {
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 0.6rem 0.9rem;
        text-align: left;
        font-size: 0.95rem;
      }

      th {
        background: rgba(255, 255, 255, 0.06);
      }
    }

    :deep(code) {
      background: rgba(255, 255, 255, 0.08);
      padding: 0.15rem 0.4rem;
      border-radius: 5px;
      font-size: 0.9em;
    }

    :deep(blockquote) {
      border-left: 3px solid var(--piano-accent-text);
      padding-left: 1rem;
      color: rgba(255, 255, 255, 0.75);
    }
  }

  .doc-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    gap: 1rem;
  }

  .doc-footer__edit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.88rem;
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
</style>
