<script setup lang="ts">
  /**
   * SPEC piano-admin-panel v1.1.0 (RF-04): gestão de eventos sazonais e
   * pool de tasks semanais — fatia 1 do painel admin.
   * Auth: middleware auth (Firebase) no site; chamadas vão para a API piano
   * via /api/piano/proxy com Bearer do login piano (usePianoApi).
   * A API rejeita 403 quem não está em ADMIN_EMAILS dela (fail-closed).
   */
  import { ref, onMounted } from 'vue'

  import { usePianoApi } from '~/composables/usePianoApi'

  definePageMeta({
    layout: 'admin',
    middleware: 'auth',
  })

  useHead({ title: 'Gestão da Comunidade · Piano Louvor JA' })

  const { isAuthenticated, login, request } = usePianoApi()

  // --- Sessão piano (login e-mail/senha da conta admin) ---
  const email = ref('')
  const password = ref('')
  const loginError = ref('')
  const loggingIn = ref(false)

  async function onLogin() {
    loginError.value = ''
    loggingIn.value = true
    try {
      await login(email.value, password.value)
    } catch {
      loginError.value = 'Credenciais inválidas ou API indisponível.'
    } finally {
      loggingIn.value = false
    }
  }

  // --- Eventos sazonais ---
  type SeasonalEvent = {
    id: number
    name: string
    description: string | null
    multiplier: number
    starts_at: string
    ends_at: string
    active: boolean
  }
  const events = ref<SeasonalEvent[]>([])
  const eventsLoading = ref(true)

  const eventName = ref('')
  const eventDescription = ref('')
  const eventMultiplier = ref('2')
  const eventStarts = ref('')
  const eventEnds = ref('')
  const eventFormError = ref('')
  const eventSaving = ref(false)
  const eventFeedback = ref('')

  function validDates(): boolean {
    return (
      eventStarts.value.length >= 10 &&
      eventEnds.value.length >= 10 &&
      new Date(eventEnds.value) > new Date(eventStarts.value)
    )
  }

  async function loadEvents() {
    eventsLoading.value = true
    try {
      const res = await request<{ data?: SeasonalEvent[] }>('/v1/custom/admin/seasonal-events')
      events.value = res.data ?? []
    } catch {
      events.value = []
    } finally {
      eventsLoading.value = false
    }
  }

  async function onCreateEvent() {
    eventFormError.value = ''
    eventFeedback.value = ''
    const multiplier = Number(eventMultiplier.value)
    if (!eventName.value.trim()) {
      eventFormError.value = 'Informe o nome do evento.'
      return
    }
    if (!validDates()) {
      eventFormError.value = 'Data fim deve ser posterior à data início.'
      return
    }
    if (!(multiplier >= 1)) {
      eventFormError.value = 'Multiplicador deve ser >= 1.'
      return
    }
    eventSaving.value = true
    try {
      await request('/v1/custom/admin/seasonal-events', {
        method: 'POST',
        body: {
          name: eventName.value.trim(),
          description: eventDescription.value.trim() || null,
          multiplier,
          starts_at: eventStarts.value,
          ends_at: eventEnds.value,
          active: true,
        },
      })
      eventFeedback.value = `Evento "${eventName.value}" criado.`
      eventName.value = ''
      eventDescription.value = ''
      eventMultiplier.value = '2'
      eventStarts.value = ''
      eventEnds.value = ''
      await loadEvents()
    } catch {
      eventFormError.value = 'Falha ao criar evento (permissão ou API).'
    } finally {
      eventSaving.value = false
    }
  }

  async function onToggleEvent(ev: SeasonalEvent) {
    try {
      await request(`/v1/custom/admin/seasonal-events/${ev.id}`, {
        method: 'PUT',
        body: {
          name: ev.name,
          description: ev.description,
          multiplier: ev.multiplier,
          starts_at: ev.starts_at,
          ends_at: ev.ends_at,
          active: !ev.active,
        },
      })
      await loadEvents()
    } catch {
      eventFeedback.value = ''
    }
  }

  async function onDeactivateEvent(ev: SeasonalEvent) {
    try {
      await request(`/v1/custom/admin/seasonal-events/${ev.id}`, {
        method: 'DELETE',
      })
      await loadEvents()
    } catch {
      /* feedback discreto */
    }
  }

  // --- Pool de tasks semanais ---
  const tasks = ref<Array<{ id: string; description: string; active: boolean }>>([])
  const tasksLoading = ref(true)
  const tasksSaving = ref(false)
  const tasksFeedback = ref('')

  async function loadTasks() {
    tasksLoading.value = true
    try {
      const res = await request<{ data?: Array<{ id: string; description: string }> }>(
        '/v1/custom/admin/weekly-tasks',
      )
      tasks.value = (res.data ?? []).map((t) => ({ ...t, active: true }))
    } catch {
      tasks.value = []
    } finally {
      tasksLoading.value = false
    }
  }

  function addTask() {
    const n = tasks.value.length + 1
    tasks.value.push({ id: `task_${Date.now()}_${n}`, description: '', active: true })
  }

  function removeTask(i: number) {
    if (tasks.value.length <= 3) return // pool mínimo 3
    tasks.value.splice(i, 1)
  }

  async function onSaveTasks() {
    tasksSaving.value = true
    tasksFeedback.value = ''
    try {
      await request('/v1/custom/admin/weekly-tasks', {
        method: 'PUT',
        body: {
          tasks: tasks.value.map((t) => ({
            id: t.id,
            description: t.description,
            active: t.active,
          })),
        },
      })
      tasksFeedback.value = 'Pool de tasks salvo.'
    } catch {
      tasksFeedback.value = 'Falha ao salvar pool (mínimo 3 tasks válidas).'
    } finally {
      tasksSaving.value = false
    }
  }

  onMounted(async () => {
    if (!isAuthenticated.value) return
    await Promise.all([loadEvents(), loadTasks()])
  })
