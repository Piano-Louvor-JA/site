<script setup lang="ts">
  interface InfraPayload {
    generated_at: number
    ram: { total: number; available: number; used_pct: number }
    disk: { total: number; free: number; used_pct: number }
    load1: number
    containers_running: string
    services: Record<string, string>
  }

  const { $firebaseAuth } = useNuxtApp() as unknown as {
    $firebaseAuth: { currentUser: { getIdToken: () => Promise<string> } | null }
  }

  const data = ref<InfraPayload | null>(null)
  const loading = ref(true)
  const errorMsg = ref('')

  function statusClass(pct: number): string {
    if (pct > 90) return 'infra-card__pct--critical'
    if (pct >= 80) return 'infra-card__pct--warning'
    return 'infra-card__pct--ok'
  }

  function serviceOk(code: string): boolean {
    const n = Number.parseInt(code, 10)
    return n >= 200 && n < 400
  }

  function formatBytes(bytes: number): string {
    const gb = bytes / 1024 ** 3
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 ** 2).toFixed(0)} MB`
  }

  function formatTimestamp(unix: number): string {
    return new Date(unix * 1000).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  async function load(): Promise<void> {
    errorMsg.value = ''
    try {
      const user = $firebaseAuth.currentUser
      if (!user) throw new Error('sem sessão')
      const token = await user.getIdToken()
      const res = await fetch('/api/admin/infra', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          statusMessage?: string
          message?: string
        } | null
        errorMsg.value = body?.statusMessage || body?.message || `Erro ${res.status}`
        return
      }
      data.value = (await res.json()) as InfraPayload
    } catch {
      errorMsg.value = 'infra inacessível'
    } finally {
      loading.value = false
    }
  }

  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    void load()
    timer = setInterval(() => void load(), 60_000)
  })
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  useHead({ title: 'Admin · Infra' })

  definePageMeta({
    layout: 'admin',
  })
</script>

<template>
  <div class="infra">
    <h2 class="infra__title">Infraestrutura — VM Oracle</h2>

    <div v-if="loading && !data" class="infra__state">Carregando…</div>

    <div v-else-if="errorMsg" class="infra__state infra__state--error">
      <i class="ti ti-alert-triangle" aria-hidden="true" />
      <p>{{ errorMsg }}</p>
      <button type="button" class="infra__retry" @click="load()">Tentar novamente</button>
    </div>

    <template v-else-if="data">
      <p class="infra__collected">
        Coleta: {{ formatTimestamp(data.generated_at) }} · atualiza a cada 60s
      </p>

      <div class="infra__cards">
        <div class="infra-card">
          <span class="infra-card__label">Disco</span>
          <span :class="['infra-card__pct', statusClass(data.disk.used_pct)]">
            {{ data.disk.used_pct.toFixed(1) }}%
          </span>
          <span class="infra-card__hint"> {{ formatBytes(data.disk.free) }} livres </span>
        </div>

        <div class="infra-card">
          <span class="infra-card__label">RAM</span>
          <span :class="['infra-card__pct', statusClass(data.ram.used_pct)]">
            {{ data.ram.used_pct.toFixed(1) }}%
          </span>
          <span class="infra-card__hint"> {{ formatBytes(data.ram.available) }} disponíveis </span>
        </div>

        <div class="infra-card">
          <span class="infra-card__label">Load 1min</span>
          <span
            :class="[
              'infra-card__pct',
              data.load1 > 4
                ? 'infra-card__pct--critical'
                : data.load1 > 2
                  ? 'infra-card__pct--warning'
                  : 'infra-card__pct--ok',
            ]"
          >
            {{ data.load1.toFixed(2) }}
          </span>
          <span class="infra-card__hint">média do host</span>
        </div>

        <div class="infra-card">
          <span class="infra-card__label">Containers</span>
          <span class="infra-card__pct infra-card__pct--ok">
            {{ data.containers_running }}
          </span>
          <span class="infra-card__hint">rodando</span>
        </div>
      </div>

      <h3 class="infra__services-title">Serviços</h3>
      <ul class="infra__services">
        <li v-for="(code, name) in data.services" :key="name" class="infra-service">
          <span class="infra-service__name">{{ name }}</span>
          <span
            :class="[
              'infra-service__badge',
              serviceOk(code) ? 'infra-service__badge--ok' : 'infra-service__badge--down',
            ]"
          >
            {{ serviceOk(code) ? '🟢' : '🔴' }} {{ code }}
          </span>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .infra {
    padding: 1.5rem 2rem;
    color: #e5e2e1;

    &__title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 1rem;
    }

    &__collected {
      font-size: 0.8rem;
      color: #bfc7d4;
      opacity: 0.8;
      margin: 0 0 1rem;
    }

    &__state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 3rem 1rem;
      color: #bfc7d4;

      &--error {
        color: #fca5a5;
      }
    }

    &__retry {
      background: #e0895a;
      color: #131313;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-weight: 600;
      cursor: pointer;
    }

    &__cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    &__services-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
    }

    &__services {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
    }
  }

  .infra-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: #1e1e1e;
    border: 1px solid #353534;
    border-radius: 12px;
    padding: 1rem 1.25rem;

    &__label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #bfc7d4;
    }

    &__pct {
      font-size: 1.75rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;

      &--ok {
        color: #22c55e;
      }
      &--warning {
        color: #e0895a;
      }
      &--critical {
        color: #ef4444;
      }
    }

    &__hint {
      font-size: 0.75rem;
      color: #8a93a1;
    }
  }

  .infra-service {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    background: #1e1e1e;
    border: 1px solid #353534;
    border-radius: 10px;
    padding: 0.6rem 0.9rem;

    &__name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #e5e2e1;
    }

    &__badge {
      font-size: 0.8rem;
      font-weight: 700;

      &--ok {
        color: #22c55e;
      }
      &--down {
        color: #ef4444;
      }
    }
  }
</style>
