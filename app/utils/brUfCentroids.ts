/**
 * Centroides aproximados (lat, lng) das UFs — só para posicionar bolinhas
 * no mapa admin de telemetria. Não é geocoding oficial.
 */
export const BR_UF_CENTROIDS: Record<string, readonly [number, number]> = {
  AC: [-9.02, -70.81],
  AL: [-9.57, -36.78],
  AM: [-3.47, -65.1],
  AP: [1.41, -51.77],
  BA: [-13.29, -41.71],
  CE: [-5.2, -39.53],
  DF: [-15.78, -47.93],
  ES: [-19.19, -40.34],
  GO: [-15.98, -49.86],
  MA: [-5.42, -45.44],
  MG: [-18.1, -44.38],
  MS: [-20.77, -54.78],
  MT: [-12.64, -55.42],
  PA: [-3.79, -52.48],
  PB: [-7.28, -36.72],
  PE: [-8.38, -37.86],
  PI: [-6.6, -42.28],
  PR: [-24.89, -51.55],
  RJ: [-22.25, -42.66],
  RN: [-5.81, -36.59],
  RO: [-10.83, -63.34],
  RR: [1.99, -61.33],
  RS: [-30.17, -53.5],
  SC: [-27.45, -50.95],
  SE: [-10.57, -37.45],
  SP: [-22.19, -48.79],
  TO: [-9.46, -48.26],
}

/** Bounding box aproximado do Brasil continental (para % no mapa). */
const LAT_MAX = 5.3
const LAT_MIN = -33.8
const LNG_MIN = -74.0
const LNG_MAX = -34.0

function hashOffset(seed: string): { dLat: number; dLng: number } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const a = ((h >>> 0) % 1000) / 1000
  const b = (((h >>> 8) >>> 0) % 1000) / 1000
  return { dLat: (a - 0.5) * 1.6, dLng: (b - 0.5) * 1.6 }
}

export function projectBrPoint(
  region: string,
  city: string | null,
): { left: number; top: number } | null {
  const uf = region.trim().toUpperCase()
  const base = BR_UF_CENTROIDS[uf]
  if (!base) return null
  let [lat, lng] = base
  if (city) {
    const { dLat, dLng } = hashOffset(`${uf}|${city.toLowerCase()}`)
    lat += dLat
    lng += dLng
  }
  const left = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100
  const top = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100
  return {
    left: Math.min(98, Math.max(2, left)),
    top: Math.min(98, Math.max(2, top)),
  }
}
