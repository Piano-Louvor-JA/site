<template>
  <div class="equipe-tab">
    <p v-if="loading" class="equipe-tab__loading" role="status">
      {{ t('admin.comunidade.carregando') }}
    </p>
    <p v-else-if="error" class="equipe-tab__erro">
      {{ t('admin.comunidade.erroCarregar') }} — {{ error }}
    </p>
    <p v-else-if="!staff.length" class="equipe-tab__vazio">
      {{ t('admin.comunidade.semEquipe') }}
    </p>

    <article v-for="m in staff" :key="m.id" class="equipe-tab__card">
      <header class="equipe-tab__card-head">
        <h3>{{ m.name }}</h3>
        <p class="equipe-tab__email">
          {{ m.email }}
        </p>
      </header>

      <ul v-if="m.roles.length" class="equipe-tab__roles">
        <li v-for="r in m.roles" :key="r" class="equipe-tab__role-badge">
          {{ t(`admin.comunidade.role.${r}`) }}
        </li>
      </ul>

      <!-- PLAN §3.2: toggle gm visível somente para GM. Detecção: o próprio
           registro do operador (mesmo email Firebase) com gm:true na lista
           carregada. Ausente/sem gm → fail-closed, nem renderiza o toggle.
           A autorização real continua server-side. -->
      <label v-if="podeVerGm" class="equipe-tab__gm">
        <input
          type="checkbox"
          :checked="m.gm"
          :disabled="salvando === m.id"
          @change="toggleGm(m, ($event.target as HTMLInputElement).checked)"
        />
        {{ t('admin.comunidade.gm') }}
      </label>
      <span v-else-if="m.gm" class="equipe-tab__gm-badge">{{ t('admin.comunidade.gm') }}</span>
    </article>
  </div>
</template>

<script setup lang="ts">
  /**
   * Aba Equipe do hub /admin/comunidade (PLAN §3.2): membros staff do
   * tenant. Toggle gm aparece somente quando o próprio operador é GM
   * (registro próprio com gm:true na lista carregada); autorização real
   * é sempre server-side (adminAuth fail-closed).
   */
  import { ref, computed, onMounted } from 'vue'
  import { useMembersAdmin, type AdminMember } from '~/composables/useMembersAdmin'

  const { t } = useI18n()
  const { members, loading, error, listMembers, updateMember } = useMembersAdmin()
  const { user } = useFirebaseAuth()

  const salvando = ref<string | null>(null)

  const staff = computed(() => members.value.filter((m) => m.roles.includes('staff')))
  /** operador é GM somente se seu registro estiver na lista com gm:true */
  const podeVerGm = computed(() => {
    const email = user.value?.email?.trim().toLowerCase()
    if (!email) return false
    return members.value.some((m) => m.email === email && m.gm)
  })

  async function toggleGm(m: AdminMember, gm: boolean) {
    salvando.value = m.id
    try {
      await updateMember(m.id, { gm })
    } finally {
      salvando.value = null
    }
  }

  onMounted(() => {
    void listMembers({ limit: 100 })
  })
</script>

<style scoped lang="scss">
  .equipe-tab {
    display: grid;
    gap: 12px;

    &__vazio,
    &__loading {
      color: var(--color-text-muted, #8a93a1);
      text-align: center;
      padding: 32px 0;
    }

    &__erro {
      color: #dc2626;
      font-size: 0.85rem;
    }

    &__card {
      border: 1px solid var(--color-border, #353534);
      border-radius: 12px;
      padding: 16px;
      display: grid;
      gap: 8px;
    }

    &__card-head {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;

      h3 {
        margin: 0;
        font-size: 1.05rem;
      }
    }

    &__email {
      color: var(--piano-accent-text);
      font-size: 0.85rem;
      margin: 0;
    }

    &__roles {
      list-style: none;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
    }

    &__role-badge,
    &__gm-badge {
      font-size: 0.75rem;
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--color-border, #353534);
    }

    &__gm-badge {
      border-color: var(--piano-accent);
      color: var(--piano-accent-text);
    }

    &__gm {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }
  }
</style>
