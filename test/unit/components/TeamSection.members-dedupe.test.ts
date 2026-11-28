// TeamSection: seção "Membros da equipe" (review Ezequias 27/11):
// - Lucas com 2 contas (mesmo github) → 1 card (dedupe por login)
// - devs (Felipe/Lucas) NÃO aparecem na fileira de cima (fundadores)
// - role "Dev Junior" via i18n team.members.<login>.role
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TeamSection from '~/components/TeamSection.vue'

const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)

const STAFF = [
  {
    id: 'e1',
    name: 'Ezequias Fonseca',
    avatar_url: null,
    bio: null,
    github: 'ezequiasfonseca',
    since: '',
    roles: ['staff'],
  },
  {
    id: 'r1',
    name: 'Rafael Dias Zendron',
    avatar_url: null,
    bio: null,
    github: 'rafaumeu',
    since: '',
    roles: ['staff'],
  },
]
const DEVS = [
  {
    id: 'f@x',
    name: 'Felipe Nascimento Santos',
    avatar_url: null,
    bio: null,
    github: 'Lipesantos658',
    since: '',
    roles: ['dev', 'staff'],
  },
  {
    id: 'lu1',
    name: 'Lucas da Silva Vieira',
    avatar_url: null,
    bio: null,
    github: 'venatornocte',
    since: '',
    roles: ['dev'],
  },
  {
    id: 'lu2',
    name: 'Lucas da Silva Vieira',
    avatar_url: null,
    bio: null,
    github: 'venatornocte',
    since: '',
    roles: ['dev', 'staff'],
  },
]

function mockRoster() {
  fetchMock.mockImplementation(async (url: string) => {
    if (String(url).includes('role=dev')) return { data: DEVS }
    return { data: [...STAFF, ...DEVS.filter((d) => d.roles.includes('staff'))] }
  })
}

beforeEach(() => {
  fetchMock.mockReset()
})

describe('TeamSection — Membros da equipe (review Ezequias)', () => {
  it('dedupe: Lucas 2 contas → 1 card na subseção devs', async () => {
    mockRoster()
    const w = mount(TeamSection, { global: { stubs: ['i'] } })
    await flushPromises()
    const devSection = w.findAll('.team__people')[1]
    expect(devSection).toBeTruthy()
    const names = devSection.findAll('.team__person-name').map((n) => n.text())
    expect(names.filter((n) => n === 'Lucas da Silva Vieira')).toHaveLength(1)
    expect(names).toContain('Felipe Nascimento Santos')
    expect(devSection.find('h3').text()).toBe('Membros da equipe')
  })

  it('devs não aparecem na fileira de cima (só fundadores/equipe base)', async () => {
    mockRoster()
    const w = mount(TeamSection, { global: { stubs: ['i'] } })
    await flushPromises()
    const topSection = w.findAll('.team__people')[0]
    const names = topSection.findAll('.team__person-name').map((n) => n.text())
    expect(names).toContain('Ezequias Fonseca')
    expect(names).not.toContain('Felipe Nascimento Santos')
    expect(names).not.toContain('Lucas da Silva Vieira')
  })

  it('roles: Felipe e Lucas exibem "Dev Junior"', async () => {
    mockRoster()
    const w = mount(TeamSection, { global: { stubs: ['i'] } })
    await flushPromises()
    const devSection = w.findAll('.team__people')[1]
    const roles = devSection.findAll('.team__person-role').map((r) => r.text())
    expect(roles).toEqual(['Dev Junior', 'Dev Junior'])
  })
})
