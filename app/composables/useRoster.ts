// onMounted vem do auto-import do Nuxt — import explícito quebra o stub global
// de testes (vi.stubGlobal) e o comportamento SSG do composable.
import { computed, ref } from 'vue'
import { teamMembers, type TeamMember } from '~/data/team'

/**
 * useRoster — roster dinâmico do domínio Membro (SPEC Comunidade Orgânica v1.0.0).
 * Fonte: GET `${pianoApiBase}/v1/custom/community/roster?role=<Role>` — chamada
 * DIRETA client-side (site é SSG: proibido $fetch('/api/...') relativo / Nitro proxy).
 * Header `X-Tenant: pianolouvorja` explícito (default da API, mas enviado por clareza).
 *
 * Estados por role: pending (loading), members (data, [] = vazio honesto), error.
 * Falha não vira estado celebratório: quem consome oculta a seção dinâmica ou mostra erro.
 * Fallback hardcoded do team.ts somente para role 'staff' (People do home), enquanto a
 * env NUXT_PUBLIC_PIANO_API_BASE não está confirmada em produção (regra do PLAN §3.2).
 */

export type RosterRole = 'dev' | 'tester' | 'conteudo' | 'curador' | 'staff'

export type RosterMember = {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  github: string | null
  since: string
  roles: string[]
}

const TENANT = 'pianolouvorja'

/** Ordem curada do team.ts preservada no fallback. */
const STAFF_ORDER = teamMembers.map((m) => m.login)

/** Membros staff hardcoded → forma de RosterMember (fallback transitório). */
function staffFallback(): RosterMember[] {
  return STAFF_ORDER.map((login) => {
    const m = teamMembers.find((t) => t.login === login) as TeamMember
    return {
      id: `fallback-staff-${m.login}`,
      name: m.name,
      avatar_url: m.avatar,
      bio: null,
      github: m.login,
      since: '',
      roles: ['staff'],
    }
  })
}

function isRosterMember(value: unknown): value is RosterMember {
  if (typeof value !== 'object' || value === null) return false
  const m = value as Record<string, unknown>
  return typeof m.id === 'string' && typeof m.name === 'string' && Array.isArray(m.roles)
}

export function useRoster(role: RosterRole | string) {
  const members = ref<RosterMember[]>([])
  const pending = ref(true)
  const error = ref(false)

  async function load(): Promise<void> {
    // Base da API por ambiente (default PROD como usePianoApi; site é SSG —
    // chamada client-side direta, nunca rota Nitro relativa).
    let base = 'https://api.pianolouvorja.com.br'
    try {
      const cfg = useRuntimeConfig()
      base = String(cfg?.public?.pianoApiBase ?? '') || base
    } catch {
      // useRuntimeConfig indisponível (fora do contexto Nuxt) → default PROD
    }
    try {
      const doFetch = globalThis.$fetch as unknown as <R>(
        url: string,
        opts?: Record<string, unknown>,
      ) => Promise<R>
      const payload = await doFetch<{ data?: unknown[] }>(
        `${base.replace(/\/$/, '')}/v1/custom/community/roster?role=${encodeURIComponent(role)}`,
        { headers: { 'X-Tenant': TENANT } },
      )
      const data = payload?.data
      if (!Array.isArray(data) || !data.every(isRosterMember)) {
        throw new Error('roster: payload inválido')
      }
      // ponytail: dedupe simples por github/email — a API pode devolver a mesma
      // pessoa em 2 docs (seed + sync Sheet); unificar roles no lado cliente.
      const seen = new Map<string, RosterMember>()
      for (const m of data) {
        const key = (m.github ?? m.id).toLowerCase()
        const prev = seen.get(key)
        seen.set(key, prev ? { ...prev, roles: [...new Set([...prev.roles, ...m.roles])] } : m)
      }
      members.value = [...seen.values()]
      error.value = false
    } catch {
      error.value = true
      // Fallback hardcoded APENAS para staff (People do home) durante transição.
      members.value = role === 'staff' ? staffFallback() : []
    } finally {
      pending.value = false
    }
  }

  onMounted(() => {
    void load()
  })

  const isEmpty = computed(() => !pending.value && !error.value && members.value.length === 0)

  return { members, pending, error, isEmpty }
}
