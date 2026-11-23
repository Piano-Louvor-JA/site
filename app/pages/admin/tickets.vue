<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTicketsApi } from '~/composables/useTicketsApi'

  definePageMeta({ middleware: 'auth' })

  const { t } = useI18n()
  const api = useTicketsApi()

  useAppHead({ title: t('tickets.admin.title'), path: '/admin/tickets' })

  type IntakeRow = {
    id: number
    protocol: string
    name: string
    email: string
    subject: string
    message: string
    status: string
  }
  type TicketRow = {
    id: number
    public_ref: string
    subject: string
    priority: string
    status: string
  }

  const intake = ref<IntakeRow[]>([])
  const tickets = ref<TicketRow[]>([])
  const loading = ref(true)
  const error = ref('')
  const triagePriority = ref<Record<number, string>>({})
  const aiNote = ref<Record<number, string>>({})

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const [i, tk] = await Promise.all([api.listIntake(), api.listTickets()])
      intake.value = i.items ?? []
      tickets.value = tk.items ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    } finally {
      loading.value = false
    }
  }

  async function triage(id: number) {
    error.value = ''
    try {
      await api.triageIntake(id, { priority: triagePriority.value[id] ?? 'P3' })
      await load()
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    }
  }

  async function changeStatus(id: number, status: string) {
    error.value = ''
    try {
      await api.setStatus(id, status)
      await load()
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    }
  }

  async function askAi(id: number) {
    error.value = ''
    aiNote.value[id] = ''
    try {
      const r = await api.aiSuggestion(id)
      aiNote.value[id] = r.suggestion ?? t('tickets.admin.aiNone')
    } catch (e) {
      aiNote.value[id] = e instanceof Error ? e.message : t('tickets.admin.aiDisabled')
    }
  }

  onMounted(load)
</script>

<template>
  <div class="admin-page">
    <section class="admin-hero">
      <div>
        <h1>{{ $t('tickets.admin.title') }}</h1>
        <p>{{ $t('tickets.admin.description') }}</p>
      </div>
    </section>

    <section class="admin-content">
      <p v-if="loading">
        {{ $t('tickets.loading') }}
      </p>
      <p v-if="error" class="tickets-error" role="alert">
        {{ error }}
      </p>

      <h2>{{ $t('tickets.admin.intakeQueue') }}</h2>
      <p v-if="!loading && intake.length === 0">
        {{ $t('tickets.admin.intakeEmpty') }}
      </p>
      <ul v-else class="tickets-list">
        <li v-for="it in intake" :key="it.id" class="tickets-item">
          <div class="tickets-item__head">
            <span class="tickets-ref">{{ it.protocol }}</span>
            <span>{{ it.subject }} — {{ it.name }} &lt;{{ it.email }}&gt;</span>
            <span class="tickets-badge" :data-status="it.status">{{ it.status }}</span>
          </div>
          <p class="tickets-item__body">
            {{ it.message }}
          </p>
          <form
            v-if="it.status === 'pending'"
            class="tickets-triage"
            @submit.prevent="triage(it.id)"
          >
            <select v-model="triagePriority[it.id]" :aria-label="$t('tickets.portal.priority')">
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3" selected>P3</option>
              <option value="P4">P4</option>
            </select>
            <button type="submit">
              {{ $t('tickets.admin.triage') }}
            </button>
          </form>
        </li>
      </ul>

      <h2>{{ $t('tickets.admin.ticketsTitle') }}</h2>
      <p v-if="!loading && tickets.length === 0">
        {{ $t('tickets.portal.empty') }}
      </p>
      <ul v-else class="tickets-list">
        <li v-for="tk in tickets" :key="tk.id" class="tickets-item">
          <div class="tickets-item__head">
            <span class="tickets-ref">{{ tk.public_ref }}</span>
            <span>{{ tk.subject }}</span>
            <span class="tickets-badge" :data-priority="tk.priority">{{ tk.priority }}</span>
            <span class="tickets-badge" :data-status="tk.status">{{ tk.status }}</span>
          </div>
          <div class="tickets-admin-actions">
            <select
              :value="tk.status"
              :aria-label="$t('tickets.admin.changeStatus')"
              @change="changeStatus(tk.id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="resolved">resolved</option>
              <option value="closed">closed</option>
            </select>
            <button type="button" @click="askAi(tk.id)">
              {{ $t('tickets.admin.aiAsk') }}
            </button>
            <span v-if="aiNote[tk.id]" class="tickets-ai-note" data-testid="ai-note">{{
              aiNote[tk.id]
            }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
