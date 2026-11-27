/**
 * Centroides aproximados (lat, lng) das UFs — só para posicionar bolinhas
 * no mapa admin de telemetria. Não é geocoding oficial.
 *
 * Projeção alinhada ao geoViewBox do mapa SVG (MapSVG / mapa-brazil.svg):
 * mapsvg:geoViewBox="-74.008595 5.275696 -34.789914 -33.743888"
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

/** geoViewBox do mapa-brazil.svg (oeste, norte, leste, sul). */
export const BR_MAP_GEO = {
  west: -74.008595,
  north: 5.275696,
  east: -34.789914,
  south: -33.743888,
} as const

function hashOffset(seed: string): { dLat: number; dLng: number } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const a = ((h >>> 0) % 1000) / 1000
  const b = (((h >>> 8) >>> 0) % 1000) / 1000
  // Offset leve para espalhar cidades sem sair da UF
  return { dLat: (a - 0.5) * 0.9, dLng: (b - 0.5) * 0.9 }
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
  const { west, north, east, south } = BR_MAP_GEO
  const left = ((lng - west) / (east - west)) * 100
  const top = ((north - lat) / (north - south)) * 100
  return {
    left: Math.min(99, Math.max(1, left)),
    top: Math.min(99, Math.max(1, top)),
  }
}
