"use client";

import React, { createContext, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Locale,
  Translations,
  getTranslations,
  resolvePath,
} from "@/lib/i18n";
import { setLocaleAction } from "@/app/actions/setLocale";

// ─── Context shape ────────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  /** Resolves a dot-notation translation key, e.g. t("hero.search_button") */
  t: (key: string) => string;
  /** Changes the locale: writes cookie via Server Action + refreshes server components */
  setLocale: (locale: Locale) => void;
  /** True while the locale change is in flight */
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface LocaleProviderProps {
  /** Current locale resolved server-side from the cookie */
  locale: Locale;
  children: React.ReactNode;
}

/**
 * Wraps the app and provides locale + t() to all client components.
 * All 4 language JSONs are bundled client-side for instant switching.
 */
export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Derive translations from the prop — updates automatically after router.refresh()
  const translations: Translations = getTranslations(locale);

  const t = (key: string): string => resolvePath(translations, key);

  const setLocale = (newLocale: Locale) => {
    startTransition(async () => {
      await setLocaleAction(newLocale);
      // Re-fetch server components so Navbar, FeaturedCollections etc. update
      router.refresh();
    });
  };

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access locale context from any client component.
 * Must be used inside <LocaleProvider>.
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale() must be used inside <LocaleProvider>.");
  }
  return ctx;
}
