"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * La trecerea pe o pagină nouă, pagina pornește de sus.
 *
 * Next.js păstrează poziția de scroll dacă noua pagină pare deja vizibilă. Când pleci de jos
 * de pe o pagină lungă (Acasă are animația pe mai multe ecrane), browserul te lasă jos și pe
 * pagina nouă. Aici o ducem sus, cu două excepții: butoanele Înapoi/Înainte ale browserului
 * (acolo poziția veche e restaurată, ca pe orice site) și linkurile cu ancoră (#locatii etc.).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const historyNav = useRef(false);

  useEffect(() => {
    const onPop = () => {
      historyNav.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    // Prima încărcare o lasă browserului.
    if (first.current) {
      first.current = false;
      return;
    }
    if (historyNav.current) {
      historyNav.current = false;
      return;
    }
    if (window.location.hash) return;
    // „instant”: site-ul are scroll lin activat, iar aici nu vrem animația de la jos în sus.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
