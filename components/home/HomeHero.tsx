"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Loader } from "./Loader";
import type { HeroStore } from "./scene/utils";

const HeroCanvas = dynamic(() => import("./scene/HeroCanvas"), { ssr: false });

export type HeroCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  doctorName: string;
  doctorNote: string;
  pills: [string, string, string];
  scroll: string;
  s2Eyebrow: string;
  s2Title: string;
  s2Text: string;
  loading: string;
};

/** Unde stau etichetele în jurul pensei (desktop) și încotro pleacă la scroll. */
const PILLS = [
  { className: "left-[72%] top-[24%]", away: { x: 120, y: -90 } },
  { className: "left-[80%] top-[60%]", away: { x: 160, y: 60 } },
  { className: "left-[54%] top-[66%]", away: { x: -60, y: 120 } },
];

export function HomeHero({
  copy,
  contactHref,
  conditionsHref,
}: {
  copy: HeroCopy;
  contactHref: string;
  conditionsHref: string;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const store = useRef<HeroStore>({ progress: 0, pointerX: 0, pointerY: 0, reduced: false, revealedAt: 0 });
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  // Scena 3D se încarcă abia după ce s-a desenat loader-ul, ca desenul să nu sacadeze.
  const [drawn, setDrawn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Cât timp e loader-ul pe ecran, pagina nu se poate derula și pornește mereu de sus.
  useEffect(() => {
    if (loaded) return;
    const html = document.documentElement;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
    };
  }, [loaded]);

  // După loader: textul din hero urcă rând cu rând.
  useEffect(() => {
    if (!loaded || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-s1] > div > *", {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.25,
        clearProps: "transform,opacity,visibility",
      });
    }, trackRef);
    return () => ctx.revert();
  }, [loaded, reduced]);

  // Respectăm setarea de sistem „mișcare redusă”.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      store.current.reduced = mq.matches;
      setReduced(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [store]);

  // Mouse-ul mișcă ușor pensa și camera.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      store.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      store.current.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [store]);

  // Scena 3D se oprește când secțiunea iese din ecran.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll lin (Lenis) + cronologia legată de scroll (GSAP ScrollTrigger).
  useEffect(() => {
    if (reduced || !loaded) return;
    const st = store.current;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.085 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            st.progress = self.progress;
          },
        },
      });

      tl.to("[data-hero-hint]", { autoAlpha: 0, duration: 0.04 }, 0)
        .to("[data-hero-s1]", { autoAlpha: 0, y: -70, duration: 0.14 }, 0.03);
      PILLS.forEach((pill, i) => {
        tl.to(`[data-hero-pill="${i}"]`, { autoAlpha: 0, ...pill.away, scale: 0.85, duration: 0.12 }, 0.02 + i * 0.015);
      });
      tl.fromTo("[data-hero-s2]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.8)
        // Ține cronologia exact pe 0..1, ca să se potrivească cu scena 3D.
        .to({}, { duration: 0 }, 1);
    }, trackRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      st.progress = 0;
    };
  }, [reduced, loaded, store]);

  return (
    <>
      <Loader
        ready={canvasReady}
        reduced={reduced}
        label={copy.loading}
        note={copy.pills.join(" · ")}
        onDrawn={() => setDrawn(true)}
        onDone={() => {
          store.current.revealedAt = performance.now();
          setLoaded(true);
        }}
      />

      <section
        ref={trackRef}
        aria-labelledby="hero-title"
        className={reduced ? "relative" : "relative h-[340svh]"}
      >
        <div className="hero-bg sticky top-0 h-svh overflow-hidden text-white">
          <div className="absolute inset-0" aria-hidden="true">
            {drawn && <HeroCanvas store={store} active={active} onReady={() => setCanvasReady(true)} />}
          </div>

          {/* Scena 1: textul din hero */}
          <div
            data-hero-s1
            className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 sm:px-8 md:justify-center md:pb-0"
          >
            <div className="pointer-events-auto max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-[#8fe6ea]" />
                {copy.eyebrow}
              </p>
              <h1 id="hero-title" className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {copy.titleA}
                <span className="block font-semibold text-[#a9dcd9]">{copy.titleB}</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">{copy.lead}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={contactHref}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  {copy.ctaPrimary}
                </Link>
                <Link
                  href={conditionsHref}
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {copy.ctaSecondary} <span aria-hidden="true">↗</span>
                </Link>
              </div>

              <div className="mt-8 hidden w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] py-2.5 pl-2.5 pr-5 backdrop-blur-md sm:flex">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold">{copy.doctorName}</span>
                  <span className="block text-xs text-white/60">{copy.doctorNote}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Etichetele care plutesc în jurul pensei */}
          {copy.pills.map((label, i) => (
            <span
              key={label}
              data-hero-pill={i}
              className={`absolute z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-lg shadow-black/15 backdrop-blur-md md:inline-flex ${PILLS[i].className}`}
            >
              <span className="grid size-4 place-items-center rounded-full bg-ink text-[9px] text-white">+</span>
              {label}
            </span>
          ))}

          {/* Scena 2: textul de deasupra tăvii */}
          {!reduced && (
            <div data-hero-s2 className="invisible absolute inset-x-0 top-0 z-10 px-5 pt-28 text-center opacity-0 sm:pt-32">
              <SceneTwoText copy={copy} />
            </div>
          )}

          {!reduced && (
            <div data-hero-hint className="absolute inset-x-0 bottom-6 z-10 hidden flex-col md:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {copy.scroll}
              <span className="hero-hint-line h-8 w-px bg-white/40" />
            </div>
          )}
        </div>
      </section>

      {/* Cu mișcare redusă, scena 2 devine o secțiune obișnuită */}
      {reduced && (
        <section className="hero-bg px-5 py-24 text-center text-white">
          <SceneTwoText copy={copy} />
        </section>
      )}
    </>
  );
}

function SceneTwoText({ copy }: { copy: HeroCopy }) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8fe6ea]">{copy.s2Eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">{copy.s2Title}</h2>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">{copy.s2Text}</p>
    </div>
  );
}
