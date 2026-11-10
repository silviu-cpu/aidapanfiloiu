export const locales = ["ro", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ro";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Româna nu are prefix în URL (/despre), engleza are (/en/despre). */
export function localePath(lang: Locale, path: string) {
  if (!path.startsWith("/")) return path;
  path = path.replace(/^\/(?:en|ro)(?=\/|$)/, "") || "/";
  if (lang === defaultLocale) return path;
  return path === "/" ? "/en" : `/en${path}`;
}

/** Link canonic + versiunile în celelalte limbi (hreflang) pentru metadata unei pagini. */
export function alternates(lang: Locale, path: string) {
  return {
    canonical: localePath(lang, path),
    languages: {
      ro: localePath("ro", path),
      en: localePath("en", path),
      "x-default": localePath("ro", path),
    },
  };
}

/** Citește și validează segmentul [lang] dintr-o pagină. */
export async function getLang(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return hasLocale(lang) ? lang : defaultLocale;
}

export const ogLocale: Record<Locale, string> = { ro: "ro_RO", en: "en_GB" };

/** Texte comune tuturor paginilor. */
export const common = {
  ro: {
    tagline: "Chirurgie generală în București",
    description: "Dr. Aida Panfiloiu, medic specialist chirurgie generală în București. Consultații de chirurgie generală și proctologie, chirurgie laparoscopică și îngrijirea plăgilor.",
    skip: "Sari la conținut",
  },
  en: {
    tagline: "General surgery in Bucharest",
    description: "Dr. Aida Panfiloiu, specialist in general surgery in Bucharest. General surgery and proctology consultations, laparoscopic surgery and wound care.",
    skip: "Skip to content",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Meniul principal. */
export const nav = {
  ro: {
    label: "Meniu principal",
    links: [
      { href: "/", label: "Acasă" },
      { href: "/despre", label: "Despre mine" },
      { href: "/servicii", label: "Servicii" },
      { href: "/contact", label: "Contact" },
    ],
    cta: "Programează-te",
    switchLabel: "English version",
    languageName: "English",
    menuOpen: "Deschide meniul",
    menuClose: "Închide meniul",
  },
  en: {
    label: "Main menu",
    links: [
      { href: "/", label: "Home" },
      { href: "/despre", label: "About me" },
      { href: "/servicii", label: "Services" },
      { href: "/contact", label: "Contact" },
    ],
    cta: "Book a visit",
    switchLabel: "Versiunea în română",
    languageName: "Română",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
} satisfies Record<
  Locale,
  {
    label: string;
    links: { href: string; label: string }[];
    cta: string;
    switchLabel: string;
    languageName: string;
    menuOpen: string;
    menuClose: string;
  }
>;
