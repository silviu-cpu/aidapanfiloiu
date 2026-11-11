import type { CSSProperties } from "react";

/**
 * Trecerea dintre o secțiune închisă și una deschisă: o bandă lungă cu gradient
 * care pornește din culoarea secțiunii de sus, trece prin menta deschisă
 * (secondary-container) și ajunge în culoarea secțiunii de jos, la fel ca
 * gradientul din „Ghidul afecțiunilor”.
 *
 * Banda e intenționat înaltă: o trecere scurtă de la verde închis la alb arată ca o dungă.
 */
const FROM = {
  hero: "#1d4246",
  "surface-lowest": "var(--color-surface-lowest)",
  surface: "var(--color-surface)",
  forest: "var(--color-forest)",
  deep: "var(--color-deep)",
  "deep-2": "var(--color-deep-2)",
  primary: "var(--color-primary)",
} as const;

const TO = {
  "surface-lowest": "var(--color-surface-lowest)",
  surface: "var(--color-surface)",
  "surface-mid": "var(--color-surface-mid)",
  "mist-bg": "var(--color-mist-bg)",
  forest: "var(--color-forest)",
} as const;

/*
 * Hero-ul de pe Acasă are jos, în stânga, o lumină difuză (vezi .hero-bg în globals.css).
 * Aici o continuăm exact de unde se termină acolo, ca să nu rămână o linie la îmbinare:
 * același centru (5% din înălțimea ecranului sub marginea hero-ului) și aceeași mărime.
 */
const HERO_GLOW = "radial-gradient(90% 60svh at 25% 5svh, rgb(214 236 234 / 0.28), transparent 60%)";

const MINT = "var(--color-secondary-container)";

/** Amestecă două culori: `share` e cât la sută rămâne din prima. */
const mix = (a: string, b: string, share: number) => `color-mix(in oklab, ${a} ${share}%, ${b})`;

/*
 * Gradientul pornește încet din culoarea de sus și se stinge încet în cea de jos.
 * Dacă ar porni drept, ochiul ar vedea o muchie exact unde începe.
 */
const fadeStops = (from: string, to: string) =>
  [
    `${from} 0%`,
    `${mix(from, MINT, 96)} 10%`,
    `${mix(from, MINT, 84)} 21%`,
    `${mix(from, MINT, 62)} 33%`,
    `${mix(from, MINT, 36)} 45%`,
    `${mix(from, MINT, 14)} 56%`,
    `${MINT} 66%`,
    `${mix(MINT, to, 55)} 80%`,
    `${mix(MINT, to, 18)} 91%`,
    `${to} 100%`,
  ].join(", ");

export default function SectionFade({ from, to }: { from: keyof typeof FROM; to: keyof typeof TO }) {
  const fade = `linear-gradient(in oklab, ${fadeStops(FROM[from], TO[to])})`;
  const style: CSSProperties = { background: from === "hero" ? `${HERO_GLOW}, ${fade}` : fade };

  return <div aria-hidden="true" className="h-56 md:h-80" style={style} />;
}
