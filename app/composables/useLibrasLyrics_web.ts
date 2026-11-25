import { computed, ref, watch, type Ref } from 'vue'
import type { LibrasState } from '../types'
import { normalizeLyrics } from '../types'
// Adaptação Web: usa useCookie do Nuxt em vez de isLibrasEnabled do app
import { useCookie } from '#app' // <-- Nova dependência Nuxt
const isLibrasEnabled = computed(() => useCookie('libras.enabled').value === true)
import { useCookie } from '#app' // <-- Nova dependência Nuxt
const isLibrasEnabled = computed(() => useCookie('libras.enabled').value === true)
import { getLibrasGloss } from '../services/libras-translate'

// Adicionar handleLibrasReady no composable
const handleLibrasReady = (gloss: string | null) => {
  if (gloss) {
    gloss.value = gloss
  } else {
    // Degradação silenciosa (SPEC §7)
    gloss.value = null
  }
}

/**
 * Observa somente a letra atual do player (SPEC fatia 2).
 * - desligado (default false): estado disabled, zero trabalho.
 * - letra null/vazia: disabled.
 * - cache→API→fallback; falha total → unavailable, nunca lança.
 * - troca de letra invalida render anterior via token monotônico.
 */
export function useLibrasLyrics(lyrics: Ref<string | null>) {
  const state = ref<LibrasState>('disabled')
  const gloss = ref<string | null>(null)
// ... restante do arquivo
