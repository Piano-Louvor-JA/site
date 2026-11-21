import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import InstitucionalPage from '~/pages/institucional.vue'
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
const renderText = (text: string) =>
  text.replace("app{'@'}pianolouvorja.com.br", 'app@pianolouvorja.com.br')

beforeEach(() => vi.stubGlobal('useAppHead', vi.fn()))

function mountPage(locale: string, messages: Record<string, unknown>) {
  const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
  return mount(InstitucionalPage, {
    global: {
      plugins: [i18n],
      mocks: { $t: i18n.global.t },
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })
}

describe('Página institucional', () => {
  for (const locale of LOCALES) {
    it(`renderiza S1–S4 com textos do catálogo ${locale}`, () => {
      const messages = CATALOGS[locale]
      const wrapper = mountPage(locale, messages as unknown as Record<string, unknown>)
      expect(wrapper.find('[data-testid="institucional-page"]').exists()).toBe(true)
      const inst = messages.institucional!
      // S1–S4 renderizadas com title/body do catálogo
      for (const key of ['s1', 's2', 's3', 's4'] as const) {
        expect(wrapper.text()).toContain(inst[key].title)
        expect(wrapper.text()).toContain(renderText(inst[key].body))
      }
      // CTA press presente
      expect(wrapper.text()).toContain(inst.cta.press)
    })

    it(`${locale}: título/lede não é cópia do pt-BR (tradução real)`, () => {
      const messages = CATALOGS[locale]
      const inst = messages.institucional!
      if (locale === 'pt') return
      expect(inst.title).not.toBe(CATALOGS.pt.institucional!.title)
      expect(inst.lede).not.toBe(CATALOGS.pt.institucional!.lede)
    })

    it(`${locale}: sem métricas inventadas (AC-08)`, () => {
      const messages = CATALOGS[locale]
      const wrapper = mountPage(locale, messages as unknown as Record<string, unknown>)
      expect(wrapper.text()).not.toMatch(METRICS_RE)
    })
  }
})
