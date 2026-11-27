<script setup lang="ts">
  import type { MapPoint } from '~/composables/useTelemetryHistory'
  import { projectBrPoint } from '~/utils/brUfCentroids'

  const props = defineProps<{
    points: MapPoint[]
    /** Total “online agora” da aba Agora (todos os dispositivos). */
    liveOnline?: number
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

  /** Dispositivos online nos pontos colocados no mapa (não o nº de bolinhas). */
  const onlineDevices = computed(() =>
    placed.value.reduce((sum, p) => sum + Math.max(0, p.online), 0),
  )
  /** Dispositivos do período no mapa que não estão online agora. */
  const offlineDevices = computed(() =>
    placed.value.reduce((sum, p) => sum + Math.max(0, p.devices - p.online), 0),
  )

  const unmappedOnline = computed(() => {
    const live = props.liveOnline
    if (live == null || !Number.isFinite(live)) return 0
    return Math.max(0, Math.floor(live) - onlineDevices.value)
  })
</script>

<template>
  <div class="tmap">
    <div class="tmap__legend" aria-hidden="true">
      <span><i class="tmap__dot tmap__dot--on" /> Online agora ({{ onlineDevices }})</span>
      <span
        ><i class="tmap__dot tmap__dot--off" /> Acesso nos últimos 90 dias ({{
          offlineDevices
        }})</span
      >
    </div>
    <p v-if="unmappedOnline > 0" class="tmap__gap">
      {{ unmappedOnline }} online agora sem UF/Brasil no mapa (não dá para posicionar).
    </p>
    <div class="tmap__canvas" role="img" aria-label="Mapa do Brasil com acessos">
      <img
        class="tmap__br"
        src="/maps/mapa-brazil.svg"
        alt=""
        width="613"
        height="639"
        draggable="false"
      />
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
  .tmap__gap {
    margin: 0;
    font-size: 0.85rem;
    color: var(--admin-muted, #94a3b8);
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
    width: min(100%, 560px);
    /* Proporção do mapa-brazil.svg (612.51611 × 639.04297) */
    aspect-ratio: 612.51611 / 639.04297;
    margin-inline: auto;
    background: linear-gradient(180deg, #e8f1ff 0%, #f8fafc 100%);
    border: 1px solid var(--admin-border, #e2e8f0);
    border-radius: 12px;
    overflow: hidden;
  }
  .tmap__br {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    pointer-events: none;
    user-select: none;
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
