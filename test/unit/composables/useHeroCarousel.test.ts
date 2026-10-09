import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref } from 'vue'
const state = vi.hoisted(() => ({
  missingGsap: false,
  mount: undefined as undefined | (() => Promise<void>),
  unmount: undefined as undefined | (() => void),
}))
const animation = vi.hoisted(() => ({ fromTo: vi.fn(), to: vi.fn(), revert: vi.fn() }))
vi.mock('vue', async (original) => ({
  ...(await original<typeof import('vue')>()),
  onMounted: (fn: () => Promise<void>) => {
    state.mount = fn
  },
  onUnmounted: (fn: () => void) => {
    state.unmount = fn
  },
}))
vi.mock('gsap', () => ({
  get gsap() {
    return state.missingGsap
      ? undefined
      : {
          ...animation,
          context: (fn: () => void) => {
            fn()
            return { revert: animation.revert }
          },
        }
  },
}))
import { useHeroCarousel } from '~/composables/useHeroCarousel'
function root() {
  const el = document.createElement('div')
  el.innerHTML = [0, 1, 2]
    .map(
      (i) =>
        `<div class="hero__preview-slide ${i === 0 ? 'hero__preview-slide--active' : ''}"><img class="hero__preview-img"></div><button class="hero__preview-dot ${i === 0 ? 'hero__preview-dot--active' : ''}"></button>`,
    )
    .join('')
  return el
}
afterEach(() => {
  state.missingGsap = false
  state.unmount?.()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})
describe('hero carousel behavior', () => {
  it.each([
    [false, false],
    [true, true],
    [true, false],
  ])('rotates, wraps and stops after unmount (desktop=%s reduced=%s)', async (desktop, reduced) => {
    vi.useFakeTimers()
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) => ({ matches: query.includes('960') ? desktop : reduced }) as MediaQueryList,
    )
    const el = root()
    const { active } = useHeroCarousel(ref(el), 3)
    await state.mount!()
    expect(active.value).toBe(0)
    await vi.advanceTimersByTimeAsync(5000)
    expect(active.value).toBe(1)
    expect(
      el
        .querySelectorAll('.hero__preview-slide')[1]
        .classList.contains('hero__preview-slide--active'),
    ).toBe(true)
    expect(
      el.querySelectorAll('.hero__preview-dot')[1].classList.contains('hero__preview-dot--active'),
    ).toBe(true)
    await vi.advanceTimersByTimeAsync(10000)
    expect(active.value).toBe(0)
    if (desktop && !reduced) {
      expect(animation.to).toHaveBeenCalledWith(el.querySelector('img'), {
        scale: 1.06,
        duration: 5.65,
        ease: 'none',
      })
      expect(animation.fromTo).toHaveBeenCalled()
      const dot = el.querySelectorAll<HTMLButtonElement>('button')[2]
      dot.click()
      expect(active.value).toBe(2)
      dot.click()
      expect(active.value).toBe(2)
    } else {
      expect(animation.fromTo).not.toHaveBeenCalled()
    }
    state.unmount!()
    const stopped = active.value
    await vi.advanceTimersByTimeAsync(20000)
    expect(active.value).toBe(stopped)
    expect(vi.getTimerCount()).toBe(0)
  })
  it.each([0, 1])('does not schedule for %s slides', async (total) => {
    vi.useFakeTimers()
    useHeroCarousel(ref(root()), total)
    await state.mount!()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('does not schedule without a root', async () => {
    vi.useFakeTimers()
    useHeroCarousel(ref(null), 3)
    await state.mount!()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('does not initialize on server', async () => {
    const saved = process.server
    process.server = true
    try {
      useHeroCarousel(ref(root()), 3)
      await state.mount!()
      expect(animation.to).not.toHaveBeenCalled()
    } finally {
      process.server = saved
    }
  })
  it('does not initialize without window', async () => {
    const saved = window
    vi.stubGlobal('window', undefined)
    try {
      useHeroCarousel(ref(root()), 3)
      await state.mount!()
    } finally {
      vi.stubGlobal('window', saved)
    }
    expect(animation.to).not.toHaveBeenCalled()
  })
  it('does not animate when SDK is unavailable', async () => {
    state.missingGsap = true
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (q) => ({ matches: q.includes('960') }) as MediaQueryList,
    )
    useHeroCarousel(ref(root()), 3)
    await state.mount!()
    expect(animation.to).not.toHaveBeenCalled()
  })
  it.each([true, false])(
    'handles absent slides and a queued callback after disposal (desktop=%s)',
    async (desktop) => {
      vi.useFakeTimers()
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (q) => ({ matches: desktop && q.includes('960') }) as MediaQueryList,
      )
      const timer = vi.spyOn(globalThis, 'setTimeout')
      const el = document.createElement('div')
      el.innerHTML =
        '<button class="hero__preview-dot"></button><button class="hero__preview-dot"></button>'
      const { active } = useHeroCarousel(ref(el), 3)
      await state.mount!()
      if (desktop) el.querySelectorAll<HTMLButtonElement>('button')[1].click()
      const callback = timer.mock.calls.at(-1)![0] as () => void
      state.unmount!()
      callback()
      expect(vi.getTimerCount()).toBe(0)
      expect(active.value).toBe(desktop ? 1 : 1)
    },
  )
})
