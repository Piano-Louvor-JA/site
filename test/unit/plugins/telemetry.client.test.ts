import { describe, it, expect, vi, beforeEach } from 'vitest'

const { initMock, captureMock } = vi.hoisted(() => ({
  initMock: vi.fn(),
  captureMock: vi.fn(),
}))

vi.mock('@sentry/browser', () => ({ init: initMock, captureException: captureMock }))

import plugin from '~/plugins/telemetry.client'

describe('telemetry.client plugin', () => {
  beforeEach(() => {
    vi.resetModules()
    initMock.mockClear()
    captureMock.mockClear()
  })

  it('sem DSN não inicializa SDK nem registra hooks', () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { telemetriaDsn: '' } }))
    const hook = vi.fn()
    vi.stubGlobal('defineNuxtPlugin', (fn: (app: unknown) => unknown) => fn)
    plugin({ hook })
    expect(initMock).not.toHaveBeenCalled()
    expect(hook).not.toHaveBeenCalled()
  })

  it('com DSN inicializa SDK sem PII e reporta vue:error', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { telemetriaDsn: 'https://key@errors.example/1' },
    }))
    vi.stubGlobal('defineNuxtPlugin', (fn: (app: unknown) => unknown) => fn)
    const hooks: Record<string, (e: unknown) => void> = {}
    plugin({
      hook: (name: string, cb: (e: unknown) => void) => {
        hooks[name] = cb
      },
    })
    await vi.waitFor(() => expect(initMock).toHaveBeenCalledTimes(1))
    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: 'https://key@errors.example/1', sendDefaultPii: false, tracesSampleRate: 0 }),
    )
    const error = new Error('boom')
    hooks['vue:error'](error)
    await vi.waitFor(() => expect(captureMock).toHaveBeenCalledWith(error))
  })
})
