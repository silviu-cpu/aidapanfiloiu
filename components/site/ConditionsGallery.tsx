"use client";

import { useTranslation } from "@/components/LocaleProvider";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import Photo from "@/components/site/Photo";
import { AppointmentLink } from "./AppointmentModal";
import { useEffect, useRef, useState } from "react";
import { conditions, type Condition } from "@/lib/content";

/**
 * Galerie orizontală „fixată”: secțiunea rămâne pe ecran și cardurile alunecă spre
 * stânga în timp ce pacientul derulează în jos; pagina continuă abia după ultima
 * afecțiune. Merge la fel pe telefon, unde se poate și glisa stânga–dreapta.
 * Dacă ecranul e prea jos pentru un card întreg sau e activă „mișcarea redusă”,
 * devine un carusel obișnuit.
 */
export default function ConditionsGallery() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [details, setDetails] = useState<Condition | null>(null);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const total = conditions.length;
  const swipe = useRef<{ x: number; y: number; index: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => {
      const heading = headingRef.current;
      const card = trackRef.current?.firstElementChild as HTMLElement | null;
      const text = card?.lastElementChild as HTMLElement | null | undefined;
      if (!heading || !card || !text) return;
      // Când e fixată, cardul ia înălțimea rămasă pe ecran (cel mult 600px); poza se micșorează,
      // textul nu. Cel mai mic card acceptat: textul întreg + o poză de măcar 96px.
      const minCard = text.offsetHeight + 96;
      // Titlu + card + spațiu pentru navbar, margini și bara de jos.
      const requiredHeight = heading.offsetHeight + minCard + 184;
      setPinned(mq.matches && requiredHeight <= window.innerHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    if (headingRef.current) observer.observe(headingRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    if (!pinned) {
      // Înălțimea salvată e folosită doar când galeria e fixată, deci nu trebuie resetată.
      track.style.transform = "";
      const distance = track.scrollWidth - track.clientWidth;
      const progress = distance > 0 ? Math.min(1, Math.max(0, track.scrollLeft / distance)) : 0;
      setActive(Math.round(progress * (total - 1)));
      if (barRef.current) barRef.current.style.width = `${((progress * (total - 1) + 1) / total) * 100}%`;
      return;
    }

    track.scrollLeft = 0;

    let distance = 0;
    let frame = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      // Înălțimea zonei fixate (100svh) nu se schimbă când bara browserului de pe telefon
      // apare sau dispare, deci secțiunea nu „sare” în timpul derulării.
      const stage = (section.firstElementChild as HTMLElement | null)?.clientHeight || window.innerHeight;
      setHeight(distance + stage);
    };
    const onResize = () => {
      measure();
      onScroll();
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
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [pinned, total]);

  const navigate = (index: number) => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    const progress = Math.max(0, Math.min(total - 1, index)) / Math.max(1, total - 1);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (pinned) {
      const top = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({ top: top + progress * (section.offsetHeight - window.innerHeight), behavior });
    } else {
      track.scrollTo({ left: progress * (track.scrollWidth - track.clientWidth), behavior });
    }
  };

  // Când galeria e fixată, o glisare stânga–dreapta duce la cardul următor sau anterior.
  const onTouchStart = (e: React.TouchEvent) => {
    if (!pinned) return;
    swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, index: active };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!pinned || !start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    navigate(start.index + (dx < 0 ? 1 : -1));
  };

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (pinned || !track) return;
    const distance = track.scrollWidth - track.clientWidth;
    const progress = distance > 0 ? Math.min(1, Math.max(0, track.scrollLeft / distance)) : 0;
    if (barRef.current) barRef.current.style.width = `${((progress * (total - 1) + 1) / total) * 100}%`;
    setActive(Math.round(progress * (total - 1)));
  };

  // Fișa completă se deschide într-o fereastră peste pagină.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!details || !dialog) return;
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [details]);

  return (
    <section
      ref={sectionRef}
      data-reveal-skip
      className="relative bg-forest text-white"
      style={pinned && height ? { height } : undefined}
      aria-label={t("Afecțiuni tratate")}
    >
      <div className={pinned ? "sticky top-0 flex h-svh flex-col overflow-hidden pb-10 pt-24" : "py-16 md:py-20"}>
        <div ref={headingRef} className="container-x mb-8 flex shrink-0 flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl text-white md:text-5xl">{t("Afecțiuni tratate")}</h2>
            <p className="text-lg text-mist">
              {t(pinned ? "Derulează ca să le vezi pe toate." : "Glisează ca să le vezi pe toate.")}
            </p>
          </div>
            <div className="flex shrink-0 items-center gap-5">
              <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold tracking-wider text-mist">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div className="h-1.5 w-36 overflow-hidden rounded-full bg-forest-2">
                <div ref={barRef} className="h-full rounded-full bg-mist" style={{ width: `${100 / total}%` }} />
              </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(active - 1)}
                  disabled={active === 0}
                  aria-label={t("Afecțiunea anterioară")}
                  className="flex size-11 items-center justify-center rounded-full border border-mist/30 text-mist transition-colors hover:bg-mist/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist disabled:cursor-default disabled:opacity-30"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(active + 1)}
                  disabled={active === total - 1}
                  aria-label={t("Afecțiunea următoare")}
                  className="flex size-11 items-center justify-center rounded-full border border-mist/30 text-mist transition-colors hover:bg-mist/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist disabled:cursor-default disabled:opacity-30"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
        </div>

        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={`flex items-stretch gap-6 px-6 pb-4 lg:px-8 ${
            pinned
              ? "min-h-0 w-max flex-1 touch-pan-y will-change-transform"
              : "snap-x snap-mandatory overflow-x-auto"
          }`}
        >
          {conditions.map((c, i) => {
            const focus = !pinned || i === active;
            return (
              <article
                key={c.id}
                className={`flex w-[85vw] shrink-0 snap-center flex-col overflow-hidden rounded-[1.75rem] border bg-forest-2 shadow-xl transition-all duration-500 md:w-[520px] ${
                  pinned ? "max-h-[600px]" : "h-[540px] md:h-[min(600px,70vh)]"
                } ${
                  focus ? "scale-100 border-mist/30 opacity-100" : "scale-95 border-mist/10 opacity-70"
                }`}
              >
                {/* Poza ocupă spațiul rămas; pe ecrane joase se micșorează ea, nu textul. */}
                <div className="relative min-h-24 w-full flex-1 bg-nav">
                  <Photo src={c.image} alt={t(c.imageAlt)} sizes="(min-width: 768px) 520px, 85vw" className={`object-cover ${c.imageClassName ?? ""}`} />
                </div>
                <div className="flex shrink-0 flex-col gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl leading-tight text-white md:text-3xl">{t(c.name)}</h3>
                    <p className="line-clamp-3 text-white/80">{t(c.short)}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mist/15 pt-4">
                    <button
                      type="button"
                      onClick={() => setDetails(c)}
                      aria-haspopup="dialog"
                      className="inline-flex items-center gap-2 rounded-full border border-mist/40 px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:bg-mist hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist"
                    >
                      {t("Citește mai mult")} <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <AppointmentLink
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-mist/40 px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:bg-mist hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist"
                    >
                      {t("Programează-te")} <ArrowRight size={16} aria-hidden="true" />
                    </AppointmentLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby="condition-title"
        onClose={() => setDetails(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const b = event.currentTarget.getBoundingClientRect();
          if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) setDetails(null);
        }}
        data-lenis-prevent
        className="fixed inset-0 m-auto max-h-[88dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-[1.75rem] border border-mist/20 bg-forest-2 p-0 text-white shadow-2xl backdrop:bg-[#082629]/75 backdrop:backdrop-blur-sm"
      >
        {details && (
          <>
            <div className="relative h-48 w-full bg-nav sm:h-60">
              <Photo src={details.image} alt={t(details.imageAlt)} sizes="(min-width: 672px) 672px, 100vw" className={`object-cover ${details.imageClassName ?? ""}`} />
              <button
                type="button"
                autoFocus
                onClick={() => setDetails(null)}
                aria-label={t("Închide")}
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-forest-2/80 text-white backdrop-blur hover:bg-forest-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mist"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <h3 id="condition-title" className="text-3xl leading-tight text-white sm:text-[34px]">{t(details.name)}</h3>
              <p className="mt-4 leading-relaxed text-white/85">{t(details.short)}</p>
              <div className="mt-6 space-y-5 border-t border-mist/15 pt-6">
                {[
                  { label: "Cum se manifestă", text: details.symptoms },
                  { label: "Cum stabilim diagnosticul", text: details.assessment },
                  { label: "Opțiuni de tratament", text: details.treatment },
                ].map(({ label, text }) => (
                  <div key={label}>
                    <h4 className="text-sm font-semibold text-mist">{t(label)}</h4>
                    <p className="mt-2 text-[15px] leading-relaxed text-white/85">{t(text)}</p>
                  </div>
                ))}
              </div>
              <AppointmentLink
                href="/contact"
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-mist px-6 py-3 text-center text-[15px] font-semibold leading-snug text-primary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mist"
              >
                {t("Programează o consultație")}
              </AppointmentLink>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
