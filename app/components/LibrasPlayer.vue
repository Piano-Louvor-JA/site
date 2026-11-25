<script setup lang="ts">
  import { toRef } from 'vue'
  import { useLibrasLyrics } from '../composables/useLibrasLyrics_web'

  const props = defineProps<{ lyrics: string | null }>()
  const { state, gloss } = useLibrasLyrics(toRef(props, 'lyrics'))
</script>

<template>
  <section
    v-if="state === 'ready' && gloss"
    data-testid="libras-player"
    role="region"
    aria-label="Libras — tradução automática da letra"
  >
    <p data-testid="libras-auto-notice">Tradução automática — Libras</p>
    <p data-testid="libras-gloss" aria-live="polite">
      {{ gloss }}
    </p>
  </section>
</template>

<style scoped lang="scss">
  // O estilo do player é gerenciado pela folha principal, mas mantemos o bloco aqui por consistência.
</style>
