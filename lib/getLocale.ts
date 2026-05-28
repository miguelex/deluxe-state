import { cookies } from "next/headers";
import { Locale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isValidLocale } from "./i18n";

/**
 * Reads the `locale` cookie and returns the current locale.
 * Server-only — uses next/headers cookies().
 * Do NOT import this in client components.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? "";
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}
