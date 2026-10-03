/**
 * Carrossel de plataformas — GSAP ScrollTrigger (client-only).
 *
 * Desktop (>=960px, sem prefers-reduced-motion):
 *   - Seção presa (pin) enquanto o scroll vertical move o track horizontal
 *   - Snap por card (ScrollTrigger snap)
 *   - Card central recebe .platforms__card--active (borda laranja)
 *
 * Mobile / reduced-motion: nada roda — o scroll-snap CSS nativo do
 * .platforms__viewport cuida da navegação (progressive enhancement
 * ao contrário: sem JS, sem pin, funciona igual).
 */
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function usePlatformsCarousel(
  pinRoot: Ref<HTMLElement | null>,
  viewport: Ref<HTMLElement | null>,
  track: Ref<HTMLElement | null>,
) {
  const activeIndex = ref(0)
  let ctx: gsap.Context | null = null
  let cleanupMatchMedia: (() => void) | null = null

  onMounted(async () => {
    if (process.server) return
    if (typeof window === 'undefined') return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()
    cleanupMatchMedia = () => mm.revert()

    mm.add('(min-width: 960px)', () => {
      const trackEl = track.value
      const viewportEl = viewport.value
      if (!trackEl || !viewportEl || !pinRoot.value) return

      const slides = Array.from(trackEl.querySelectorAll<HTMLElement>('.platforms__slide'))
      if (slides.length < 2) return

      const getScrollDistance = (): number =>
        Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth)

      ctx = gsap.context(() => {
        const tween = gsap.to(trackEl, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinRoot.value,
            start: 'top top',
            end: () => `+=${getScrollDistance() + window.innerHeight * 0.5}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (slides.length - 1),
              duration: { min: 0.2, max: 0.5 },
              ease: 'power2.inOut',
            },
            onUpdate: (self: ScrollTrigger) => {
              const idx = Math.round(self.progress * (slides.length - 1))
              if (idx !== activeIndex.value) {
                activeIndex.value = idx
                slides.forEach((s, i) => {
                  const card = s.querySelector<HTMLElement>('.platforms__card')
                  card?.classList.toggle('platforms__card--active', i === idx)
                })
              }
            },
          },
        })

        // Cards fora do centro levemente menores — profundidade sutil
        slides.forEach((slide, i) => {
          if (i !== 0) {
            gsap.set(slide.querySelector<HTMLElement>('.platforms__card'), {
              scale: 0.96,
            })
          }
        })
        void tween
      })

      return () => {
        ctx?.revert()
        ctx = null
      }
    })
  })

  onUnmounted(() => {
    cleanupMatchMedia?.()
    ctx?.revert()
    ctx = null
  })

  return { activeIndex }
}
