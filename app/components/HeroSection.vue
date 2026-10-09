<script setup lang="ts">
  import { ref } from 'vue'
  import { siteConfig } from '~/data/site'
  import { useHeroCarousel } from '~/composables/useHeroCarousel'

  // Telas mockadas do produto girando dentro da janela de preview
  const slides = [
    { src: '/img/hero-carrossel/desktop.webp', alt: 'App desktop PIANO LouvorJA — tela inicial' },
    { src: '/img/hero-carrossel/web.webp', alt: 'App Web PIANO LouvorJA — álbuns' },
    { src: '/img/hero-carrossel/mobile.webp', alt: 'App mobile PIANO LouvorJA' },
    { src: '/img/hero-carrossel/palco-tv.webp', alt: 'Palco PIANO projetando na TV' },
    { src: '/img/hero-carrossel/voidbr.webp', alt: 'VoidBR LouvorJA Piano' },
  ]

  const previewRoot = ref<HTMLElement | null>(null)
  useHeroCarousel(previewRoot, slides.length)
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__glow hero__glow--accent" />
    <div class="hero__glow hero__glow--yellow" />

    <div class="hero__container">
      <div class="hero__content">
        <span class="hero__badge">
          <i class="ti ti-sparkles" />
          {{ $t('hero.badge') }}
        </span>

        <h1 class="hero__title">
          {{ $t('hero.title') }}<br />
          <span class="hero__title-accent"
            >{{ $t('hero.titleHighlight') }} <span>{{ $t('hero.titleHighlight2') }}</span></span
          >
        </h1>

        <p data-testid="hero-subtitle" class="hero__subtitle">
          {{ $t('hero.subtitle') }}
        </p>

        <div class="hero__actions">
          <a
            data-testid="hero-cta"
            :href="siteConfig.appUrl"
            class="hero__cta hero__cta--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="ti ti-login" />
            {{ $t('hero.ctaPrimary') }}
          </a>
          <a data-testid="hero-secondary" href="#platforms" class="hero__cta hero__cta--secondary">
            <i class="ti ti-devices" />
            {{ $t('hero.ctaSecondary') }}
          </a>
        </div>

        <div class="hero__meta">
          <div class="hero__meta-item">
            <i class="ti ti-bolt" />
            {{ $t('hero.meta.noInstall') }}
          </div>
          <div class="hero__meta-item">
            <i class="ti ti-devices" />
            {{ $t('hero.meta.anyDevice') }}
          </div>
          <div class="hero__meta-item">
            <i class="ti ti-code" />
            {{ $t('hero.meta.openSource') }}
          </div>
        </div>
      </div>

      <!-- Preview: janela com telas mockadas do produto em carrossel -->
      <div class="hero__preview">
        <div ref="previewRoot" class="hero__preview-window" data-testid="hero-preview-window">
          <!-- Barra de janela estilo desktop -->
          <div class="hero__preview-bar"><span /><span /><span /></div>

          <!-- App header (espelha AppShell do webapp) -->
          <div class="hero__preview-header">
            <div class="hero__preview-brand">
              <img src="/brand/logo-louvor-ja.svg" alt="" class="hero__preview-logo" />
              <span class="hero__preview-brand-text">
                <span class="hero__preview-louvor">Louvor</span>
                <span class="hero__preview-ja">JA</span>
              </span>
            </div>
            <div class="hero__preview-codename-block">
              <img src="/brand/codename-piano.svg" alt="" class="hero__preview-codename" />
              <span class="hero__preview-version">1.15.2</span>
            </div>
          </div>

          <!-- Corpo: telas mockadas em carrossel (crossfade + Ken Burns no desktop) -->
          <div class="hero__preview-body">
            <div
              v-for="(slide, i) in slides"
              :key="slide.src"
              class="hero__preview-slide"
              :class="{ 'hero__preview-slide--active': i === 0 }"
            >
              <img
                :src="slide.src"
                :alt="slide.alt"
                class="hero__preview-img"
                :loading="i === 0 ? 'eager' : 'lazy'"
                decoding="async"
                width="1280"
                height="800"
              />
            </div>
          </div>

          <!-- Dots de navegação (auto-rotação a cada 5s; clicáveis no desktop) -->
          <div class="hero__preview-dots" role="tablist" aria-label="Telas do produto">
            <button
              v-for="(slide, i) in slides"
              :key="`dot-${slide.src}`"
              type="button"
              class="hero__preview-dot"
              :class="{ 'hero__preview-dot--active': i === 0 }"
              :aria-label="`Tela ${i + 1} de ${slides.length}`"
            />
          </div>

          <!-- Dock inferior (igual ao webapp) -->
          <div class="hero__preview-dock">
            <div class="hero__preview-dock-item hero__preview-dock-item--active">
              <i class="ti ti-home" />
            </div>
            <div class="hero__preview-dock-item">
              <i class="ti ti-book-2" />
            </div>
            <div class="hero__preview-dock-item">
              <i class="ti ti-music" />
            </div>
            <div class="hero__preview-dock-item">
              <i class="ti ti-clipboard-text" />
            </div>
            <div class="hero__preview-dock-item">
              <i class="ti ti-stopwatch" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: var(--site-bg);
    transition: background 0.3s;
    padding: 8rem 1.5rem 4rem;

    &__glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.35;
      pointer-events: none;

      &--accent {
        width: 500px;
        height: 500px;
        background: var(--site-accent);
        top: -100px;
        right: -100px;
      }

      &--yellow {
        width: 400px;
        height: 400px;
        background: var(--piano-yellow);
        bottom: -150px;
        left: -100px;
        opacity: 0.15;
      }
    }

    &__container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      width: 100%;
    }

    &__badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--site-accent-soft);
      border: 1px solid rgba(224, 137, 90, 0.3);
      color: var(--site-accent-text);
      padding: 0.375rem 1rem;
      border-radius: var(--piano-radius-full);
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    &__title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      color: var(--site-text);
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
    }

    &__title-accent {
      // Sem gradiente: "Simples" na marca azul, "e Completo" no acento (texto AA por tema)
      color: var(--piano-title-accent);
      -webkit-text-fill-color: var(--piano-title-accent);

      span {
        color: var(--piano-accent-text);
        -webkit-text-fill-color: var(--piano-accent-text);
      }
    }

    &__subtitle {
      font-size: 1.2rem;
      color: var(--site-text-secondary);
      line-height: 1.7;
      max-width: 480px;
      margin-bottom: 2rem;
    }

    &__actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }

    &__cta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: var(--piano-radius-full);
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition:
        transform 0.2s,
        box-shadow 0.2s;

      &--primary {
        background: var(--site-accent);
        color: var(--piano-on-accent);
        box-shadow: var(--piano-shadow-glow);

        &:hover {
          background: var(--site-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(224, 137, 90, 0.55);
        }
      }

      &--secondary {
        background: transparent;
        color: var(--site-text);
        border: 1px solid var(--site-border);

        &:hover {
          background: var(--site-accent-soft);
          transform: translateY(-2px);
        }
      }

      i {
        font-size: 1.2rem;
      }
    }

    &__meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    &__meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--site-text-secondary);
      font-size: 0.85rem;

      i {
        font-size: 1.05rem;
        color: var(--site-accent);
      }
    }

    /* ========== PREVIEW (espelha fielmente o webapp) ========== */
    &__preview {
      display: flex;
      justify-content: center;
    }

    &__preview-window {
      width: 100%;
      max-width: 420px;
      background: var(--piano-dark);
      border-radius: var(--piano-radius-lg);
      box-shadow:
        0 24px 64px rgba(0, 0, 0, 0.4),
        0 0 0 1px var(--piano-border-subtle);
      overflow: hidden;
      transform: perspective(1000px) rotateY(-3deg) rotateX(2deg);
    }

    &__preview-bar {
      display: flex;
      gap: 0.375rem;
      padding: 0.625rem 1rem;
      background: rgba(0, 0, 0, 0.4);

      span {
        width: 11px;
        height: 11px;
        border-radius: 50%;

        &:nth-child(1) {
          background: #ff5f57;
        }
        &:nth-child(2) {
          background: #ffbd2e;
        }
        &:nth-child(3) {
          background: #28ca42;
        }
      }
    }

    /* App header — espelha AppShell */
    &__preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, rgba(224, 137, 90, 0.16) 0%, rgba(19, 19, 19, 0.6) 100%);
      border-bottom: 1px solid var(--piano-border-subtle);
    }

    &__preview-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__preview-logo {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }

    &__preview-brand-text {
      display: flex;
      gap: 0.25rem;
      font-size: 1.05rem;
      font-weight: 700;
    }

    &__preview-louvor {
      color: #fff;
    }
    &__preview-ja {
      color: var(--brand-yellow);
      font-weight: 400;
    }

    &__preview-codename-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.1rem;
    }

    &__preview-codename {
      height: 16px;
      width: auto;
      filter: brightness(0) invert(1);
      opacity: 0.85;
    }

    &__preview-version {
      font-size: 0.55rem;
      color: rgba(255, 255, 255, 0.3);
      letter-spacing: 0.05em;
    }

    /* Corpo do app — telas mockadas em carrossel */
    &__preview-body {
      position: relative;
      background: var(--piano-dark);
      min-height: 260px;
      overflow: hidden;
    }

    &__preview-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.65s ease;
      pointer-events: none;

      &--active {
        opacity: 1;
        pointer-events: auto;
      }
    }

    &__preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
      will-change: transform;
    }

    /* Dots de navegação do carrossel */
    &__preview-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 0 0.25rem;
      background: rgba(0, 0, 0, 0.5);
    }

    &__preview-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: none;
      padding: 0;
      background: rgba(255, 255, 255, 0.25);
      cursor: pointer;
      transition:
        background 0.3s,
        width 0.3s;

      &--active {
        background: var(--site-accent);
        width: 22px;
        border-radius: 4px;
      }
    }

    /* Dock inferior */
    &__preview-dock {
      display: flex;
      justify-content: space-around;
      padding: 0.625rem 0.5rem;
      background: rgba(0, 0, 0, 0.5);
      border-top: 1px solid var(--piano-border-subtle);
    }

    &__preview-dock-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--piano-radius-sm);
      color: rgba(255, 255, 255, 0.4);
      transition: all 0.2s;

      i {
        font-size: 1.15rem;
      }

      &--active {
        color: var(--site-accent);
        background: var(--piano-accent-soft);
      }
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 960px) {
      &__container {
        grid-template-columns: 1fr;
        gap: 2.5rem;
        text-align: center;
      }

      &__content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__badge {
        align-self: center;
      }

      &__actions {
        justify-content: center;
      }

      &__meta {
        justify-content: center;
      }

      &__subtitle {
        margin-left: auto;
        margin-right: auto;
      }

      &__preview {
        order: -1;
      }
    }

    @media (max-width: 600px) {
      padding: 6rem 1.25rem 3rem;

      &__title {
        font-size: 2.25rem;
      }

      &__subtitle {
        font-size: 1.05rem;
      }

      &__actions {
        flex-direction: column;
        width: 100%;
      }

      &__cta {
        justify-content: center;
      }

      &__meta {
        gap: 0.875rem;
        flex-direction: column;
      }

      /* Mobile: preview sem perspectiva, ocupa largura */
      &__preview-window {
        transform: none;
        max-width: 340px;
      }

      /* Dock compacto em mobile */
      &__preview-dock-item {
        width: 32px;
        height: 32px;

        i {
          font-size: 1rem;
        }
      }
    }
  }
</style>
