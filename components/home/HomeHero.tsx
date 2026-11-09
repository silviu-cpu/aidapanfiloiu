"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AppointmentLink } from "@/components/site/AppointmentModal";
import { useEffect, useRef, useState } from "react";
import { Loader } from "./Loader";
import type { HeroStore } from "./scene/utils";

const HeroCanvas = dynamic(() => import("./scene/HeroCanvas"), { ssr: false });

export type HeroCopy = {
  titleA: string;
  titleB: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  doctorName: string;
  doctorNote: string;
  /** Fotografia doamnei doctor, afișată mic lângă nume. */
  doctorPhoto: string;
  /** Specialitățile, afișate sub descriere (și în loader). */
  pills: [string, string, string];
  scroll: string;
  s2Eyebrow: string;
  s2Title: string;
  s2Text: string;
  loading: string;
};

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
      gsap.from("[data-hero-s1] > div > :not([data-specialties])", {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.25,
        clearProps: "transform,opacity,visibility",
      });
      const specialties = gsap.timeline({ delay: 0.6 });
      trackRef.current?.querySelectorAll("[data-specialty]").forEach((specialty) => {
        specialties.from(specialty.querySelectorAll("[data-letter]"), {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.035,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        });
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
              <h1 id="hero-title" className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {copy.titleA}
                <span className="block font-semibold text-[#a9dcd9]">{copy.titleB}</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">{copy.lead}</p>

              {/* Specialitățile se dezvăluie pe rând, literă cu literă. */}
              <ul data-specialties className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-white/85">
                {copy.pills.map((label, i) => (
                  <li key={label} className="flex items-center gap-5">
                    {i > 0 && <span aria-hidden="true" className="hidden h-4 w-px bg-white/20 sm:block" />}
                    <Link
                      data-specialty
                      href={conditionsHref}
                      aria-label={label}
                      className="inline-block whitespace-nowrap transition-colors hover:text-white"
                    >
                      <span aria-hidden="true" className="inline-block overflow-hidden align-bottom">
                        {Array.from(label).map((letter, index) => (
                          <span key={index} data-letter className="inline-block whitespace-pre">
                            {letter}
                          </span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <AppointmentLink
                  href={contactHref}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
                >
                  {copy.ctaPrimary}
                </AppointmentLink>
                <Link
                  href={conditionsHref}
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {copy.ctaSecondary} <span aria-hidden="true">↗</span>
                </Link>
              </div>

              {/* Semnătura: fotografia reală, numele și experiența, fără cutie */}
              <div className="mt-10 hidden max-w-md items-center gap-5 border-t border-white/10 pt-6 sm:flex">
                {/* Cerc cu un inel fin mentă; poza e mărită pe față, ca un portret. */}
                <span className="shrink-0 rounded-full border border-[#8fe6ea]/40 p-1 shadow-lg shadow-black/25">
                  <span className="relative block size-20 overflow-hidden rounded-full bg-white">
                    <Image
                      src={copy.doctorPhoto}
                      alt=""
                      width={160}
                      height={160}
                      className="size-full origin-[50%_18%] scale-[1.55] object-cover object-[50%_12%]"
                    />
                  </span>
                </span>
                <span>
                  <span className="block font-serif text-2xl leading-tight text-white">{copy.doctorName}</span>
                  <span className="mt-1 block text-sm text-white/60">{copy.doctorNote}</span>
                </span>
              </div>
            </div>
          </div>

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
