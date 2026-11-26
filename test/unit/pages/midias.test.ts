import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

import pt from '../../../i18n/pt-BR.json'
import en from '../../../i18n/en.json'
import es from '../../../i18n/es.json'

/**
 * SPEC piano-site-drive-midias v1.0.0: página /midias — links de download
 * das mídias do LouvorJA hospedadas no Google Drive (sem depender da API).
 * Links configuráveis por runtimeConfig (NUXT_PUBLIC_DRIVE_MEDIA_URL etc.).
 */
import MediaPage from '~/pages/midias.vue'

const i18n = createI18n({ legacy: false, locale: 'pt', messages: { pt } })

function mountPage() {
  return mount(MediaPage, {
    global: { plugins: [i18n], mocks: { $t: i18n.global.t } },
  })
}

beforeEach(() => {
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      driveMediaUrl: 'https://drive.google.com/file/d/1Kq2Xfh82kGKnAyF1zKjGN4RWN8rlwm8J/view',
    },
  }))
})

describe('Página /midias — downloads do Drive', () => {
  it('renderiza título e botão de download apontando para o link configurado', async () => {
    const wrapper = mountPage()
    await flushPromises()
    expect(wrapper.find('[data-testid="midias-download"]').exists()).toBe(true)
    const link = wrapper.find('[data-testid="midias-download"]')
    expect(link.attributes('href')).toContain('drive.google.com')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
    wrapper.unmount()
  })

  it('sem link configurado: mostra convite à comunidade (SPEC locale-convite B2), não erro', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { driveMediaUrl: '' } }))
    const wrapper = mountPage()
    await flushPromises()
    expect(wrapper.find('[data-testid="midias-convite"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="midias-convite"]').text()).toBe(
      pt.midias?.convite_catalogo as string,
    )
    expect(wrapper.find('[data-testid="midias-download"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('i18n: renderiza nos 3 idiomas sem quebrar', async () => {
    for (const [locale, messages] of Object.entries({ pt, en, es })) {
      const i18nL = createI18n({
        legacy: false,
        locale,
        messages: { [locale]: messages },
      })
      const wrapper = mount(MediaPage, {
        global: { plugins: [i18nL], mocks: { $t: i18nL.global.t } },
      })
      await flushPromises()
      expect(wrapper.find('[data-testid="midias-download"]').exists()).toBe(true)
      wrapper.unmount()
    }
  })
})
