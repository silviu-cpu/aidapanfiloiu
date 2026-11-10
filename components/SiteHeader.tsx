import Link from "next/link";
import Image from "next/image";
import { AppointmentLink } from "./site/AppointmentModal";
import { MobileMenu } from "./MobileMenu";
import { localePath, nav, type Locale } from "@/lib/i18n";

/** Bara de navigare: o „pastilă” de sticlă care plutește deasupra paginii. */
export function SiteHeader({ lang, current }: { lang: Locale; current: string }) {
  const t = nav[lang];
  const other: Locale = lang === "ro" ? "en" : "ro";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label={t.label}
        className="pointer-events-auto relative mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-full border border-white/15 bg-[#0f2629]/60 py-2 pl-3 pr-2 text-white shadow-xl shadow-black/20 backdrop-blur-xl sm:gap-4 sm:pl-5"
      >
        <Link href={localePath(lang, "/")} className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
          <Image src="/brand/logo.svg" width={32} height={32} alt="" aria-hidden="true" className="size-6 shrink-0 sm:size-8" />
          <span className="max-w-[5.5rem] leading-tight sm:max-w-none">Dr. Aida Panfiloiu</span>
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

        <div className="flex items-center gap-1">
          {/* Schimbarea limbii: duce la aceeași pagină în cealaltă limbă. Pe telefon e în meniu. */}
          <Link
            href={localePath(other, current)}
            hrefLang={other}
            lang={other}
            aria-label={t.switchLabel}
            className="hidden rounded-full px-2 py-2 text-xs font-semibold uppercase sm:inline-block text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:px-3"
          >
            {other}
          </Link>
          <AppointmentLink
            href={localePath(lang, "/contact")}
            className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-ink transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-xs"
          >
            {t.cta}
          </AppointmentLink>
          <MobileMenu
            links={t.links.map((link) => ({
              href: localePath(lang, link.href),
              label: link.label,
              current: link.href === current,
            }))}
            language={{ href: localePath(other, current), code: other, label: t.switchLabel, name: t.languageName }}
            labels={{ open: t.menuOpen, close: t.menuClose, menu: t.label }}
          />
        </div>
      </nav>
    </header>
  );
}
