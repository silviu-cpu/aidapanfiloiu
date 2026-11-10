import english from "./en.json";
import type { Locale } from "./i18n";

const dictionary: Record<string, string> = english;

/** Translate display copy; Romanian remains the source language. */
export function translate(lang: Locale, text: string): string {
  if (lang === "ro") return text;
  const key = text.replace(/\s+/g, " ").trim();
  return dictionary[key] ?? text;
}

export function translator(lang: Locale) {
  return (text: string) => translate(lang, text);
}
