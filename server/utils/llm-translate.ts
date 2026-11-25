/**
 * llm-translate — Tradução de release notes (changelog) para os locales do site.
 *
 * Traduz do pt-BR (fonte) para os 11 demais locales do site via LLM (z.ai).
 * Cada locale tem prompt próprio com glossário:
 * - ar: árabe فصحى formal cristão (تسبيح para louvor/worship; الأدفنتست
 *   السبتيين para Seventh-day Adventist; terminologia de igreja, sem gíria).
 * - hi: hindi formal adventista (सेवेन्थ-डे एडवेंटिस्ट; उपासना para worship).
 * - Piano LouvorJA permanece em alfabeto latino em todos os idiomas.
 * - Placeholders/URLs/markdown intactos.
 * Fallback: devolve o texto original se a API falhar (e-mail segue em pt-BR).
 */

/** Traduções por locale (chave = locale do site, ex.: 'en', 'ar'). */
export type TranslationResult = Record<string, string>

const BASE_PROMPT =
  'You are a professional translator for a Christian music app (Piano LouvorJA). Translate the following release notes from Brazilian Portuguese'

const COMMON_RULES =
  'Preserve markdown formatting exactly. Keep technical terms (API, CI, etc.) as-is. Keep URLs and placeholders untouched. Keep the product name "Piano LouvorJA" in the Latin alphabet. Return ONLY the translation, no explanations.'

const SYSTEM_PROMPTS: Record<string, string> = {
  en: `${BASE_PROMPT} to natural, fluent English. ${COMMON_RULES}`,
  es: `${BASE_PROMPT} to natural, fluent Spanish (Latin America). ${COMMON_RULES}`,
  ru: `${BASE_PROMPT} to natural, fluent Russian. ${COMMON_RULES}`,
  uk: `${BASE_PROMPT} to natural, fluent Ukrainian. ${COMMON_RULES}`,
  fr: `${BASE_PROMPT} to natural, fluent French. ${COMMON_RULES}`,
  ja: `${BASE_PROMPT} to natural, fluent Japanese. ${COMMON_RULES}`,
  ko: `${BASE_PROMPT} to natural, fluent Korean. ${COMMON_RULES}`,
  zh: `${BASE_PROMPT} to natural, fluent Simplified Chinese. ${COMMON_RULES}`,
  tr: `${BASE_PROMPT} to natural, fluent Turkish. ${COMMON_RULES}`,
  ar: `${BASE_PROMPT} to formal Modern Standard Arabic (فصحى) suitable for a Christian church context: use تسبيح for worship/louvor, الأدفنتست السبتيين for Seventh-day Adventist. No colloquialisms. ${COMMON_RULES}`,
  hi: `${BASE_PROMPT} to formal Hindi suitable for a Seventh-day Adventist church context (सेवेन्थ-डे एडवेंटिस्ट चर्च; उपासना for worship). No colloquialisms. ${COMMON_RULES}`,
}

/** Locales-alvo da tradução (todos exceto pt-BR, que é a fonte). */
export const TRANSLATE_LOCALES: readonly string[] = Object.freeze(Object.keys(SYSTEM_PROMPTS))

async function translateOne(
  text: string,
  toLang: string,
  model: string,
  apiKey: string,
): Promise<string> {
  try {
    const res = await $fetch<{ choices?: { message?: { content?: string } }[] }>(
      'https://api.z.ai/api/paas/v4/chat/completions',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: {
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS[toLang] },
            { role: 'user', content: text },
          ],
        },
      },
    )
    return res.choices?.[0]?.message?.content ?? text
  } catch {
    return text
  }
}

export async function translateChangelog(
  text: string,
  _fromLocale: string,
): Promise<TranslationResult> {
  const config = useRuntimeConfig()
  const apiKey = config.llmApiKey
  const model = config.llmModel ?? 'glm-4-flash'

  if (!apiKey) {
    return Object.fromEntries(TRANSLATE_LOCALES.map((locale) => [locale, text]))
  }

  const results = await Promise.all(
    TRANSLATE_LOCALES.map((locale) => translateOne(text, locale, model, apiKey!)),
  )

  const out: TranslationResult = {}
  TRANSLATE_LOCALES.forEach((locale, i) => {
    out[locale] = results[i]!
  })
  return out
}
