import { describe, it, expect } from 'vitest'
import { getEmailStrings, EMAIL_LOCALES, isRtlLocale } from '~~/server/utils/email-i18n'

/**
 * SPEC: site-email-i18n-12 v1 — e-mails transacionais nos 12 idiomas do site.
 * TDD RED primeiro; regras: fallback pt-BR, ar RTL, glossário BARRA (فصحى cristã
 * formal para ar; hindi formal adventista para hi), Piano LouvorJA em alfabeto
 * latino em todos os idiomas.
 */

const ALL_LOCALES = [
  'pt-BR',
  'en',
  'es',
  'ru',
  'uk',
  'fr',
  'ja',
  'ko',
  'zh',
  'tr',
  'ar',
  'hi',
] as const

describe('getEmailStrings — cobertura dos 12 idiomas do site', () => {
  it('expõe exatamente os 12 locales do site', () => {
    expect([...EMAIL_LOCALES].sort()).toEqual([...ALL_LOCALES].sort())
  })

  it('nenhum string é vazia em nenhum locale', () => {
    for (const locale of ALL_LOCALES) {
      const s = getEmailStrings(locale)
      expect(s.appSubtitle.length, `${locale}.appSubtitle`).toBeGreaterThan(0)
      expect(s.unsubscribe.length, `${locale}.unsubscribe`).toBeGreaterThan(0)
      expect(s.copyright.length, `${locale}.copyright`).toBeGreaterThan(0)
      expect(s.badges.release.length, `${locale}.badges.release`).toBeGreaterThan(0)
      expect(s.badges.devotional.length, `${locale}.badges.devotional`).toBeGreaterThan(0)
      expect(s.badges.announcement.length, `${locale}.badges.announcement`).toBeGreaterThan(0)
    }
  })

  it('pt-BR mantém strings canônicas', () => {
    const s = getEmailStrings('pt-BR')
    expect(s.appSubtitle).toBe('App de louvor para IASD')
    expect(s.unsubscribe).toContain('Cancelar inscri')
    expect(s.copyright).toContain('Todos os direitos reservados')
    expect(s.badges.release).toContain('Nova vers')
    expect(s.badges.devotional).toBe('Devocional')
    expect(s.badges.announcement).toContain('An')
  })

  it('en mantém strings canônicas', () => {
    const s = getEmailStrings('en')
    expect(s.appSubtitle).toBe('Worship app for Seventh-day Adventist Church')
    expect(s.unsubscribe).toBe('Unsubscribe')
    expect(s.copyright).toContain('All rights reserved')
    expect(s.badges.release).toBe('New release')
    expect(s.badges.devotional).toBe('Devotional')
    expect(s.badges.announcement).toBe('Announcement')
  })

  it('es mantém strings canônicas', () => {
    const s = getEmailStrings('es')
    expect(s.appSubtitle).toBe('App de alabanza para IASD')
    expect(s.unsubscribe).toContain('Cancelar suscripci')
    expect(s.copyright).toContain('Todos los derechos reservados')
    expect(s.badges.release).toContain('Nueva versi')
    expect(s.badges.devotional).toBe('Devocional')
    expect(s.badges.announcement).toBe('Anuncio')
  })

  it('ru tem strings russas distintas de pt-BR', () => {
    const s = getEmailStrings('ru')
    expect(s.appSubtitle).toBe('Приложение поклонения для церкви христиан-адвентистов седьмого дня')
    expect(s.unsubscribe).toBe('Отписаться')
    expect(s.copyright).toContain('Все права защищены')
    expect(s.badges.release).toBe('Новая версия')
  })

  it('uk tem strings ucranianas distintas de ru', () => {
    const s = getEmailStrings('uk')
    expect(s.appSubtitle).toBe('Застосунок поклоніння для церкви адвентистів сьомого дня')
    expect(s.unsubscribe).toBe('Відписатися')
    expect(s.copyright).toContain('Усі права захищені')
    expect(s.badges.release).toBe('Нова версія')
  })

  it('fr tem strings francesas', () => {
    const s = getEmailStrings('fr')
    expect(s.appSubtitle).toBe("Application de louange pour l'Église adventiste du septième jour")
    expect(s.unsubscribe).toBe('Se désabonner')
    expect(s.copyright).toContain('Tous droits réservés')
    expect(s.badges.release).toBe('Nouvelle version')
  })

  it('ja tem strings japonesas', () => {
    const s = getEmailStrings('ja')
    expect(s.appSubtitle).toBe('セブンスデー・アドベンチスト教会のための賛美アプリ')
    expect(s.unsubscribe).toBe('配信を停止する')
    expect(s.copyright).toContain('全著作権所有')
    expect(s.badges.release).toBe('新バージョン')
  })

  it('ko tem strings coreanas', () => {
    const s = getEmailStrings('ko')
    expect(s.appSubtitle).toBe('재림교회를 위한 경배 앱')
    expect(s.unsubscribe).toBe('구독 취소')
    expect(s.copyright).toContain('모든 권리 보유')
    expect(s.badges.release).toBe('새 버전')
  })

  it('zh tem strings em chinês simplificado', () => {
    const s = getEmailStrings('zh')
    expect(s.appSubtitle).toBe('为基督复临安息日会而设的敬拜应用')
    expect(s.unsubscribe).toBe('取消订阅')
    expect(s.copyright).toContain('版权所有')
    expect(s.badges.release).toBe('新版本')
  })

  it('tr tem strings turcas', () => {
    const s = getEmailStrings('tr')
    expect(s.appSubtitle).toBe('Yedinci Gün Adventist Kilisesi için ilahi uygulaması')
    expect(s.unsubscribe).toBe('Abonelikten çık')
    expect(s.copyright).toContain('Tüm hakları saklıdır')
    expect(s.badges.release).toBe('Yeni sürüm')
  })

  it('ar segue glossário فصحى cristã formal (BARRA)', () => {
    const s = getEmailStrings('ar')
    expect(s.appSubtitle).toBe('تطبيق تسبيح لكنيسة الأدفنتست السبتيين')
    expect(s.unsubscribe).toBe('إلغاء الاشتراك')
    expect(s.copyright).toContain('جميع الحقوق محفوظة')
    expect(s.badges.release).toBe('إصدار جديد')
    expect(s.badges.devotional).toBe('تأمل روحي')
    expect(s.badges.announcement).toBe('إعلان')
  })

  it('hi segue registro formal adventista (BARRA)', () => {
    const s = getEmailStrings('hi')
    expect(s.appSubtitle).toBe('सेवेन्थ-डे एडवेंटिस्ट चर्च के लिए उपासना ऐप')
    expect(s.unsubscribe).toBe('सदस्यता रद्द करें')
    expect(s.copyright).toContain('सर्वाधिकार सुरक्षित')
    expect(s.badges.release).toBe('नया संस्करण')
    expect(s.badges.devotional).toBe('भक्ति लेख')
    expect(s.badges.announcement).toBe('घोषणा')
  })

  it('unsubscribe é único por idioma (fora do par latino pt-BR/es)', () => {
    const seen = new Set<string>()
    for (const locale of ALL_LOCALES) {
      const s = getEmailStrings(locale)
      if (locale !== 'pt-BR' && locale !== 'es') {
        expect(seen.has(s.unsubscribe), `${locale} unsubscribe duplicado`).toBe(false)
      }
      seen.add(s.unsubscribe)
    }
  })
})

