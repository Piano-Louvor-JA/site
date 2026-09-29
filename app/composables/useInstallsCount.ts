import { ref } from 'vue'

/**
 * Busca o total de instalações (soma de downloads de assets de release no GitHub)
 * via GET /api/github/total-downloads.
 *
 * Fallback "0" — nunca congela um número antigo em caso de erro.
 * Formata em pt-BR (1.234).
 *
 * A API pode devolver total como number (legado) ou como objeto
 * { total: number, apps: [...] } (formato atual do agregador) — normaliza aqui.
 */
export function useInstallsCount() {
  const installsNum = ref('0')
  const installsRaw = ref(0)
  const loaded = ref(false)

  async function load(): Promise<void> {
    try {
      const data = await $fetch<{ total: number | { total: number } | null }>(
        '/api/github/total-downloads',
      )
      let raw: number | null = null
      if (typeof data.total === 'number') {
        raw = data.total
      } else if (data.total && typeof data.total === 'object' && typeof data.total.total === 'number') {
        raw = data.total.total
      }
      if (raw !== null && raw > 0) {
        installsRaw.value = raw
        installsNum.value = raw.toLocaleString('pt-BR')
      }
    } catch {
      // mantém fallback "0"
    } finally {
      loaded.value = true
    }
  }

  return { installsNum, installsRaw, loaded, load }
}
