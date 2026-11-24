import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import DocsPage from '~/pages/docs/index.vue'
import Institutional from '~/pages/institucional.vue'
import TvSupport from '~/components/TvSupportSection.vue'
import pt from '../../../i18n/pt-BR.json'
import uk from '../../../i18n/uk.json'
import ja from '../../../i18n/ja.json'

function context() {
  const i18n = createI18n({ legacy: false, locale: 'uk', messages: { 'pt-BR': pt, uk, ja } })
  vi.stubGlobal('useI18n', () => ({ t: i18n.global.t, locale: i18n.global.locale }))
  vi.stubGlobal(
    'useLocalePath',
    () => (path: string) =>
      `${i18n.global.locale.value === 'pt-BR' ? '' : `/${i18n.global.locale.value}`}${path}`,
  )
  vi.stubGlobal('useLocaleMessages', () => ({ raw: () => [] }))
  vi.stubGlobal('useAppHead', vi.fn())
  vi.stubGlobal('onBeforeUnmount', vi.fn())
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  return {
    i18n,
    options: {
      global: {
        plugins: [i18n],
        stubs: {
          NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
          ClientOnly: { template: '<slot />' },
        },
      },
    },
  }
}

describe('localized guide cards and navigation', () => {
  it('renders fourteen translated cards and exactly one locale prefix', () => {
    const ctx = context()
    const wrapper = mount(DocsPage, ctx.options)
    expect(wrapper.findAll('.doc-guide-card')).toHaveLength(14)
    const windows = wrapper.find('[data-testid="docs-guide-windows"]')
    expect(windows.text()).toContain(uk.docs.guides.cards.windows.title)
    expect(windows.attributes('href')).toBe('/uk/docs/install/windows')
  })

  it('updates both the card text and destination after switching locale', async () => {
    const ctx = context()
    const wrapper = mount(DocsPage, ctx.options)
    ctx.i18n.global.locale.value = 'ja'
    await nextTick()
    const windows = wrapper.find('[data-testid="docs-guide-windows"]')
    expect(windows.text()).toContain(ja.docs.guides.cards.windows.title)
    expect(windows.attributes('href')).toBe('/ja/docs/install/windows')
  })

  it('keeps institutional links in the selected language', () => {
    const ctx = context()
    const wrapper = mount(Institutional, ctx.options)
    const links = wrapper.findAll('a').map((link) => link.attributes('href'))
    expect(links).toContain('/uk/download')
    expect(links).toContain('/uk/contact')
    expect(links).toContain('/uk/institucional/press')
  })

  it('preserves the TV fragment when localizing the download CTA', () => {
    const ctx = context()
    const wrapper = mount(TvSupport, ctx.options)
    expect(wrapper.find('.tv-support__cta').attributes('href')).toBe('/uk/download#tv')
  })
})
