<script setup lang="ts">
  /**
   * Telemetria — dispositivos online (app/.planning/telemetria-dispositivos, Fase 4).
   * Lista quem mandou sinal à API nos últimos 11 min. Lógica no composable
   * useOnlineDevices (testado); aqui só a apresentação em grade ou lista.
   */
  import {
    locationLabel,
    platformInfo,
    relativeTime,
    type SortKey,
    useOnlineDevices,
  } from '~/composables/useOnlineDevices'
  import {
    RANKING_OPTIONS,
    type RankingDim,
    useTelemetryHistory,
  } from '~/composables/useTelemetryHistory'

  type TeleTab = 'agora' | 'rankings' | 'mapa'

  const {
    devices,
    generatedAt,
    loading,
    error,
    filters,
    sort,
    viewMode,
    summary,
    platformOptions,
    regionOptions,
    districtOptions,
    hasFilters,
    filtered,
    refresh,
    toggleSort,
    clearFilters,
    showUnidentified,
    setViewMode,
    start,
    stop,
  } = useOnlineDevices()

  const {
    history,
    rankings,
    mapPoints,
    loading: histLoading,
    error: histError,
    rankingBy,
    maxRankDevices,
    refresh: refreshHistory,
    setRankingBy,
  } = useTelemetryHistory()

  const tab = ref<TeleTab>('agora')

  // Relógio para "há X min" andar entre uma busca e outra.
  const now = ref(Date.now())
  let clock: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    start()
    void refreshHistory()
    clock = setInterval(() => (now.value = Date.now()), 15_000)
  })
  onUnmounted(() => {
    stop()
    if (clock) clearInterval(clock)
  })

  async function selectTab(next: TeleTab) {
    tab.value = next
    if (next !== 'agora') await refreshHistory()
  }

  async function onRankingChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as RankingDim
    await setRankingBy(value)
  }

  async function refreshAll() {
    await Promise.all([refresh(), refreshHistory()])
  }

  const groupCards = computed(() => [
    {
      key: 'desktop',
      label: 'Desktop',
      icon: 'ti-device-desktop',
      value: summary.value.groups.desktop,
    },
    { key: 'apk', label: 'Celular', icon: 'ti-device-mobile', value: summary.value.groups.apk },
    { key: 'web', label: 'Web', icon: 'ti-world', value: summary.value.groups.web },
    { key: 'palco', label: 'TVs (Palco)', icon: 'ti-device-tv', value: summary.value.groups.palco },
  ])

  const columns: { key: SortKey; label: string }[] = [
    { key: 'church', label: 'Igreja' },
    { key: 'district', label: 'Distrito' },
    { key: 'city', label: 'Cidade/UF' },
    { key: 'platform', label: 'Plataforma' },
    { key: 'app_version', label: 'Versão' },
    { key: 'last_seen', label: 'Último sinal' },
  ]

  function sortIcon(key: SortKey): string {
    if (sort.value.key !== key) return 'ti-arrows-sort'
    return sort.value.dir === 'asc' ? 'ti-sort-ascending' : 'ti-sort-descending'
  }

  function formatTime(iso: string | null): string {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  useHead({ title: 'Admin · Telemetria' })

  definePageMeta({
    layout: 'admin',
    middleware: 'auth',
  })
</script>

<template>
  <div class="tele">
    <header class="tele__head">
      <div>
        <h2 class="tele__title">Telemetria</h2>
        <p class="tele__sub">
          Online agora (11 min) · histórico e mapa dos últimos 90 dias
          <template v-if="generatedAt"> · coleta {{ formatTime(generatedAt) }} </template>
        </p>
      </div>
      <button
        type="button"
        class="tele__refresh"
        :disabled="loading || histLoading"
        @click="refreshAll()"
      >
        <i
          class="ti ti-refresh"
          :class="{ tele__spin: loading || histLoading }"
          aria-hidden="true"
        />
        Atualizar
      </button>
    </header>

    <nav class="tele__tabs" aria-label="Seções da telemetria">
      <button
        type="button"
        class="tele__tab"
        :class="{ 'tele__tab--active': tab === 'agora' }"
        :aria-pressed="tab === 'agora'"
        @click="selectTab('agora')"
      >
        Agora
      </button>
      <button
        type="button"
        class="tele__tab"
        :class="{ 'tele__tab--active': tab === 'rankings' }"
        :aria-pressed="tab === 'rankings'"
        @click="selectTab('rankings')"
      >
        Rankings
      </button>
      <button
        type="button"
        class="tele__tab"
        :class="{ 'tele__tab--active': tab === 'mapa' }"
        :aria-pressed="tab === 'mapa'"
        @click="selectTab('mapa')"
      >
        Mapa Brasil
      </button>
    </nav>

    <div v-if="tab === 'agora' && error && !devices.length" class="tele__state tele__state--error">
      <i class="ti ti-alert-triangle" aria-hidden="true" />
      <p>{{ error }}</p>
      <button type="button" class="tele__retry" @click="refresh()">Tentar novamente</button>
    </div>

    <template v-else-if="tab === 'agora'">
      <p v-if="error" class="tele__warn">
        <i class="ti ti-alert-triangle" aria-hidden="true" /> {{ error }}
      </p>

      <section class="tele__cards" aria-label="Resumo">
        <div class="tele-card tele-card--main">
          <span class="tele-card__label">Online agora</span>
          <span class="tele-card__value">{{ summary.online }}</span>
          <span class="tele-card__hint">{{ summary.identifiedPct }}% identificados (token)</span>
        </div>
        <button
          type="button"
          class="tele-card tele-card--warn"
          :class="{ 'tele-card--active': filters.identified === 'no' }"
          :aria-pressed="filters.identified === 'no'"
          title="Filtrar dispositivos sem token (app desatualizado)"
          @click="showUnidentified()"
        >
          <span class="tele-card__label"
            ><i class="ti ti-key-off" aria-hidden="true" /> Sem token</span
          >
          <span class="tele-card__value">{{ summary.unidentified }}</span>
          <span class="tele-card__hint">app sem atualizar</span>
        </button>
        <div v-for="card in groupCards" :key="card.key" class="tele-card">
          <span class="tele-card__label"
            ><i :class="['ti', card.icon]" aria-hidden="true" /> {{ card.label }}</span
          >
          <span class="tele-card__value">{{ card.value }}</span>
        </div>
      </section>

      <section class="tele__toolbar" aria-label="Filtros">
        <label class="tele-field tele-field--search">
          <i class="ti ti-search" aria-hidden="true" />
          <input
            v-model="filters.q"
            type="search"
            placeholder="Buscar igreja, distrito ou cidade"
          />
        </label>
        <select v-model="filters.platform" class="tele-field" aria-label="Plataforma">
          <option value="">Todas as plataformas</option>
          <option v-for="p in platformOptions" :key="p" :value="p">
            {{ platformInfo(p).label }}
          </option>
        </select>
        <select v-model="filters.region" class="tele-field" aria-label="UF">
          <option value="">Todas as UFs</option>
          <option v-for="r in regionOptions" :key="r" :value="r">
            {{ r }}
          </option>
        </select>
        <select v-model="filters.district" class="tele-field" aria-label="Distrito">
          <option value="">Todos os distritos</option>
          <option v-for="d in districtOptions" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
        <select v-model="filters.identified" class="tele-field" aria-label="Token">
          <option value="">Token: todos</option>
          <option value="yes">Com token</option>
          <option value="no">Sem token</option>
        </select>
        <button v-if="hasFilters" type="button" class="tele__clear" @click="clearFilters()">
          <i class="ti ti-x" aria-hidden="true" /> Limpar
        </button>

        <div class="tele__views" role="group" aria-label="Visualização">
          <button
            type="button"
            :class="['tele__view', { 'tele__view--active': viewMode === 'grid' }]"
            :aria-pressed="viewMode === 'grid'"
            title="Grade"
            @click="setViewMode('grid')"
          >
            <i class="ti ti-layout-grid" aria-hidden="true" />
          </button>
          <button
            type="button"
            :class="['tele__view', { 'tele__view--active': viewMode === 'list' }]"
            :aria-pressed="viewMode === 'list'"
            title="Lista"
            @click="setViewMode('list')"
          >
            <i class="ti ti-list" aria-hidden="true" />
          </button>
        </div>
      </section>

      <p class="tele__count">{{ filtered.length }} de {{ devices.length }} dispositivo(s)</p>

      <div v-if="loading && !devices.length" class="tele__state">Carregando…</div>

      <div v-else-if="!filtered.length" class="tele__state">
        <i class="ti ti-plug-connected-x" aria-hidden="true" />
        <p>
          {{
            hasFilters
              ? 'Nenhum dispositivo com esses filtros.'
              : 'Nenhum dispositivo online agora.'
          }}
        </p>
      </div>

      <!-- Grade -->
      <ul v-else-if="viewMode === 'grid'" class="tele__grid">
        <li
          v-for="d in filtered"
          :key="d.install_id_short + d.platform"
          class="tele-device"
          :class="{ 'tele-device--warn': !d.identified }"
        >
          <div class="tele-device__top">
            <span class="tele-device__platform">
              <i :class="['ti', platformInfo(d.platform).icon]" aria-hidden="true" />
              {{ platformInfo(d.platform).label }}
            </span>
            <span class="tele-device__seen">
              <span
                class="tele-device__dot"
                :class="{ 'tele-device__dot--warn': !d.identified }"
                aria-hidden="true"
              />
              {{ relativeTime(d.last_seen, now) }}
            </span>
          </div>
          <p class="tele-device__church">
            {{
              d.church || (d.source === 'passive' ? 'App desatualizado' : 'Igreja não informada')
            }}
          </p>
          <p class="tele-device__district">
            {{
              d.district ||
              (d.source === 'passive'
                ? 'Detectado pelo tráfego (sem heartbeat)'
                : 'Distrito não informado')
            }}
          </p>
          <dl class="tele-device__meta">
            <div>
              <dt>
                <i class="ti ti-map-pin" aria-hidden="true" />
              </dt>
              <dd>{{ locationLabel(d) }}</dd>
            </div>
            <div>
              <dt>
                <i class="ti ti-cpu" aria-hidden="true" />
              </dt>
              <dd>{{ d.os || '—' }}</dd>
            </div>
            <div>
              <dt>
                <i class="ti ti-tag" aria-hidden="true" />
              </dt>
              <dd>
                {{ d.app_version ? `v${d.app_version}` : '—' }}
                <span
                  v-if="d.identified"
                  class="tele-device__badge"
                  title="Enviou token de parceiro"
                  >token</span
                >
                <span
                  v-else
                  class="tele-device__badge tele-device__badge--warn"
                  title="Sem token de parceiro — app provavelmente desatualizado"
                  >sem token</span
                >
              </dd>
            </div>
          </dl>
          <span class="tele-device__id" title="Início do ID anônimo da instalação"
            >#{{ d.install_id_short }}</span
          >
        </li>
      </ul>

      <!-- Lista -->
      <div v-else class="tele__table-wrap">
        <table class="tele-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key" scope="col">
                <button type="button" class="tele-table__sort" @click="toggleSort(col.key)">
                  {{ col.label }} <i :class="['ti', sortIcon(col.key)]" aria-hidden="true" />
                </button>
              </th>
              <th scope="col">Sistema</th>
              <th scope="col">ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="d in filtered"
              :key="d.install_id_short + d.platform"
              :class="{ 'tele-table__row--warn': !d.identified }"
            >
              <td class="tele-table__church">
                {{ d.church || (d.source === 'passive' ? 'App desatualizado' : '—') }}
              </td>
              <td>
                {{ d.district || (d.source === 'passive' ? 'Tráfego sem heartbeat' : '—') }}
              </td>
              <td>{{ locationLabel(d) }}</td>
              <td>
                <i :class="['ti', platformInfo(d.platform).icon]" aria-hidden="true" />
                {{ platformInfo(d.platform).label }}
              </td>
              <td>
                {{ d.app_version ? `v${d.app_version}` : '—' }}
                <span v-if="d.identified" class="tele-device__badge">token</span>
                <span v-else class="tele-device__badge tele-device__badge--warn">sem token</span>
              </td>
              <td class="tele-table__seen">
                {{ relativeTime(d.last_seen, now) }}
              </td>
              <td class="tele-table__muted">
                {{ d.os || '—' }}
              </td>
              <td class="tele-table__muted">#{{ d.install_id_short }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else-if="tab === 'rankings'">
      <p v-if="histError" class="tele__warn">
        <i class="ti ti-alert-triangle" aria-hidden="true" /> {{ histError }}
      </p>
      <section v-if="history" class="tele__cards" aria-label="Resumo 90 dias">
        <div class="tele-card tele-card--main">
          <span class="tele-card__label">Vistos em 90 dias</span>
          <span class="tele-card__value">{{ history.totals.seen }}</span>
          <span class="tele-card__hint">{{ history.totals.online }} online agora</span>
        </div>
        <div class="tele-card">
          <span class="tele-card__label">Offline (com histórico)</span>
          <span class="tele-card__value">{{ history.totals.offline_seen }}</span>
        </div>
        <div class="tele-card">
          <span class="tele-card__label">Com igreja</span>
          <span class="tele-card__value">{{ history.totals.with_church }}</span>
        </div>
        <div class="tele-card">
          <span class="tele-card__label">Com geo</span>
          <span class="tele-card__value">{{ history.totals.with_geo }}</span>
        </div>
      </section>

      <section class="tele__toolbar" aria-label="Ranking">
        <label class="tele-field">
          Dimensão
          <select :value="rankingBy" aria-label="Dimensão do ranking" @change="onRankingChange">
            <option v-for="opt in RANKING_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
      </section>

      <div v-if="histLoading && !rankings.length" class="tele__state">Carregando rankings…</div>
      <div v-else-if="!rankings.length" class="tele__state">
        Sem dados suficientes neste período.
      </div>
      <ol v-else class="tele-rank">
        <li v-for="(item, idx) in rankings" :key="item.key" class="tele-rank__item">
          <span class="tele-rank__pos">{{ idx + 1 }}</span>
          <div class="tele-rank__body">
            <div class="tele-rank__row">
              <strong>{{ item.label }}</strong>
              <span>{{ item.devices }} · {{ item.online }} online</span>
            </div>
            <div class="tele-rank__bar" aria-hidden="true">
              <span
                class="tele-rank__fill"
                :style="{
                  width: maxRankDevices
                    ? Math.round((item.devices / maxRankDevices) * 100) + '%'
                    : '0%',
                }"
              />
            </div>
          </div>
        </li>
      </ol>
    </template>

    <template v-else>
      <p v-if="histError" class="tele__warn">
        <i class="ti ti-alert-triangle" aria-hidden="true" /> {{ histError }}
      </p>
      <p class="tele__sub tele__map-hint">
        Verde = online agora · Cinza = teve acesso nos últimos 90 dias e está offline · só Brasil
        com UF (sem localização não entra no mapa)
      </p>
      <div v-if="histLoading && !mapPoints.length" class="tele__state">Carregando mapa…</div>
      <AdminTelemetryBrazilMap v-else :points="mapPoints" :live-online="summary.online" />
    </template>
  </div>
