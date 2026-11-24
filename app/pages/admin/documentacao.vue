<script setup lang="ts">
  /**
   * Editor leigo de documentação (SPEC v1.2 editor-leigo).
   * Voluntário escolhe guia, edita texto (textarea + prints), envia p/ revisão.
   * Servidor cria branch+commit+PR — merge humano. Zero GitHub p/ o usuário.
   */
  import { ref, computed } from 'vue'

  definePageMeta({
    layout: 'admin',
    middleware: 'auth',
  })

  useHead({ title: 'Editar Guias · Piano Louvor JA' })

  const docs = [
    { slug: 'manual', title: 'Manual do PIANO' },
    { slug: 'instalacao', title: 'Instalação' },
    { slug: 'palco', title: 'Palco (TV)' },
    { slug: 'privacidade', title: 'Privacidade' },
  ]
  // ponytail: lista fixa v1 — upgrade: buscar do content/docs via server route
  const docList = ref(docs)

  const slug = ref('')
  const title = ref('')
  const markdown = ref('')
  const images = ref<File[]>([])
  const sending = ref(false)
  const result = ref<{ ok: boolean; text: string; prUrl?: string } | null>(null)

  const maxImages = 6
  const maxImageMb = 5
  const canSend = computed(
    () =>
      !!slug.value &&
      title.value.trim().length >= 3 &&
      markdown.value.trim() !== '' &&
      !sending.value,
  )

  const localErrors = computed(() => {
    const errors: string[] = []
    if (images.value.length > maxImages) errors.push(`Máximo de ${maxImages} imagens`)
    for (const file of images.value) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        errors.push(`${file.name}: formato inválido (use PNG, JPG ou WebP)`)
      }
      if (file.size > maxImageMb * 1024 * 1024) {
        errors.push(`${file.name}: imagem acima de ${maxImageMb}MB`)
      }
    }
    return errors
  })

  function onPickImages(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (files) images.value = [...images.value, ...files].slice(0, maxImages)
  }

  async function send() {
    if (!canSend.value || localErrors.value.length > 0) return
    sending.value = true
    result.value = null
    try {
      const imagePayload = await Promise.all(
        images.value.map((file) => {
          const reader = new FileReader()
          const done = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
            reader.onerror = () => reject(reader.error)
          })
          reader.readAsDataURL(file)
          return done.then((data) => ({ name: file.name, type: file.type, data, size: file.size }))
        }),
      )

      const response = await $fetch<{ prUrl: string }>('/api/docs/propose', {
        method: 'POST',
        body: {
          slug: slug.value,
          title: title.value,
          markdown: markdown.value,
          images: imagePayload,
        },
      })
      result.value = {
        ok: true,
        text: 'Enviado! Um revisor vai aprovar antes de publicar.',
        prUrl: response.prUrl,
      }
      markdown.value = ''
      images.value = []
    } catch (error) {
      const status = (error as { statusCode?: number; statusMessage?: string }) ?? {}
      const text =
        status.statusCode === 429
          ? 'Aguarde alguns minutos antes de enviar outra revisão.'
          : status.statusCode === 503
            ? 'Serviço indisponível. Contate a administração.'
            : 'Falha ao enviar. Revise os campos e tente novamente.'
      result.value = { ok: false, text }
    } finally {
      sending.value = false
    }
  }
</script>

<template>
  <div class="docs-editor">
    <h1>Editar guias de ajuda</h1>
    <p class="hint">
      Escolha o guia, ajuste o texto e envie para revisão. Suas alterações ficam salvas com
      histórico e um revisor aprova antes de aparecer no site.
    </p>

    <label>
      Guia
      <select v-model="slug">
        <option value="" disabled>Selecione o guia…</option>
        <option v-for="doc in docList" :key="doc.slug" :value="doc.slug">{{ doc.title }}</option>
      </select>
    </label>

    <label>
      Título
      <input v-model="title" type="text" maxlength="120" placeholder="Ex.: Como usar o Palco" />
    </label>

    <label>
      Texto (Markdown simples: # título, **negrito**, listas com -)
      <textarea v-model="markdown" rows="16" placeholder="Escreva aqui o conteúdo do guia…" />
    </label>

    <label>
      Prints de tela (até {{ maxImages }} imagens, {{ maxImageMb }}MB cada, PNG/JPG/WebP)
      <input type="file" accept="image/png,image/jpeg,image/webp" multiple @change="onPickImages" />
    </label>
    <ul v-if="images.length" class="picked">
      <li v-for="(image, i) in images" :key="i">
        {{ image.name }}
      </li>
    </ul>
    <p v-for="error in localErrors" :key="error" class="error">
      {{ error }}
    </p>

    <button
      type="button"
      class="btn btn-primary"
      :disabled="!canSend || localErrors.length > 0"
      @click="send"
    >
      {{ sending ? 'Enviando…' : 'Enviar para revisão' }}
    </button>

    <p v-if="result" :class="result.ok ? 'ok' : 'error'" role="status">
      {{ result.text }}
      <a v-if="result.prUrl" :href="result.prUrl" target="_blank" rel="noopener">Ver envio</a>
    </p>
  </div>
</template>

<style scoped>
  .docs-editor {
    max-width: 48rem;
    margin: 0 auto;
    padding: 1.5rem;
    display: grid;
    gap: 1rem;
    color: var(--piano-text-on-dark, #fff);
  }
  .hint {
    color: var(--piano-text-on-dark-muted, rgba(255, 255, 255, 0.7));
  }
  label {
    display: grid;
    gap: 0.35rem;
    font-weight: 600;
  }
  input,
  select,
  textarea {
    background: #131313;
    border: 1px solid #353534;
    border-radius: 8px;
    color: var(--piano-text-on-dark, #fff);
    padding: 0.5rem 0.75rem;
    font: inherit;
    font-size: 0.9rem;
    transition: border-color 0.15s;
  }
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--piano-cyan);
  }
  input::placeholder,
  textarea::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
  textarea {
    font-family: inherit;
    min-height: 16rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid #353534;
    background: #1e1e1e;
    color: var(--piano-text-on-dark, #fff);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    justify-self: start;
    transition:
      border-color 0.15s,
      background 0.15s,
      opacity 0.15s;
  }
  .btn:hover:not(:disabled) {
    border-color: var(--piano-cyan);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-primary {
    background: var(--piano-accent);
    border-color: var(--piano-accent);
    color: #ffffff;
    font-weight: 600;
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--piano-cyan-light);
    border-color: var(--piano-cyan-light);
  }
  .picked {
    margin: 0;
    padding-left: 1.2rem;
    color: var(--piano-text-on-dark-muted, rgba(255, 255, 255, 0.7));
  }
  .error {
    color: #fca5a5;
    margin: 0;
  }
  .ok {
    color: #86efac;
    margin: 0;
  }
  a {
    color: var(--piano-cyan);
  }
</style>
