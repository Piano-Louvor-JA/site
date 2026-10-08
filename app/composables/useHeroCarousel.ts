/**
 * Carrossel do hero — telas mockadas girando dentro da janela de preview.
 *
 * Client-only, GSAP com import dinâmico (~45kb gzip só no bundle do client).
 * Desktop: crossfade + Ken Burns (zoom lento) + auto-rotação + dots com
 * progresso animado. Mobile (<960px): swipe nativo CSS scroll-snap, sem GSAP.
 * prefers-reduced-motion: crossfade simples via CSS, sem Ken Burns.
 */
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

// Tipo estrutural mínimo — gsap é importado dinamicamente (client-only)
interface GsapLike {
  fromTo: (el: Element | null, from: gsapVars, to: gsapVars) => unknown
  to: (el: Element | null, vars: gsapVars) => unknown
  context: (fn: () => void) => { revert: () => void }
}
interface gsapVars {
  [key: string]: string | number | undefined
}

const ROTATE_MS = 5000

export function useHeroCarousel(root: Ref<HTMLElement | null>, total: number) {
  const active = ref(0)
  let gsap: GsapLike | null = null
  let ctx: { revert: () => void } | null = null
  let timers: ReturnType<typeof setTimeout>[] = []
  let disposed = false

  const clearTimers = () => {
    timers.forEach(clearTimeout)
    timers = []
  }

  const scheduleNext = (go: (i: number) => void) => {
    clearTimers()
    timers.push(
      setTimeout(() => {
        if (!disposed) go((active.value + 1) % total)
      }, ROTATE_MS),
    )
  }

  const goTo = (el: HTMLElement, i: number) => {
    const slides = el.querySelectorAll<HTMLElement>('.hero__preview-slide')
    const dots = el.querySelectorAll<HTMLElement>('.hero__preview-dot')
    const prev = active.value
    active.value = i
    if (prev === i) return

    const prevSlide = slides[prev]
    const nextSlide = slides[i]
    if (prevSlide) prevSlide.classList.remove('hero__preview-slide--active')
    if (nextSlide) nextSlide.classList.add('hero__preview-slide--active')
    dots.forEach((d, di) => d.classList.toggle('hero__preview-dot--active', di === i))

    // Crossfade + Ken Burns: zoom 1.0 -> 1.06 durante a exibição do slide
    if (nextSlide && gsap) {
      const img = nextSlide.querySelector('.hero__preview-img')
      gsap.fromTo(
        img,
        { opacity: 0, scale: 1.0 },
        { opacity: 1, duration: 0.65, ease: 'power2.out' },
      )
      gsap.fromTo(
        img,
        { scale: 1 },
        { scale: 1.06, duration: (ROTATE_MS + 650) / 1000, ease: 'none' },
      )
    }
  }

  onMounted(async () => {
    if (process.server || typeof window === 'undefined') return
    const el = root.value
    if (!el || total < 2) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 960px)').matches
    // Mobile e reduced-motion: só troca de slide CSS (crossfade via classe), sem GSAP
    if (!desktop || reduced) {
      // fallback leve: troca por timer, classes CSS fazem o fade
      const tick = () => {
        const slides = el.querySelectorAll<HTMLElement>('.hero__preview-slide')
        const dots = el.querySelectorAll<HTMLElement>('.hero__preview-dot')
        const next = (active.value + 1) % total
        slides[active.value]?.classList.remove('hero__preview-slide--active')
        slides[next]?.classList.add('hero__preview-slide--active')
        dots.forEach((d, di) => d.classList.toggle('hero__preview-dot--active', di === next))
        active.value = next
        if (!disposed) timers.push(setTimeout(tick, ROTATE_MS))
      }
      timers.push(setTimeout(tick, ROTATE_MS))
      return
    }

    const { gsap: gsapImported } = await import('gsap')
    gsap = gsapImported as unknown as GsapLike
    if (!gsap) return
    ctx = gsap.context(() => {
      const g = gsap as GsapLike
      const go = (i: number) => {
        goTo(el, i)
        scheduleNext(go)
      }
      // Dots clicáveis: reinicia o ciclo do slide escolhido
      el.querySelectorAll<HTMLElement>('.hero__preview-dot').forEach((dot, i) => {
        dot.addEventListener('click', () => go(i))
      })
      scheduleNext(go)
      // Slide inicial ganha Ken Burns imediatamente
      const first = el.querySelector<HTMLElement>('.hero__preview-slide--active .hero__preview-img')
      if (first) g.to(first, { scale: 1.06, duration: (ROTATE_MS + 650) / 1000, ease: 'none' })
    })
  })

  onUnmounted(() => {
    disposed = true
    clearTimers()
    ctx?.revert()
    ctx = null
  })

  return { active }
}
