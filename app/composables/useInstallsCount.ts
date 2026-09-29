import { ref } from 'vue'

/**
 * Busca o total de instalações (soma de downloads de assets de release no GitHub)
 * via GET /api/github/total-downloads.
 *
 * Fallback "0" — nunca congela um número antigo em caso de erro.
 * Formata em pt-BR (1.234).
 */
export function useInstallsCount() {
  const installsNum = ref('0')
  const installsRaw = ref(0)
  const loaded = ref(false)

  async function load(): Promise<void> {
    try {
      const data = await $fetch<{ total: number | null }>('/api/github/total-downloads')
      if (typeof data.total === 'number' && data.total > 0) {
        installsRaw.value = data.total
        installsNum.value = data.total.toLocaleString('pt-BR')
      }
    } catch {
      // mantém fallback "0"
    } finally {
      loaded.value = true
    }
  }

  return { installsNum, installsRaw, loaded, load }
}
