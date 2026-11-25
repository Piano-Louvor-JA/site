import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LibrasPlayer from '~/components/LibrasPlayer.vue'
import { getLibrasGloss } from '~/src/modules/libras/services/libras-translate'

vi.stubGlobal('useCookie', () => cookie)
vi.mock('~/src/modules/libras/services/libras-translate', () => ({ getLibrasGloss: vi.fn() }))
const cookie = ref<boolean | null>(null)
afterEach(() => {
  cookie.value = null
  vi.clearAllMocks()
})

describe('Libras player', () => {
  it('does no translation until the user enables Libras', async () => {
    const wrapper = mount(LibrasPlayer, { props: { lyrics: 'Olá' } })
    await flushPromises()
    expect(wrapper.find('[data-testid="libras-player"]').exists()).toBe(false)
    expect(getLibrasGloss).not.toHaveBeenCalled()
    vi.mocked(getLibrasGloss).mockResolvedValue({ gloss: 'OLÁ', sourceUsed: 'api' })
    cookie.value = true
    await flushPromises()
    expect(wrapper.get('[data-testid="libras-gloss"]').text()).toBe('OLÁ')
    cookie.value = false
    await flushPromises()
    expect(wrapper.find('[data-testid="libras-player"]').exists()).toBe(false)
    wrapper.unmount()
  })
  it('discards an obsolete translation after lyrics change', async () => {
    cookie.value = true
    let resolveOld!: (value: { gloss: string; sourceUsed: 'api' }) => void
    vi.mocked(getLibrasGloss)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve
          }),
      )
      .mockResolvedValueOnce({ gloss: 'NOVA', sourceUsed: 'api' })
    const wrapper = mount(LibrasPlayer, { props: { lyrics: 'Antiga' } })
    await wrapper.setProps({ lyrics: 'Nova' })
    await flushPromises()
    resolveOld({ gloss: 'ANTIGA', sourceUsed: 'api' })
    await flushPromises()
    expect(wrapper.get('[data-testid="libras-gloss"]').text()).toBe('NOVA')
    wrapper.unmount()
  })
})
