<script setup lang="ts">
  import { ref } from 'vue'
  import { siteConfig } from '~/data/site'
  import { usePlatformsCarousel } from '~/composables/usePlatformsCarousel'

  const pinRoot = ref<HTMLElement | null>(null)
  const trackViewport = ref<HTMLElement | null>(null)
  const track = ref<HTMLElement | null>(null)
  // GSAP client-only: pin + scrub + snap (composable registra o cleanup)
  usePlatformsCarousel(pinRoot, trackViewport, track)

  interface CarouselPlatform {
    id: string
    icon: string
    badgeKey: string
    titleKey: string
    taglineKey: string
    descKey: string
    shot: string
    shotAlt: string
    frame: 'desktop' | 'mobile' | 'tv'
    ctaHref: string
    ctaLabelKey: string
    external: boolean
    credit?: { labelKey: string; href: string }
  }

  // 5 segmentos — Mobile agrega APK + iOS (mesma tela, um card).
  // Prints reais capturados (docs/assets-carrossel/README.md).
  const platforms: CarouselPlatform[] = [
    {
      id: 'desktop',
      icon: 'ti-device-desktop',
      badgeKey: 'platforms.desktop.badge',
      titleKey: 'platforms.desktop.title',
      taglineKey: 'platforms.desktop.subtitle',
      descKey: 'platforms.desktop.description',
      shot: '/img/carrossel/desktop.webp',
      shotAlt: 'App desktop PIANO LouvorJA — tela de identificação',
      frame: 'desktop',
      ctaHref: '/download',
      ctaLabelKey: 'platforms.desktop.cta',
      external: false,
    },
    {
      id: 'web',
      icon: 'ti-world',
      badgeKey: 'platforms.web.badge',
      titleKey: 'platforms.web.title',
      taglineKey: 'platforms.web.subtitle',
      descKey: 'platforms.web.description',
      shot: '/img/carrossel/web.webp',
      shotAlt: 'App Web PIANO LouvorJA — Central de Mídia com hinários',
      frame: 'desktop',
      ctaHref: siteConfig.appUrl,
      ctaLabelKey: 'platforms.web.cta',
      external: true,
    },
    {
      id: 'mobile',
      icon: 'ti-device-mobile',
      badgeKey: 'platforms.mobile.badge',
      titleKey: 'platforms.mobile.title',
      taglineKey: 'platforms.mobile.subtitle',
      descKey: 'platforms.mobile.description',
      shot: '/img/carrossel/mobile.webp',
      shotAlt: 'App mobile PIANO LouvorJA (Android e iOS)',
      frame: 'mobile',
      ctaHref: '/download',
      ctaLabelKey: 'platforms.mobile.cta',
      external: false,
    },
    {
      id: 'tv',
      icon: 'ti-device-tv',
      badgeKey: 'platforms.tv.badge',
      titleKey: 'platforms.tv.title',
      taglineKey: 'platforms.tv.subtitle',
      descKey: 'platforms.tv.description',
      shot: '/img/carrossel/palco-tv.webp',
      shotAlt: 'Palco PIANO projetando na TV (webOS)',
      frame: 'tv',
      ctaHref: '/download#tv',
      ctaLabelKey: 'platforms.tv.cta',
      external: false,
    },
    {
      id: 'voidbr',
      icon: 'ti-disc',
      badgeKey: 'platforms.voidbr.badge',
      titleKey: 'platforms.voidbr.title',
      taglineKey: 'platforms.voidbr.subtitle',
      descKey: 'platforms.voidbr.description',
      shot: '/img/carrossel/voidbr.webp',
      shotAlt: 'VoidBR LouvorJA Piano — ISO live com o PIANO instalado',
      frame: 'desktop',
      ctaHref: 'https://voidbr.org',
      ctaLabelKey: 'platforms.voidbr.cta',
      external: true,
      credit: { labelKey: 'platforms.voidbr.credit', href: 'https://voidbr.org' },
    },
  ]
</script>

