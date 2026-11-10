"use client";

import gsap from "gsap";
import { Pause, Play, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type Testimonial = { text: string; author: string; role: string };

/** Cât stă o recenzie pe ecran înainte să plece (secunde). */
const HOLD = 4;

/**
 * Recenziile se schimbă singure: cuvintele recenziei curente se ridică și dispar în sus,
 * apoi cuvintele următoarei urcă de jos, unul după altul, din ceață.
 */
export default function TestimonialCarousel({
  items,
  labels,
}: {
  items: Testimonial[];
  labels: { region: string; review: string; pause: string; play: string; stars: string };
}) {
  const root = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const bar = useRef<HTMLSpanElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const busy = useRef(false);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Rulează doar cât secțiunea e pe ecran.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Starea inițială: doar prima recenzie e vizibilă.
  useEffect(() => {
    slides.current.forEach((slide, i) => {
      if (slide) gsap.set(slide, { autoAlpha: i === 0 ? 1 : 0 });
    });
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const from = indexRef.current;
      if (next === from || busy.current) return;
      const out = slides.current[from];
      const into = slides.current[next];
      if (!out || !into) return;
      busy.current = true;
      indexRef.current = next;
      setIndex(next);

      const words = (el: HTMLElement) => el.querySelectorAll("[data-word]");
      const meta = (el: HTMLElement) => el.querySelectorAll("[data-meta]");
      const stars = root.current?.querySelectorAll("[data-star]") ?? [];

      if (reduced) {
        gsap.set([...words(into), ...meta(into), ...stars], { clearProps: "all" });
        gsap
          .timeline({ onComplete: () => void (busy.current = false) })
          .to(out, { autoAlpha: 0, duration: 0.4 })
          .fromTo(into, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
        return;
      }

      const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });

      // Plecarea: cuvintele se ridică, se încețoșează și dispar, de la primul la ultimul.
      tl.to(words(out), {
        yPercent: -120,
        rotateX: 70,
        filter: "blur(10px)",
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.in",
        stagger: { each: 0.012 },
      })
        .to(meta(out), { y: -24, autoAlpha: 0, duration: 0.4, ease: "power2.in", stagger: 0.05 }, 0.1)
        .to(stars, { scale: 0.4, autoAlpha: 0.2, duration: 0.3, ease: "power2.in", stagger: 0.04 }, 0)
        .set(out, { autoAlpha: 0 })
        .set(into, { autoAlpha: 1 });

      // Intrarea: cuvintele urcă de jos, din ceață, cu o ușoară rotire spre privitor.
      tl.fromTo(
        words(into),
        { yPercent: 120, rotateX: -70, filter: "blur(10px)", autoAlpha: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.022 },
          clearProps: "filter",
        },
        "-=0.05",
      )
        .fromTo(
          meta(into),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          "-=0.6",
        )
        .to(stars, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.06 }, "<");
    },
    [reduced],
  );

  const next = useCallback(() => goTo((indexRef.current + 1) % items.length), [goTo, items.length]);

  // Bara de progres: când se umple, trece la recenzia următoare.
  const running = playing && visible && items.length > 1;
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    timer.current?.kill();
    timer.current = gsap.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, duration: HOLD, ease: "none", paused: true, onComplete: next },
    );
    return () => {
      timer.current?.kill();
    };
  }, [index, next]);

  useEffect(() => {
    if (running) timer.current?.play();
    else timer.current?.pause();
  }, [running, index]);

  return (
    <div
      ref={root}
      role="region"
      data-reveal-leaf
      aria-roledescription="carousel"
      aria-label={labels.region}
      className="flex flex-col items-center"
    >
      <div className="mb-6 flex gap-1 text-primary-fixed" aria-label={labels.stars} role="img">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} data-star className="inline-block">
            <Star size={20} fill="currentColor" strokeWidth={0} />
          </span>
        ))}
      </div>

      {/* Toate recenziile stau în aceeași celulă, deci înălțimea nu sare la schimbare. */}
      <div className="grid w-full [perspective:900px]">
        {items.map((item, i) => (
          <figure
            key={i}
            ref={(el) => {
              slides.current[i] = el;
            }}
            aria-hidden={i !== index}
            aria-roledescription="slide"
            className={`flex flex-col items-center [grid-area:1/1] ${i === 0 ? "" : "invisible opacity-0"}`}
          >
            <blockquote className="font-heading text-3xl leading-snug text-white md:text-[40px]">
              {`„${item.text}”`.split(" ").map((word, w) => (
                <span key={w}>
                  <span data-word className="inline-block origin-[50%_100%] will-change-transform">
                    {word}
                  </span>{" "}
                </span>
              ))}
            </blockquote>
            <figcaption className="mt-8 flex flex-col items-center">
              <span data-meta className="text-lg font-semibold text-white">
                {item.author}
              </span>
              <span data-meta className="text-primary-fixed-dim">
                {item.role}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? labels.pause : labels.play}
            className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            {playing ? <Pause size={14} fill="currentColor" strokeWidth={0} /> : <Play size={14} fill="currentColor" strokeWidth={0} />}
          </button>
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${labels.review} ${i + 1}`}
                aria-current={i === index}
                className="group relative h-1.5 overflow-hidden rounded-full bg-white/15 transition-[width] duration-500"
                style={{ width: i === index ? 48 : 12 }}
              >
                {i === index ? (
                  <span ref={bar} className="absolute inset-0 origin-left bg-primary-fixed" />
                ) : (
                  <span className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/30" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
