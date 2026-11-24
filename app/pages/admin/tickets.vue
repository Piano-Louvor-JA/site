<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTicketsApi, type Ticket, type IntakeItem } from '~/composables/useTicketsApi'

  definePageMeta({ middleware: 'auth' })

  const { t } = useI18n()
  const api = useTicketsApi()

  useAppHead({ title: t('tickets.admin.title'), path: '/admin/tickets' })

  const intake = ref<IntakeItem[]>([])
  const tickets = ref<Ticket[]>([])
  const loading = ref(true)
  const error = ref('')
  const triageTenant = ref<Record<string, string>>({})

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const [i, tk] = await Promise.all([api.listIntake(), api.listTickets()])
      intake.value = i.data ?? []
      tickets.value = tk.data ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    } finally {
      loading.value = false
    }
  }

  async function triage(id: string) {
    error.value = ''
    try {
      await api.triageIntake(id, { tenant_id: triageTenant.value[id]?.trim() ?? '' })
      await load()
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
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
            <span>{{ it.subject }} — {{ it.requester_name }}</span>
            <span class="tickets-badge" :data-status="it.status">{{ it.status }}</span>
          </div>
          <form
            v-if="it.status === 'new' || it.status === 'in_review'"
            class="tickets-triage"
            @submit.prevent="triage(it.id)"
          >
            <label
              >{{ $t('tickets.admin.tenant') }}
              <input v-model="triageTenant[it.id]" required />
            </label>
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
            <span class="tickets-ref">{{ tk.id }}</span>
            <span>{{ tk.subject }}</span>
            <span class="tickets-badge" :data-priority="tk.priority">{{ tk.priority }}</span>
            <span class="tickets-badge" :data-status="tk.status">{{ tk.status }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
