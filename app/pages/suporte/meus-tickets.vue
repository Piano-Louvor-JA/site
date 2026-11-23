<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTicketsApi } from '~/composables/useTicketsApi'

  definePageMeta({ middleware: 'auth' })

  const { t } = useI18n()
  const api = useTicketsApi()

  useAppHead({ title: t('tickets.portal.title'), path: '/suporte/meus-tickets' })

  type TicketRow = {
    id: number
    public_ref: string
    subject: string
    priority: string
    status: string
    first_response_due_at?: string | null
  }
  type MessageRow = { id: number; author_type: string; body: string; created_at?: string }

  const tickets = ref<TicketRow[]>([])
  const loading = ref(true)
  const error = ref('')
  const openDetail = ref<number | null>(null)
  const messages = ref<MessageRow[]>([])
  const reply = ref('')
  const sending = ref(false)

  // novo ticket
  const showForm = ref(false)
  const newTicket = ref<{ subject: string; priority: 'P1' | 'P2' | 'P3' | 'P4'; message: string }>({
    subject: '',
    priority: 'P3',
    message: '',
  })
  const creating = ref(false)

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const r = await api.listTickets()
      tickets.value = r.items ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    } finally {
      loading.value = false
    }
  }

  async function toggleDetail(id: number) {
    if (openDetail.value === id) {
      openDetail.value = null
      return
    }
    openDetail.value = id
    messages.value = []
    try {
      const r = await api.listMessages(id)
      messages.value = r.items ?? []
    } catch {
      messages.value = []
    }
  }

  async function sendReply() {
    if (!openDetail.value || !reply.value.trim()) return
    sending.value = true
    try {
      await api.postMessage(openDetail.value, reply.value.trim())
      reply.value = ''
      const r = await api.listMessages(openDetail.value)
      messages.value = r.items ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    } finally {
      sending.value = false
    }
  }

  async function create() {
    creating.value = true
    error.value = ''
    try {
      await api.createTicket({ ...newTicket.value })
      showForm.value = false
      newTicket.value = { subject: '', priority: 'P3', message: '' }
      await load()
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    } finally {
      creating.value = false
    }
  }

  onMounted(load)
</script>

<template>
  <div class="tickets-page">
    <section class="tickets-hero">
      <div>
        <h1>{{ $t('tickets.portal.title') }}</h1>
        <p>{{ $t('tickets.portal.description') }}</p>
      </div>
    </section>

    <section class="tickets-content">
      <div class="tickets-actions">
        <button type="button" @click="showForm = !showForm">
          {{ $t('tickets.portal.newTicket') }}
        </button>
      </div>

      <form v-if="showForm" class="tickets-form" @submit.prevent="create">
        <label>
          {{ $t('tickets.intake.subject') }}
          <input v-model="newTicket.subject" required minlength="3" maxlength="200" />
        </label>
        <label>
          {{ $t('tickets.portal.priority') }}
          <select v-model="newTicket.priority">
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </label>
        <label>
          {{ $t('tickets.intake.message') }}
          <textarea v-model="newTicket.message" required rows="5" />
        </label>
        <button type="submit" :disabled="creating">
          {{ creating ? $t('tickets.sending') : $t('tickets.portal.create') }}
        </button>
      </form>

      <p v-if="loading">
        {{ $t('tickets.loading') }}
      </p>
      <p v-else-if="error" class="tickets-error" role="alert">
        {{ error }}
      </p>
      <p v-else-if="tickets.length === 0">
        {{ $t('tickets.portal.empty') }}
      </p>

      <ul v-else class="tickets-list">
        <li v-for="tk in tickets" :key="tk.id" class="tickets-item">
          <button
            type="button"
            class="tickets-item__head"
            :aria-expanded="openDetail === tk.id"
            @click="toggleDetail(tk.id)"
          >
            <span class="tickets-ref">{{ tk.public_ref }}</span>
            <span>{{ tk.subject }}</span>
            <span class="tickets-badge" :data-priority="tk.priority">{{ tk.priority }}</span>
            <span class="tickets-badge" :data-status="tk.status">{{ tk.status }}</span>
          </button>

          <div v-if="openDetail === tk.id" class="tickets-detail">
            <ul class="tickets-messages">
              <li
                v-for="m in messages"
                :key="m.id"
                :class="['tickets-message', `tickets-message--${m.author_type}`]"
              >
                <span class="tickets-message__author">{{ m.author_type }}</span>
                <p>{{ m.body }}</p>
              </li>
            </ul>
            <form class="tickets-reply" @submit.prevent="sendReply">
              <textarea v-model="reply" rows="3" :aria-label="$t('tickets.portal.reply')" />
              <button type="submit" :disabled="sending || !reply.trim()">
                {{ $t('tickets.portal.reply') }}
              </button>
            </form>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
