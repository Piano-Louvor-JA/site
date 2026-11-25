import { computed, ref, watch, type Ref } from 'vue'
import type { LibrasState } from '../src/modules/libras/types'
import { getLibrasGloss } from '../src/modules/libras/services/libras-translate'

/**
 * Observa somente a letra atual do player (SPEC fatia 2) — versão Web.
 * - `librasEnabled` lido do cookie Nuxt `libras.enabled` (não do userPreferences do Electron).
 * - desligado (default false): estado disabled, zero trabalho.
 * - cache→API→fallback; falha total → unavailable, nunca lança.
 */
export function useLibrasLyrics(lyrics: Ref<string | null>) {
  const state = ref<LibrasState>('disabled')
  const gloss = ref<string | null>(null)

  // useCookie deve ser chamado dentro do setup/composable (instância Nuxt ativa)
  const librasCookie = useCookie<boolean | null>('libras.enabled', { default: () => null })
  const isLibrasEnabled = computed(() => librasCookie.value === true)

  // Token monotônico anti-stale
  let token = 0

  watch(
    [isLibrasEnabled, lyrics],
    async ([enabled, current]) => {
      const myToken = ++token
      if (!enabled || !current) {
        state.value = 'disabled'
        gloss.value = null
        return
      }
      state.value = 'loading'
      gloss.value = null
      try {
        const result = await getLibrasGloss(current)
        if (myToken !== token) return // stale
        if (result.gloss) {
          gloss.value = result.gloss
          state.value = 'ready'
        } else {
          state.value = 'unavailable'
        }
      } catch {
        if (myToken === token) state.value = 'unavailable'
      }
    },
    { immediate: true },
  )

  function handleLibrasReady(value: string | null) {
    if (value) {
      gloss.value = value
      state.value = 'ready'
    } else {
      gloss.value = null
    }
  }

  return { state, gloss, isLibrasEnabled, handleLibrasReady }
}
