<script setup lang="ts">
  import type { MapPoint } from '~/composables/useTelemetryHistory'
  import { projectBrPoint } from '~/utils/brUfCentroids'

  const props = defineProps<{
    points: MapPoint[]
  }>()

  interface Placed extends MapPoint {
    left: number
    top: number
    title: string
  }

  const placed = computed((): Placed[] => {
    const out: Placed[] = []
    for (const p of props.points) {
      const pos = projectBrPoint(p.region, p.city)
      if (!pos) continue
      const place = [p.city, p.region].filter(Boolean).join(' / ')
      out.push({
        ...p,
        ...pos,
        title: `${place} · ${p.devices} acesso(s)${p.is_online ? ' · online agora' : ' · offline (90d)'}`,
      })
    }
    return out
  })

  const onlineCount = computed(() => placed.value.filter((p) => p.is_online).length)
  const offlineCount = computed(() => placed.value.filter((p) => !p.is_online).length)
</script>

<template>
  <div class="tmap">
    <div class="tmap__legend" aria-hidden="true">
      <span><i class="tmap__dot tmap__dot--on" /> Online agora ({{ onlineCount }})</span>
      <span
        ><i class="tmap__dot tmap__dot--off" /> Acesso nos últimos 90 dias ({{
          offlineCount
        }})</span
      >
    </div>
    <div class="tmap__canvas" role="img" aria-label="Mapa do Brasil com acessos">
      <svg class="tmap__br" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <!-- Silhueta simplificada do Brasil (aprox.) -->
        <path
          class="tmap__land"
          d="M42 8 L55 6 L62 10 L70 14 L74 22 L78 30 L80 40 L78 52 L74 62 L68 72 L60 82 L52 88 L44 90 L36 86 L30 78 L26 68 L22 58 L18 48 L16 38 L18 28 L24 18 L32 12 Z"
        />
      </svg>
      <button
        v-for="(p, i) in placed"
        :key="`${p.region}-${p.city ?? ''}-${i}`"
        type="button"
        class="tmap__pin"
        :class="p.is_online ? 'tmap__pin--on' : 'tmap__pin--off'"
        :style="{ left: p.left + '%', top: p.top + '%' }"
        :title="p.title"
        :aria-label="p.title"
      />
    </div>
    <p v-if="!placed.length" class="tmap__empty">
      Ainda não há acessos com cidade/UF no Brasil neste período.
    </p>
  </div>
</template>

<style scoped>
  .tmap {
    display: grid;
    gap: 0.75rem;
  }
  .tmap__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--admin-muted, #64748b);
  }
  .tmap__legend span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .tmap__dot {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    display: inline-block;
  }
  .tmap__dot--on {
    background: #22c55e;
    box-shadow: 0 0 0 3px rgb(34 197 94 / 25%);
  }
  .tmap__dot--off {
    background: #94a3b8;
  }
  .tmap__canvas {
    position: relative;
    width: min(100%, 640px);
    aspect-ratio: 1 / 1.05;
    margin-inline: auto;
    background: linear-gradient(180deg, #e8f1ff 0%, #f8fafc 100%);
    border: 1px solid var(--admin-border, #e2e8f0);
    border-radius: 12px;
    overflow: hidden;
  }
  .tmap__br {
    position: absolute;
    inset: 4% 8%;
    width: 84%;
    height: 92%;
  }
  .tmap__land {
    fill: #c7e0c4;
    stroke: #7a9e76;
    stroke-width: 0.4;
  }
  .tmap__pin {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 0;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: default;
    padding: 0;
  }
  .tmap__pin--on {
    background: #22c55e;
    box-shadow: 0 0 0 4px rgb(34 197 94 / 30%);
    z-index: 2;
  }
  .tmap__pin--off {
    background: #94a3b8;
    opacity: 0.9;
    z-index: 1;
  }
  .tmap__empty {
    text-align: center;
    color: var(--admin-muted, #64748b);
    font-size: 0.9rem;
  }
</style>
