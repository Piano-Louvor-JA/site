/**
 * Snapshots estáticos de último recurso — dados REAIS capturados da GitHub API
 * e congelados no código. Usados APENAS quando:
 *   1. a GitHub API está indisponível (429/5xx/network), E
 *   2. o cache em memória expirou sem valor válido.
 *
 * COMO ATUALIZAR: quando lançar release nova, rode o script
 * `scripts/refresh-snapshots.mjs` (F4) ou atualize manualmente os campos abaixo.
 * Cada snapshot carrega `snapshotDate` pra debug de obsolescência.
 *
 * Hierarquia de fallback (todos os endpoints github):
 *   cache quente (5min) → GitHub API → cache STALE (expirado) → ESTE ARQUIVO → null/erro
 */

export const LATEST_APP_SNAPSHOT = {
  tag_name: 'v1.29.0',
  snapshotDate: '2026-09-29',
  assets: [
    {
      name: 'LouvorJA-PIANO-1.29.0-x86_64.AppImage',
      browser_download_url:
        'https://github.com/Piano-Louvor-JA/app/releases/download/v1.29.0/LouvorJA-PIANO-1.29.0-x86_64.AppImage',
      size: 199091382,
    },
    {
      name: 'LouvorJA-PIANO-1.29.0-arm64.AppImage',
      browser_download_url:
        'https://github.com/Piano-Louvor-JA/app/releases/download/v1.29.0/LouvorJA-PIANO-1.29.0-arm64.AppImage',
      size: 198833694,
    },
    {
      name: 'LouvorJA-PIANO-1.29.0-x64.exe',
      browser_download_url:
        'https://github.com/Piano-Louvor-JA/app/releases/download/v1.29.0/LouvorJA-PIANO-1.29.0-x64.exe',
      size: 157030238,
    },
    {
      name: 'LouvorJA-PIANO-1.29.0-arm64.dmg',
      browser_download_url:
        'https://github.com/Piano-Louvor-JA/app/releases/download/v1.29.0/LouvorJA-PIANO-1.29.0-arm64.dmg',
      size: 190417458,
    },
    {
      name: 'LouvorJA-PIANO-1.29.0-x64.dmg',
      browser_download_url:
        'https://github.com/Piano-Louvor-JA/app/releases/download/v1.29.0/LouvorJA-PIANO-1.29.0-x64.dmg',
      size: 192186380,
    },
  ],
} as const

/** Total de instalações do ecossistema no momento do snapshot (app+apk+palco-receiver). */
export const TOTAL_INSTALLS_SNAPSHOT = {
  total: 619,
  snapshotDate: '2026-09-29',
} as const
