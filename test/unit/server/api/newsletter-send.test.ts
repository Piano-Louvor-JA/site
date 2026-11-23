import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * SPEC site-email-i18n-12 — POST /api/admin/newsletter/send
 * Agrupa destinatários por locale: assunto E corpo no idioma do usuário
 * (via translations por locale), shell do e-mail no idioma (RTL para ar),
 * fallback pt-BR para locale desconhecido/sem tradução.
 */

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage?: string }) => {
  const err = new Error(opts.statusMessage ?? 'error') as Error & {
    statusCode: number
    statusMessage?: string
  }
  err.statusCode = opts.statusCode
  err.statusMessage = opts.statusMessage
  return err
})

const fetchSubscribersMock = vi.fn()
const sendMailMock = vi.fn()
const addToHistoryMock = vi.fn()

// readBody é auto-import do Nitro no runtime — stub global (padrão do repo).
vi.stubGlobal('readBody', (event: { readBody?: () => Promise<unknown> }) => {
  if (event.readBody) return event.readBody()
  return Promise.resolve(undefined)
})

vi.mock('~~/server/utils/subscribers', () => ({
  fetchSubscribers: (...args: unknown[]) => fetchSubscribersMock(...args),
}))
vi.mock('~~/server/utils/mail', () => ({
  sendMail: (...args: unknown[]) => sendMailMock(...args),
}))
vi.mock('~~/server/utils/newsletter-history', () => ({
  addToNewsletterHistory: (...args: unknown[]) => addToHistoryMock(...args),
}))

function makeEvent(payload: unknown) {
  return {
    node: { req: { headers: {} } },
    readBody: async () => payload,
  }
}

async function callSend(payload: unknown) {
  const mod = await import('~~/server/api/admin/newsletter/send.post')
  return (mod.default as unknown as (e: unknown) => Promise<unknown>)(makeEvent(payload))
}

function sub(email: string, locale: string, active = true) {
  return { email, createdAt: '', tags: [] as string[], active, locale }
}

