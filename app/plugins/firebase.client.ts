import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth'

/**
 * Firebase initialization plugin.
 * Reads public config from runtimeConfig and initializes Firebase App + Auth.
 * Safe-guards against SSR (auth is client-only).
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public

  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
  }

  // Skip init if credentials not configured (e.g. dev without env)
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('[firebase] Missing config — set FIREBASE_* env vars')
    return
  }

  const app: FirebaseApp = initializeApp(firebaseConfig)
  const auth: Auth = getAuth(app)

  // Persistência local explícita: evita o IndexedDB alternar entre abas
  // ("Database is closing/hidden" quando múltiplas instâncias/páginas do
  // admin competem pela mesma DB em reload/HMR) e garante sessão estável.
  void setPersistence(auth, browserLocalPersistence).catch(() => {
    // Sem IndexedDB (modo privado/bloqueado): Auth cai em memória — login
    // funciona, só não sobrevive ao refresh. Não deve quebrar o app.
  })

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
    },
  }
})
