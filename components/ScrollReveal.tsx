"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Apariția lină a secțiunilor la scroll.
 *
 * După ce se încarcă pagina, componenta caută în fiecare secțiune (în afară de hero)
 * blocurile de conținut — titluri, paragrafe, butoane, carduri — și le marchează cu
 * `data-reveal`. Când un bloc intră pe ecran, primește `.is-visible` și urcă ușor din
 * transparență (animația e în globals.css). Cardurile dintr-o listă apar pe rând.
 *
 * Doar blocurile aflate încă SUB ecran sunt ascunse, deci nimic nu „clipește”.
 * Fără JavaScript sau cu „mișcare redusă”, totul rămâne vizibil.
 *
 * Excepții:
 *   data-reveal-skip  — secțiunea nu se animă deloc (are deja animația ei);
 *   data-reveal-leaf  — elementul apare ca un singur bloc, fără să se intre în el.
 */

const LEAF_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6", "P", "A", "BUTTON", "FORM", "FIGURE", "BLOCKQUOTE",
  "IMG", "PICTURE", "IFRAME", "SVG", "DETAILS", "LABEL", "TABLE", "DL", "SPAN",
]);
const MAX_DEPTH = 5;
const STAGGER_MS = 100;
const MAX_STAGGER = 6;

function isDecorative(el: Element) {
  const style = getComputedStyle(el);
  return (style.position === "absolute" && style.pointerEvents === "none") || el.getAttribute("aria-hidden") === "true";
}

/** O listă de elemente asemănătoare (carduri, puncte): apar pe rând. */
function isGroup(el: Element) {
  const kids = el.children.length;
  if (kids < 2) return false;
  if (el.tagName === "UL" || el.tagName === "OL") return true;
  if (!getComputedStyle(el).display.includes("grid")) return false;
  // O grilă de așezare (coloane „col-span”) nu e o listă: intrăm în fiecare coloană.
  return !Array.from(el.children).some((child) => /(^|\s)(\w+:)?col-span-/.test(child.className));
}

function isLeaf(el: Element, depth: number) {
  return (
    el.hasAttribute("data-reveal-leaf") ||
    LEAF_TAGS.has(el.tagName.toUpperCase()) ||
    el.children.length === 0 ||
    depth >= MAX_DEPTH ||
    !!el.querySelector("iframe, canvas")
  );
}

type Candidate = { el: HTMLElement; delay: number };

function mark(el: HTMLElement, delay: number, out: Candidate[]) {
  out.push({ el, delay });
}

function collect(el: Element, depth: number, out: Candidate[]) {
  let leafIndex = 0;
  for (const child of Array.from(el.children)) {
    if (!(child instanceof HTMLElement) || isDecorative(child) || child.closest("[data-reveal-skip]")) continue;
    if (isGroup(child)) {
      Array.from(child.children).forEach((item, i) => {
        if (item instanceof HTMLElement && !isDecorative(item)) mark(item, Math.min(i, MAX_STAGGER) * STAGGER_MS, out);
      });
    } else if (isLeaf(child, depth)) {
      mark(child, Math.min(leafIndex++, 3) * 80, out);
    } else {
      collect(child, depth + 1, out);
    }
  }
}

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let io: IntersectionObserver | null = null;
    let below: HTMLElement[] = [];

    const finish = (event: AnimationEvent) => {
      const el = event.currentTarget as HTMLElement;
      if (event.target !== el) return;
      // După animație scoatem marcajul, ca să nu blocheze alte animații ale elementului.
      el.removeAttribute("data-reveal");
      el.classList.remove("is-visible");
      el.style.removeProperty("--reveal-delay");
      el.removeEventListener("animationend", finish);
    };

    const run = () => {
      // Secțiunile paginii, fără hero (secțiunea cu titlul paginii, h1) și fără cele excluse.
      const sections = Array.from(document.querySelectorAll<HTMLElement>(".site-page section, footer"))
        .filter((s) => !s.parentElement?.closest("section"))
        .filter((s) => !s.closest("[data-reveal-skip]") && !s.querySelector("h1"));
      const candidates: Candidate[] = [];
      for (const section of sections) collect(section, 0, candidates);

      // Ce e deja pe ecran nu se atinge: ascundem doar ce urmează mai jos.
      const next = candidates.filter(({ el }) => el.getBoundingClientRect().top >= window.innerHeight);
      below = next.map(({ el }) => el);
      for (const { el, delay } of next) {
        el.setAttribute("data-reveal", "");
        if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.addEventListener("animationend", finish);
            el.classList.add("is-visible");
            io?.unobserve(el);
          }
        },
        // Fără margine negativă jos: și ultimele rânduri din subsol trebuie să poată apărea.
        { threshold: 0.08 },
      );
      below.forEach((el) => io?.observe(el));
    };

    // Așteptăm ca React să termine hidratarea paginii: dacă am modifica elementele
    // înainte, React ar semnala o nepotrivire între HTML-ul de pe server și cel din browser.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(run, { timeout: 800 }) : window.setTimeout(run, 300);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      io?.disconnect();
      for (const el of below) {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-visible");
        el.style.removeProperty("--reveal-delay");
        el.removeEventListener("animationend", finish);
      }
    };
  }, [pathname]);

  return null;
}
