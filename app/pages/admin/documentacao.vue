<script setup lang="ts">
  /**
   * Editor leigo de documentação (SPEC v1.3 — seções + preview).
   * Voluntário escolhe guia → carrega markdown atual (GitHub staging via API) →
   * escolhe seção ## (ou guia inteiro) → edita bloco com toolbar MD + preview →
   * remonta MD completo e envia p/ revisão. Merge humano.
   */
  import { ref, computed } from 'vue'
  import {
    extractSections,
    reassemble,
    renderMarkdown,
    splitFrontmatter,
    type DocsSection,
  } from '~/utils/docs-markdown'

  definePageMeta({
    layout: 'admin',
    middleware: 'auth',
  })

  useHead({ title: 'Editar Guias · Piano Louvor JA' })

  // 14 guias reais do content/docs (árvore install/*) — SPEC v1.3
  const docs = [
    { slug: 'manual', title: 'Manual do PIANO' },
    { slug: 'getting-started', title: 'Primeiros passos' },
    { slug: 'faq', title: 'Perguntas frequentes' },
    { slug: 'shortcuts', title: 'Atalhos' },
    { slug: 'troubleshooting', title: 'Problemas comuns' },
    { slug: 'palco-multi-device', title: 'Palco multi-tela' },
    { slug: 'install/windows', title: 'Instalar no Windows' },
    { slug: 'install/linux', title: 'Instalar no Linux' },
    { slug: 'install/macos', title: 'Instalar no macOS' },
    { slug: 'install/android-apk', title: 'Instalar no Android (APK)' },
    { slug: 'install/web-pwa', title: 'Instalar (Web/PWA)' },
    { slug: 'install/tv-android', title: 'Instalar na TV (Android)' },
    { slug: 'install/tv-lg-webos', title: 'Instalar na TV (LG webOS)' },
    { slug: 'install/tv-samsung-tizen', title: 'Instalar na TV (Samsung Tizen)' },
  ]

  const slug = ref('')
  const title = ref('')
  const loading = ref(false)
  const loadError = ref('')
  const fullMarkdown = ref('')
  const sectionIndex = ref<number | 'all'>('all')
  const block = ref('')
  const preview = ref(false)
  const images = ref<File[]>([])
  const sending = ref(false)
  const result = ref<{ ok: boolean; text: string; prUrl?: string } | null>(null)

  const maxImages = 6
  const maxImageMb = 5

  const sections = computed<DocsSection[]>(() => extractSections(fullMarkdown.value))
  const sectionOptions = computed(() => [
    { value: 'all', label: 'Guia inteiro' },
    ...sections.value.map((s, i) => ({ value: String(i), label: s.title })),
  ])

  function onSectionChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    pickSection(value === 'all' ? 'all' : Number(value))
  }

  function pickSection(value: number | 'all') {
    sectionIndex.value = value
    if (value === 'all') {
      const { body } = splitFrontmatter(fullMarkdown.value)
      block.value = body
    } else {
      const section = sections.value[value]
      block.value = section ? fullMarkdown.value.slice(section.start, section.end) : ''
    }
  }

  async function loadGuide() {
    if (!slug.value) return
    loading.value = true
    loadError.value = ''
    fullMarkdown.value = ''
    block.value = ''
    sectionIndex.value = 'all'
    result.value = null
    try {
      const response = await $fetch<{ markdown: string }>('/api/docs/guide', {
        params: { slug: slug.value },
      })
      fullMarkdown.value = response.markdown
      const { frontmatter } = splitFrontmatter(response.markdown)
      const titleMatch = frontmatter.match(/^title:\s*(.+)$/m)
      if (titleMatch) title.value = titleMatch[1]!.trim()
      pickSection('all')
    } catch {
      loadError.value = 'Não foi possível carregar o guia. Tente novamente.'
    } finally {
      loading.value = false
    }
  }

  const canSend = computed(
    () =>
      !!slug.value && title.value.trim().length >= 3 && block.value.trim() !== '' && !sending.value,
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

  function removeImage(index: number) {
    images.value = images.value.filter((_, i) => i !== index)
  }

  const textareaEl = ref<HTMLTextAreaElement | null>(null)

  /** Toolbar MD: envolve a seleção (ou insere no cursor) no textarea. */
  function wrap(before: string, after = before, placeholder = 'texto') {
    const el = textareaEl.value
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = block.value.slice(start, end) || placeholder
    block.value = block.value.slice(0, start) + before + selected + after + block.value.slice(end)
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = start + before.length
      el.selectionEnd = start + before.length + selected.length
    })
  }

  function insertHeading() {
    const el = textareaEl.value
    if (!el) return
    const start = el.selectionStart
    const lineStart = block.value.lastIndexOf('\n', start - 1) + 1
    block.value = block.value.slice(0, lineStart) + '## ' + block.value.slice(lineStart)
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + 3
    })
  }

  const previewHtml = computed(() => renderMarkdown(block.value))

  async function send() {
    if (!canSend.value || localErrors.value.length > 0) return
    sending.value = true
    result.value = null
    try {
      // Remonta o MD completo: bloco editado substitui a seção no original.
      let markdown: string
      if (sectionIndex.value === 'all') {
        const { frontmatter } = splitFrontmatter(fullMarkdown.value)
        markdown = frontmatter + block.value
      } else {
        const section = sections.value[sectionIndex.value]
        if (!section) return
        markdown = reassemble(fullMarkdown.value, section, block.value)
      }

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
          markdown,
          images: imagePayload,
        },
      })
      result.value = {
        ok: true,
        text: 'Enviado! Um revisor vai aprovar antes de publicar.',
        prUrl: response.prUrl,
      }
      block.value = ''
      fullMarkdown.value = ''
      slug.value = ''
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
      <select v-model="slug" :disabled="loading" @change="loadGuide">
        <option value="" disabled>Selecione o guia…</option>
        <option v-for="doc in docs" :key="doc.slug" :value="doc.slug">{{ doc.title }}</option>
      </select>
    </label>

    <p v-if="loading" role="status">Carregando guia…</p>
    <p v-if="loadError" class="error">
      {{ loadError }}
    </p>

    <template v-if="fullMarkdown">
      <label>
        Título
        <input v-model="title" type="text" maxlength="120" placeholder="Ex.: Como usar o Palco" />
      </label>

      <label>
        Parte do guia
        <select :value="String(sectionIndex)" @change="onSectionChange($event)">
          <option v-for="option in sectionOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <div class="toolbar" role="toolbar" aria-label="Formatação de texto">
        <button type="button" class="btn" title="Negrito" @click="wrap('**')">
          <b>B</b>
        </button>
        <button type="button" class="btn" title="Itálico" @click="wrap('*')">
          <i>I</i>
        </button>
        <button type="button" class="btn" title="Lista" @click="wrap('\n- ', '', 'item')">
          Lista
        </button>
        <button type="button" class="btn" title="Link" @click="wrap('[', '](https://)', 'texto')">
          Link
        </button>
        <button type="button" class="btn" title="Título de seção" @click="insertHeading">
          Título
        </button>
        <button type="button" class="btn" :aria-pressed="preview" @click="preview = !preview">
          {{ preview ? 'Editar' : 'Pré-visualizar' }}
        </button>
      </div>

      <label v-if="!preview">
        Texto (Markdown simples: # título, **negrito**, listas com -)
        <textarea
          ref="textareaEl"
          v-model="block"
          rows="16"
          placeholder="Escreva aqui o conteúdo do guia…"
        />
      </label>
      <!-- Conteúdo escapado pelo renderMarkdown (escape antes de markdown). -->
      <div v-else class="preview" v-html="previewHtml" />

      <label>
        Prints de tela (até {{ maxImages }} imagens, {{ maxImageMb }}MB cada, PNG/JPG/WebP)
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          @change="onPickImages"
        />
      </label>
      <ul v-if="images.length" class="picked">
        <li v-for="(image, i) in images" :key="i">
          {{ image.name }}
          <button
            type="button"
            class="btn btn-remove"
            :aria-label="`Remover ${image.name}`"
            @click="removeImage(i)"
          >
            ✕
          </button>
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
    </template>

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
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .preview {
    background: #131313;
    border: 1px solid #353534;
    border-radius: 8px;
    padding: 1rem;
    min-height: 16rem;
    font-size: 0.9rem;
    line-height: 1.6;
    overflow-wrap: anywhere;
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
    justify-self: start;
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--piano-cyan-light);
    border-color: var(--piano-cyan-light);
  }
  .btn-remove {
    padding: 0.1rem 0.45rem;
    font-size: 0.75rem;
    margin-left: 0.4rem;
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