describe('getEmailStrings — fallback', () => {
  it('caí para pt-BR em locale desconhecido', () => {
    const s = getEmailStrings('xx-YY')
    expect(s.appSubtitle).toBe('App de louvor para IASD')
    expect(s.unsubscribe).toContain('Cancelar inscri')
  })

  it('caí para pt-BR com locale vazio', () => {
    const s = getEmailStrings('')
    expect(s.appSubtitle).toBe('App de louvor para IASD')
  })

  it('usa variante exata (sem case-folding): "EN" não existe → fallback', () => {
    const s = getEmailStrings('EN')
    expect(s.appSubtitle).toBe('App de louvor para IASD')
  })
})

describe('isRtlLocale', () => {
  it('ar é RTL', () => {
    expect(isRtlLocale('ar')).toBe(true)
  })

  it('hi é LTR (não-RTL)', () => {
    expect(isRtlLocale('hi')).toBe(false)
  })

  it('pt-BR/en/es/ru/uk/fr/ja/ko/zh/tr são LTR', () => {
    for (const locale of ALL_LOCALES) {
      if (locale === 'ar') continue
      expect(isRtlLocale(locale), `${locale} deveria ser LTR`).toBe(false)
    }
  })

  it('locale desconhecido é LTR (fallback seguro)', () => {
    expect(isRtlLocale('xx')).toBe(false)
  })
})
