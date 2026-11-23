import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * SPEC-B2 §2.2: intake público — formulário com consent LGPD obrigatório,
 * honeypot, protocolo no sucesso, consulta de status.
 */
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useAppHead', vi.fn())
vi.stubGlobal('useHead', vi.fn())
vi.stubGlobal('useLocalePath', () => (p: string) => p)
vi.stubGlobal(
  'useRuntimeConfig',
  vi.fn(() => ({ public: { pianoApiBase: 'https://api.test.local' } })),
)
vi.stubGlobal(
  'useFirebaseAuth',
  vi.fn(() => ({ getToken: vi.fn(async () => 'tok') })),
)

const IntakePage = (await import('~/pages/suporte/index.vue')).default

const mountPage = async () => {
  const { createI18n } = await import('vue-i18n')
  const pt = (await import('../../../i18n/pt-BR.json')).default
  const i18n = createI18n({ legacy: false, locale: 'pt-BR', messages: { 'pt-BR': pt } })
  return mount(IntakePage, { global: { plugins: [i18n] } })
}

describe('página /suporte (intake público)', () => {
  beforeEach(() => fetchMock.mockReset())

  it('renderiza formulário com consent e honeypot', async () => {
    const w = await mountPage()
    expect(w.find('form').exists()).toBe(true)
    expect(w.find('input[type="checkbox"]').exists()).toBe(true)
    expect(w.html()).toMatch(/LGPD/)
  })

  it('bloqueia envio sem consent', async () => {
    const w = await mountPage()
    await w.find('input[autocomplete="name"]').setValue('Maria')
    await w.find('input[type="email"]').setValue('maria@test.local')
    await w.findAll('input[type="text"]').filter((i) => i.attributes('type') === 'text') // noop
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(w.html()).toMatch(/consentimento/i)
  })

  it('envia e mostra protocolo', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, protocol: 'PRC-ABC123' }),
    })
    const w = await mountPage()
    await w.find('input[autocomplete="name"]').setValue('Maria')
    await w.find('input[type="email"]').setValue('maria@test.local')
    await w.find('[data-testid="intake-subject"]').setValue('Dúvida plano')
    await w.find('textarea').setValue('Olá')
    await w.find('input[type="checkbox"]').setValue(true)
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test.local/v1/tickets-intake')
    expect(JSON.parse(init.body).email).toBe('maria@test.local')
    expect(w.find('[data-testid="intake-protocol"]').text()).toContain('PRC-ABC123')
  })

  it('consulta status por protocolo', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ protocol: 'PRC-ABC123', status: 'pending' }),
    })
    const w = await mountPage()
    const forms = w.findAll('form')
    const statusForm = forms[forms.length - 1]
    await statusForm.find('input').setValue('PRC-ABC123')
    await statusForm.trigger('submit')
    await flushPromises()
    expect(w.find('[data-testid="intake-status-result"]').text()).toContain('pending')
  })
})
