<script setup lang="ts">
  const { t } = useI18n()
  const { raw } = useLocaleMessages()
  const localePath = useLocalePath()

  // Onda 3 routing: prefixa /xx conforme locale — em /es/docs os cards linkam
  // /es/docs/*, nunca a rota pt-BR (sem prefixo).

  // Module sections — maps to docs.sections.* i18n keys
  const moduleSections = [
    { id: 'media', icon: 'ti-music' },
    { id: 'hymnal', icon: 'ti-music-search' },
    { id: 'collections', icon: 'ti-playlist' },
    { id: 'liturgy', icon: 'ti-list-check' },
    { id: 'bible', icon: 'ti-book' },
    { id: 'projection', icon: 'ti-device-tv' },
    { id: 'streaming', icon: 'ti-broadcast' },
    { id: 'tools', icon: 'ti-tools' },
    { id: 'settings', icon: 'ti-adjustments' },
  ]

  // FAQ items — inline content keyed by docs.faq.*
  const faqItems = [
    { key: 'cost' },
    { key: 'offline' },
    { key: 'devices' },
    { key: 'data' },
    { key: 'privacy' },
    { key: 'support' },
    { key: 'updates' },
    { key: 'troubleshooting' },
    { key: 'contribute' },
  ]

  // Keyboard shortcuts from i18n (raw bypasses AST compilation)
  const shortcuts = computed(() => {
    const items = raw<Array<{ action: string; shortcut: string }>>('docs.content.shortcuts.items')
    return Array.isArray(items) ? items : []
  })

  // Getting started steps from i18n
  const gettingStartedSteps = computed(() => {
    const steps = raw<string[]>('docs.content.gettingStarted.steps')
    return Array.isArray(steps) ? steps : []
  })

  // Active section for sidebar highlight
  const activeSection = ref('gettingStarted')

  // F2.4 — cards de guias completos (14 páginas de conteúdo); textos em
  // docs.guides.cards.* (i18n) e rotas via localePath para respeitar /xx.
  const guideCards = computed(() => [
    {
      to: '/docs/getting-started',
      testid: 'getting-started',
      icon: 'ti-rocket',
      title: t('docs.guides.cards.gettingStarted.title'),
      desc: t('docs.guides.cards.gettingStarted.desc'),
    },
    {
      to: '/docs/install/windows',
      testid: 'windows',
      icon: 'ti-brand-windows',
      title: t('docs.guides.cards.windows.title'),
      desc: t('docs.guides.cards.windows.desc'),
    },
    {
      to: '/docs/install/macos',
      testid: 'macos',
      icon: 'ti-brand-apple',
      title: t('docs.guides.cards.macos.title'),
      desc: t('docs.guides.cards.macos.desc'),
    },
    {
      to: '/docs/install/linux',
      testid: 'linux',
      icon: 'ti-brand-linux',
      title: t('docs.guides.cards.linux.title'),
      desc: t('docs.guides.cards.linux.desc'),
    },
    {
      to: '/docs/install/android-apk',
      testid: 'android',
      icon: 'ti-brand-android',
      title: t('docs.guides.cards.android.title'),
      desc: t('docs.guides.cards.android.desc'),
    },
    {
      to: '/docs/install/web-pwa',
      testid: 'pwa',
      icon: 'ti-world',
      title: t('docs.guides.cards.pwa.title'),
      desc: t('docs.guides.cards.pwa.desc'),
    },
    {
      to: '/docs/install/tv-samsung-tizen',
      testid: 'tv-samsung',
      icon: 'ti-device-tv',
      title: t('docs.guides.cards.tvSamsung.title'),
      desc: t('docs.guides.cards.tvSamsung.desc'),
    },
    {
      to: '/docs/install/tv-lg-webos',
      testid: 'tv-lg',
      icon: 'ti-device-tv',
      title: t('docs.guides.cards.tvLg.title'),
      desc: t('docs.guides.cards.tvLg.desc'),
    },
    {
      to: '/docs/install/tv-android',
      testid: 'tv-android',
      icon: 'ti-device-tv',
      title: t('docs.guides.cards.tvAndroid.title'),
      desc: t('docs.guides.cards.tvAndroid.desc'),
    },
    {
      to: '/docs/palco-multi-device',
      testid: 'palco',
      icon: 'ti-devices',
      title: t('docs.guides.cards.palco.title'),
      desc: t('docs.guides.cards.palco.desc'),
    },
    {
      to: '/docs/faq',
      testid: 'faq',
      icon: 'ti-help-circle',
      title: t('docs.guides.cards.faq.title'),
      desc: t('docs.guides.cards.faq.desc'),
    },
    {
      to: '/docs/troubleshooting',
      testid: 'troubleshooting',
      icon: 'ti-bug',
      title: t('docs.guides.cards.troubleshooting.title'),
      desc: t('docs.guides.cards.troubleshooting.desc'),
    },
    {
      to: '/docs/shortcuts',
      testid: 'shortcuts',
      icon: 'ti-keyboard',
      title: t('docs.guides.cards.shortcuts.title'),
      desc: t('docs.guides.cards.shortcuts.desc'),
    },
    {
      to: '/docs/manual',
      testid: 'manual',
      icon: 'ti-book-2',
      title: t('docs.guides.cards.manual.title'),
      desc: t('docs.guides.cards.manual.desc'),
    },
  ])

  const allSectionIds = ['gettingStarted', ...moduleSections.map((m) => m.id), 'shortcuts', 'faq']

  const scrollToSection = (id: string) => {
    activeSection.value = id
    const el = document.getElementById(`doc-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Scroll spy: atualiza activeSection quando o usuário rola a página
  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Encontra a seção mais visível
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          const id = visible[0]!.target.id.replace('doc-', '')
          activeSection.value = id
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    allSectionIds.forEach((id) => {
      const el = document.getElementById(`doc-${id}`)
      if (el) observer.observe(el)
    })

    onBeforeUnmount(() => observer.disconnect())
  })

  // SEO
  useAppHead({
    title: t('docs.title'),
    description: t('docs.subtitle'),
    path: '/docs',
  })

  // JSON-LD FAQPage — serializa as 9 FAQs i18n docs.faq.* (agentic/SEO)
  const faqJsonLd = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => {
      const q = t(`docs.faq.${item.key}.question`)
      const a = t(`docs.faq.${item.key}.answer`)
      return {
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      }
    }),
  }))

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(faqJsonLd.value),
      },
    ],
  })
</script>

<template>
  <div class="docs-page">
    <!-- Hero -->
    <section class="docs-hero">
      <div class="docs-hero__container">
        <span class="docs-hero__eyebrow">{{ $t('nav.docs') }}</span>
        <h1 class="docs-hero__title">
          {{ $t('docs.title') }}
        </h1>
        <p class="docs-hero__subtitle">
          {{ $t('docs.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Main content with sidebar -->
    <div class="docs-layout">
      <!-- Sidebar navigation -->
      <aside class="docs-sidebar">
        <nav class="docs-sidebar__nav" :aria-label="$t('docs.sidebarLabel')">
          <button
            class="docs-sidebar__link"
            :class="{ 'docs-sidebar__link--active': activeSection === 'gettingStarted' }"
            data-testid="docs-nav-gettingStarted"
            @click="scrollToSection('gettingStarted')"
          >
            <i class="ti ti-rocket" />
            <span>{{ $t('docs.sections.gettingStarted.title') }}</span>
          </button>
          <button
            v-for="mod in moduleSections"
            :key="mod.id"
            class="docs-sidebar__link"
            :class="{ 'docs-sidebar__link--active': activeSection === mod.id }"
            :data-testid="`docs-nav-${mod.id}`"
            @click="scrollToSection(mod.id)"
          >
            <i :class="`ti ${mod.icon}`" />
            <span>{{ $t(`docs.sections.${mod.id}.title`) }}</span>
          </button>
          <button
            class="docs-sidebar__link"
            :class="{ 'docs-sidebar__link--active': activeSection === 'shortcuts' }"
            data-testid="docs-nav-shortcuts"
            @click="scrollToSection('shortcuts')"
          >
            <i class="ti ti-keyboard" />
            <span>{{ $t('docs.sections.shortcuts.title') }}</span>
          </button>
          <button
            class="docs-sidebar__link"
            :class="{ 'docs-sidebar__link--active': activeSection === 'faq' }"
            data-testid="docs-nav-faq"
            @click="scrollToSection('faq')"
          >
            <i class="ti ti-help-circle" />
            <span>{{ $t('docs.sections.faq.title') }}</span>
          </button>
        </nav>
      </aside>

      <!-- Content area -->
      <main class="docs-content">
        <!-- Doc pages cards (F2.4: guia completo por tema/plataforma) -->
        <section id="doc-guides" class="doc-section" data-testid="docs-section-guides">
          <h2 class="doc-section__title">
            <i class="ti ti-book" />
            {{ $t('docs.guides.title') || 'Guias completos' }}
          </h2>
          <p class="doc-section__lead">
            {{
              $t('docs.guides.lead') ||
              'Cada ferramenta do ecossistema explicada passo a passo, por plataforma.'
            }}
          </p>
          <div class="doc-guides">
            <NuxtLink
              v-for="guide in guideCards"
              :key="guide.to"
              class="doc-guide-card"
              :to="localePath(guide.to)"
              :data-testid="`docs-guide-${guide.testid}`"
            >
              <i :class="['ti', guide.icon]" />
              <span class="doc-guide-card__title">{{ guide.title }}</span>
              <span class="doc-guide-card__desc">{{ guide.desc }}</span>
            </NuxtLink>
          </div>
        </section>

        <!-- Getting Started -->
        <section
          id="doc-gettingStarted"
          class="doc-section"
          data-testid="docs-section-gettingStarted"
        >
          <h2 class="doc-section__title">
            <i class="ti ti-rocket" />
            {{ $t('docs.sections.gettingStarted.title') }}
          </h2>
          <p class="doc-section__lead">
            {{ $t('docs.content.gettingStarted.intro') }}
          </p>
          <ol class="doc-steps">
            <li
              v-for="(step, idx) in gettingStartedSteps"
              :key="idx"
              class="doc-steps__item"
              :data-testid="`docs-step-${idx + 1}`"
            >
              <span class="doc-steps__number">{{ idx + 1 }}</span>
              <span class="doc-steps__text">{{ step }}</span>
            </li>
          </ol>
          <div class="doc-tip" data-testid="docs-tip">
            <i class="ti ti-bulb" />
            <p>{{ $t('docs.content.gettingStarted.tip') }}</p>
          </div>
        </section>

        <!-- Module sections -->
        <section
          v-for="mod in moduleSections"
          :id="`doc-${mod.id}`"
          :key="mod.id"
          class="doc-section"
          :data-testid="`docs-section-${mod.id}`"
        >
          <h2 class="doc-section__title">
            <i :class="`ti ${mod.icon}`" />
            {{ $t(`docs.sections.${mod.id}.title`) }}
          </h2>
          <p class="doc-section__lead">
            {{ $t(`docs.sections.${mod.id}.description`) }}
          </p>
          <div class="doc-features">
            <div
              v-for="n in 3"
              :key="n"
              class="doc-feature-card"
              :data-testid="`docs-feature-${mod.id}-${n}`"
            >
              <i class="ti ti-check" />
              <span>{{ $t(`docs.content.modules.${mod.id}.${n - 1}`) }}</span>
            </div>
          </div>
        </section>

        <!-- Keyboard Shortcuts -->
        <section id="doc-shortcuts" class="doc-section" data-testid="docs-section-shortcuts">
          <h2 class="doc-section__title">
            <i class="ti ti-keyboard" />
            {{ $t('docs.sections.shortcuts.title') }}
          </h2>
          <p class="doc-section__lead">
            {{ $t('docs.sections.shortcuts.description') }}
          </p>
          <div class="doc-table-wrapper">
            <table class="doc-table" data-testid="docs-shortcuts-table">
              <thead>
                <tr>
                  <th>{{ $t('docs.content.shortcuts.table.action') }}</th>
                  <th>{{ $t('docs.content.shortcuts.table.shortcut') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in shortcuts"
                  :key="idx"
                  :data-testid="`docs-shortcut-${idx}`"
                >
                  <td>{{ item.action }}</td>
                  <td>
                    <kbd class="doc-kbd">{{ item.shortcut }}</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- FAQ -->
        <section id="doc-faq" class="doc-section" data-testid="docs-section-faq">
          <h2 class="doc-section__title">
            <i class="ti ti-help-circle" />
            {{ $t('docs.sections.faq.title') }}
          </h2>
          <div class="doc-faq">
            <details
              v-for="item in faqItems"
              :key="item.key"
              class="doc-faq__item"
              :data-testid="`docs-faq-${item.key}`"
            >
              <summary class="doc-faq__question">
                {{ $t(`docs.faq.${item.key}.question`) }}
                <i class="ti ti-chevron-down" />
              </summary>
              <div class="doc-faq__answer">
                {{ $t(`docs.faq.${item.key}.answer`) }}
              </div>
            </details>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .docs-page {
    min-height: 100vh;
  }

  // F2.4 — cards de guias
  .doc-guides {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .doc-guide-card {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1.1rem 1.25rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-decoration: none;
    transition:
      border-color 0.2s,
      background 0.2s;

    &:hover {
      border-color: var(--piano-accent-text);
      background: rgba(255, 255, 255, 0.07);
    }

    .ti {
      font-size: 1.4rem;
      color: var(--piano-accent-text);
    }

    &__title {
      color: var(--piano-text-primary);
      font-weight: 600;
      font-size: 1rem;
    }

    &__desc {
      color: rgba(255, 255, 255, 0.65);
      font-size: 0.85rem;
      line-height: 1.4;
    }
  }

  // ── Hero ──────────────────────────────────────
  .docs-hero {
    background: var(--piano-bg-primary);
    padding: 0 1.5rem 4rem;
    text-align: center;

    &__container {
      max-width: 720px;
      margin: 0 auto;
    }

    &__eyebrow {
      display: inline-block;
      color: var(--piano-accent-text);
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
    }

    &__title {
      font-size: 3rem;
      font-weight: 800;
      color: var(--piano-text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    &__subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
    }
  }

  // ── Layout: sidebar + content ─────────────────
  .docs-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1.5rem 6rem;
  }

  // ── Sidebar ───────────────────────────────────
  .docs-sidebar {
    position: sticky;
    top: 100px;
    align-self: start;
    max-height: calc(100vh - 120px);
    overflow-y: auto;

    &__nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem 0;
      border-left: 2px solid var(--piano-border);
    }

    &__link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 1rem;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--piano-text-secondary);
      text-align: left;
      transition: all 0.2s;
      border-radius: 0 var(--piano-radius-sm) var(--piano-radius-sm) 0;

      i {
        font-size: 1.1rem;
        width: 20px;
        text-align: center;
        flex-shrink: 0;
      }

      &:hover {
        background: var(--piano-accent-soft);
        color: var(--piano-accent-text);
      }

      &--active {
        background: var(--piano-accent-soft);
        color: var(--piano-accent-text);
        font-weight: 700;
        border-left: 3px solid var(--piano-accent);
        margin-left: -2px;
      }
    }
  }

  // ── Content sections ──────────────────────────
  .docs-content {
    min-width: 0;
  }

  .doc-section {
    margin-bottom: 3.5rem;
    scroll-margin-top: 100px;

    &__title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--piano-text-primary);
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--piano-border-subtle);

      i {
        color: var(--piano-accent);
        font-size: 1.4rem;
      }
    }

    &__lead {
      font-size: 1.05rem;
      color: var(--piano-text-secondary);
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
  }

  // ── Getting Started steps ─────────────────────
  .doc-steps {
    list-style: none;
    counter-reset: steps;
    margin-bottom: 1.5rem;

    &__item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: var(--piano-bg-secondary);
      border: 1px solid var(--piano-border-subtle);
      border-radius: var(--piano-radius-md);
    }

    &__number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--piano-radius-full);
      background: var(--piano-bg-accent);
      color: var(--piano-on-accent);
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    &__text {
      font-size: 1rem;
      color: var(--piano-text-primary);
      line-height: 1.6;
      padding-top: 0.3rem;
    }
  }

  // ── Tip box ───────────────────────────────────
  .doc-tip {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: var(--piano-accent-soft);
    border-left: 4px solid var(--piano-accent);
    border-radius: var(--piano-radius-md);

    i {
      color: var(--piano-accent);
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    p {
      color: var(--piano-text-secondary);
      line-height: 1.6;
      padding-top: 0.15rem;
    }
  }

  // ── Feature mini-cards ────────────────────────
  .doc-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .doc-feature-card {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 1rem 1.25rem;
    background: var(--piano-bg-solid);
    border: 1px solid var(--piano-border);
    border-radius: var(--piano-radius-md);
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--piano-accent);
    }

    i {
      color: var(--piano-accent-text);
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    span {
      font-size: 0.95rem;
      color: var(--piano-text-secondary);
      font-weight: 500;
    }
  }

  // ── Shortcuts table ───────────────────────────
  .doc-table-wrapper {
    overflow-x: auto;
    border-radius: var(--piano-radius-md);
    border: 1px solid var(--piano-border);
  }

  .doc-table {
    width: 100%;
    border-collapse: collapse;

    th {
      padding: 0.85rem 1.25rem;
      text-align: left;
      background: var(--piano-bg-secondary);
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--piano-text-secondary);
    }

    td {
      padding: 0.85rem 1.25rem;
      border-top: 1px solid var(--piano-border-subtle);
      font-size: 0.95rem;
      color: var(--piano-text-primary);
    }

    tbody tr:hover {
      background: var(--piano-accent-soft);
    }
  }

  .doc-kbd {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    background: var(--piano-bg-secondary);
    border: 1px solid var(--piano-border);
    color: var(--piano-accent-text);
    border-radius: var(--piano-radius-sm);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.85rem;
    font-weight: 600;
  }

  // ── FAQ ───────────────────────────────────────
  .doc-faq {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__item {
      background: var(--piano-bg-solid);
      border: 1px solid var(--piano-border);
      border-radius: var(--piano-radius-md);
      overflow: hidden;

      &[open] {
        border-color: var(--piano-accent);
      }
    }

    &__question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      cursor: pointer;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--piano-text-primary);
      list-style: none;

      &::-webkit-details-marker {
        display: none;
      }

      i {
        color: var(--piano-accent);
        transition: transform 0.2s;
        flex-shrink: 0;
      }

      .doc-faq__item[open] & {
        i {
          transform: rotate(180deg);
        }
      }
    }

    &__answer {
      padding: 0 1.25rem 1.25rem;
      color: var(--piano-text-secondary);
      line-height: 1.7;
      font-size: 0.95rem;
    }
  }

  // ── Responsive ────────────────────────────────
  @media (max-width: 960px) {
    .docs-layout {
      grid-template-columns: 1fr;
      gap: 0;
      padding-top: 2rem;
    }

    .docs-sidebar {
      position: static;
      max-height: none;
      margin-bottom: 1.5rem;

      &__nav {
        flex-direction: row;
        flex-wrap: wrap;
        border-left: none;
        border-bottom: 2px solid var(--piano-border);
        padding: 0 0 1rem;
      }

      &__link {
        border-radius: var(--piano-radius-full);
        padding: 0.5rem 1rem;
        font-size: 0.85rem;

        &--active {
          border-left: none;
          margin-left: 0;
          background: var(--piano-bg-accent);
          color: var(--piano-on-accent);
        }
      }
    }

    .doc-features {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .docs-hero {
      padding: 3.5rem 1.25rem 3rem;

      &__title {
        font-size: 2.2rem;
      }

      &__subtitle {
        font-size: 1.05rem;
      }
    }
  }
</style>
