/**
 * Centroides e cidades (lat, lng) — só para posicionar bolinhas/rótulos
 * no mapa admin de telemetria. Não é geocoding oficial.
 *
 * Projeção = Mercator do MapSVG (`convertGeoToPixel`), alinhada a:
 * mapsvg:geoViewBox="-74.008595 5.275696 -34.789914 -33.743888"
 * (equiretangular desloca o litoral — ex.: São Luís para o interior do MA).
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

/** Nome do estado (exibição no mapa). */
export const BR_UF_NAMES: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MG: 'Minas Gerais',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  PA: 'Pará',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  PI: 'Piauí',
  PR: 'Paraná',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RO: 'Rondônia',
  RR: 'Roraima',
  RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina',
  SE: 'Sergipe',
  SP: 'São Paulo',
  TO: 'Tocantins',
}

/**
 * Posição no mapa SVG (% left/top do viewBox), calibrada ao mapa-brazil.svg.
 * Chave: `UF|nome` normalizado. Capitais + cidades frequentes.
 * (lat/lng puro cai em baía/oceano neste SVG simplificado — ex. São Luís.)
 */
export const BR_CITY_MAP_PCT: Record<string, readonly [number, number]> = {
  // Capitais
  'AC|rio branco': [15.77, 36.81],
  'AL|maceio': [97.66, 36.0],
  'AM|manaus': [35.66, 19.93],
  'AP|macapa': [58.49, 12.22],
  'BA|salvador': [90.71, 44.44],
  'CE|fortaleza': [90.4, 21.15],
  'DF|brasilia': [66.62, 51.4],
  'ES|vitoria': [85.75, 62.97],
  'GO|goiania': [63.09, 53.67],
  // Litoral norte do MA (ilha / ponta), não o centroide do estado
  'MA|sao luis': [74.9, 17.4],
  'MG|belo horizonte': [76.68, 61.99],
  'MS|campo grande': [49.44, 63.43],
  'MT|cuiaba': [45.67, 50.91],
  'PA|belem': [65.18, 15.98],
  'PB|joao pessoa': [99.0, 29.87],
  'PE|recife': [99.0, 32.04],
  'PI|teresina': [79.57, 24.76],
  'PR|curitiba': [63.07, 76.6],
  'RJ|rio de janeiro': [78.53, 69.87],
  'RN|natal': [98.49, 26.61],
  'RO|porto velho': [25.77, 33.8],
  'RR|boa vista': [34.0, 5.4],
  'RS|porto alegre': [58.11, 89.32],
  'SC|florianopolis': [64.62, 82.51],
  'SE|aracaju': [94.12, 39.1],
  'SP|sao paulo': [69.8, 71.55],
  'TO|palmas': [65.49, 37.49],
  // Outras frequentes
  'SP|campinas': [68.71, 69.85],
  'SP|santos': [70.58, 72.62],
  'SP|bertioga': [71.06, 72.35],
  'SP|sao vicente': [70.37, 72.63],
  'RJ|niteroi': [78.88, 69.72],
  'BA|feira de santana': [89.35, 42.51],
  'BA|vitoria da conquista': [84.56, 49.04],
  'MG|uberlandia': [65.61, 59.39],
  'MA|imperatriz': [67.65, 25.81],
  'MA|caxias': [78.14, 24.21],
  'MA|bacabal': [74.5, 22.64],
  'PA|canaa dos carajas': [61.53, 28.22],
}

/** geoViewBox do mapa-brazil.svg (oeste, norte, leste, sul). */
export const BR_MAP_GEO = {
  west: -74.008595,
  north: 5.275696,
  east: -34.789914,
  south: -33.743888,
} as const

/** width/height do mapa-brazil.svg (usados pelo MapSVG na conversão). */
export const BR_MAP_SVG = {
  width: 612.51611,
  height: 639.04297,
} as const

export function normalizeCityKey(city: string): string {
  return city.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/\s+/g, ' ')
}

function hashOffset(seed: string): { dLat: number; dLng: number } {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const a = ((h >>> 0) % 1000) / 1000
  const b = (((h >>> 8) >>> 0) % 1000) / 1000
  // Offset bem leve só quando a cidade não está no catálogo
  return { dLat: (a - 0.5) * 0.55, dLng: (b - 0.5) * 0.55 }
}

/** MapSVG convertGeoToPixel → percentual do viewBox. */
function toPercent(lat: number, lng: number): { left: number; top: number } {
  const { west, east, south } = BR_MAP_GEO
  const { width, height } = BR_MAP_SVG
  const mapLonDelta = east - west
  const latRad = (lat * Math.PI) / 180
  const latBottom = (south * Math.PI) / 180
  const x = (lng - west) * (width / mapLonDelta)
  const world = ((width / mapLonDelta) * 360) / (2 * Math.PI)
  const yBottom = (world / 2) * Math.log((1 + Math.sin(latBottom)) / (1 - Math.sin(latBottom)))
  const y =
    height - ((world / 2) * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad))) - yBottom)
  return {
    left: Math.min(99, Math.max(1, (x / width) * 100)),
    top: Math.min(99, Math.max(1, (y / height) * 100)),
  }
}

export function projectBrPoint(
  region: string,
  city: string | null,
): { left: number; top: number } | null {
  const uf = region.trim().toUpperCase()
  const base = BR_UF_CENTROIDS[uf]
  if (!base) return null

  if (city) {
    const key = `${uf}|${normalizeCityKey(city)}`
    const known = BR_CITY_MAP_PCT[key]
    if (known) {
      return {
        left: Math.min(99, Math.max(1, known[0])),
        top: Math.min(99, Math.max(1, known[1])),
      }
    }
    // Cidade desconhecida: centroide da UF + offset leve (não inventa geografia)
    const { dLat, dLng } = hashOffset(key)
    return toPercent(base[0] + dLat, base[1] + dLng)
  }

  return toPercent(base[0], base[1])
}
