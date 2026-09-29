import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsSection from '~/components/StatsSection.vue'

// setup.ts auto-executa onMounted, então o fetch dispara no mount.

describe('StatsSection', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: null }))
  })

  afterEach(() => {
    // não usar unstubAllGlobals — removeria os stubs globais do test/setup.ts.
    // O próximo beforeEach sobrescreve $fetch com mock limpo.
  })

  it('renderiza 4 stat items', () => {
    const wrapper = mount(StatsSection)
    const items = wrapper.findAll('[data-testid="stat-item"]')
    expect(items.length).toBe(4)
  })

  it('renderiza os numeros corretos com fallback quando API falha/retorna null', async () => {
    const wrapper = mount(StatsSection)
    // aguardar microtasks do onMounted async
    await Promise.resolve()
    await Promise.resolve()
    const nums = wrapper.findAll('[data-testid="stat-num"]')
    expect(nums[0].text()).toBe('8+')
    expect(nums[1].text()).toBe('100%')
    expect(nums[2].text()).toBe('0')
    expect(nums[3].text()).toBe('PWA')
  })

  it('renderiza as labels i18n para cada stat', () => {
    const wrapper = mount(StatsSection)
    const text = wrapper.text()
    expect(text).toContain('Funcionalidades')
    expect(text).toContain('Gratuito')
    expect(text).toContain('Instalações')
    expect(text).toContain('Funciona offline')
  })

  it('atualiza o numero de instalacoes quando a API retorna total', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: 1234 }))

    const wrapper = mount(StatsSection)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    const nums = wrapper.findAll('[data-testid="stat-num"]')
    expect(nums[2].text()).toBe('1.234')
  })

  it('mantem fallback 0 quando a API rejeita', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(new Error('network')))

    const wrapper = mount(StatsSection)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    const nums = wrapper.findAll('[data-testid="stat-num"]')
    expect(nums[2].text()).toBe('0')
  })

  it('mantem fallback 0 quando total e 0 (numero novo sem installs)', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ total: 0 }))

    const wrapper = mount(StatsSection)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    const nums = wrapper.findAll('[data-testid="stat-num"]')
    expect(nums[2].text()).toBe('0')
  })
})
