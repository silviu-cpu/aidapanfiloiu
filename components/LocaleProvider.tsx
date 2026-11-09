"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Locale, localePath } from "@/lib/i18n";
import { translator } from "@/lib/translate";

const LocaleContext = createContext<Locale>("ro");

export function LocaleProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const lang = useContext(LocaleContext);
  return { lang, t: translator(lang), path: (href: string) => localePath(lang, href) };
}
