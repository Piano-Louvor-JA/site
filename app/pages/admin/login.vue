<script setup lang="ts">
  import { ref } from 'vue'

  definePageMeta({
    layout: 'admin',
  })

  useHead({
    title: 'Admin · Piano Louvor JA',
  })

  const { login, sendPasswordReset, user, error } = useFirebaseAuth()
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const errorMsg = ref('')
  const showPassword = ref(false)
  const resetMode = ref(false)
  const resetSent = ref(false)

  const returnToLogin = () => {
    resetMode.value = false
    resetSent.value = false
    errorMsg.value = ''
  }

  const openPasswordReset = () => {
    resetMode.value = true
    errorMsg.value = ''
  }

  // If arriving from password reset email (oobCode in URL), redirect to reset page
  const route = useRoute()
  if (route.query.oobCode) {
    navigateTo(`/admin/reset-password${route.fullPath.substring(route.fullPath.indexOf('?'))}`)
  }

  // Redirect if already logged in
  watchEffect(() => {
    if (user.value) {
      navigateTo('/admin')
    }
  })

  const handleSubmit = async () => {
    errorMsg.value = ''
    loading.value = true
    try {
      if (resetMode.value) {
        await sendPasswordReset(email.value)
        resetSent.value = true
      } else {
        await login(email.value, password.value)
        navigateTo('/admin')
      }
    } catch {
      errorMsg.value = resetMode.value
        ? 'Não foi possível enviar o email. Verifique o endereço.'
        : error.value || 'Credenciais inválidas'
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Piano Louvor JA</h1>
        <p>{{ resetMode ? 'Recuperar Senha' : 'Painel Administrativo' }}</p>
      </div>

      <div v-if="resetSent" class="reset-success">
        <i class="ti ti-mail-check" aria-hidden="true" style="font-size: 2.5rem; color: #e0895a" />
        <p>Email de recuperação enviado!</p>
        <p class="reset-hint">
          Verifique sua caixa de entrada (e o spam) e clique no link para redefinir sua senha.
        </p>
        <button class="login-btn" @click="returnToLogin">Voltar ao login</button>
      </div>

      <form v-else class="login-form" @submit.prevent="handleSubmit">
        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@exemplo.com"
            :disabled="loading"
          />
        </div>

        <div v-if="!resetMode" class="field">
          <label for="password">Senha</label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="********"
              :disabled="loading"
            />
            <button
              type="button"
              class="password-toggle"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            >
              <i class="ti" :class="showPassword ? 'ti-eye-off' : 'ti-eye'" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p v-if="errorMsg" class="error">
          {{ errorMsg }}
        </p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{
            loading
              ? resetMode
                ? 'Enviando...'
                : 'Entrando...'
              : resetMode
                ? 'Enviar link de recuperação'
                : 'Entrar'
          }}
        </button>

        <button v-if="!resetMode" type="button" class="reset-link" @click="openPasswordReset">
          Esqueci minha senha
        </button>
        <button v-else type="button" class="reset-link" @click="returnToLogin">
          &larr; Voltar ao login
        </button>
      </form>

      <NuxtLink to="/" class="back-link"> &larr; Voltar ao site </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: #1e1e1e;
    border: 1px solid #353534;
    border-radius: 12px;
    padding: 2.5rem;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
    color: #e0895a;
  }

  .login-header p {
    font-size: 0.875rem;
    color: #bfc7d4;
    margin: 0;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #e5e2e1;
  }

  .field input {
    padding: 0.75rem 1rem;
    background: #242424;
    border: 1px solid #334155;
    border-radius: 8px;
    color: #e5e2e1;
    font-size: 0.9375rem;
    transition: border-color 0.15s;
  }

  .field input:focus {
    outline: none;
    border-color: #e0895a;
  }

  .field input:disabled {
    opacity: 0.5;
  }

  .password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-wrapper input {
    width: 100%;
    padding-right: 2.75rem;
  }

  .password-toggle {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: #8a93a1;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s;
  }

  .password-toggle:hover {
    color: #e0895a;
  }

  .password-toggle i {
    font-size: 1.125rem;
  }

  .error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    font-size: 0.8125rem;
    margin: 0;
  }

  .login-btn {
    padding: 0.75rem 1rem;
    background: #e0895a;
    color: #131313;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
  }

  .login-btn:hover:not(:disabled) {
    background: #c9713f;
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .back-link {
    display: block;
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.8125rem;
    color: #bfc7d4;
    text-decoration: none;
    transition: color 0.15s;
  }

  .back-link:hover {
    color: #e0895a;
  }

  .reset-link {
    display: block;
    text-align: center;
    background: none;
    border: none;
    color: #bfc7d4;
    font-size: 0.8125rem;
    cursor: pointer;
    padding: 0.5rem 0;
    text-decoration: none;
    transition: color 0.15s;
  }

  .reset-link:hover {
    color: #e0895a;
  }

  .reset-success {
    text-align: center;
    padding: 1rem 0;
  }

  .reset-success p {
    color: #e5e2e1;
    font-size: 0.9rem;
    margin: 0.75rem 0 0.25rem;
  }

  .reset-hint {
    font-size: 0.8125rem !important;
    color: #8a93a1 !important;
    margin-top: 0.5rem !important;
  }
</style>
