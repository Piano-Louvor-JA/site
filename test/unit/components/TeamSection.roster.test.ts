import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

// useRoster é chamado dentro do TeamSection — mocka o fetch global usado lá.
const fetchMock = vi.fn()

vi.stubGlobal('$fetch', fetchMock)

import TeamSection from '~/components/TeamSection.vue'
import { teamMembers } from '~/data/team'

const apiMember = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 'm1',
  name: 'Felipe Dev',
  avatar_url: 'https://github.com/felipehj.png?size=96',
  bio: null,
  github: 'felipehj',
  since: '2026-11-20T00:00:00Z',
  roles: ['staff'],
  ...overrides,
})

describe('TeamSection roster dinâmico (SPEC Comunidade Orgânica)', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('em pending não renderiza a lista de pessoas', () => {
    fetchMock.mockReturnValue(new Promise(() => {})) // nunca resolve
    const wrapper = mount(TeamSection, { global: { stubs: ['i'] } })
    expect(wrapper.findAll('.team__person')).toHaveLength(0)
  })

  it('renderiza o roster da API (staff) quando o fetch resolve', async () => {
    fetchMock.mockResolvedValue({
      data: [
        apiMember(),
        apiMember({ id: 'm2', name: 'Ezequias Fonseca', github: 'ezequiasfonseca' }),
      ],
    })
    const wrapper = mount(TeamSection, { global: { stubs: ['i'] } })
    await flushPromises()
    const people = wrapper.findAll('.team__person')
    expect(people).toHaveLength(2)
    expect(people[0]!.find('.team__person-name').text()).toBe('Felipe Dev')
    // chamada direta à API pública, nunca rota relativa /api/
    expect(fetchMock.mock.calls[0]![0] as string).toMatch(
      /^https:\/\/.+\/v1\/custom\/community\/roster\?role=staff$/,
    )
  })

  it('fallback hardcoded do team.ts quando a API falha (env não confirmada em prod)', async () => {
    fetchMock.mockRejectedValue(new Error('network'))
    const wrapper = mount(TeamSection, { global: { stubs: ['i'] } })
    await flushPromises()
    const people = wrapper.findAll('.team__person')
    expect(people).toHaveLength(teamMembers.length)
    expect(people[0]!.find('.team__person-name').text()).toBe(teamMembers[0]!.name)
  })
})

it('renders members without GitHub or avatar using safe defaults', async () => {
  fetchMock.mockResolvedValue({
    data: [
      apiMember({ github: null, avatar_url: null }),
      apiMember({ id: 'm2', github: 'unknown', avatar_url: null }),
    ],
  })
  const w = mount(TeamSection, { global: { stubs: ['i'] } })
  await flushPromises()
  expect(w.findAll('.team__person')).toHaveLength(2)
  expect(w.findAll('.team__avatar')[0]!.attributes('src')).toContain('/ghost.png')
  expect(w.findAll('.team__avatar')[1]!.attributes('src')).toContain('/unknown.png')
})
