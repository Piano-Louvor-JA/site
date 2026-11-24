<template>
  <div class="membros-tab">
    <div v-if="feedback" class="membros-tab__feedback" :class="{ '--erro': !feedback.ok }">
      {{ feedback.msg }}
    </div>

    <div class="membros-tab__toolbar">
      <label class="membros-tab__filtro">
        <span>{{ t('admin.comunidade.filtroStatus') }}</span>
        <select v-model="filtroStatus" @change="carregar">
          <option value="">{{ t('admin.comunidade.todos') }}</option>
          <option value="pendente">pendente</option>
          <option value="aprovado">aprovado</option>
          <option value="inativo">inativo</option>
        </select>
      </label>
      <button class="membros-tab__recarregar" :disabled="loading" @click="carregar">
        {{ loading ? t('admin.comunidade.carregando') : t('admin.comunidade.recarregar') }}
      </button>
    </div>

    <div v-if="loading && !members.length" class="membros-tab__loading" role="status">
      {{ t('admin.comunidade.carregando') }}
    </div>
    <p v-else-if="error" class="membros-tab__erro">
      {{ t('admin.comunidade.erroCarregar') }} — {{ error }}
    </p>
    <p v-else-if="!members.length" class="membros-tab__vazio">
      {{ t('admin.comunidade.semMembros') }}
    </p>

    <article v-for="m in members" v-else :key="m.id" class="membros-tab__card">
      <header class="membros-tab__card-head">
        <h3>{{ m.name }}</h3>
        <p class="membros-tab__email">
          {{ m.email }}
        </p>
        <span class="membros-tab__status" :class="`--${m.status}`">{{ m.status }}</span>
      </header>

      <fieldset class="membros-tab__roles">
        <legend>{{ t('admin.comunidade.roles') }}</legend>
        <label v-for="r in ROLES" :key="r" class="membros-tab__role">
          <!-- SPEC AC2: roles são MULTI — checkboxes, nunca radios -->
          <input v-model="rascunhos[m.id]" type="checkbox" :value="r" />
          {{ t(`admin.comunidade.role.${r}`) }}
        </label>
      </fieldset>

      <div class="membros-tab__acoes">
        <button
          class="membros-tab__salvar"
          :disabled="!dirty(m.id) || salvando === m.id"
          @click="salvar(m.id)"
        >
          {{ salvando === m.id ? t('admin.comunidade.salvando') : t('admin.comunidade.salvar') }}
        </button>
        <button
          v-if="m.status === 'pendente'"
          class="membros-tab__aprovar"
          :disabled="salvando === m.id"
          @click="mudarStatus(m.id, 'aprovado')"
        >
          {{ t('admin.comunidade.aprovar') }}
        </button>
        <button
          v-else-if="m.status === 'aprovado'"
          class="membros-tab__inativar"
          :disabled="salvando === m.id"
          @click="mudarStatus(m.id, 'inativo')"
        >
          {{ t('admin.comunidade.inativar') }}
        </button>
        <button
          v-else
          class="membros-tab__aprovar"
          :disabled="salvando === m.id"
          @click="mudarStatus(m.id, 'aprovado')"
        >
          {{ t('admin.comunidade.reativar') }}
        </button>
      </div>
    </article>

    <button
      v-if="!loading && !exhausted && members.length"
      class="membros-tab__mais"
      @click="loadMore"
    >
      {{ t('admin.comunidade.carregarMais') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  /**
   * Aba Membros do hub /admin/comunidade (PLAN §3.2).
   * Lista todos os membros do tenant via API admin; roles são MULTI
   * (checkboxes, nunca radios — SPEC AC2); promoção/demotação via PATCH
   * com payload atômico. API decide autorização; o client só envia token.
   */
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useMembersAdmin, ROLES, type Role, type Status } from '~/composables/useMembersAdmin'

  const { t } = useI18n()
  const { members, loading, error, exhausted, listMembers, loadMore, updateMember } =
    useMembersAdmin()

  const filtroStatus = ref<'' | Status>('')
  /** rascunho de roles por membro — só entra no PATCH ao salvar */
  const rascunhos = reactive<Record<string, Role[]>>({})
  const salvando = ref<string | null>(null)
  const feedback = ref<{ ok: boolean; msg: string } | null>(null)

  function dirty(memberId: string): boolean {
    const m = members.value.find((x) => x.id === memberId)
    const rascunho = rascunhos[memberId] ?? []
    if (!m) return false
    return rascunho.length !== m.roles.length || rascunho.some((r) => !m.roles.includes(r))
  }

  function syncRascunhos() {
    for (const m of members.value) {
      if (!rascunhos[m.id]) rascunhos[m.id] = [...m.roles]
    }
  }

  async function carregar() {
    feedback.value = null
    await listMembers({ status: filtroStatus.value || undefined })
    syncRascunhos()
  }

  async function salvar(memberId: string) {
    salvando.value = memberId
    feedback.value = null
    try {
      await updateMember(memberId, { roles: rascunhos[memberId] ?? [] })
      feedback.value = { ok: true, msg: t('admin.comunidade.salvoOk') }
    } catch (err: unknown) {
      feedback.value = { ok: false, msg: msgErro(err, t('admin.comunidade.erroSalvar')) }
    } finally {
      salvando.value = null
    }
  }

  async function mudarStatus(memberId: string, status: Status) {
    salvando.value = memberId
    feedback.value = null
    try {
      await updateMember(memberId, { status })
      feedback.value = {
        ok: true,
        msg:
          status === 'aprovado'
            ? t('admin.comunidade.aprovadoOk')
            : t('admin.comunidade.inativadoOk'),
      }
    } catch (err: unknown) {
      feedback.value = { ok: false, msg: msgErro(err, t('admin.comunidade.erroSalvar')) }
    } finally {
      salvando.value = null
    }
  }

  function msgErro(err: unknown, fallback: string): string {
    const status =
      typeof err === 'object' && err !== null && 'statusCode' in err
        ? (err as { statusCode?: number }).statusCode
        : undefined
    const msg =
      typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message
        : undefined
    return status ? `Erro ${status}${msg ? `: ${msg}` : ''}` : fallback
  }

  onMounted(() => {
    void carregar()
  })

  watch(members, syncRascunhos)
</script>

<style scoped lang="scss">
  .membros-tab {
    display: grid;
    gap: 12px;

    &__toolbar {
      display: flex;
      gap: 12px;
      align-items: end;
      flex-wrap: wrap;
    }

    &__filtro {
      display: grid;
      gap: 4px;
      font-size: 0.8rem;
      color: var(--color-text-muted, #8a93a1);

      select {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid var(--color-border, #353534);
        background: transparent;
        color: inherit;
      }
    }

    &__recarregar,
    &__mais {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--color-border, #353534);
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.85rem;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }

    &__mais {
      justify-self: center;
    }

    &__feedback {
      padding: 10px 14px;
      border-radius: 8px;
      background: rgba(34, 197, 94, 0.12);
      color: #16a34a;
      font-size: 0.9rem;

      &.--erro {
        background: rgba(239, 68, 68, 0.12);
        color: #dc2626;
      }
    }

    &__loading,
    &__vazio {
      color: var(--color-text-muted, #8a93a1);
      text-align: center;
      padding: 32px 0;
    }

    &__erro {
      color: #dc2626;
      text-align: center;
      padding: 32px 0;
    }

    &__card {
      border: 1px solid var(--color-border, #353534);
      border-radius: 12px;
      padding: 16px;
    }

    &__card-head {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;

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

    &__status {
      font-size: 0.75rem;
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid var(--color-border, #353534);

      &.--aprovado {
        border-color: #16a34a;
        color: #16a34a;
      }

      &.--pendente {
        border-color: #d97706;
        color: #d97706;
      }
    }

    &__roles {
      border: 1px dashed var(--color-border, #353534);
      border-radius: 8px;
      padding: 10px 12px;
      margin: 0 0 12px;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;

      legend {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--color-text-muted, #8a93a1);
        padding: 0 4px;
      }
    }

    &__role {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      cursor: pointer;
    }

    &__acoes {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    &__salvar,
    &__aprovar,
    &__inativar {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }

    &__salvar {
      background: var(--piano-accent);
      color: #ffffff;
    }

    &__aprovar {
      background: #16a34a;
      color: white;
    }

    &__inativar {
      background: transparent;
      color: #dc2626;
      border: 1px solid #dc2626;
    }
  }
</style>
