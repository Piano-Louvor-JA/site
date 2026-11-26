import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.resetModules()
})

function stubIdb(handlers: {
  onOpen?: (request: IDBOpenDBRequest) => void
  get?: (request: IDBRequest) => void
  put?: (request: IDBRequest) => void
  objectStoreNames?: string[]
}) {
  const objectStoreNames = {
    contains: (name: string) => (handlers.objectStoreNames ?? []).includes(name),
  }
  const db = {
    objectStoreNames,
    createObjectStore: vi.fn(),
    transaction: () => ({
      objectStore: () => ({
        get: () => {
          const request = {} as IDBRequest
          queueMicrotask(() => handlers.get?.(request))
          return request
        },
        put: () => {
          const request = {} as IDBRequest
          queueMicrotask(() => handlers.put?.(request))
          return request
        },
      }),
    }),
  }
  vi.stubGlobal('indexedDB', {
    open: () => {
      const request = {} as IDBOpenDBRequest
      queueMicrotask(() => {
        if (handlers.onOpen) handlers.onOpen(request)
        else {
          request.onupgradeneeded?.({
            target: { result: db },
          } as unknown as IDBVersionChangeEvent)
          request.onsuccess?.({ target: { result: db } } as unknown as Event)
        }
      })
      return request
    },
  })
  return db
}

describe('libras-cache IndexedDB', () => {
  it('treats an asynchronous IndexedDB read error as a cache miss', async () => {
    stubIdb({
      get: (request) => request.onerror?.(new Event('error')),
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { getTranslation } = await import('~/src/modules/libras/services/libras-cache')
    await expect(getTranslation('letra')).resolves.toBeUndefined()
  })

  it('rejects when IndexedDB is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined)
    Object.defineProperty(globalThis, 'indexedDB', {
      value: undefined,
      configurable: true,
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { getTranslation, saveTranslation } =
      await import('~/src/modules/libras/services/libras-cache')
    await expect(getTranslation('x')).resolves.toBeUndefined()
    await expect(
      saveTranslation({
        cacheKey: 'x',
        gloss: 'X',
        source: 'x',
        createdAt: 1,
      }),
    ).rejects.toThrow('Unavailable')
  })

  it('creates the object store on upgrade and saves/reads a translation', async () => {
    const db = stubIdb({
      objectStoreNames: [],
      get: (request) => {
        Object.defineProperty(request, 'result', {
          value: {
            cacheKey: 'ola',
            gloss: 'OLÁ',
            source: 'olá',
            createdAt: 1,
          },
        })
        request.onsuccess?.(new Event('success'))
      },
      put: (request) => request.onsuccess?.(new Event('success')),
    })
    const { getTranslation, saveTranslation } =
      await import('~/src/modules/libras/services/libras-cache')
    await saveTranslation({
      cacheKey: 'ola',
      gloss: 'OLÁ',
      source: 'olá',
      createdAt: 1,
    })
    await expect(getTranslation('ola')).resolves.toMatchObject({ gloss: 'OLÁ' })
    expect(db.createObjectStore).toHaveBeenCalledWith('translations', {
      keyPath: 'cacheKey',
    })
  })

  it('propagates open and put errors as Unavailable on save', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    stubIdb({
      onOpen: (request) => {
        Object.defineProperty(request, 'error', { value: null })
        request.onerror?.({ target: request } as unknown as Event)
      },
    })
    const { saveTranslation } = await import('~/src/modules/libras/services/libras-cache')
    await expect(
      saveTranslation({
        cacheKey: 'a',
        gloss: 'A',
        source: 'a',
        createdAt: 1,
      }),
    ).rejects.toThrow('Unavailable')
  })

  it('rejects save when put fails after open', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    stubIdb({
      objectStoreNames: ['translations'],
      put: (request) => request.onerror?.(new Event('error')),
    })
    const { saveTranslation } = await import('~/src/modules/libras/services/libras-cache')
    await expect(
      saveTranslation({
        cacheKey: 'a',
        gloss: 'A',
        source: 'a',
        createdAt: 1,
      }),
    ).rejects.toThrow('Unavailable')
  })
})
