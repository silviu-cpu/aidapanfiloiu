"use client";

import { useTranslation } from "@/components/LocaleProvider";

import Photo from "@/components/site/Photo";
import { AppointmentLink } from "./AppointmentModal";
import { useEffect, useRef, useState } from "react";
import { conditions } from "@/lib/content";

/**
 * Galerie orizontală „fixată”: pe desktop, secțiunea rămâne pe ecran și cardurile
 * alunecă spre stânga în timp ce pacientul derulează în jos.
 * Pe telefon sau cu „reduce motion” devine un carusel obișnuit.
 */
export default function ConditionsGallery() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const total = conditions.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    if (!pinned) {
      // Înălțimea salvată e folosită doar când galeria e fixată, deci nu trebuie resetată.
      track.style.transform = "";
      return;
    }

    let distance = 0;
    let frame = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      setHeight(distance + window.innerHeight);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
        track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
        if (barRef.current) barRef.current.style.width = `${((progress * (total - 1) + 1) / total) * 100}%`;
        setActive(Math.round(progress * (total - 1)));
      });
    };

    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [pinned, total]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-forest text-white"
      style={pinned && height ? { height } : undefined}
      aria-label={t("Afecțiuni tratate")}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-20"}>
        <div className="container-x mb-10 flex flex-col justify-between gap-6 pt-16 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl text-white md:text-5xl">{t("Afecțiuni tratate")}</h2>
            <p className="text-lg text-mist">
              {t(pinned ? "Derulează ca să le vezi pe toate." : "Glisează ca să le vezi pe toate.")}
            </p>
          </div>
          {pinned && (
            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              <span className="text-sm font-semibold tracking-wider text-mist">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div className="h-1.5 w-36 overflow-hidden rounded-full bg-forest-2">
                <div ref={barRef} className="h-full rounded-full bg-mist" style={{ width: `${100 / total}%` }} />
              </div>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          className={`flex gap-6 px-6 lg:px-8 ${
            pinned ? "w-max will-change-transform" : "snap-x snap-mandatory overflow-x-auto pb-4"
          }`}
        >
          {conditions.map((c, i) => {
            const focus = !pinned || i === active;
            return (
              <article
                key={c.id}
                className={`flex h-[540px] w-[85vw] shrink-0 snap-center flex-col overflow-hidden rounded-[1.75rem] border bg-forest-2 shadow-xl transition-all duration-500 md:h-[min(600px,70vh)] md:w-[520px] ${
                  focus ? "scale-100 border-mist/30 opacity-100" : "scale-95 border-mist/10 opacity-70"
                }`}
              >
                <div className="relative h-[55%] w-full bg-nav">
                  <Photo src={c.image} alt={t(c.imageAlt)} sizes="(min-width: 768px) 520px, 85vw" className={`object-cover ${c.imageClassName ?? ""}`} />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl leading-tight text-white md:text-3xl">{t(c.name)}</h3>
                    <p className="text-white/80">{t(c.short)}</p>
                    <p className="font-medium text-mist">{t("Tratament:")}{" "}{t(c.treatment)}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mist/15 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {c.places.map((p) => (
                        <span key={p} className="rounded-full border border-mist/40 px-2.5 py-0.5 text-xs text-mist">
                          {t(p)}
                        </span>
                      ))}
                    </div>
                    <AppointmentLink href="/contact" className="text-sm font-semibold text-mist hover:underline">
                      {t("Programează-te →")}</AppointmentLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
