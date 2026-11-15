import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * SPEC piano-admin-panel v1.1.0 (RF-04): página Admin/Gestão no site —
 * CRUD de eventos sazonais + editor do pool de tasks semanais, chamando
 * /api/piano/proxy/v1/custom/admin/* com Bearer do login piano.
 * UI só renderiza gestão para quem está autenticado (middleware auth).
 */
import AdminGestaoPage from '~/pages/admin/gestao.vue'

const fetchMock = vi.fn()

vi.stubGlobal('$fetch', fetchMock)
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useHead', vi.fn())
// Sessão piano autenticada (usePianoApi lê localStorage — mock do setup
// devolve undefined por padrão; sobrescrever getItem para os tokens)
const store: Record<string, string> = {
  piano_admin_token: 'test-token',
  piano_admin_user: JSON.stringify({
    id_user: 1,
    email: 'admin@test.local',
    displayName: 'Admin',
  }),
}
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store[k] ?? null,
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
})

const mountPage = async () => {
  const { createI18n } = await import('vue-i18n')
  const pt = (await import('../../../i18n/pt-BR.json')).default
  const i18n = createI18n({ legacy: false, locale: 'pt', messages: { pt } })
  const wrapper = mount(AdminGestaoPage, {
    global: { plugins: [i18n], mocks: { $t: i18n.global.t } },
  })
  await flushPromises()
  return wrapper
}

const eventPayload = {
  data: [
    {
      id: 1,
      name: 'Páscoa',
      description: null,
      multiplier: 2,
      starts_at: '2020-01-01T00:00:00',
      ends_at: '2099-12-31T00:00:00',
      active: true,
    },
  ],
}

describe('Admin/Gestão — eventos sazonais + tasks', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockImplementation(async (url: string) => {
      if (String(url).includes('/admin/seasonal-events')) return eventPayload
      if (String(url).includes('/admin/weekly-tasks')) {
        return {
          data: [
            { id: 't1', description: 'Tarefa 1' },
            { id: 't2', description: 'Tarefa 2' },
            { id: 't3', description: 'Tarefa 3' },
          ],
        }
      }
      return { data: [] }
    })
  })

  it('carrega e renderiza eventos + pool de tasks', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Páscoa')
    // descriptions ficam no value dos inputs (v-model), não no texto
    const taskInputs = wrapper.findAll('.admin-gestao__task input')
    expect(taskInputs.length).toBe(3)
    expect((taskInputs[0]!.element as HTMLInputElement).value).toBe('Tarefa 1')
    wrapper.unmount()
  })

  it('cria evento via POST com payload validado', async () => {
    const wrapper = await mountPage()
    await wrapper.find('[data-testid="event-name"]').setValue('Natal')
    await wrapper.find('[data-testid="event-multiplier"]').setValue('3')
    await wrapper.find('[data-testid="event-starts"]').setValue('2026-12-20')
    await wrapper.find('[data-testid="event-ends"]').setValue('2026-12-30')
    await wrapper.find('[data-testid="event-submit"]').trigger('submit')
    await flushPromises()

    const post = fetchMock.mock.calls.find(
      (c) => String(c[0]).includes('/admin/seasonal-events') && c[1]?.method === 'POST',
    )
    expect(post).toBeTruthy()
    const body = JSON.parse(post![1].body as string)
    expect(body.multiplier).toBe(3)
    expect(body.name).toBe('Natal')
    wrapper.unmount()
  })

  it('datas invertidas: não envia e mostra erro no form (validação client)', async () => {
    const wrapper = await mountPage()
    const postsBefore = fetchMock.mock.calls.filter(
      (c) => String(c[0]).includes('/admin/seasonal-events') && c[1]?.method === 'POST',
    ).length
    await wrapper.find('[data-testid="event-name"]').setValue('Inválido')
    await wrapper.find('[data-testid="event-multiplier"]').setValue('2')
    await wrapper.find('[data-testid="event-starts"]').setValue('2026-12-31')
    await wrapper.find('[data-testid="event-ends"]').setValue('2026-12-01')
    await wrapper.find('[data-testid="event-submit"]').trigger('submit')
    await flushPromises()

    const postsAfter = fetchMock.mock.calls.filter(
      (c) => String(c[0]).includes('/admin/seasonal-events') && c[1]?.method === 'POST',
    ).length
    expect(postsAfter).toBe(postsBefore) // não enviou
    expect(wrapper.find('[data-testid="event-form-error"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('salva pool de tasks via PUT com as 3+ tarefas do form', async () => {
    const wrapper = await mountPage()
    await wrapper.find('[data-testid="tasks-submit"]').trigger('click')
    await flushPromises()

    const put = fetchMock.mock.calls.find(
      (c) => String(c[0]).includes('/admin/weekly-tasks') && c[1]?.method === 'PUT',
    )
    expect(put).toBeTruthy()
    const body = JSON.parse(put![1].body as string)
    expect((body.tasks as unknown[]).length).toBeGreaterThanOrEqual(3)
    wrapper.unmount()
  })
})
