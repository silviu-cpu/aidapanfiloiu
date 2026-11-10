"use client";

import { useTranslation } from "@/components/LocaleProvider";

import { useEffect, useRef, useState } from "react";

export type ExperienceItem = {
  years: string;
  title: string;
  detail?: string;
};

/**
 * Timeline animat la scroll: linia se „umple” cu mentă pe măsură ce derulezi,
 * iar fiecare bulină devine verde când linia ajunge la ea.
 */
export default function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lit, setLit] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    if (!list || !section || !viewport) return;
    let frame = 0;
    let distance = 0;
    const measure = () => {
      distance = Math.max(0, list.scrollHeight - viewport.clientHeight + 12);
      if (pinned) setHeight(window.innerHeight + Math.max(items.length * 420, window.innerHeight * 3));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress = pinned && scrollable > 0
          ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollable) / 0.92)
          : 1;
        list.style.transform = pinned ? `translate3d(0, ${-progress * distance}px, 0)` : "";
        const positions = dotRefs.current.map((dot) => dot ? dot.offsetTop + (dot.offsetParent as HTMLElement).offsetTop + 8 : 0);
        const start = positions[0] ?? 12;
        const end = positions[positions.length - 1] ?? start;
        const reached = start + (end - start) * progress;
        if (fillRef.current) {
          fillRef.current.style.top = `${start}px`;
          fillRef.current.style.height = `${reached - start}px`;
        }
        setLit(positions.filter((position) => position <= reached + 0.5).length);
      });
    };
    const resize = () => { measure(); onScroll(); };
    measure();
    onScroll();
    const observer = new ResizeObserver(resize);
    observer.observe(list);
    observer.observe(viewport);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      list.style.transform = "";
    };
  }, [items.length, pinned]);

  return (
    <section ref={sectionRef} className="relative bg-forest text-white" style={pinned && height ? { height } : undefined} aria-labelledby="experience-title">
      <div className={pinned ? "sticky top-0 flex h-screen flex-col overflow-hidden px-6 pb-12 pt-24" : "relative overflow-hidden px-6 py-24"}>
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          <div className="shrink-0 pb-10">
            <h2 id="experience-title" className="mb-3 text-4xl text-white md:text-5xl">{t("Experiență profesională")}</h2>
            <p className="text-lg text-mist">{t("Parcursul meu, de la rezidențiat până azi.")}</p>
          </div>
          <div ref={viewportRef} className={pinned ? "min-h-0 flex-1 overflow-hidden px-2 pt-3" : "px-2 pt-3"}>
    <ol ref={listRef} className={`relative space-y-12 pb-3 ${pinned ? "will-change-transform" : ""}`}>
      {/* linia de fundal, de la prima la ultima bulină */}
      <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-0.5 rounded-full bg-white/15" />
      {/* linia care se umple */}
      <span
        ref={fillRef}
        aria-hidden
        className="absolute left-[7px] w-0.5 rounded-full bg-mint"
        style={{ top: 12, height: 0 }}
      />

      {items.map((item, i) => {
        const on = i < lit;
        return (
          <li key={`${item.years}-${item.title}`} className="relative pl-10">
            <span
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              aria-hidden
              className={`absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                on
                  ? "scale-110 border-mint bg-mint"
                  : "border-white/30 bg-forest"
              }`}
            />
            <div
              className={`flex flex-col gap-1 transition-all duration-500 sm:flex-row sm:items-baseline sm:gap-6 ${
                on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-40"
              }`}
            >
              <span className={`w-36 shrink-0 text-sm font-semibold ${on ? "text-mint" : "text-mist"}`}>
                {t(item.years)}
              </span>
              <div className="space-y-1">
                <p className="text-white">{t(item.title)}</p>
                {item.detail && <p className="text-sm text-mist/80">{t(item.detail)}</p>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