</template>

<style scoped lang="scss">
  .tele {
    padding: 1.5rem 2rem;
    color: #e5e2e1;

    @media (max-width: 600px) {
      padding: 1rem;
    }

    &__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    &__tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    &__tab {
      border: 1px solid rgb(255 255 255 / 12%);
      background: rgb(255 255 255 / 4%);
      color: #bfc7d4;
      border-radius: 999px;
      padding: 0.35rem 0.9rem;
      font-size: 0.85rem;
      cursor: pointer;

      &--active {
        background: #e0895a;
        border-color: #e0895a;
        color: #131313;
        font-weight: 600;
      }
    }

    &__map-hint {
      margin-bottom: 0.75rem;
    }

    &__title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
    }

    &__sub {
      font-size: 0.8rem;
      color: #bfc7d4;
      opacity: 0.8;
      margin: 0;
    }

    &__refresh,
    &__retry {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #e0895a;
      color: #131313;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;

      &:disabled {
        opacity: 0.6;
        cursor: default;
      }
    }

    &__spin {
      animation: tele-spin 1s linear infinite;
    }

    &__state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 3rem 1rem;
      color: #bfc7d4;

      i {
        font-size: 2rem;
        opacity: 0.6;
      }

      &--error {
        color: #fca5a5;
      }
    }

    &__warn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin: 0 0 1rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
      font-size: 0.85rem;
    }

    &__cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    &__toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.75rem;
    }

    &__clear {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: transparent;
      border: 1px solid #353534;
      border-radius: 8px;
      color: #bfc7d4;
      padding: 0.45rem 0.75rem;
      cursor: pointer;

      &:hover {
        color: #e0895a;
        border-color: #e0895a;
      }
    }

    &__views {
      display: inline-flex;
      margin-left: auto;
      border: 1px solid #353534;
      border-radius: 8px;
      overflow: hidden;
    }

    &__view {
      background: transparent;
      border: none;
      color: #bfc7d4;
      padding: 0.45rem 0.7rem;
      font-size: 1.05rem;
      cursor: pointer;

      &--active {
        background: #e0895a;
        color: #131313;
      }
    }

    &__count {
      font-size: 0.8rem;
      color: #8a93a1;
      margin: 0 0 0.75rem;
    }

    &__grid {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1rem;
    }

    &__table-wrap {
      overflow-x: auto;
      border: 1px solid #353534;
      border-radius: 12px;
    }
  }

  .tele-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: #1e1e1e;
    border: 1px solid #353534;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    text-align: left;
    color: inherit;
    font: inherit;

    &--main {
      border-color: rgba(224, 137, 90, 0.55);
      background: linear-gradient(135deg, rgba(224, 137, 90, 0.14), #1e1e1e 70%);
    }

    &--warn {
      border-color: rgba(251, 191, 36, 0.45);
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), #1e1e1e 70%);
      cursor: pointer;

      &:hover,
      &.tele-card--active {
        border-color: rgba(251, 191, 36, 0.85);
      }

      .tele-card__value {
        color: #fbbf24;
      }
    }

    &__label {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #bfc7d4;
    }

    &__value {
      font-size: 1.9rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: #e5e2e1;
    }

    &--main &__value {
      color: #e0895a;
    }

    &__hint {
      font-size: 0.75rem;
      color: #8a93a1;
    }
  }

  .tele-field {
    background: #1e1e1e;
    border: 1px solid #353534;
    border-radius: 8px;
    color: #e5e2e1;
    padding: 0.45rem 0.6rem;
    font-size: 0.85rem;

    &--search {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      flex: 1 1 240px;

      input {
        flex: 1;
        min-width: 0;
        background: transparent;
        border: none;
        color: inherit;
        outline: none;
        font-size: 0.85rem;
      }
    }

    &:focus-within {
      border-color: #e0895a;
    }
  }

  .tele-device {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    background: #1e1e1e;
    border: 1px solid #353534;
    border-radius: 12px;
    padding: 1rem 1.1rem 1.6rem;
    transition: border-color 0.2s;

    &:hover {
      border-color: rgba(224, 137, 90, 0.55);
    }

    &--warn {
      border-color: rgba(251, 191, 36, 0.35);

      &:hover {
        border-color: rgba(251, 191, 36, 0.7);
      }
    }

    &__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      color: #bfc7d4;
    }

    &__platform {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 600;

      i {
        font-size: 1rem;
        color: #e0895a;
      }
    }

    &__seen {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    &__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);

      &--warn {
        background: #fbbf24;
        box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
      }
    }

    &__church {
      margin: 0.35rem 0 0;
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.3;
    }

    &__district {
      margin: 0;
      font-size: 0.85rem;
      color: #bfc7d4;
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0.5rem 0 0;
      font-size: 0.8rem;
      color: #bfc7d4;

      div {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }

      dt {
        color: #8a93a1;
      }

      dd {
        margin: 0;
      }
    }

    &__badge {
      margin-left: 0.3rem;
      padding: 0.05rem 0.4rem;
      border-radius: 999px;
      background: rgba(120, 214, 210, 0.15);
      color: #78d6d2;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;

      &--warn {
        background: rgba(251, 191, 36, 0.18);
        color: #fbbf24;
      }
    }

    &__id {
      position: absolute;
      right: 0.9rem;
      bottom: 0.5rem;
      font-size: 0.7rem;
      color: #6b7280;
      font-family: ui-monospace, monospace;
    }
  }

  .tele-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;

    th,
    td {
      padding: 0.6rem 0.8rem;
      text-align: left;
      border-bottom: 1px solid #2a2a29;
      white-space: nowrap;
    }

    th {
      background: #1a1a1a;
      color: #bfc7d4;
      font-weight: 600;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    tbody tr:hover {
      background: rgba(224, 137, 90, 0.06);
    }

    &__row--warn {
      background: rgba(251, 191, 36, 0.04);
    }

    &__sort {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      text-transform: inherit;
      letter-spacing: inherit;
      cursor: pointer;
      padding: 0;

      &:hover {
        color: #e0895a;
      }
    }

    &__church {
      font-weight: 600;
    }

    &__seen {
      color: #22c55e;
    }

    &__muted {
      color: #8a93a1;
    }
  }

  .tele-rank {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.55rem;

    &__item {
      display: grid;
      grid-template-columns: 2rem 1fr;
      gap: 0.75rem;
      align-items: center;
      background: rgb(255 255 255 / 4%);
      border: 1px solid rgb(255 255 255 / 8%);
      border-radius: 10px;
      padding: 0.65rem 0.85rem;
    }

    &__pos {
      font-weight: 700;
      color: #e0895a;
      text-align: center;
    }

    &__body {
      display: grid;
      gap: 0.35rem;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      font-size: 0.9rem;

      span {
        color: #bfc7d4;
        white-space: nowrap;
      }
    }

    &__bar {
      height: 6px;
      border-radius: 999px;
      background: rgb(255 255 255 / 8%);
      overflow: hidden;
    }

    &__fill {
      display: block;
      height: 100%;
      background: #e0895a;
      border-radius: inherit;
    }
  }

  @keyframes tele-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
