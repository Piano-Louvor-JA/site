import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, type Ref } from 'vue'

// Mock useState — refs persistentes por chave (mesmo padrão de useAuthState.test.ts)
const stateMap = new Map<string, Ref<unknown>>()
vi.stubGlobal('useState', <T>(key: string, init: () => T): Ref<T> => {
  if (!stateMap.has(key)) {
    stateMap.set(key, ref(init()))
  }
  return stateMap.get(key) as Ref<T>
})

const { useTheme } = await import('~/composables/useTheme')

// localStorage funcional (o setup global usa vi.fn() sem storage real)
const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
})

describe('useTheme', () => {
  beforeEach(() => {
    stateMap.clear()
    store.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it('retorna theme, toggleTheme e initTheme', () => {
    const result = useTheme()
    expect(result).toHaveProperty('theme')
    expect(result).toHaveProperty('toggleTheme')
    expect(result).toHaveProperty('initTheme')
  })

  it('theme padrão é dark (Ethereal Lumens) sem localStorage e sem preferência', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
    } as MediaQueryList)
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('respeita localStorage quando disponível', () => {
    store.set('piano-theme', 'light')
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('respeita prefers-color-scheme: light quando não há localStorage', () => {
    store.clear()
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
    } as MediaQueryList)
    stateMap.clear()
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('ignora valor inválido no localStorage', () => {
    store.set('piano-theme', 'purple')
    const { theme } = useTheme()
    expect(['dark', 'light']).toContain(theme.value)
  })

  it('toggleTheme alterna dark↔light, persiste e aplica data-theme', () => {
    store.clear()
    const { theme, toggleTheme } = useTheme()
    const before = theme.value
    toggleTheme()
    expect(theme.value).toBe(before === 'dark' ? 'light' : 'dark')
    expect(store.get('piano-theme')).toBe(theme.value)
    expect(document.documentElement.dataset.theme).toBe(theme.value)
  })

  it('initTheme aplica o tema atual no documentElement', () => {
    store.set('piano-theme', 'light')
    const { theme, initTheme } = useTheme()
    initTheme()
    expect(document.documentElement.dataset.theme).toBe(theme.value)
  })

  it('estado é compartilhado entre chamadas (useState)', () => {
    const a = useTheme()
    const b = useTheme()
    expect(a.theme).toBe(b.theme)
    a.toggleTheme()
    expect(b.theme.value).toBe(a.theme.value)
  })
  it('alterna nas duas direções e restaura o tema escuro persistido', () => {
    store.set('piano-theme', 'dark')
    const { theme, toggleTheme } = useTheme()
    expect(theme.value).toBe('dark')
    toggleTheme()
    expect(theme.value).toBe('light')
    expect(store.get('piano-theme')).toBe('light')
    toggleTheme()
    expect(theme.value).toBe('dark')
    expect(store.get('piano-theme')).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
