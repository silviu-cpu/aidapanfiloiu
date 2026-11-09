"use client";

import { useEffect, useRef, useState } from "react";

export type ExperienceItem = {
  years: string;
  title: string;
  detail?: string;
};

/**
 * Timeline animat la scroll: linia se „umple” cu mentă pe măsură ce derulezi,
 * iar fiecare bulină se aprinde când linia ajunge la ea. Ultima aprinsă pulsează.
 */
export default function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Punctul de referință: puțin sub mijlocul ecranului.
        const line = window.innerHeight * 0.62;
        const rect = list.getBoundingClientRect();
        const first = dotRefs.current[0]?.getBoundingClientRect();
        const last = dotRefs.current[items.length - 1]?.getBoundingClientRect();
        if (first && last && fillRef.current) {
          const start = first.top + first.height / 2;
          const end = last.top + last.height / 2;
          const reached = Math.min(Math.max(line - start, 0), end - start);
          fillRef.current.style.top = `${start - rect.top}px`;
          fillRef.current.style.height = `${reached}px`;
        }
        let count = 0;
        dotRefs.current.forEach((dot) => {
          if (dot && dot.getBoundingClientRect().top + 8 <= line) count += 1;
        });
        setLit(count);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  return (
    <ol ref={listRef} className="relative space-y-12">
      {/* linia de fundal, de la prima la ultima bulină */}
      <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-0.5 rounded-full bg-white/15" />
      {/* linia care se umple */}
      <span
        ref={fillRef}
        aria-hidden
        className="absolute left-[7px] w-0.5 rounded-full bg-mint shadow-[0_0_12px_rgba(134,239,217,0.7)] transition-[height] duration-150 ease-out"
        style={{ top: 12, height: 0 }}
      />

      {items.map((item, i) => {
        const on = i < lit;
        const current = on && i === lit - 1;
        return (
          <li key={`${item.years}-${item.title}`} className="relative pl-10">
            <span
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              aria-hidden
              className={`absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                on
                  ? "scale-110 border-mint bg-mint shadow-[0_0_0_6px_rgba(134,239,217,0.15)]"
                  : "border-white/30 bg-forest"
              }`}
            >
              {current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />}
            </span>
            <div
              className={`flex flex-col gap-1 transition-all duration-500 sm:flex-row sm:items-baseline sm:gap-6 ${
                on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-40"
              }`}
            >
              <span className={`w-36 shrink-0 text-sm font-semibold ${on ? "text-mint" : "text-mist"}`}>
                {item.years}
              </span>
              <div className="space-y-1">
                <p className="text-white">{item.title}</p>
                {item.detail && <p className="text-sm text-mist/80">{item.detail}</p>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
