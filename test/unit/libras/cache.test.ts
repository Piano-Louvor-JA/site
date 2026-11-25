import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.resetModules()
})

it('treats an asynchronous IndexedDB read error as a cache miss', async () => {
  const readRequest = {} as IDBRequest
  const db = {
    transaction: () => ({
      objectStore: () => ({
        get: () => {
          queueMicrotask(() => readRequest.onerror?.(new Event('error')))
          return readRequest
        },
      }),
    }),
  }
  vi.stubGlobal('indexedDB', {
    open: () => {
      const request = {} as IDBOpenDBRequest
      queueMicrotask(() => request.onsuccess?.({ target: { result: db } } as unknown as Event))
      return request
    },
  })
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const { getTranslation } = await import('~/src/modules/libras/services/libras-cache')
  await expect(getTranslation('letra')).resolves.toBeUndefined()
})
