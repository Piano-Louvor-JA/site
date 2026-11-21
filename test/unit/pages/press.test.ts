import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PressPage from '~/pages/institucional/press.vue'
import pt from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'
import fr from '../../../i18n/fr.json'
import ru from '../../../i18n/ru.json'
import uk from '../../../i18n/uk.json'

const CATALOGS = { pt: pt, en, es, fr, ru, uk } as const
const LOCALES = ['pt', 'en', 'es', 'fr', 'ru', 'uk'] as const

const METRICS_RE =
  /\d{2,}(?:[.,]\d+)?\s*(downloads?|instala[çc][õo]es|installs?|usu[áa]rios|users)/i

function mountPage(locale: string, messages: Record<string, unknown>) {
  const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
  return mount(PressPage, {
    global: {
      plugins: [i18n],
      mocks: { $t: i18n.global.t },
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
}

describe('Press kit', () => {
  for (const locale of LOCALES) {
    it(`renderiza P1–P4 + CTA imprimir em ${locale}`, () => {
      const messages = CATALOGS[locale]
      const wrapper = mountPage(locale, messages as unknown as Record<string, unknown>)
      expect(wrapper.find('[data-testid="press-page"]').exists()).toBe(true)
      const press = messages.press!
      expect(wrapper.text()).toContain(press.about)
      for (const point of press.keyPoints) {
        expect(wrapper.text()).toContain(point)
      }
      for (const item of press.where.items) {
        expect(wrapper.text()).toContain(item)
      }
      expect(wrapper.text()).toContain(press.contact)
      // Botão imprimir
      const btn = wrapper.find('[data-testid="press-print-btn"]')
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toContain(press.printCta)
    })

    it(`${locale}: título/lede não é cópia do pt-BR (tradução real)`, () => {
      const messages = CATALOGS[locale]
      const press = messages.press!
      if (locale === 'pt') return
      expect(press.title).not.toBe(CATALOGS.pt.press!.title)
      expect(press.lede).not.toBe(CATALOGS.pt.press!.lede)
    })

    it(`${locale}: sem métricas inventadas (AC-08)`, () => {
      const messages = CATALOGS[locale]
      const wrapper = mountPage(locale, messages as unknown as Record<string, unknown>)
      expect(wrapper.text()).not.toMatch(METRICS_RE)
    })
  }
})
