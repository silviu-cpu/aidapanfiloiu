"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MenuLink = { href: string; label: string; current: boolean };

/**
 * Meniul de pe telefon: butonul „hamburger” deschide un panou sub bara de navigare,
 * cu paginile site-ului și schimbarea limbii. Se închide la Esc, la clic în afară
 * și când se schimbă pagina.
 */
export function MobileMenu({
  links,
  language,
  labels,
}: {
  links: MenuLink[];
  language: { href: string; code: string; label: string; name: string };
  labels: { open: string; close: string; menu: string };
}) {
  const pathname = usePathname();
  // Meniul ține minte pe ce pagină a fost deschis, așa că se închide singur când se schimbă pagina.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((prev) => {
      const next = typeof value === "function" ? value(prev === pathname) : value;
      return next ? pathname : null;
    });
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenOn(null);
      button.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className="md:hidden">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-white/15 bg-[#0f2629]/95 p-2 text-white shadow-xl shadow-black/30 backdrop-blur-xl"
      >
        <ul aria-label={labels.menu} className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-2xl px-4 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-2 border-t border-white/10 pt-2">
          <Link
            href={language.href}
            hrefLang={language.code}
            lang={language.code}
            aria-label={language.label}
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="rounded-full border border-white/25 px-2 py-0.5 text-xs font-semibold uppercase">{language.code}</span>
            {language.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
