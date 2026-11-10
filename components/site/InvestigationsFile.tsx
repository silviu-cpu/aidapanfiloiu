"use client";

import { useTranslation } from "@/components/LocaleProvider";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { investigations } from "@/lib/content";

const tabColors = [
  "bg-secondary-container text-primary",
  "bg-primary-fixed-dim text-primary",
  "bg-primary-container text-white",
];

/**
 * Investigațiile ca fișe într-o cartotecă.
 * La intrarea în ecran fișele se așază pe rând; la hover, focus sau click, o fișă iese în sus din teanc.
 * Pe telefon, fișele devin o listă simplă.
 */
export default function InvestigationsFile() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  // După intrarea în ecran, fișele răspund imediat la hover (fără întârzierea de la intrare).
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          window.setTimeout(() => setSettled(true), investigations.length * 90 + 600);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {/* Desktop: cartoteca */}
      <div className="hidden pt-36 md:block">
        <div className="flex justify-center" role="group" aria-label={t("Investigații")}>
          {investigations.map((inv, i) => {
            const isActive = i === active;
            return (
              <button
                key={inv.name}
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{
                  zIndex: isActive ? 50 : i,
                  opacity: shown ? 1 : 0,
                  transform: !shown
                    ? "translateY(64px)"
                    : isActive
                      ? "translateY(-112px) rotate(2deg)"
                      : "translateY(0)",
                  transitionDelay: shown && !settled ? `${i * 90}ms` : "0ms",
                }}
                className={`relative h-[300px] w-44 shrink-0 text-left transition-[transform,opacity] duration-500 ease-out focus-visible:outline-2 focus-visible:outline-primary lg:w-52 xl:w-56 ${
                  i === 0 ? "" : "md:-ml-20 lg:-ml-24 xl:-ml-16"
                }`}
              >
                <span
                  className={`absolute -top-6 left-4 max-w-[85%] truncate rounded-t-lg px-3 pb-2 pt-1 text-[11px] font-semibold ${
                    tabColors[i % tabColors.length]
                  }`}
                >
                  {t(inv.name)}
                </span>
                <span
                  className={`relative flex h-full flex-col gap-3 rounded-2xl border border-[#e8e1d6] bg-[#fbf8f2] p-5 transition-shadow duration-500 ${
                    isActive ? "shadow-2xl" : "shadow-[0_6px_18px_-8px_rgba(0,54,57,0.25)]"
                  }`}
                >
                  <span className="flex items-start gap-2">
                    <FileText size={18} className="mt-0.5 shrink-0 text-primary-container" />
                    <span className="font-heading text-xl leading-tight text-primary">{t(inv.name)}</span>
                  </span>
                  <Detail label={t("Ce arată")} text={inv.shows} />
                  <Detail label={t("Când e nevoie")} text={inv.when} />
                  <Detail label={t("Cum te pregătești")} text={inv.prep} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Telefon: listă */}
      <div className="flex flex-col gap-4 md:hidden">
        {investigations.map((inv, i) => (
          <div
            key={inv.name}
            style={{ transitionDelay: `${i * 70}ms` }}
            className={`flex flex-col gap-3 rounded-2xl border border-[#e8e1d6] bg-[#fbf8f2] p-5 shadow-sm transition-all duration-500 ${
              shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <span className="font-heading text-xl text-primary">{t(inv.name)}</span>
            <Detail label={t("Ce arată")} text={inv.shows} />
            <Detail label={t("Când e nevoie")} text={inv.when} />
            <Detail label={t("Cum te pregătești")} text={inv.prep} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  const { t } = useTranslation();
  return (
    <span className="block text-[13px] leading-snug text-on-surface-variant">
      <strong className="font-semibold text-on-surface">{t(label)}:</strong> {t(text)}
    </span>
  );
}
