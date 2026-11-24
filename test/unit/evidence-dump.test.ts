import { describe, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * EVIDÊNCIA (não é teste de comportamento — falha nunca): monta as abas do
 * hub com fixtures e despeja o HTML renderizado para screenshots no browser.
 */

vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useHead', vi.fn())

const membersFixture = {
  data: [
    {
      id: 'm1',
      tenant_id: 'pianolouvorja',
      email: 'felipe@example.com',
      name: 'Felipe Nascimento',
      avatar_url: null,
      bio: 'Apaixonado por tecnologia',
      github: 'Lipesantos658',
      roles: ['dev'],
      status: 'aprovado',
      gm: false,
      since: '2026-11-13T00:01:59.250Z',
    },
    {
      id: 'm2',
      tenant_id: 'pianolouvorja',
      email: 'jeydson@example.com',
      name: 'Jeydson Garcia',
      avatar_url: null,
      bio: 'Trabalhar para missão',
      github: null,
      roles: ['dev', 'tester', 'conteudo'],
      status: 'aprovado',
      gm: true,
      since: '2026-11-10T01:06:03.245Z',
    },
    {
      id: 'm3',
      tenant_id: 'pianolouvorja',
      email: 'novo@example.com',
      name: 'Candidato Novo',
      avatar_url: null,
      bio: null,
      github: null,
      roles: [],
      status: 'pendente',
      gm: false,
      since: '2026-11-18T10:00:00.000Z',
    },
  ],
  next_cursor: null,
}

vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(membersFixture))
vi.stubGlobal('useNuxtApp', () => ({
  $firebaseAuth: { currentUser: { getIdToken: async () => 'tok' } },
}))
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    pianoApiBase: 'https://api-stg.pianolouvorja.com.br',
    testersSheetUrl: 'https://sheets.test.local/gviz',
  },
}))
vi.stubGlobal('useFirebaseAuth', () => ({
  user: { value: { email: 'jeydson@example.com', uid: 'u1' } },
  getToken: async () => 'tok',
}))
vi.stubGlobal('useRoute', () => ({ path: '/admin/comunidade', query: {}, params: {} }))
vi.stubGlobal('useRouter', () => ({ push: async () => {}, replace: async () => {} }))

const CSS = `
  body { background: #131313; color: #f8f9ff; font-family: system-ui, sans-serif; margin: 24px; }
  [data-v-app], #app { max-width: 900px; margin: 0 auto; }
`

function dump(name: string, html: string) {
  const directory = resolve('.evidence')
  mkdirSync(directory, { recursive: true })
  const out = resolve(directory, `${name}.html`)
  writeFileSync(
    out,
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${name}</title><style>${CSS}</style></head><body><div id="app">${html}</div></body></html>`,
  )
  console.log('DUMPED', out)
}

/** v-model seta a PROPRIEDADE checked, que o innerHTML não serializa —
 *  espelha para atributo para o dump refletir o estado real do componente. */
function syncCheckedAttr(w: { findAll: (sel: string) => { element: Element }[] }) {
  for (const c of w.findAll('input[type="checkbox"]')) {
    if ((c.element as HTMLInputElement).checked) c.element.setAttribute('checked', 'checked')
  }
}

describe('evidence dumps', () => {
  it('dump MembersTab', async () => {
    const { default: MembersTab } = await import('~/components/admin/AdminMembersTab.vue')
    const w = mount(MembersTab)
    await flushPromises()
    await flushPromises()
    syncCheckedAttr(w)
    dump('tab-membros', w.html())
  })

  it('dump TeamTab (operador GM vê toggles)', async () => {
    vi.stubGlobal(
      '$fetch',
      vi.fn().mockResolvedValue({
        data: [
          ...membersFixture.data,
          {
            id: 's1',
            tenant_id: 'pianolouvorja',
            email: 'rafael@pianolouvorja.com.br',
            name: 'Rafael (Fundador)',
            avatar_url: null,
            bio: 'Fundador do PIANO LouvorJA',
            github: 'rafaelejosi',
            roles: ['staff', 'dev'],
            status: 'aprovado',
            gm: true,
            since: '2024-01-01T00:00:00.000Z',
          },
        ],
        next_cursor: null,
      }),
    )
    const { default: TeamTab } = await import('~/components/admin/AdminTeamTab.vue')
    const w = mount(TeamTab)
    await flushPromises()
    await flushPromises()
    syncCheckedAttr(w)
    dump('tab-equipe', w.html())
  })

  it('dump PendingTab (fluxo #274 preservado)', async () => {
    vi.stubGlobal(
      '$fetch',
      vi.fn((url: string) => {
        if (String(url).includes('sheet=testadores')) {
          return Promise.resolve(
            '"nome","email","avatar_url","bio","foco","linkedin","github","instagram","outros","ativo","desde","status"\n"Maria Teste","maria@ex.com","","Bio de teste","web","","","","","FALSE","","pendente"',
          )
        }
        return Promise.resolve('"nome","email","status"\n')
      }),
    )
    const { default: PendingTab } = await import('~/components/admin/AdminPendingTab.vue')
    const w = mount(PendingTab)
    await flushPromises()
    await flushPromises()
    dump('tab-pendentes', w.html())
  })

  it('dump Hub (3 abas)', async () => {
    const [{ default: Hub }, { default: Pending }, { default: Members }, { default: Team }] =
      await Promise.all([
        import('~/pages/admin/comunidade.vue'),
        import('~/components/admin/AdminPendingTab.vue'),
        import('~/components/admin/AdminMembersTab.vue'),
        import('~/components/admin/AdminTeamTab.vue'),
      ])
    const w = mount(Hub, {
      global: {
        components: {
          AdminPendingTab: Pending,
          AdminMembersTab: Members,
          AdminTeamTab: Team,
        },
      },
    })
    await flushPromises()
    dump('hub-abas', w.html())
  })
})
