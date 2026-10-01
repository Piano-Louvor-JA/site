import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutSection from '~/components/AboutSection.vue'

// setup.ts auto-executa onMounted, então o fetch dispara no mount.

describe('AboutSection', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: null }))
  })

  it('renderiza a secao com id about', () => {
    const wrapper = mount(AboutSection)
    expect(wrapper.find('#about').exists()).toBe(true)
  })

  it('renderiza texto sobre o projeto', () => {
    const wrapper = mount(AboutSection)
    expect(wrapper.text().length).toBeGreaterThan(50)
  })

  it('renderiza installs com fallback 0 quando API nao retorna total', async () => {
    const wrapper = mount(AboutSection)
    await Promise.resolve()
    await Promise.resolve()
    expect(wrapper.find('[data-testid="about-installs-num"]').text()).toBe('0')
  })

  it('atualiza installs quando a API retorna total', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: 987 }))
    const wrapper = mount(AboutSection)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    expect(wrapper.find('[data-testid="about-installs-num"]').text()).toBe('987')
  })
})
