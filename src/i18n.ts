import { computed, ref } from 'vue';

/**
 * 零依賴、扁平 key 的 i18n（沿用 idle_game/helios-selene 的做法，但用 Vue composable
 * 包一層以支援即時切換，不需重新整理）。zh-Hant 是原始語系（照抄既有中文文案）；
 * 其餘語系為一次性機器翻譯，未經專業審閱，見本檔案結尾註解。
 */
export type Locale =
  | 'en'
  | 'zh-Hant'
  | 'zh-Hans'
  | 'ja'
  | 'ru'
  | 'es'
  | 'pt'
  | 'pt-BR'
  | 'fr'
  | 'de'
  | 'it'
  | 'ko'
  | 'hi'
  | 'ar'
  | 'th';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'zh-Hant': '繁體中文',
  'zh-Hans': '简体中文',
  ja: '日本語',
  ru: 'Русский',
  es: 'Español',
  pt: 'Português',
  'pt-BR': 'Português (BR)',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ko: '한국어',
  hi: 'हिन्दी',
  ar: 'العربية',
  th: 'ไทย',
};

const LOCALE_LIST = Object.keys(LOCALE_NAMES) as Locale[];
const DEFAULT_LOCALE: Locale = 'zh-Hant';
const STORAGE_KEY = 'zombie-survivors:locale';

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALE_LIST.includes(saved as Locale)) return saved as Locale;
  } catch {
    /* localStorage 不可用時略過 */
  }
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get('lang');
    if (q && LOCALE_LIST.includes(q as Locale)) return q as Locale;
  } catch {
    /* 略過 */
  }
  const nav = (navigator.language || '').toLowerCase();
  const match = LOCALE_LIST.find((l) => nav === l.toLowerCase() || nav.startsWith(l.toLowerCase().split('-')[0]));
  if (match) return match;
  return DEFAULT_LOCALE;
}

const locale = ref<Locale>(detectLocale());

export function setLocale(id: Locale) {
  locale.value = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* 略過寫入失敗 */
  }
  document.documentElement.lang = id;
  document.title = t('landing.title');
}

/** import.meta.glob 不適用於這裡（單一巨大表格），直接靜態 import 每個語系表 */
import { zhHant } from './locales/zh-Hant';
import { en } from './locales/en';
import { zhHans } from './locales/zh-Hans';
import { ja } from './locales/ja';
import { ru } from './locales/ru';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { ptBR } from './locales/pt-BR';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { it } from './locales/it';
import { ko } from './locales/ko';
import { hi } from './locales/hi';
import { ar } from './locales/ar';
import { th } from './locales/th';

const TABLES: Record<Locale, Record<string, string>> = {
  'zh-Hant': zhHant,
  en,
  'zh-Hans': zhHans,
  ja,
  ru,
  es,
  pt,
  'pt-BR': ptBR,
  fr,
  de,
  it,
  ko,
  hi,
  ar,
  th,
};

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
}

/** 翻譯字串；找不到 key 時退回 zh-Hant，兩者都沒有則回傳 key 本身（方便發現漏翻）。 */
export function t(key: string, vars?: Record<string, string | number>): string {
  const table = TABLES[locale.value];
  const raw = table?.[key] ?? TABLES[DEFAULT_LOCALE][key] ?? key;
  return interpolate(raw, vars);
}

document.documentElement.lang = locale.value;
document.title = t('landing.title');

export function useI18n() {
  return {
    locale: computed(() => locale.value),
    setLocale,
    localeList: LOCALE_LIST,
    localeNames: LOCALE_NAMES,
    t,
  };
}
