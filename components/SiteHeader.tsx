import Link from "next/link";
import { AppointmentLink } from "./site/AppointmentModal";
import { localePath, nav, type Locale } from "@/lib/i18n";

/** Bara de navigare: o „pastilă” de sticlă care plutește deasupra paginii. */
export function SiteHeader({ lang, current }: { lang: Locale; current: string }) {
  const t = nav[lang];
  const other: Locale = lang === "ro" ? "en" : "ro";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label={t.label}
        className="pointer-events-auto mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-full border border-white/15 bg-[#0f2629]/60 py-2 pl-5 pr-2 text-white shadow-xl shadow-black/20 backdrop-blur-xl"
      >
        <Link href={localePath(lang, "/")} className="flex items-center gap-2 text-sm font-semibold">
          <span className="size-1.5 rounded-full bg-[#8fe6ea]" aria-hidden="true" />
          Dr. Aida Panfiloiu
        </Link>

        <ul className="hidden items-center gap-1 text-xs font-medium md:flex">
          {t.links.map((link) => (
            <li key={link.href}>
              <Link
                href={localePath(lang, link.href)}
                aria-current={link.href === current ? "page" : undefined}
                className="rounded-full px-3 py-1.5 text-white/75 transition-colors hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          {/* Schimbarea limbii: duce la aceeași pagină în cealaltă limbă */}
          <Link
            href={localePath(other, current)}
            hrefLang={other}
            lang={other}
            aria-label={t.switchLabel}
            className="rounded-full px-3 py-2 text-xs font-semibold uppercase text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            {other}
          </Link>
          <AppointmentLink
            href={localePath(lang, "/contact")}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            {t.cta}
          </AppointmentLink>
        </div>
      </nav>
    </header>
  );
}
