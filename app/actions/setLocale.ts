"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, isValidLocale, Locale, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Server Action: persists the chosen locale in a cookie (1 year).
 * Called by the LanguageSelector client component.
 */
export async function setLocaleAction(locale: Locale): Promise<void> {
  if (!isValidLocale(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,             // readable by JS so client can read it if needed
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