describe('POST /api/admin/newsletter/send — i18n por destinatário', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sendMailMock.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('400 sem subject/body', async () => {
    await expect(callSend({ subject: '', body: 'x' })).rejects.toMatchObject({ statusCode: 400 })
    await expect(callSend({ subject: 's', body: '' })).rejects.toMatchObject({ statusCode: 400 })
  })

  it('sem assinantes → total 0 sem envio', async () => {
    fetchSubscribersMock.mockResolvedValue([])
    const res = (await callSend({ subject: 's', body: 'b' })) as { total: number; sent: number }
    expect(res.total).toBe(0)
    expect(sendMailMock).not.toHaveBeenCalled()
  })

  it('um envio por locale, cada um com assunto/corpo/shell do idioma', async () => {
    fetchSubscribersMock.mockResolvedValue([
      sub('a@x.com', 'pt-BR'),
      sub('b@x.com', 'en'),
      sub('c@x.com', 'ar'),
    ])

    const res = (await callSend({
      subject: 'Nova versão',
      body: '# Conteúdo',
      template: 'release',
      translations: {
        en: { subject: 'New release', body: '# Content' },
        ar: { subject: 'إصدار جديد', body: '# محتوى' },
      },
    })) as { total: number; sent: number; failed: number }

    expect(res).toMatchObject({ total: 3, sent: 3, failed: 0 })
    expect(sendMailMock).toHaveBeenCalledTimes(3)

    const calls = sendMailMock.mock.calls as unknown as [
      { to: string | string[]; subject: string; html: string },
    ][]
    const byTo = new Map(calls.map((c) => [String(c[0].to), c[0]]))

    // pt-BR: base
    const br = byTo.get('a@x.com')!
    expect(br.subject).toBe('Nova versão')
    expect(br.html).toContain('Cancelar inscri')

    // en: tradução + shell en
    const en = byTo.get('b@x.com')!
    expect(en.subject).toBe('New release')
    expect(en.html).toContain('Unsubscribe')
    expect(en.html).toContain('<h1>Content</h1>')

    // ar: tradução + shell ar com RTL
    const ar = byTo.get('c@x.com')!
    expect(ar.subject).toBe('إصدار جديد')
    expect(ar.html).toContain('dir="rtl"')
    expect(ar.html).toContain('إلغاء الاشتراك')
  })

  it('locale sem tradução recebe conteúdo base (fallback)', async () => {
    fetchSubscribersMock.mockResolvedValue([sub('ja@x.com', 'ja')])

    await callSend({ subject: 'Assunto PT', body: 'Corpo PT' })

    const call = (sendMailMock.mock.calls as unknown as [{ to: string; subject: string }[]])[0][0]
    expect(call.subject).toBe('Assunto PT')
  })

  it('locale desconhecido agrupa no fallback pt-BR do shell', async () => {
    fetchSubscribersMock.mockResolvedValue([sub('xx@x.com', 'xx-YY')])

    await callSend({ subject: 'S', body: 'B' })

    const call = (
      sendMailMock.mock.calls as unknown as [{ to: string; subject: string; html: string }[]]
    )[0][0]
    expect(call.subject).toBe('S')
    expect(call.html).toContain('Cancelar inscri')
  })

  it('tradução com subject vazio usa assunto base (não envia assunto em branco)', async () => {
    fetchSubscribersMock.mockResolvedValue([sub('en@x.com', 'en')])

    await callSend({
      subject: 'Base',
      body: 'Base body',
      translations: { en: { subject: '   ', body: 'English body' } },
    })

    const call = (
      sendMailMock.mock.calls as unknown as [{ to: string; subject: string; html: string }[]]
    )[0][0]
    expect(call.subject).toBe('Base')
    expect(call.html).toContain('English body')
  })

  it('assinante inativo não recebe e-mail', async () => {
    fetchSubscribersMock.mockResolvedValue([
      sub('on@x.com', 'pt-BR', true),
      sub('off@x.com', 'pt-BR', false),
    ])

    const res = (await callSend({ subject: 's', body: 'b' })) as { total: number; sent: number }
    expect(res.total).toBe(1)
    expect(sendMailMock).toHaveBeenCalledTimes(1)
  })

  it('falha de SMTP em um locale não bloqueia os demais', async () => {
    fetchSubscribersMock.mockResolvedValue([sub('ok@x.com', 'pt-BR'), sub('bad@x.com', 'en')])

    sendMailMock.mockImplementation(async (opts: { to: string | string[] }) => {
      const to = Array.isArray(opts.to) ? opts.to.join(',') : opts.to
      return to === 'bad@x.com' ? { success: false, error: 'SMTP refused' } : { success: true }
    })

    const res = (await callSend({ subject: 's', body: 'b' })) as {
      sent: number
      failed: number
      errors: string[]
    }
    expect(res.sent).toBe(1)
    expect(res.failed).toBe(1)
    expect(res.errors[0]).toBe('SMTP refused')
  })

  it('grava histórico com contagem global', async () => {
    fetchSubscribersMock.mockResolvedValue([sub('a@x.com', 'pt-BR'), sub('b@x.com', 'en')])

    await callSend({ subject: 's', body: 'b' })

    expect(addToHistoryMock).toHaveBeenCalledTimes(1)
    const record = addToHistoryMock.mock.calls[0][0] as { total: number; sent: number }
    expect(record.total).toBe(2)
    expect(record.sent).toBe(2)
  })
})

describe('resolveLocalizedContent (unidade)', () => {
  it('sem translations devolve base', async () => {
    const mod = await import('~~/server/api/admin/newsletter/send.post')
    const resolve = mod.resolveLocalizedContent
    expect(resolve({ subject: 'S', body: 'B' }, undefined, 'en')).toEqual({
      subject: 'S',
      body: 'B',
    })
  })

  it('tradução completa substitui subject e body', async () => {
    const mod = await import('~~/server/api/admin/newsletter/send.post')
    const resolve = mod.resolveLocalizedContent
    expect(
      resolve({ subject: 'S', body: 'B' }, { fr: { subject: 'Sujet', body: 'Corps' } }, 'fr'),
    ).toEqual({ subject: 'Sujet', body: 'Corps' })
  })

  it('tradução parcial preenche campo faltante com base', async () => {
    const mod = await import('~~/server/api/admin/newsletter/send.post')
    const resolve = mod.resolveLocalizedContent
    expect(resolve({ subject: 'S', body: 'B' }, { ja: { body: '本文' } }, 'ja')).toEqual({
      subject: 'S',
      body: '本文',
    })
    expect(resolve({ subject: 'S', body: 'B' }, { ja: { subject: '件名' } }, 'ja')).toEqual({
      subject: '件名',
      body: 'B',
    })
  })
})
