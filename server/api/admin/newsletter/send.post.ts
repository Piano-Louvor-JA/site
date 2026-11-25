import {
  addToNewsletterHistory,
  type NewsletterSendRecord,
} from '~~/server/utils/newsletter-history'
import { fetchSubscribers, type Subscriber } from '~~/server/utils/subscribers'
import { sendMail } from '~~/server/utils/mail'
import { renderTemplate } from '~~/server/utils/email-templates'

interface SendBody {
  subject: string
  body: string
  template: string
  /** Traduções por locale (opcional): { en: {subject, body}, ar: {...}, ... } */
  translations?: Record<string, { subject?: string; body?: string }>
}

const BATCH_SIZE = 50
const BATCH_DELAY_MS = 2000

/**
 * Resolve o conteúdo (assunto+corpo) no idioma do destinatário.
 * Prioridade: tradução do locale → conteúdo base (pt-BR, digitado pelo admin).
 */
export function resolveLocalizedContent(
  base: { subject: string; body: string },
  translations: Record<string, { subject?: string; body?: string }> | undefined,
  locale: string,
): { subject: string; body: string } {
  const t = translations?.[locale]
  if (!t) return base
  return {
    subject: t.subject?.trim() ? t.subject : base.subject,
    body: t.body?.trim() ? t.body : base.body,
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SendBody>(event)

  if (!body.subject || !body.body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: subject, body',
    })
  }

  const subs: Subscriber[] = await fetchSubscribers()
  if (subs.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
      errors: ['No subscribers found'],
    }
  }

  const active = subs.filter((s) => s.active)
  const errors: string[] = []
  let sent = 0
  let failed = 0

  // Agrupa por locale: cada lote de idioma recebe assunto+corpo+shell no
  // idioma do destinatário (SPEC site-email-i18n-12). Locales desconhecidos
  // agrupam sob pt-BR (fallback de getEmailStrings/renderTemplate).
  const byLocale = new Map<string, string[]>()
  for (const s of active) {
    const locale = s.locale || 'pt-BR'
    const bucket = byLocale.get(locale)
    if (bucket) bucket.push(s.email)
    else byLocale.set(locale, [s.email])
  }

  for (const [locale, emails] of byLocale) {
    const content = resolveLocalizedContent(
      { subject: body.subject, body: body.body },
      body.translations,
      locale,
    )

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE)
      const html = renderTemplate(body.template || 'announcement', {
        subject: content.subject,
        body: content.body,
        unsubscribeUrl: 'https://pianolouvorja.com.br',
        locale,
      })

      const result = await sendMail({
        to: batch,
        subject: content.subject,
        html,
      })

      if (result.success) {
        sent += batch.length
      } else {
        failed += batch.length
        errors.push(result.error || 'Unknown error')
      }

      if (i + BATCH_SIZE < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
      }
    }
  }

  const record: NewsletterSendRecord = {
    date: new Date().toISOString(),
    subject: body.subject,
    template: body.template || 'announcement',
    total: active.length,
    sent,
    failed,
    errors,
  }
  addToNewsletterHistory(record)

  return {
    total: active.length,
    sent,
    failed,
    errors,
  }
})
