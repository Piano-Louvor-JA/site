import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

// useRoster é chamado dentro de TeamSection — mocka o fetch global usado lá.
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
    fetchMock.mockImplementation((url: string) =>
      url.includes('role=staff')
        ? Promise.resolve({
            data: [
              apiMember(),
              apiMember({ id: 'm2', name: 'Ezequias Fonseca', github: 'ezequiasfonseca' }),
            ],
          })
        : Promise.resolve({ data: [] }), // dev: sem devs para este cenário
    )
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

  it('renderiza subseção devs (role=dev) quando a API resolve devs (SPEC v1.1.0 AC-devs)', async () => {
    // 1ª chamada: staff; 2ª: dev (useRoster é chamado 2× no componente)
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('role=staff')) {
        return Promise.resolve({ data: [apiMember()] })
      }
      if (url.includes('role=dev')) {
        return Promise.resolve({
          data: [
            apiMember({ id: 'd1', name: 'Felipe', github: 'felipehj', roles: ['dev'] }),
            apiMember({ id: 'd2', name: 'Lucas', github: 'lucas-dev', roles: ['dev'] }),
          ],
        })
      }
      return Promise.reject(new Error('url inesperada: ' + url))
    })
    const wrapper = mount(TeamSection, { global: { stubs: ['i'] } })
    await flushPromises()
    const devs = wrapper.findAll('.team__dev')
    expect(devs).toHaveLength(2)
    expect(devs[0]!.find('.team__person-name').text()).toBe('Felipe')
    expect(devs[1]!.find('.team__person-name').text()).toBe('Lucas')
  })
})

it('renders members without GitHub or avatar using safe defaults', async () => {
  fetchMock.mockImplementation((url: string) =>
    url.includes('role=staff')
      ? Promise.resolve({
          data: [
            apiMember({ github: null, avatar_url: null }),
            apiMember({ id: 'm2', github: 'unknown', avatar_url: null }),
          ],
        })
      : Promise.resolve({ data: [] }),
  )
  const w = mount(TeamSection, { global: { stubs: ['i'] } })
  await flushPromises()
  expect(w.findAll('.team__person')).toHaveLength(2)
  expect(w.findAll('.team__avatar')[0]!.attributes('src')).toContain('/ghost.png')
  expect(w.findAll('.team__avatar')[1]!.attributes('src')).toContain('/unknown.png')
})

it('AC3: membro sem chave team.members.<login> usa fallback default.role, nunca a key crua', async () => {
  fetchMock.mockImplementation((url: string) =>
    url.includes('role=staff')
      ? Promise.resolve({
          data: [apiMember({ id: 'm9', name: 'Novo Dev', github: 'novodev' })],
        })
      : Promise.resolve({ data: [] }),
  )
  const wrapper = mount(TeamSection, { global: { stubs: ['i'] } })
  await flushPromises()
  const role = wrapper.find('.team__person-role')
  expect(role.text()).toBe('Membro da equipe')
  expect(role.text()).not.toContain('team.members.')
})

it('AC7: mesma pessoa em 2 docs (seed + sync) é deduplicada no cliente', async () => {
  fetchMock.mockImplementation((url: string) =>
    url.includes('role=staff')
      ? Promise.resolve({
          data: [
            apiMember({ id: 'seed', name: 'Felipe', github: 'felipehj', roles: ['dev', 'staff'] }),
            apiMember({ id: 'sync', name: 'Felipe', github: 'felipehj', roles: ['staff'] }),
          ],
        })
      : Promise.resolve({ data: [] }),
  )
  const wrapper = mount(TeamSection, { global: { stubs: ['i'] } })
  await flushPromises()
  expect(wrapper.findAll('.team__person')).toHaveLength(1)
})