<template>
  <section id="platforms" class="platforms" data-testid="platforms-carousel">
    <div class="platforms__container">
      <div class="platforms__header">
        <span class="platforms__eyebrow">{{ $t('platforms.eyebrow') }}</span>
        <h2 class="platforms__title">
          {{ $t('platforms.title') }}
        </h2>
        <p class="platforms__description">
          {{ $t('platforms.description') }}
        </p>
      </div>
    </div>

    <!--
      Carrossel horizontal — ÚNICO efeito hero da página (doc-mestre 30/09).
      Desktop: GSAP ScrollTrigger (pin + scrub + snap por card), client-only.
      Mobile (<960px): scroll-snap CSS nativo, sem pin.
      prefers-reduced-motion: cards em scroll nativo, sem pin/scrub.
    -->
    <div ref="pinRoot" class="platforms__pin">
      <div ref="trackViewport" class="platforms__viewport">
        <ul ref="track" class="platforms__track">
          <li
            v-for="(platform, i) in platforms"
            :key="platform.id"
            :data-carousel-index="i"
            class="platforms__slide"
          >
            <article data-testid="platform-card" class="platforms__card" :data-slide="platform.id">
              <div class="platforms__shot-wrap">
                <img
                  :src="platform.shot"
                  :alt="platform.shotAlt"
                  class="platforms__shot"
                  width="1280"
                  height="720"
                  loading="lazy"
                  decoding="async"
                />
                <div class="platforms__shot-glow" aria-hidden="true" />
              </div>

              <div class="platforms__card-body">
                <div class="platforms__card-header">
                  <div class="platforms__card-icon">
                    <i :class="`ti ${platform.icon}`" />
                  </div>
                  <span class="platforms__card-badge">
                    {{ $t(platform.badgeKey) }}
                  </span>
                </div>

                <h3 class="platforms__card-name">
                  {{ $t(platform.titleKey) }}
                </h3>
                <p class="platforms__card-tagline">
                  {{ $t(platform.taglineKey) }}
                </p>
                <p class="platforms__card-desc">
                  {{ $t(platform.descKey) }}
                </p>

                <div class="platforms__card-footer">
                  <a
                    :href="platform.ctaHref"
                    class="platforms__card-cta"
                    :target="platform.external ? '_blank' : undefined"
                    :rel="platform.external ? 'noopener noreferrer' : undefined"
                  >
                    <span>{{ $t(platform.ctaLabelKey) }}</span>
                    <i class="ti ti-arrow-right" />
                  </a>
                  <a
                    v-if="platform.credit"
                    :href="platform.credit.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="platforms__card-credit"
                  >
                    {{ $t(platform.credit.labelKey) }}
                  </a>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .platforms {
    background: var(--piano-bg-primary);
    padding: 6rem 0 4rem;
    overflow: hidden;

    &__container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    &__header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 3rem;

      @media (min-width: 960px) {
        margin-bottom: 1.5rem;
      }
    }

    &__eyebrow {
      display: inline-block;
      color: var(--piano-accent-text);
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.75rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--piano-text-primary);
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    &__description {
      font-size: 1.1rem;
      color: var(--piano-text-secondary);
      line-height: 1.7;
    }

    &__viewport {
      width: 100%;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      // Desktop: o GSAP controla o movimento (pin + scrub), desliga o scroll nativo
      @media (min-width: 960px) {
        overflow-x: hidden;
        scroll-snap-type: none;
      }
    }

    &__track {
      display: flex;
      gap: 2rem;
      padding: 1rem 1.5rem 2rem;
      list-style: none;
      margin: 0;
      width: max-content;

      @media (min-width: 960px) {
        padding: 1rem 6vw 2rem;
      }
    }

    &__slide {
      flex: 0 0 auto;
      width: min(84vw, 420px);
      scroll-snap-align: center;
      display: flex;
    }

    &__card {
      display: flex;
      flex-direction: column;
      width: 100%;
      background: var(--piano-bg-solid);
      border: 1px solid var(--piano-border);
      border-radius: var(--piano-radius-lg);
      overflow: hidden;
      transition:
        border-color 0.3s,
        box-shadow 0.3s;

      &--active {
        border-color: var(--piano-accent);
        box-shadow: var(--piano-shadow-glow);
      }
    }

    &__shot-wrap {
      position: relative;
      overflow: hidden;
      background: var(--piano-dark);
      border-bottom: 1px solid var(--piano-border-subtle);
      aspect-ratio: 16 / 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__shot {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    // Frame mobile: print retrato centralizado sem esticar
    .platforms__card--mobile .platforms__shot {
      width: auto;
      height: 100%;
      object-fit: contain;
    }

    &__shot-glow {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 60%, rgba(19, 19, 19, 0.55) 100%);
      pointer-events: none;
    }

    &__card-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.25rem 1.5rem 1.5rem;
      flex: 1;
    }

    &__card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: var(--piano-radius-md);
      background: var(--piano-accent);
      color: var(--piano-on-accent);
      font-size: 1.3rem;
    }

    &__card-badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--piano-accent-text);
      background: var(--piano-accent-soft);
      border: 1px solid var(--piano-accent);
      padding: 0.25rem 0.6rem;
      border-radius: var(--piano-radius-full);
    }

    &__card-name {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--piano-text-primary);
      margin: 0.25rem 0 0;
    }

    &__card-tagline {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--piano-accent-text);
      margin: 0;
    }

    &__card-desc {
      font-size: 0.9rem;
      color: var(--piano-text-muted);
      line-height: 1.6;
      margin: 0 0 0.75rem;
    }

    &__card-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    &__card-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--piano-on-accent);
      background: var(--piano-accent);
      padding: 0.6rem 1.1rem;
      border-radius: var(--piano-radius-full);
      text-decoration: none;
      transition:
        background 0.2s,
        transform 0.2s;

      &:hover {
        background: var(--piano-accent-hover);
        transform: translateY(-2px);
      }
    }

    &__card-credit {
      font-size: 0.75rem;
      color: var(--piano-text-muted);
      text-decoration: underline;
      text-underline-offset: 3px;

      &:hover {
        color: var(--piano-accent-text);
      }
    }
  }
</style>
