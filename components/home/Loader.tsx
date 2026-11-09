"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "drawing" | "waiting" | "leaving" | "gone";

/** Cât durează desenul, cât mai așteptăm scena 3D după el și cât ține ieșirea. */
const DRAW_MS = 3400;
const MAX_WAIT_MS = 4000;
const HOLD_MS = 250;
const EXIT_MS = 800;

/** Cerc ca drum SVG din două semicercuri (un singur arc de 360° se măsoară greșit în browser). */
const circle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx} ${cy + r}A${r} ${r} 0 1 1 ${cx} ${cy - r}`;

/** Brațele robotului: prinderea pe consolă → cot → suportul instrumentului → punctul de intrare. */
const ARMS = [
  { pivot: [124, 46], elbow: [110, 80], holder: [152, 104], port: [198, 141] },
  { pivot: [164, 46], elbow: [154, 78], holder: [180, 106], port: [207, 142] },
  { pivot: [204, 46], elbow: [218, 78], holder: [224, 106], port: [215, 142] },
  { pivot: [244, 46], elbow: [262, 82], holder: [252, 108], port: [224, 141] },
];

/**
 * Robot chirurgical cu mai multe brațe (sistem de tip da Vinci), desenat ca o schiță tehnică.
 * E un desen generic, fără designul sau sigla vreunui producător.
 * Piesele se trasează pe rând, în ordinea în care e „asamblat” robotul.
 */
const PARTS = [
  // Podeaua
  "M16 196H304",
  // Căruciorul, roțile și coloana
  "M36 172H92Q98 172 98 178V184Q98 190 92 190H36Q30 190 30 184V178Q30 172 36 172Z",
  `${circle(44, 193, 3.5)}${circle(84, 193, 3.5)}`,
  "M56 172V46Q56 38 64 38H66Q72 38 72 46V172M56 120H72M56 128H72",
  // Consola de sus, din care atârnă brațele
  "M60 34H262Q268 34 268 40Q268 46 262 46H60",
  circle(64, 40, 7),
  // Masa de operație și pacientul acoperit cu câmp steril
  "M128 150H300M214 150V188M192 188H236",
  "M136 150Q146 132 172 134H262Q288 134 296 150",
  // Cele patru brațe, cu articulațiile lor
  ...ARMS.flatMap(({ pivot, elbow, holder }) => [
    `M${pivot.join(" ")}L${elbow.join(" ")}L${holder.join(" ")}`,
    `${circle(pivot[0], pivot[1] + 3, 3.5)}${circle(elbow[0], elbow[1], 3.5)}${circle(holder[0], holder[1], 2.5)}`,
  ]),
  // Instrumentele, care se întâlnesc în punctul de lucru
  ...ARMS.map(({ holder, port }) => `M${holder.join(" ")}L${port.join(" ")}`),
];

/** Fiecare piesă începe puțin după cea dinainte; ultima se termină exact la 100. */
const partProgress = (p: number, i: number) =>
  Math.min(1, Math.max(0, (p - (i / (PARTS.length - 1)) * 0.64) / 0.36));

/** Ritmul desenului: pornește direct, curge constant și încetinește puțin spre final. */
const ease = (t: number) => 1 - Math.pow(1 - t, 1.6);

/**
 * Ecranul de încărcare, în două etape:
 * 1. robotul se desenează, fără nimic greu în paralel, ca liniile să curgă fluid;
 * 2. abia apoi se încarcă scena 3D, cât desenul stă complet pe ecran, și loader-ul pleacă.
 */
export function Loader({
  ready,
  reduced,
  label,
  note,
  onDrawn,
  onDone,
}: {
  ready: boolean;
  reduced: boolean;
  label: string;
  note: string;
  onDrawn: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("drawing");
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const counter = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onDrawn, onDone });

  useEffect(() => {
    callbacks.current = { onDrawn, onDone };
  });

  // Etapa 1: desenul. Elementele se modifică direct, fără re-randări React la fiecare cadru.
  useEffect(() => {
    const duration = reduced ? 600 : DRAW_MS;
    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const p = ease(t);
      paths.current.forEach((el, i) => {
        if (el) el.style.strokeDashoffset = String(1 - partProgress(p, i % PARTS.length));
      });
      if (counter.current) counter.current.textContent = String(Math.round(p * 100)).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;

      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setPhase("waiting");
        callbacks.current.onDrawn();
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Cât timp loader-ul acoperă ecranul, pagina de dedesubt nu se mai desenează
  // (efectele de sticlă de sub el ar încetini animația).
  useEffect(() => {
    if (phase === "leaving" || phase === "gone") return;
    const html = document.documentElement;
    html.classList.add("site-loading");
    return () => html.classList.remove("site-loading");
  }, [phase]);

  // Etapa 2: când scena 3D e gata (sau a durat prea mult), loader-ul pleacă.
  useEffect(() => {
    if (phase !== "waiting") return;
    const id = window.setTimeout(
      () => {
        setPhase("leaving");
        callbacks.current.onDone();
      },
      ready ? HOLD_MS : MAX_WAIT_MS,
    );
    return () => window.clearTimeout(id);
  }, [phase, ready]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`site-loader hero-bg fixed inset-0 z-[70] flex flex-col items-center justify-center text-white transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
        phase === "leaving" ? "pointer-events-none -translate-y-6 opacity-0" : ""
      }`}
    >
      <span className="sr-only">{label}</span>

      <svg
        viewBox="10 26 300 176"
        className={`w-[min(84vw,460px)] overflow-visible ${phase === "waiting" ? "loader-wait" : ""}`}
        fill="none"
        stroke="#8fe6ea"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Strălucirea: aceleași linii, mai late și transparente (mai ieftin decât un filtru CSS) */}
        {[
          { width: 4, opacity: 0.14 },
          { width: 1.15, opacity: 1 },
        ].map((layer, l) => (
          <g key={l} strokeWidth={layer.width} strokeOpacity={layer.opacity}>
            {PARTS.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  paths.current[l * PARTS.length + i] = el;
                }}
                d={d}
                pathLength={1}
                strokeDasharray="1 2"
                strokeDashoffset={1}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="mt-10 flex w-[min(84vw,460px)] items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold tracking-tight">Dr. Aida Panfiloiu</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/50">{note}</p>
        </div>
        <p ref={counter} className="font-serif text-4xl tabular-nums leading-none text-[#a9dcd9]" aria-hidden="true">
          00
        </p>
      </div>
      <div className="mt-4 h-px w-[min(84vw,460px)] overflow-hidden bg-white/10" aria-hidden="true">
        <div ref={bar} className="h-full origin-left bg-[#8fe6ea]" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
