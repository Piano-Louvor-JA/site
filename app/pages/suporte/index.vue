<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useTicketsApi } from '~/composables/useTicketsApi'

  const { t } = useI18n()
  const localePath = useLocalePath()

  useAppHead({
    title: t('tickets.intake.title'),
    description: t('tickets.intake.description'),
    path: '/suporte',
  })

  const api = useTicketsApi()
  const form = ref({ name: '', email: '', subject: '', message: '' })
  const consent = ref(false)
  const honeypot = ref('')
  const sending = ref(false)
  const error = ref('')
  const protocol = ref('')

  async function submit() {
    error.value = ''
    if (honeypot.value) return // bot
    if (!consent.value) {
      error.value = t('tickets.intake.consentRequired')
      return
    }
    sending.value = true
    try {
      const r = await api.createIntake({
        requester_name: form.value.name,
        requester_email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
        consent_lgpd: true,
      })
      protocol.value = r.protocol
    } catch (e) {
      error.value = e instanceof Error ? e.message : t('tickets.error.api')
    } finally {
      sending.value = false
    }
  }
</script>

<template>
  <div class="tickets-page">
    <section class="tickets-hero">
      <div>
        <h1>{{ $t('tickets.intake.title') }}</h1>
        <p>{{ $t('tickets.intake.description') }}</p>
      </div>
    </section>

    <section class="tickets-content">
      <!-- Sucesso: protocolo -->
      <div v-if="protocol" class="tickets-success" data-testid="intake-protocol">
        <h2>{{ $t('tickets.intake.successTitle') }}</h2>
        <p class="tickets-protocol">
          {{ protocol }}
        </p>
        <p>{{ $t('tickets.intake.successHint') }}</p>
        <button type="button" @click="protocol = ''">
          {{ $t('tickets.intake.newRequest') }}
        </button>
      </div>

      <!-- Formulário -->
      <form v-else class="tickets-form" @submit.prevent="submit">
        <label>
          {{ $t('tickets.intake.name') }}
          <input v-model="form.name" required minlength="2" maxlength="120" autocomplete="name" />
        </label>
        <label>
          {{ $t('tickets.intake.email') }}
          <input v-model="form.email" type="email" required maxlength="200" autocomplete="email" />
        </label>
        <label>
          {{ $t('tickets.intake.subject') }}
          <input
            v-model="form.subject"
            required
            minlength="3"
            maxlength="150"
            data-testid="intake-subject"
          />
        </label>
        <label>
          {{ $t('tickets.intake.message') }}
          <textarea v-model="form.message" required minlength="5" maxlength="5000" rows="6" />
        </label>
        <!-- honeypot: oculto de humanos -->
        <input
          v-model="honeypot"
          type="text"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          style="position: absolute; left: -9999px"
        />
        <label class="tickets-consent">
          <input v-model="consent" type="checkbox" required />
          {{ $t('tickets.intake.consent') }}
        </label>
        <p v-if="error" class="tickets-error" role="alert">
          {{ error }}
        </p>
        <button type="submit" :disabled="sending">
          {{ sending ? $t('tickets.sending') : $t('tickets.intake.submit') }}
        </button>
      </form>

      <aside class="tickets-status">
        <NuxtLink :to="localePath('/suporte/meus-tickets')" class="tickets-portal-link">
          {{ $t('tickets.intake.portalLink') }}
        </NuxtLink>
      </aside>
    </section>
  </div>
</template>
