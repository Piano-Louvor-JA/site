import { describe, it, expect, vi, afterEach } from 'vitest'
import plugin from '~/plugins/geo-beacon.client'

describe('geo visit beacon', () => {
  afterEach(() => vi.unstubAllGlobals())

  function setup(base: string | undefined, path = '/') {
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { pianoApiBase: base } }))
    vi.stubGlobal('window', { location: { pathname: path } })
    const hook = vi.fn()
    plugin({ hook } as never)
    return hook
  }

  it.each([undefined, ''])('does not register without an API base (%s)', (base) => {
    expect(setup(base)).not.toHaveBeenCalled()
  })

  it('sends an anonymous keepalive visit to the configured API', () => {
    const fetchMock = vi.fn().mockResolvedValue({})
    vi.stubGlobal('fetch', fetchMock)
    const hook = setup('https://api.example/')
    expect(hook).toHaveBeenCalledWith('page:finish', expect.any(Function))
    hook.mock.calls[0][1]()
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('https://api.example/v1/geo/visit', {
      method: 'POST',
      keepalive: true,
    })
  })

  it.each(['/admin', '/admin/comunidade', '/api/github/releases'])(
    'skips private route %s',
    (path) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      setup('https://api.example', path).mock.calls[0][1]()
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it('absorbs rejected network requests', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(() => setup('https://api.example').mock.calls[0][1]()).not.toThrow()
    await Promise.resolve()
  })

  it('absorbs synchronous fetch errors', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => {
        throw new Error('unavailable')
      }),
    )
    expect(() => setup('https://api.example').mock.calls[0][1]()).not.toThrow()
  })
})
