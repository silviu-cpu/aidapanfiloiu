/**
 * Trecerea dintre o secțiune deschisă și una închisă (sau invers): o bandă cu gradient
 * care pornește din culoarea secțiunii de sus, trece prin menta deschisă
 * (secondary-container) și ajunge în culoarea secțiunii de jos — la fel ca
 * gradientul din „Ghidul afecțiunilor”.
 *
 * Culorile sunt scrise complet aici, ca Tailwind să le găsească la compilare.
 */
const FROM = {
  hero: "from-[#1d4246]",
  "surface-lowest": "from-surface-lowest",
  surface: "from-surface",
  forest: "from-forest",
  deep: "from-deep",
  "deep-2": "from-deep-2",
  primary: "from-primary",
} as const;

const TO = {
  "surface-lowest": "to-surface-lowest",
  surface: "to-surface",
  "surface-mid": "to-surface-mid",
  "mist-bg": "to-mist-bg",
  forest: "to-forest",
} as const;

export default function SectionFade({ from, to }: { from: keyof typeof FROM; to: keyof typeof TO }) {
  return (
    <div
      aria-hidden="true"
      className={`h-32 bg-gradient-to-b via-secondary-container md:h-48 ${FROM[from]} ${TO[to]}`}
    />
  );
}
