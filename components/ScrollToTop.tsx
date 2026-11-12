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

    // Site-ul are scroll lin (CSS), iar aici nu vrem animația de la jos în sus. Unele browsere
    // (Safari) îl aplică și peste „instant”, așa că îl oprim cât timp sărim sus.
    const html = document.documentElement;
    const toTop = () => {
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      html.style.scrollBehavior = previous;
    };
    toTop();
    // Încă o dată în cadrul următor: dacă pagina nouă își termină încărcarea sau browserul
    // mai are inerție de la derularea cu degetul, nu rămânem la jumătatea paginii.
    const frame = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
