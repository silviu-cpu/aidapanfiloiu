import type { Metadata } from "next";
import { alternates, localePath, ogLocale, type Locale } from "./i18n";
import { site } from "./site";

/** Imaginea afișată când link-ul e trimis pe WhatsApp, Facebook, LinkedIn etc. (1200 × 630). */
export function shareImage(lang: Locale) {
  return {
    url: `/images/og-${lang}.jpg`,
    width: 1200,
    height: 630,
    alt: lang === "ro" ? "Dr. Aida Gabriela Panfiloiu, medic specialist chirurgie generală" : "Dr. Aida Gabriela Panfiloiu, specialist in general surgery",
  };
}

/**
 * Titlul, descrierea și previzualizarea la share pentru o pagină.
 * Next.js nu combină câmpurile din `openGraph` între layout și pagină (cel al paginii îl
 * înlocuiește complet), așa că fiecare pagină primește aici setul întreg.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  /** true: titlul se folosește așa cum e, fără „ | Dr. Aida Panfiloiu” la final. */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const image = shareImage(lang);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[lang],
      alternateLocale: ogLocale[lang === "ro" ? "en" : "ro"],
      url: localePath(lang, path),
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}
