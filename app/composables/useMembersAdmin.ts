/**
 * PLAN §2.3/§3.1 — cliente dos endpoints admin do domínio Membro.
 * SSG: fetch direto na API pública via NUXT_PUBLIC_PIANO_API_BASE
 * (nunca rota Nitro relativa). Token Firebase no Authorization;
 * X-Tenant explícito (default pianolouvorja). Fail-closed: sem token,
 * nenhuma chamada parte do client.
 */
import { ref, computed } from 'vue'

export const ROLES = ['dev', 'tester', 'conteudo', 'curador', 'staff'] as const
export type Role = (typeof ROLES)[number]
export type Status = 'pendente' | 'aprovado' | 'inativo'

export interface AdminMember {
  id: string
  tenant_id: string
  email: string
  name: string
  avatar_url: string | null
  bio: string | null
  github: string | null
  roles: Role[]
  status: Status
  gm: boolean
  since: string
}

export interface MembersPatch {
  name?: string
  avatar_url?: string | null
  bio?: string | null
  github?: string | null
  roles?: Role[]
  status?: Status
  gm?: boolean
}

const TENANT = 'pianolouvorja'

async function adminHeaders(): Promise<Record<string, string>> {
  const { $firebaseAuth } = useNuxtApp() as unknown as {
    $firebaseAuth: { currentUser: { getIdToken(): Promise<string> } | null }
  }
  const token = await $firebaseAuth.currentUser?.getIdToken()
  if (!token) throw new Error('não autenticado')
  return { Authorization: `Bearer ${token}`, 'X-Tenant': TENANT }
}

function apiBase(): string {
  const config = useRuntimeConfig()
  return String(config.public.pianoApiBase ?? '').replace(/\/$/, '')
}

export function useMembersAdmin() {
  const members = ref<AdminMember[]>([])
  const nextCursor = ref<string | null>(null)
  const loading = ref(false)
  const error = ref('')
  /** filtros da última listagem — loadMore repete a mesma consulta */
  let lastFilter: { status?: Status; role?: Role; limit?: number } = {}
  /** true quando a paginação chegou ao fim (next_cursor null). */
  const exhausted = computed(() => nextCursor.value === null)
  const hasMembers = computed(() => members.value.length > 0)

  async function listMembers(params?: {
    status?: Status | ''
    role?: Role | ''
    cursor?: string | null
    limit?: number
  }): Promise<void> {
    // fail-closed: sem token a chamada nem parte — erro propaga, não vira estado de lista
    const headers = await adminHeaders()
    loading.value = true
    error.value = ''
    try {
      const status = params?.status || undefined
      const role = params?.role || undefined
      const limit = params?.limit
      if (!params?.cursor) lastFilter = { status, role, limit }
      const qs = new URLSearchParams()
      if (status) qs.set('status', status)
      if (role) qs.set('role', role)
      if (params?.cursor) qs.set('cursor', params.cursor)
      qs.set('limit', String(limit ?? 50))
      const res = await $fetch<{ data: AdminMember[]; next_cursor: string | null }>(
        `${apiBase()}/v1/custom/admin/members?${qs.toString()}`,
        { headers },
      )
      // primeira página substitui; paginação por cursor acumula
      members.value = params?.cursor ? [...members.value, ...res.data] : res.data
      nextCursor.value = res.next_cursor
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar membros'
    } finally {
      loading.value = false
    }
  }

  /** Avança a paginação repetindo os filtros da última listagem. */
  async function loadMore(): Promise<void> {
    if (!nextCursor.value || loading.value) return
    await listMembers({ ...lastFilter, cursor: nextCursor.value })
  }

  /** PATCH atômico; propaga erro estruturado (statusCode) para feedback honesto. */
  async function updateMember(memberId: string, patch: MembersPatch): Promise<AdminMember> {
    const res = await $fetch<AdminMember>(
      `${apiBase()}/v1/custom/admin/members/${encodeURIComponent(memberId)}`,
      { method: 'PATCH', headers: await adminHeaders(), body: patch },
    )
    const idx = members.value.findIndex((m) => m.id === memberId)
    if (idx >= 0) members.value[idx] = res
    return res
  }

  return {
    members,
    nextCursor,
    loading,
    error,
    exhausted,
    hasMembers,
    listMembers,
    loadMore,
    updateMember,
  }
}
