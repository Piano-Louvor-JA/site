import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth'

let app: FirebaseApp | null = null
let authInstance: Auth | null = null

// Extracted for testability — can be overridden in tests via __setIsServerForTesting
let _isServer = false

export function __setIsServerForTesting(val: boolean) {
  _isServer = val
}

export function useFirebaseClient(): Auth {
  // Client-only — never run on server
  if (_isServer) {
    throw new Error('useFirebaseClient can only be used on the client')
  }

  if (authInstance) return authInstance

  const config = useRuntimeConfig().public

  // Don't initialize if credentials are missing
  if (!config.firebaseApiKey || !config.firebaseAppId) {
    throw new Error('Firebase configuration missing. Check your .env file.')
  }

  app = getApps().length
    ? getApps()[0]!
    : initializeApp({
        apiKey: config.firebaseApiKey,
        authDomain: config.firebaseAuthDomain,
        projectId: config.firebaseProjectId,
        storageBucket: config.firebaseStorageBucket,
        messagingSenderId: config.firebaseMessagingSenderId,
        appId: config.firebaseAppId,
      })

  authInstance = getAuth(app)
  // Mesma persistência explícita do plugin — a instância compartilhada não
  // deve depender do default implícito ao trocar de página/aba.
  void setPersistence(authInstance, browserLocalPersistence).catch(() => {
    // IndexedDB indisponível: sessão fica em memória (degrada, não quebra)
  })
  return authInstance
}
