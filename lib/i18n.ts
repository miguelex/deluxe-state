import enData from "@/locales/en.json";
import esData from "@/locales/es.json";
import frData from "@/locales/fr.json";
import deData from "@/locales/de.json";

// ─── Constants ────────────────────────────────────────────────────────────────

export const LOCALES = ["en", "es", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "locale";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Translations = typeof enData;

// ─── Translation loader ───────────────────────────────────────────────────────

const allTranslations: Record<Locale, Translations> = {
  en: enData,
  es: esData,
  fr: frData,
  de: deData,
};

/**
 * Returns the full translations object for a given locale.
 * Safe to call from both server and client components.
 */
export function getTranslations(locale: Locale): Translations {
  return allTranslations[locale] ?? allTranslations[DEFAULT_LOCALE];
}

/**
 * Resolves a dot-notation key against a translations object.
 * e.g. resolvePath(t, "hero.search_button") → "Search"
 */
export function resolvePath(translations: Translations, key: string): string {
  const keys = key.split(".");
  let current: unknown = translations;
  for (const k of keys) {
    if (typeof current === "object" && current !== null && k in (current as object)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return key; // fallback: return key itself if not found
    }
  }
  return typeof current === "string" ? current : key;
}

/**
 * Returns true if the string is a supported locale.
 */
export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
