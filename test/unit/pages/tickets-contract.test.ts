import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import pt from '../../../i18n/pt-BR.json'
import Portal from '~/pages/suporte/meus-tickets.vue'
import Admin from '~/pages/admin/tickets.vue'

vi.mock('~/composables/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({ getToken: async () => 'id-token' }),
}))
const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)
vi.stubGlobal('useAppHead', vi.fn())
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useRuntimeConfig', () => ({ public: { pianoApiBase: 'https://api.test.local' } }))
const json = (data: unknown) => ({ ok: true, status: 200, json: async () => data })
const ticket = {
  id: 'ticket-uuid',
  tenant_id: 'organization',
  subject: 'Instalação',
  description: 'Minha descrição inicial',
  priority: 'P3',
  status: 'new',
}
const options = () => ({
  global: { plugins: [createI18n({ legacy: false, locale: 'pt-BR', messages: { 'pt-BR': pt } })] },
})

describe('ticket pages with real API response shapes', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('portal loads UUIDs, description and public messages and posts a public reply', async () => {
    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (url.endsWith('/messages'))
        return json(
          init.method === 'POST'
            ? { id: 'message-id' }
            : {
                data: [
                  {
                    id: 'public',
                    author_type: 'human',
                    author_ref: 'user',
                    body: 'Resposta pública',
                    visibility: 'public',
                  },
                  {
                    id: 'internal',
                    author_type: 'human',
                    author_ref: 'agent',
                    body: 'Nota interna',
                    visibility: 'internal',
                  },
                ],
              },
        )
      return json(url.endsWith('/ticket-uuid') ? ticket : { data: [ticket] })
    })
    const wrapper = mount(Portal, options())
    await flushPromises()
    expect(wrapper.text()).toContain('ticket-uuid')
    await wrapper.find('button.tickets-item__head').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Minha descrição inicial')
    expect(wrapper.text()).toContain('Resposta pública')
    expect(wrapper.text()).not.toContain('Nota interna')
    await wrapper.find('.tickets-reply textarea').setValue('Obrigado pela ajuda')
    await wrapper.find('.tickets-reply').trigger('submit')
    await flushPromises()
    const sent = fetchMock.mock.calls.find((call) => call[1].method === 'POST')!
    expect(sent[0]).toBe('https://api.test.local/v1/tickets/portal/tickets/ticket-uuid/messages')
    expect(JSON.parse(sent[1].body)).toEqual({ body: 'Obrigado pela ajuda', visibility: 'public' })
  })

  it('portal ticket creation maps the message into description', async () => {
    fetchMock.mockResolvedValue(json({ data: [] }))
    const wrapper = mount(Portal, options())
    await flushPromises()
    await wrapper.find('.tickets-actions button').trigger('click')
    await wrapper.find('.tickets-form input').setValue('Ajuda na instalação')
    await wrapper.find('.tickets-form textarea').setValue('Não consigo instalar o aplicativo')
    await wrapper.find('.tickets-form').trigger('submit')
    await flushPromises()
    const sent = fetchMock.mock.calls.find((call) => call[1].method === 'POST')!
    expect(JSON.parse(sent[1].body)).toEqual({
      subject: 'Ajuda na instalação',
      priority: 'P3',
      description: 'Não consigo instalar o aplicativo',
    })
  })

  it('admin requires an explicit organization to convert a new intake and offers no unsupported status control', async () => {
    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (init.method === 'POST') return json({ ticket_id: 'converted-ticket' })
      return json({
        data: url.endsWith('/admin/triage')
          ? [
              {
                id: 'triage-uuid',
                protocol: 'PROTO-REFERENCE',
                requester_name: 'Maria',
                subject: 'Ajuda',
                status: 'new',
                tenant_id: null,
              },
            ]
          : [ticket],
      })
    })
    const wrapper = mount(Admin, options())
    await flushPromises()
    expect(wrapper.text()).toContain('Maria')
    expect(wrapper.find('select').exists()).toBe(false)
    const organization = wrapper.find('.tickets-triage input')
    expect(organization.attributes('required')).toBeDefined()
    await organization.setValue('organization')
    await wrapper.find('.tickets-triage').trigger('submit')
    await flushPromises()
    const sent = fetchMock.mock.calls.find((call) => call[1].method === 'POST')!
    expect(sent[0]).toBe('https://api.test.local/v1/tickets/admin/triage/triage-uuid/convert')
    expect(JSON.parse(sent[1].body)).toEqual({ tenant_id: 'organization' })
    expect(wrapper.find('[data-testid="ai-note"]').exists()).toBe(false)
  })
})
