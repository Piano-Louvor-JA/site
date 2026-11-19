export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', 'nuxt-gtag', '@nuxt/content'],

  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID || '',
    loadingStrategy: 'async',
  },

  i18n: {
    locales: [
      { code: 'pt-BR', language: 'pt-BR', name: 'Portugues', file: 'pt-BR.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es', name: 'Espanol', file: 'es.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'uk', language: 'uk', name: 'Українська', file: 'uk.json' },
      { code: 'fr', language: 'fr', name: 'Français', file: 'fr.json' },
    ],
    defaultLocale: 'pt-BR',
    strategy: 'prefix_except_default',
    langDir: '../i18n',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'piano_lang',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'pt-BR',
    },
  },

  ssr: true,

  css: ['@tabler/icons-webfont/dist/tabler-icons.min.css', '~/assets/css/main.scss'],

  routeRules: {
    // Admin pages are client-only (Firebase Auth)
    '/admin/**': { ssr: true },
    // pt-BR é defaultLocale (sem prefixo). Evita 404 de URL antiga /pt-BR
    '/pt-BR': { redirect: '/' },
  },

  nitro: {
    prerender: {
      // Ignore admin routes — they're client-only (Firebase Auth)
      ignore: ['/admin', '/admin/**'],
      crawlLinks: false,
      routes: [
        '/',
        '/en',
        '/es',
        '/200.html',
        '/404.html',
        '/llms-full.txt',
        // GitHub API — pré-renderizado como JSON estático (sem servidor Node em produção)
        // Pular durante testes (VITEST) para evitar rate limit da API do GitHub
        ...(!process.env.VITEST ? ['/api/github/contributors', '/api/github/releases'] : []),
      ],
    },
  },

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/ico/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/ico/favicon.png' },
      ],
      // Anti-FOUC: aplica data-theme antes da hidratação (default dark)
      script: [
        {
          innerHTML:
            "try{var t=localStorage.getItem('piano-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}",
        },
      ],
    },
  },

  typescript: {
    strict: true,
  },

  // F2.5 — rotas de docs geradas do conteúdo (crawlLinks segue false; enumeramos nós)
  hooks: {
    'nitro:build:before': async (nitro) => {
      try {
        // ESM-safe imports (nuxt.config é ESM)
        const { readdirSync, readFileSync, statSync, writeFileSync } = await import('node:fs')
        const { resolve } = await import('node:path')
        const base = resolve('./content/docs/pt-BR')
        const walk = (dir: string): Array<{ slug: string; lastmod: string | null }> => {
          const out: Array<{ slug: string; lastmod: string | null }> = []
          for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (entry.isDirectory()) out.push(...walk(resolve(dir, entry.name)))
            else if (entry.name.endsWith('.md')) {
              const file = resolve(dir, entry.name)
              const rel = file.slice(base.length + 1).replace(/\.md$/, '')
              const slug = rel.split('/').map(encodeURIComponent).join('/')
              const fm = readFileSync(file, 'utf8').match(/^reviewed_at:\s*(.+)$/m)
              let lastmod: string | null = null
              if (fm) {
                const d = new Date(`${fm[1]!.trim()}T12:00:00Z`)
                if (!Number.isNaN(d.getTime())) lastmod = d.toISOString()
              }
              if (!lastmod) {
                const d = new Date(statSync(file).mtime)
                lastmod = Number.isNaN(d.getTime()) ? null : d.toISOString()
              }
              out.push({ slug, lastmod })
            }
          }
          return out
        }
        const pages = walk(base)
        if (pages.length === 0) return
        // Rotas de docs: pt-BR (default, sem prefixo) + en/es prefixadas
        const docRoutes = pages.flatMap((p) => [
          `/docs/${p.slug}`,
          `/en/docs/${p.slug}`,
          `/es/docs/${p.slug}`,
        ])
        nitro.options.prerender.routes.push(...docRoutes)
        // Índice p/ sitemap.xml ler lastmod (runtime Nitro roda fora do repo root às vezes)
        const idxPath = resolve('./content/docs-index.json')
        writeFileSync(idxPath, JSON.stringify(pages))
      } catch {
        // content/docs ausente no primeiro build — nada a injetar
      }
    },
  },

  runtimeConfig: {
    // Server-only secrets
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT || '',

    // Geo telemetry salt (LGPD: IP hasheado, nunca em texto claro)
    geoSalt: process.env.GEO_SALT || '',

    // SMTP (Hostinger) — Newsletter manager
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '465'),
    smtpSecure: process.env.SMTP_SECURE !== 'false',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFromName: process.env.SMTP_FROM_NAME || 'Piano LouvorJA',
    smtpFromEmail: process.env.SMTP_FROM_EMAIL || '',
    buttondownApiKey: process.env.BUTTONDOWN_API_KEY || '',
    llmApiKey: process.env.LLM_API_KEY || '',
    llmModel: process.env.LLM_MODEL || 'glm-4-flash',

    public: {
      // Asaas payment link (created in Asaas dashboard — Pix/boleto/card)
      // Env var: NUXT_PUBLIC_ASAAS_DONATE_URL
      asaasDonateUrl: process.env.NUXT_PUBLIC_ASAAS_DONATE_URL || '',

      // Testers sheet (Google Forms → Sheets gviz CSV público)
      // Env var: NUXT_PUBLIC_TESTERS_SHEET_URL (override opcional).
      // Default = sheet pública de relatos de testadores — valor público por
      // design (lida client-side, sem OAuth), nunca um segredo. Default no
      // código elimina a classe de bug "deploy sem env → painel vazio"
      // (ocorrido em STG+PROD em 17-19/11/2026, PR #127 checklist item 3).
      testersSheetUrl:
        process.env.NUXT_PUBLIC_TESTERS_SHEET_URL ||
        'https://docs.google.com/spreadsheets/d/1Do-Qp5iMkyO125C2yKTvgpkHBynvALSxgiXzwi1NQCE/gviz/tq?tqx=out:csv',

      // Downloads de mídias (Google Drive) — SPEC piano-site-drive-midias
      driveMediaUrl: process.env.NUXT_PUBLIC_DRIVE_MEDIA_URL || '',
      // API custom do PIANO (painel admin) — base por ambiente (SPEC piano-admin-direct-api)
      pianoApiBase: process.env.NUXT_PUBLIC_PIANO_API_BASE || 'https://api.pianolouvorja.com.br',

      web3formsKey: process.env.WEB3FORMS_ACCESS_KEY || '',

      // GA4
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',

      // Firebase public config (client-side)
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.FIREBASE_APP_ID || '',

      // Admin authorization (comma-separated emails)
      adminEmails: process.env.ADMIN_EMAILS || '',

      // Telemetria Glitchtip (client): vazio = desligada
      telemetriaDsn: process.env.NUXT_PUBLIC_TELEMETRIA_DSN || '',
    },
  },
})