</script>

<template>
  <div class="admin-gestao">
    <h1>Gestão da Comunidade</h1>

    <!-- Sem sessão piano: login inline -->
    <section v-if="!isAuthenticated" class="admin-gestao__login">
      <p>Entre com a conta admin da API PIANO para gerenciar eventos e tasks.</p>
      <form @submit.prevent="onLogin">
        <input v-model="email" type="email" placeholder="e-mail admin" autocomplete="username" />
        <input
          v-model="password"
          type="password"
          placeholder="senha"
          autocomplete="current-password"
        />
        <button type="submit" :disabled="loggingIn || !email || !password">
          {{ loggingIn ? 'Entrando…' : 'Entrar' }}
        </button>
        <p v-if="loginError" role="alert" class="admin-gestao__error">
          {{ loginError }}
        </p>
      </form>
    </section>

    <template v-else>
      <!-- Eventos sazonais -->
      <section class="admin-gestao__section">
        <h2>Eventos sazonais</h2>

        <form
          class="admin-gestao__event-form"
          data-testid="event-form"
          @submit.prevent="onCreateEvent"
        >
          <input v-model="eventName" data-testid="event-name" placeholder="Nome do evento" />
          <input
            v-model="eventMultiplier"
            data-testid="event-multiplier"
            type="number"
            step="0.5"
            min="1"
            placeholder="Multiplicador"
          />
          <input v-model="eventStarts" data-testid="event-starts" type="date" />
          <input v-model="eventEnds" data-testid="event-ends" type="date" />
          <input v-model="eventDescription" placeholder="Descrição (opcional)" />
          <button type="submit" data-testid="event-submit" :disabled="eventSaving">
            {{ eventSaving ? 'Salvando…' : 'Criar evento' }}
          </button>
          <p
            v-if="eventFormError"
            data-testid="event-form-error"
            role="alert"
            class="admin-gestao__error"
          >
            {{ eventFormError }}
          </p>
          <p v-if="eventFeedback" class="admin-gestao__feedback">
            {{ eventFeedback }}
          </p>
        </form>

        <p v-if="eventsLoading">Carregando eventos…</p>
        <ul v-else class="admin-gestao__events">
          <li v-for="ev in events" :key="ev.id" class="admin-gestao__event">
            <span class="admin-gestao__event-name">
              {{ ev.name }} (×{{ ev.multiplier }})
              <small v-if="!ev.active"> — inativo</small>
            </span>
            <span class="admin-gestao__event-dates">
              {{ ev.starts_at.slice(0, 10) }} → {{ ev.ends_at.slice(0, 10) }}
            </span>
            <button type="button" @click="onToggleEvent(ev)">
              {{ ev.active ? 'Desativar' : 'Ativar' }}
            </button>
            <button v-if="ev.active" type="button" @click="onDeactivateEvent(ev)">Encerrar</button>
          </li>
        </ul>
      </section>

      <!-- Pool de tasks -->
      <section class="admin-gestao__section">
        <h2>Tasks semanais (pool)</h2>
        <p v-if="tasksLoading">Carregando pool…</p>
        <template v-else>
          <div v-for="(task, i) in tasks" :key="task.id" class="admin-gestao__task">
            <input v-model="task.description" placeholder="Descrição" />
            <button type="button" :disabled="tasks.length <= 3" @click="removeTask(i)">
              Remover
            </button>
          </div>
          <button type="button" @click="addTask">+ Adicionar task</button>
          <button
            type="button"
            data-testid="tasks-submit"
            :disabled="tasksSaving"
            @click="onSaveTasks"
          >
            {{ tasksSaving ? 'Salvando…' : 'Salvar pool' }}
          </button>
          <p v-if="tasksFeedback" class="admin-gestao__feedback">
            {{ tasksFeedback }}
          </p>
        </template>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .admin-gestao {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;

    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 1.3rem;
      margin: 0 0 1rem;
    }

    &__section {
      margin-bottom: 3rem;
      padding: 1.5rem;
      border: 1px solid var(--piano-border);
      border-radius: var(--piano-radius-md);
      background: var(--piano-bg-secondary);
    }

    &__event-form {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    &__event-form input {
      padding: 0.5rem;
      border: 1px solid var(--piano-border);
      border-radius: var(--piano-radius-sm);
    }

    &__events {
      list-style: none;
      padding: 0;
    }

    &__event {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid var(--piano-border);
    }

    &__event-name {
      flex: 1;
    }

    &__event-dates {
      color: var(--piano-text-muted);
      font-size: 0.85rem;
    }

    &__task {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    &__task input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--piano-border);
      border-radius: var(--piano-radius-sm);
    }

    &__error {
      color: #c0392b;
    }

    &__feedback {
      color: var(--piano-accent);
    }

    button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--piano-accent);
      background: transparent;
      color: var(--piano-accent);
      border-radius: var(--piano-radius-sm);
      cursor: pointer;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
</style>
