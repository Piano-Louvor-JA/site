<script setup lang="ts">
  /**
   * Hub admin da Comunidade (PLAN §3.2) — 3 abas:
   * Pendentes (fluxo Sheet/API #274 preservado), Membros (domínio Membro
   * via API admin) e Equipe (staff, flag gm visível só para GM).
   * Deep-link ?tab=; API decide autorização server-side, o client só
   * envia o token Firebase.
   */
  definePageMeta({
    layout: 'admin',
    middleware: 'auth',
  })

  const { t } = useI18n()
  useHead({ title: () => `${t('admin.comunidade.title')} · Piano Louvor JA` })

  type HubTab = 'pendentes' | 'membros' | 'equipe'
  const TABS: HubTab[] = ['pendentes', 'membros', 'equipe']

  const route = useRoute()
  const router = useRouter()

  function tabInicial(): HubTab {
    const q = String(route.query.tab ?? '')
    return (TABS as string[]).includes(q) ? (q as HubTab) : 'pendentes'
  }

  const activeTab = ref<HubTab>(tabInicial())
  /** Membros/Equipe montam só na primeira visita — evita chamadas em cascata */
  const visited = ref<Set<HubTab>>(new Set([activeTab.value]))

  async function selecionarTab(tab: HubTab) {
    if (activeTab.value === tab) return
    activeTab.value = tab
    visited.value.add(tab)
    // deep-link sem recarregar: URL reflete a aba
    await router.push({ path: route.path, query: { ...route.query, tab } })
  }

  const tabs = computed(() => [
    { value: 'pendentes' as const, label: t('admin.comunidade.tab') },
    { value: 'membros' as const, label: t('admin.comunidade.tabMembros') },
    { value: 'equipe' as const, label: t('admin.comunidade.tabEquipe') },
  ])
</script>

<template>
  <div class="admin-comunidade">
    <header class="admin-comunidade__header">
      <h1>{{ $t('admin.comunidade.title') }}</h1>
      <p class="admin-comunidade__sub">
        {{ $t('admin.comunidade.subtitulo') }}
      </p>
    </header>

    <nav class="admin-comunidade__tabs" :aria-label="$t('admin.comunidade.tabsAriaLabel')">
      <button
        v-for="t in tabs"
        :key="t.value"
        class="admin-comunidade__tab"
        :class="{ '--ativa': activeTab === t.value }"
        :aria-current="activeTab === t.value ? 'true' : undefined"
        @click="selecionarTab(t.value)"
      >
        {{ t.label }}
      </button>
    </nav>

    <AdminPendingTab v-if="activeTab === 'pendentes'" />
    <AdminMembersTab v-if="visited.has('membros') && activeTab === 'membros'" />
    <AdminTeamTab v-if="visited.has('equipe') && activeTab === 'equipe'" />
  </div>
</template>

<style scoped lang="scss">
  .admin-comunidade {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px;

    &__header {
      margin-bottom: 20px;

      h1 {
        font-size: 1.6rem;
        margin: 0 0 4px;
      }
    }

    &__sub {
      color: var(--color-text-muted, #8a93a1);
      font-size: 0.9rem;
      margin: 0;
    }

    &__tabs {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      border-bottom: 1px solid var(--color-border, #353534);
      padding-bottom: 12px;
    }

    &__tab {
      padding: 8px 18px;
      border-radius: 999px;
      border: 1px solid var(--color-border, #353534);
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.95rem;

      &.--ativa {
        background: var(--piano-accent);
        border-color: var(--piano-accent);
        color: #ffffff;
        font-weight: 600;
      }
    }
  }
</style>
