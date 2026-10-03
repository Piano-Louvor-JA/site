// Dark/Light toggle espelhando os temas do produto:
// dark = Ethereal Lumens (#131313) · light = Luminous Clarity (#F8F9FF)
// CSS em app/assets/css/main.scss via html[data-theme='light'].

export type SiteTheme = 'dark' | 'light'

const STORAGE_KEY = 'piano-theme'

function resolveInitialTheme(): SiteTheme {
  if (import.meta.client) {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  }
  return 'dark'
}

export function useTheme() {
  const theme = useState<SiteTheme>('site-theme', resolveInitialTheme)

  function applyTheme(value: SiteTheme) {
    if (import.meta.client) {
      document.documentElement.dataset.theme = value
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  function initTheme() {
    applyTheme(theme.value)
  }

  return { theme, toggleTheme, initTheme }
}
