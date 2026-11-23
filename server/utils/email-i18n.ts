/**
 * email-i18n — Strings localizadas para templates de email.
 * Server-side (não tem acesso ao useI18n do Nuxt).
 * Manter em sync com os locales do site (nuxt.config i18n.locales).
 *
 * Glossário BARRA (SPEC site-email-i18n-12):
 * - ar: árabe فصحى formal cristão — تسبيح (louvor), الأدفنتست السبتيين
 *   (adventista do sétimo dia), تأمل روحي (devocional); sem coloquialismos.
 * - hi: hindi formal adventista — सेवेन्थ-डे एडवेंटिस्ट चर्च, उपासना (worship),
 *   भक्ति लेख (devocional).
 * - Piano LouvorJA permanece em alfabeto latino em todos os idiomas.
 * - HTML entities (&ccedil; etc.) apenas nos locales latinos (compat com
 *   clientes de email legados); scripts não-latinos em UTF-8 direto.
 */

export interface EmailStrings {
  appSubtitle: string
  unsubscribe: string
  copyright: string
  badges: {
    release: string
    devotional: string
    announcement: string
  }
}

/** Locales suportados nos e-mails transacionais (os 12 do site). */
export const EMAIL_LOCALES: readonly string[] = Object.freeze([
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
])

/** Locales RTL suportados (direção da escrita do e-mail). */
const RTL_LOCALES: ReadonlySet<string> = new Set(['ar'])

/** Retorna true se o locale escreve da direita para a esquerda. */
export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.has(locale)
}

const STRINGS: Record<string, EmailStrings> = {
  'pt-BR': {
    appSubtitle: 'App de louvor para IASD',
    unsubscribe: 'Cancelar inscri&ccedil;&atilde;o',
    copyright: 'Todos os direitos reservados.',
    badges: {
      release: 'Nova vers&atilde;o',
      devotional: 'Devocional',
      announcement: 'An&uacute;ncio',
    },
  },
  en: {
    appSubtitle: 'Worship app for Seventh-day Adventist Church',
    unsubscribe: 'Unsubscribe',
    copyright: 'All rights reserved.',
    badges: {
      release: 'New release',
      devotional: 'Devotional',
      announcement: 'Announcement',
    },
  },
  es: {
    appSubtitle: 'App de alabanza para IASD',
    unsubscribe: 'Cancelar suscripci&oacute;n',
    copyright: 'Todos los derechos reservados.',
    badges: {
      release: 'Nueva versi&oacute;n',
      devotional: 'Devocional',
      announcement: 'Anuncio',
    },
  },
  ru: {
    appSubtitle: 'Приложение поклонения для церкви христиан-адвентистов седьмого дня',
    unsubscribe: 'Отписаться',
    copyright: 'Все права защищены.',
    badges: {
      release: 'Новая версия',
      devotional: 'Духовное чтение',
      announcement: 'Объявление',
    },
  },
  uk: {
    appSubtitle: 'Застосунок поклоніння для церкви адвентистів сьомого дня',
    unsubscribe: 'Відписатися',
    copyright: 'Усі права захищені.',
    badges: {
      release: 'Нова версія',
      devotional: 'Щоденне читання',
      announcement: 'Оголошення',
    },
  },
  fr: {
    appSubtitle: "Application de louange pour l'Église adventiste du septième jour",
    unsubscribe: 'Se désabonner',
    copyright: 'Tous droits réservés.',
    badges: {
      release: 'Nouvelle version',
      devotional: 'Leçon devotionnelle',
      announcement: 'Annonce',
    },
  },
  ja: {
    appSubtitle: 'セブンスデー・アドベンチスト教会のための賛美アプリ',
    unsubscribe: '配信を停止する',
    copyright: '全著作権所有。',
    badges: {
      release: '新バージョン',
      devotional: 'ディボーション',
      announcement: 'お知らせ',
    },
  },
  ko: {
    appSubtitle: '재림교회를 위한 경배 앱',
    unsubscribe: '구독 취소',
    copyright: '모든 권리 보유.',
    badges: {
      release: '새 버전',
      devotional: '경건의 시간',
      announcement: '공지',
    },
  },
  zh: {
    appSubtitle: '为基督复临安息日会而设的敬拜应用',
    unsubscribe: '取消订阅',
    copyright: '版权所有。',
    badges: {
      release: '新版本',
      devotional: '灵修文章',
      announcement: '公告',
    },
  },
  tr: {
    appSubtitle: 'Yedinci Gün Adventist Kilisesi için ilahi uygulaması',
    unsubscribe: 'Abonelikten çık',
    copyright: 'Tüm hakları saklıdır.',
    badges: {
      release: 'Yeni sürüm',
      devotional: 'Sohbet Saati',
      announcement: 'Duyuru',
    },
  },
  ar: {
    appSubtitle: 'تطبيق تسبيح لكنيسة الأدفنتست السبتيين',
    unsubscribe: 'إلغاء الاشتراك',
    copyright: 'جميع الحقوق محفوظة.',
    badges: {
      release: 'إصدار جديد',
      devotional: 'تأمل روحي',
      announcement: 'إعلان',
    },
  },
  hi: {
    appSubtitle: 'सेवेन्थ-डे एडवेंटिस्ट चर्च के लिए उपासना ऐप',
    unsubscribe: 'सदस्यता रद्द करें',
    copyright: 'सर्वाधिकार सुरक्षित।',
    badges: {
      release: 'नया संस्करण',
      devotional: 'भक्ति लेख',
      announcement: 'घोषणा',
    },
  },
}

export function getEmailStrings(locale: string): EmailStrings {
  return STRINGS[locale] ?? STRINGS['pt-BR']!
}
