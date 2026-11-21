import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import TheHeader from '~/components/TheHeader.vue'
import pt from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'
import fr from '../../../i18n/fr.json'
import ru from '../../../i18n/ru.json'
import uk from '../../../i18n/uk.json'

const CATALOGS = { pt: pt, en, es, fr, ru, uk } as const
const LOCALES = ['pt', 'en', 'es', 'fr', 'ru', 'uk'] as const

describe('TheHeader — link institucional', () => {
  for (const locale of LOCALES) {
    it(`renderiza link /institucional com label do locale ${locale}`, () => {
      const messages = CATALOGS[locale]
      const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
      const wrapper = mount(TheHeader, {
        global: {
          plugins: [i18n],
          mocks: { $t: i18n.global.t },
          stubs: {
            RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
            NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
          },
        },
      })
      const links = wrapper.findAll('a[href="/institucional"]')
      expect(links.length).toBeGreaterThanOrEqual(1)
      // label = nav.institucional do locale ativo
      expect(links[0]!.text()).toContain(messages.nav!.institucional)
    })
  }
})
