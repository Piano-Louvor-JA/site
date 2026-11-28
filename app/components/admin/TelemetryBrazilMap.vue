<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import type { MapPoint } from '~/composables/useTelemetryHistory'
  import { devicesByUf, heatFill, maxDevices, onlineByUf } from '~/utils/brMapHeat'
  import { BR_UF_NAMES, projectBrPoint } from '~/utils/brUfCentroids'

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

  const MAP_SRC = '/maps/mapa-brazil.svg'
  /** viewBox nativo do mapa-brazil.svg */
  const VB_W = 612.51611
  const VB_H = 639.04297
  const MIN_ZOOM = 1
  const MAX_ZOOM = 5
  /** A partir deste zoom os nomes de cidade aparecem. */
  const LABEL_ZOOM = 1.55

  const svgHost = ref<HTMLElement | null>(null)
  const viewport = ref<HTMLElement | null>(null)
  const svgReady = ref(false)
  const zoom = ref(1)
  /** Origem do viewBox em unidades SVG (não pixels de tela). */
  const panX = ref(0)
  const panY = ref(0)

  let drag: { x: number; y: number; panX: number; panY: number } | null = null

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

  const onlineDevices = computed(() =>
    placed.value.reduce((sum, p) => sum + Math.max(0, p.online), 0),
  )
  const offlineDevices = computed(() =>
    placed.value.reduce((sum, p) => sum + Math.max(0, p.devices - p.online), 0),
  )

  const unmappedOnline = computed(() => {
    const live = props.liveOnline
    if (live == null || !Number.isFinite(live)) return 0
    return Math.max(0, Math.floor(live) - onlineDevices.value)
  })

  const ufTotals = computed(() => devicesByUf(props.points))
  const ufOnline = computed(() => onlineByUf(props.points))
  const ufMax = computed(() => maxDevices(ufTotals.value))

  interface UfLabel {
    uf: string
    name: string
    devices: number
    online: number
    left: number
    top: number
  }

  /** Rótulo por estado: nome + online agora + únicos (90d). */
  const ufLabels = computed((): UfLabel[] => {
    const out: UfLabel[] = []
    for (const [uf, devices] of Object.entries(ufTotals.value)) {
      if (devices <= 0) continue
      const pos = projectBrPoint(uf, null)
      if (!pos) continue
      out.push({
        uf,
        name: BR_UF_NAMES[uf] ?? uf,
        devices,
        online: ufOnline.value[uf] ?? 0,
        left: pos.left,
        top: pos.top,
      })
    }
    return out
  })

  const showCityLabels = computed(() => zoom.value >= LABEL_ZOOM)
  /** Nome do estado some um pouco quando as cidades aparecem, para não poluir. */
  const showUfLabels = computed(() => zoom.value < 2.4)

  const viewBox = computed(() => {
    const vw = VB_W / zoom.value
    const vh = VB_H / zoom.value
    return `${panX.value} ${panY.value} ${vw} ${vh}`
  })

  /** Posição na tela sob o viewBox atual (continua nítido — HTML, não scale). */
  function screenPos(leftPct: number, topPct: number): { left: string; top: string } {
    const vw = VB_W / zoom.value
    const vh = VB_H / zoom.value
    const mapX = (leftPct / 100) * VB_W
    const mapY = (topPct / 100) * VB_H
    const left = ((mapX - panX.value) / vw) * 100
    const top = ((mapY - panY.value) / vh) * 100
    return { left: `${left}%`, top: `${top}%` }
  }

  function markerStyle(p: Placed): { left: string; top: string } {
    return screenPos(p.left, p.top)
  }

  function clampPan(z = zoom.value) {
    const vw = VB_W / z
    const vh = VB_H / z
    panX.value = Math.min(Math.max(0, panX.value), Math.max(0, VB_W - vw))
    panY.value = Math.min(Math.max(0, panY.value), Math.max(0, VB_H - vh))
  }

  function applyViewBox() {
    const svg = svgHost.value?.querySelector('svg')
    if (!svg) return
    svg.setAttribute('viewBox', viewBox.value)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    // Remove tamanho intrínseco que força rasterização baixa
    svg.removeAttribute('width')
    svg.removeAttribute('height')
    svg.style.width = '100%'
    svg.style.height = '100%'
  }

  function applyHeat() {
    const host = svgHost.value
    if (!host) return
    const totals = ufTotals.value
    const max = ufMax.value
    // Traço em unidades SVG: compensado pelo zoom do viewBox para borda nítida na tela
    const stroke = Math.max(0.35, 0.85 / zoom.value)
    for (const path of host.querySelectorAll<SVGPathElement>('path[id^="BR-"]')) {
      const uf = path.id.replace(/^BR-/, '').toUpperCase()
      const n = totals[uf] ?? 0
      path.style.fill = heatFill(n, max)
      path.style.stroke = '#5f865b'
      path.style.strokeWidth = String(stroke)
      path.setAttribute('data-devices', String(n))
      const title = path.getAttribute('title') || uf
      path.setAttribute('aria-label', `${title}: ${n} acesso(s)`)
    }
  }

  async function loadSvg() {
    try {
      const res = await fetch(MAP_SRC)
      if (!res.ok) throw new Error(`mapa HTTP ${res.status}`)
      const raw = await res.text()
      if (svgHost.value) {
        svgHost.value.innerHTML = raw
        svgReady.value = true
        applyViewBox()
        applyHeat()
      }
    } catch {
      svgReady.value = false
    }
  }

  watch([ufTotals, ufMax, svgReady, zoom], () => {
    if (svgReady.value) applyHeat()
  })

  watch([zoom, panX, panY, svgReady], () => {
    if (svgReady.value) applyViewBox()
  })

  onMounted(() => {
    void loadSvg()
  })

  function clampZoom(z: number) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
  }

  function setZoomAt(next: number, clientX?: number, clientY?: number) {
    const el = viewport.value
    const prev = zoom.value
    const z = clampZoom(next)
    if (z === prev) return

    if (el && clientX != null && clientY != null) {
      const rect = el.getBoundingClientRect()
      const fx = (clientX - rect.left) / rect.width
      const fy = (clientY - rect.top) / rect.height
      const mapX = panX.value + fx * (VB_W / prev)
      const mapY = panY.value + fy * (VB_H / prev)
      panX.value = mapX - fx * (VB_W / z)
      panY.value = mapY - fy * (VB_H / z)
    }

    zoom.value = z
    if (z === MIN_ZOOM) {
      panX.value = 0
      panY.value = 0
    } else {
      clampPan(z)
    }
  }

  function zoomBy(delta: number) {
    const el = viewport.value
    if (!el) {
      setZoomAt(zoom.value + delta)
      return
    }
    const rect = el.getBoundingClientRect()
    setZoomAt(zoom.value + delta, rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  function resetView() {
    zoom.value = MIN_ZOOM
    panX.value = 0
    panY.value = 0
  }

  function onWheel(e: WheelEvent) {
    const step = e.deltaY > 0 ? -0.18 : 0.18
    setZoomAt(zoom.value + step, e.clientX, e.clientY)
  }

  function onPointerDown(e: PointerEvent) {
    if (zoom.value <= MIN_ZOOM) return
    const el = viewport.value
    if (!el) return
    el.setPointerCapture(e.pointerId)
    drag = { x: e.clientX, y: e.clientY, panX: panX.value, panY: panY.value }
  }

  function onPointerMove(e: PointerEvent) {
    if (!drag || !viewport.value) return
    const rect = viewport.value.getBoundingClientRect()
    const dx = e.clientX - drag.x
    const dy = e.clientY - drag.y
    // Arraste em pixels → deslocamento no viewBox
    panX.value = drag.panX - dx * (VB_W / zoom.value / rect.width)
    panY.value = drag.panY - dy * (VB_H / zoom.value / rect.height)
    clampPan()
  }

  function onPointerUp(e: PointerEvent) {
    const el = viewport.value
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    drag = null
  }
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
    <div class="tmap__heat" aria-hidden="true">
      <span>Menos acessos</span>
      <i class="tmap__heat-bar" />
      <span>Mais acessos</span>
    </div>
    <p v-if="unmappedOnline > 0" class="tmap__gap">
      {{ unmappedOnline }} online agora sem UF/Brasil no mapa (não dá para posicionar).
    </p>
    <div class="tmap__toolbar">
      <button
        type="button"
        class="tmap__tool"
        title="Afastar"
        aria-label="Afastar"
        @click="zoomBy(-0.35)"
      >
        −
      </button>
      <button
        type="button"
        class="tmap__tool"
        title="Aproximar"
        aria-label="Aproximar"
        @click="zoomBy(0.35)"
      >
        +
      </button>
      <button
        type="button"
        class="tmap__tool tmap__tool--wide"
        title="Resetar zoom"
        aria-label="Resetar zoom"
        @click="resetView"
      >
        1×
      </button>
      <span class="tmap__zoom-readout">{{ zoom.toFixed(1) }}×</span>
    </div>
    <p class="tmap__hint">
      Estado = online agora + únicos (90d) · cidades a partir de {{ LABEL_ZOOM }}× · role / arraste
      para zoom
    </p>
    <div
      ref="viewport"
      class="tmap__canvas"
      :class="{ 'tmap__canvas--grab': zoom > 1 }"
      role="img"
      aria-label="Mapa do Brasil com acessos"
      @wheel.prevent="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div ref="svgHost" class="tmap__br" aria-hidden="true" />
      <div
        v-for="u in ufLabels"
        v-show="showUfLabels"
        :key="`uf-${u.uf}`"
        class="tmap__uf"
        :style="screenPos(u.left, u.top)"
        :title="
          u.online > 0
            ? `${u.name}: ${u.online} online · ${u.devices} único(s) nos últimos 90 dias`
            : `${u.name}: ${u.devices} único(s) nos últimos 90 dias`
        "
      >
        <strong class="tmap__uf-name">{{ u.name.toUpperCase() }}</strong>
        <span v-if="u.online > 0" class="tmap__uf-online">
          <i class="tmap__dot tmap__dot--on" aria-hidden="true" />
          {{ u.online }} online
        </span>
        <span class="tmap__uf-count"
          >{{ u.devices }} único{{ u.devices === 1 ? '' : 's' }} · 90d</span
        >
      </div>
      <div
        v-for="(p, i) in placed"
        :key="`${p.region}-${p.city ?? ''}-${i}`"
        class="tmap__marker"
        :style="markerStyle(p)"
      >
        <button
          type="button"
          class="tmap__pin"
          :class="p.is_online ? 'tmap__pin--on' : 'tmap__pin--off'"
          :title="p.title"
          :aria-label="p.title"
        />
        <span v-if="showCityLabels && p.city" class="tmap__label">{{ p.city }}</span>
      </div>
    </div>
    <p v-if="!placed.length" class="tmap__empty">
      Ainda não há acessos com cidade/UF no Brasil neste período.
    </p>
  </div>
</template>

<style scoped>
  .tmap {
    display: grid;
    gap: 0.55rem;
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
  .tmap__heat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--admin-muted, #64748b);
  }
  .tmap__heat-bar {
    flex: 1;
    max-width: 160px;
    height: 0.55rem;
    border-radius: 999px;
    background: linear-gradient(90deg, #cfe0cc, #15803d);
    display: inline-block;
  }
  .tmap__gap {
    margin: 0;
    font-size: 0.85rem;
    color: var(--admin-muted, #94a3b8);
  }
  .tmap__toolbar {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .tmap__tool {
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--admin-border, #e2e8f0);
    border-radius: 8px;
    background: #fff;
    color: #0f172a;
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
  }
  .tmap__tool--wide {
    width: auto;
    padding: 0 0.65rem;
    font-size: 0.85rem;
  }
  .tmap__zoom-readout {
    margin-left: 0.35rem;
    font-size: 0.8rem;
    color: var(--admin-muted, #64748b);
  }
  .tmap__hint {
    margin: 0;
    font-size: 0.75rem;
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
    width: min(100%, 960px);
    aspect-ratio: 612.51611 / 639.04297;
    margin-inline: auto;
    background: linear-gradient(180deg, #e8f1ff 0%, #f8fafc 100%);
    border: 1px solid var(--admin-border, #e2e8f0);
    border-radius: 12px;
    overflow: hidden;
    touch-action: none;
  }
  .tmap__canvas--grab {
    cursor: grab;
  }
  .tmap__canvas--grab:active {
    cursor: grabbing;
  }
  .tmap__br {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
  }
  .tmap__br :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
    shape-rendering: geometricPrecision;
  }
  .tmap__uf {
    position: absolute;
    z-index: 1;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    pointer-events: none;
    text-align: center;
    max-width: 9rem;
  }
  .tmap__uf-name {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #14532d;
    text-shadow:
      0 0 4px #fff,
      0 0 6px #fff,
      0 1px 0 #fff;
    line-height: 1.15;
  }
  .tmap__uf-online,
  .tmap__uf-count {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    font-size: 0.65rem;
    font-weight: 650;
    color: #1e293b;
    background: rgb(255 255 255 / 92%);
    border: 1px solid rgb(15 23 42 / 12%);
    border-radius: 999px;
    padding: 0.08rem 0.4rem;
    white-space: nowrap;
    box-shadow: 0 1px 2px rgb(15 23 42 / 10%);
  }
  .tmap__uf-online {
    color: #166534;
    border-color: rgb(34 197 94 / 35%);
  }
  .tmap__uf-online .tmap__dot {
    width: 0.45rem;
    height: 0.45rem;
  }
  .tmap__marker {
    position: absolute;
    width: 0;
    height: 0;
    z-index: 2;
  }
  .tmap__pin {
    position: absolute;
    left: 0;
    top: 0;
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
  }
  .tmap__pin--off {
    background: #94a3b8;
    opacity: 0.9;
  }
  .tmap__label {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(-50%, calc(-100% - 10px));
    white-space: nowrap;
    font-size: 13px;
    font-weight: 650;
    letter-spacing: 0.01em;
    color: #0f172a;
    background: rgb(255 255 255 / 96%);
    border: 1px solid rgb(15 23 42 / 16%);
    border-radius: 5px;
    padding: 0.2rem 0.45rem;
    pointer-events: none;
    box-shadow: 0 1px 3px rgb(15 23 42 / 16%);
  }
  .tmap__empty {
    text-align: center;
    color: var(--admin-muted, #64748b);
    font-size: 0.9rem;
  }
</style>
