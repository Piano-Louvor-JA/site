/** Escala de calor do mapa BR (acessos por UF). */

const BASE = { r: 207, g: 224, b: 204 } // #cfe0cc
const HOT = { r: 21, g: 128, b: 61 } // #15803d

export function heatFill(count: number, max: number): string {
  if (count <= 0 || max <= 0) return `rgb(${BASE.r}, ${BASE.g}, ${BASE.b})`
  const t = Math.min(1, Math.max(0, count / max))
  // curva suave: poucos acessos já escurecem um pouco
  const e = Math.pow(t, 0.65)
  const r = Math.round(BASE.r + (HOT.r - BASE.r) * e)
  const g = Math.round(BASE.g + (HOT.g - BASE.g) * e)
  const b = Math.round(BASE.b + (HOT.b - BASE.b) * e)
  return `rgb(${r}, ${g}, ${b})`
}

/** Agrega dispositivos por UF (maiúscula). */
export function devicesByUf(
  points: ReadonlyArray<{ region: string; devices: number }>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const p of points) {
    const uf = p.region.trim().toUpperCase()
    if (!uf) continue
    out[uf] = (out[uf] ?? 0) + Math.max(0, p.devices)
  }
  return out
}

/** Agrega online agora por UF (maiúscula). */
export function onlineByUf(
  points: ReadonlyArray<{ region: string; online: number }>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const p of points) {
    const uf = p.region.trim().toUpperCase()
    if (!uf) continue
    out[uf] = (out[uf] ?? 0) + Math.max(0, p.online)
  }
  return out
}

export function maxDevices(byUf: Record<string, number>): number {
  let m = 0
  for (const n of Object.values(byUf)) if (n > m) m = n
  return m
}
