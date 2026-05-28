"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/LocaleContext";
import { LOCALES, Locale } from "@/lib/i18n";

// ─── Locale meta ──────────────────────────────────────────────────────────────

const LOCALE_META: Record<Locale, { flag: string; name: string; short: string }> = {
  en: { flag: "🇬🇧", name: "English",  short: "EN" },
  es: { flag: "🇪🇸", name: "Español",  short: "ES" },
  fr: { flag: "🇫🇷", name: "Français", short: "FR" },
  de: { flag: "🇩🇪", name: "Deutsch",  short: "DE" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LanguageSelector() {
  const { locale, setLocale, isPending, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LOCALE_META[locale];

  return (
    <div ref={ref} className="relative" id="language-selector">
      {/* Trigger */}
      <button
        id="language-selector-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
          border border-nordic-dark/10 bg-white/60 backdrop-blur-sm
          text-sm font-medium text-nordic-dark
          hover:border-mosque/40 hover:bg-white transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isPending ? "animate-pulse" : ""}
        `}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {current.flag}
        </span>
        <span className="hidden sm:inline text-xs font-semibold tracking-wide text-nordic-dark/80">
          {current.short}
        </span>
        <span
          className={`material-icons text-[14px] text-nordic-dark/50 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      <div
        role="listbox"
        aria-label={t("languages.en")}
        className={`
          absolute right-0 top-full mt-2 w-44 rounded-xl
          bg-white/95 backdrop-blur-md border border-nordic-dark/10
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          overflow-hidden z-[60]
          transition-all duration-200 origin-top-right
          ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
        `}
      >
        {LOCALES.map((loc) => {
          const meta = LOCALE_META[loc];
          const isActive = loc === locale;
          return (
            <button
              key={loc}
              id={`lang-option-${loc}`}
              role="option"
              aria-selected={isActive}
              type="button"
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left text-sm
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-mosque/8 text-mosque font-semibold"
                    : "text-nordic-dark hover:bg-nordic-dark/5"
                }
              `}
            >
              <span className="text-xl leading-none">{meta.flag}</span>
              <span className="flex-1">{meta.name}</span>
              {isActive && (
                <span className="material-icons text-mosque text-[16px]">
                  check
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
