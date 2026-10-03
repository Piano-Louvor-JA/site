import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PlatformsSection from '~/components/PlatformsSection.vue'

// Composable GSAP (client-only): stubado — os testes de unidade cobrem a
// estrutura SSR do componente; o comportamento do carrossel é e2e/visual.
vi.mock('~/composables/usePlatformsCarousel', () => ({
  usePlatformsCarousel: () => ({ activeIndex: { value: 0 } }),
}))

const mountPlatform = () =>
  mount(PlatformsSection, {
    global: {
      stubs: {
        ClientOnly: { template: '<slot />' },
      },
    },
  })

describe('PlatformsSection', () => {
  it('renderiza o titulo da secao', () => {
    const wrapper = mountPlatform()
    expect(wrapper.text()).toContain('Disponível onde você precisa')
  })

  it('renderiza o eyebrow da secao', () => {
    const wrapper = mountPlatform()
    expect(wrapper.text()).toContain('Multiplataforma')
  })

  it('renderiza 5 cards (desktop, web, mobile, tv, voidbr)', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    expect(cards.length).toBe(5)
  })

  it('cada card tem titulo, descricao e CTA', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    cards.forEach((card) => {
      expect(card.text().length).toBeGreaterThan(0)
      expect(card.find('a').exists()).toBe(true)
    })
  })

  it('card desktop aponta para a pagina de download', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    const desktopCard = cards[0]
    const cta = desktopCard.find('a')
    expect(cta.attributes('href')).toBe('/download')
  })

  it('card web aponta para a URL do app e abre em nova aba', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    const webCard = cards[1]
    const cta = webCard.find('a')
    expect(cta.attributes('href')).toMatch(/^https:\/\//)
    expect(cta.attributes('target')).toBe('_blank')
    expect(cta.attributes('rel')).toContain('noopener')
  })

  it('card mobile aponta para a pagina de download (app disponivel)', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    const mobileCard = cards[2]
    const cta = mobileCard.find('a')
    expect(cta.attributes('href')).toBe('/download')
    // Link interno — nao deve abrir em nova aba
    expect(cta.attributes('target')).toBeUndefined()
  })

  it('card TV existe com print do palco', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    const tvCard = cards[3]
    expect(tvCard.find('img').attributes('src')).toContain('palco-tv')
  })

  it('voidbr tem credito da comunidade e link externo', () => {
    const wrapper = mountPlatform()
    const cards = wrapper.findAll('[data-testid="platform-card"]')
    const voidbrCard = cards[4]
    const credit = voidbrCard.find('.platforms__card-credit')
    expect(credit.exists()).toBe(true)
    expect(credit.attributes('href')).toContain('voidbr.org')
    const cta = voidbrCard.find('.platforms__card-cta')
    expect(cta.attributes('target')).toBe('_blank')
    expect(cta.attributes('rel')).toContain('noopener')
  })

  it('cada card mostra o print real (webp do carrossel) com alt', () => {
    const wrapper = mountPlatform()
    const imgs = wrapper.findAll('img.platforms__shot')
    expect(imgs.length).toBe(5)
    imgs.forEach((img) => {
      expect(img.attributes('src')).toMatch(/^\/img\/carrossel\//)
      expect(img.attributes('alt')?.length).toBeGreaterThan(5)
    })
  })

  it('expose viewport + track com scroll-snap (fallback sem JS)', () => {
    const wrapper = mountPlatform()
    expect(wrapper.find('.platforms__viewport').exists()).toBe(true)
    expect(wrapper.find('.platforms__track').exists()).toBe(true)
  })
})
