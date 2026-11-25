import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ConductPage from '~/pages/conduta.vue'
import pt from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'

describe('Código de conduta', () => {
  for (const [locale, messages] of Object.entries({ pt, en, es })) {
    it(`renderiza os parágrafos e âncoras em ${locale}`, () => {
      const i18n = createI18n({ legacy: false, locale, messages: { [locale]: messages } })
      const wrapper = mount(ConductPage, {
        global: { plugins: [i18n], mocks: { $t: i18n.global.t } },
      })
      for (const [id, section] of Object.entries(messages.conduct.sections)) {
        expect(wrapper.find(`a[href="#${id}"]`).text()).toBe(section.title)
        for (const paragraph of section.body) {
          expect(wrapper.find(`#${id}`).text()).toContain(paragraph)
        }
      }
    })
  }
})
