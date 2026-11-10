"use client";

import { useEffect, useRef, useState } from "react";
import { SIGNATURE_HEIGHT, SIGNATURE_PATHS, SIGNATURE_WIDTH } from "./signature";

type Phase = "drawing" | "waiting" | "leaving" | "gone";

/** Cât durează umplerea semnăturii, bucla de la final, cât mai așteptăm scena 3D și cât ține ieșirea. */
const FILL_MS = 1600;
const KNOT_MS = 550;
/** Cât durează ștampila: coborâre, apăsare, ridicare. */
const STAMP_MS = 1100;
const MAX_WAIT_MS = 4000;
const HOLD_MS = 350;
const EXIT_MS = 800;

/** Bucla de la finalul semnăturii, desenată față de ultimul ei punct. */
const KNOT = "M0 0C26 -44 86 -40 70 4C58 38 8 26 22 -6C34 -34 74 -30 104 -8";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Pornește direct, curge constant și încetinește puțin spre final. */
const ease = (t: number) => 1 - Math.pow(1 - t, 1.5);

/**
 * Ecranul de încărcare: semnătura doamnei doctor apare direct, întreagă, ca un contur, și se
 * umple de culoare literă cu literă, de la stânga la dreapta; urmează bucla de la final, apoi
 * ștampila coboară și aplică parafa. După ce s-a încărcat scena 3D, loader-ul pleacă.
 */
export function Loader({
  ready,
  reduced,
  label,
  stamp,
  onDrawn,
  onDone,
}: {
  ready: boolean;
  reduced: boolean;
  label: string;
  /** Parafa care se „aplică” lângă semnătură: numele și specialitatea, fără cod. */
  stamp: { name: string; lines: [string, string] };
  onDrawn: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("drawing");
  const main = useRef<(SVGPathElement | null)[]>([]);
  const glow = useRef<(SVGPathElement | null)[]>([]);
  const knot = useRef<SVGPathElement>(null);
  const parafa = useRef<HTMLDivElement>(null);
  const stampTool = useRef<HTMLDivElement>(null);
  const stampShadow = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onDrawn, onDone });

  useEffect(() => {
    callbacks.current = { onDrawn, onDone };
  });

  // Etapa 1: semnătura, apoi ștampila. Elementele se modifică direct, fără re-randări React la fiecare cadru.
  useEffect(() => {
    const paths = main.current.filter((p): p is SVGPathElement => !!p);
    const lengths = paths.map((p) => p.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
    const filled = new Array(paths.length).fill(false);

    // Conturul semnăturii apare direct, întreg.
    paths.forEach((path, i) => {
      path.style.strokeDashoffset = "0";
      const g = glow.current[i];
      if (g) g.style.strokeDashoffset = "0";
    });

    // Bucla pornește din ultimul punct al semnăturii.
    const last = paths.length - 1;
    const endPoint = last >= 0 ? paths[last].getPointAtLength(lengths[last]) : { x: SIGNATURE_WIDTH, y: SIGNATURE_HEIGHT * 0.6 };
    knot.current?.setAttribute("transform", `translate(${endPoint.x} ${endPoint.y})`);

    // Ordinea: umplerea semnăturii, bucla, apoi ștampila cu parafa.
    const fillMs = reduced ? 0 : FILL_MS;
    const stampStart = fillMs + KNOT_MS * 0.7;
    const endMs = reduced ? 0 : stampStart + STAMP_MS;
    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;

      // 1) Literele se umplu de cerneală pe rând, de la stânga la dreapta (tranziția e pe fill-opacity).
      const reached = (reduced ? 1 : ease(clamp01(elapsed / fillMs))) * total;
      paths.forEach((path, i) => {
        if (!filled[i] && reached >= starts[i] + lengths[i] * 0.5) {
          filled[i] = true;
          path.style.fillOpacity = "0.95";
        }
      });

      // 2) Bucla de la finalul semnăturii.
      if (!reduced && elapsed >= fillMs && knot.current) {
        knot.current.style.strokeDashoffset = String(1 - clamp01((elapsed - fillMs) / KNOT_MS));
      }

      // 3) Ștampila: coboară, apasă (parafa apare la impact), apoi se ridică și dispare.
      if (reduced) {
        parafa.current?.classList.add("is-stamped");
      } else {
        // Se calculează la fiecare cadru, ca să ajungă sigur în poziția finală (ascunsă),
        // chiar dacă browserul sare peste cadre.
        const s = clamp01((elapsed - stampStart) / STAMP_MS);
        const tool = stampTool.current;
        if (tool) {
          const down = 1 - Math.pow(1 - clamp01(s / 0.4), 2.2);
          const up = s > 0.6 ? Math.pow(clamp01((s - 0.6) / 0.4), 2) : 0;
          const squish = s > 0.4 && s < 0.6 ? Math.sin(((s - 0.4) / 0.2) * Math.PI) * 0.06 : 0;
          const lift = (1 - down) * 160 + up * 180;
          tool.style.setProperty("--lift", `${lift.toFixed(1)}px`);
          tool.style.setProperty("--squish", (1 - squish).toFixed(3));
          const visible = Math.min(clamp01(s / 0.12), 1 - clamp01((s - 0.78) / 0.22));
          tool.style.opacity = String(visible);
          // Umbra: cu cât ștampila e mai jos, cu atât umbra e mai mică și mai închisă.
          const near = 1 - lift / 180;
          const shadow = stampShadow.current;
          if (shadow) {
            shadow.style.opacity = String(clamp01(near) * 0.8 * visible);
            shadow.style.transform = `scale(${(1.35 - clamp01(near) * 0.4).toFixed(3)})`;
          }
        }
        if (s >= 0.44) parafa.current?.classList.add("is-stamped");
      }

      if (elapsed < endMs) {
        raf = requestAnimationFrame(step);
      } else {
        parafa.current?.classList.add("is-stamped");
        setPhase("waiting");
        callbacks.current.onDrawn();
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Cât timp loader-ul acoperă ecranul, pagina de dedesubt nu se mai desenează.
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
      className={`site-loader hero-bg fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 text-white transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
        phase === "leaving" ? "pointer-events-none -translate-y-6 opacity-0" : ""
      }`}
    >
      <span className="sr-only">{label}</span>

      <div className="relative w-[min(86vw,640px)]">
      <svg
        viewBox={`0 0 ${SIGNATURE_WIDTH} ${SIGNATURE_HEIGHT}`}
        className={`w-full overflow-visible ${phase === "waiting" ? "loader-wait" : ""}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Strălucirea: aceleași litere, cu linie lată și transparentă (mai ieftin decât un filtru CSS) */}
        <g stroke="#8fe6ea" strokeOpacity={0.16}>
          {SIGNATURE_PATHS.map((d, i) => (
            <path
              key={`g${i}`}
              ref={(el) => {
                glow.current[i] = el;
              }}
              d={d}
              pathLength={1}
              strokeDasharray="1 2"
              strokeDashoffset={1}
              strokeWidth={5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Firul: conturul literelor, care apoi se umple */}
        <g stroke="#8fe6ea" fill="#d9f5f3">
          {SIGNATURE_PATHS.map((d, i) => (
            <path
              key={`m${i}`}
              ref={(el) => {
                main.current[i] = el;
              }}
              d={d}
              pathLength={1}
              strokeDasharray="1 2"
              strokeDashoffset={1}
              strokeWidth={1.1}
              vectorEffect="non-scaling-stroke"
              style={{ fillOpacity: 0, transition: "fill-opacity 0.6s ease" }}
            />
          ))}
        </g>

        {/* Bucla de la final */}
        <path
          ref={knot}
          d={KNOT}
          stroke="#8fe6ea"
          strokeWidth={1.1}
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1 2"
          strokeDashoffset={1}
        />

      </svg>

        {/* Parafa sub nume, iar deasupra ei ștampila care coboară, apasă și pleacă */}
        {/* Destul de jos încât ștampila, când apasă, să nu acopere semnătura. */}
        <div aria-hidden="true" className="absolute -bottom-44 right-[2%] sm:-bottom-[11.5rem]">
          <div
            ref={parafa}
            className="parafa rounded-[10px] border-[3px] border-double border-[#8fe6ea]/80 px-4 py-2 text-center font-serif leading-tight text-[#8fe6ea]/85"
          >
            <p className="text-[13px] font-medium sm:text-sm">{stamp.name}</p>
            <p className="mt-0.5 text-[11px] sm:text-xs">{stamp.lines[0]}</p>
            <p className="text-[11px] sm:text-xs">{stamp.lines[1]}</p>
          </div>

          {!reduced && (
            <>
              {/* Umbra ștampilei pe „hârtie”: se strânge și se închide la culoare când ștampila coboară */}
              <div
                ref={stampShadow}
                className="pointer-events-none absolute inset-x-[2%] -bottom-2 h-5 rounded-[50%] bg-black/60 blur-md"
                style={{ opacity: 0 }}
              />
              <div
                ref={stampTool}
                className="pointer-events-none absolute inset-x-[2%] bottom-0 origin-bottom"
                style={{ opacity: 0, transform: "translateY(calc(-1 * var(--lift, 160px))) scaleY(var(--squish, 1))" }}
              >
                {/* Ștampila de parafă cu mâner de lemn, văzută ușor de sus */}
                <svg viewBox="0 0 220 190" className="w-full overflow-visible drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]">
                  <defs>
                    <linearGradient id="stamp-wood" x1="0" x2="1">
                      <stop offset="0" stopColor="#5d3a24" />
                      <stop offset="0.35" stopColor="#a8714a" />
                      <stop offset="0.6" stopColor="#8c5a38" />
                      <stop offset="1" stopColor="#4a2d1b" />
                    </linearGradient>
                    <linearGradient id="stamp-metal" x1="0" x2="1">
                      <stop offset="0" stopColor="#7c8a8f" />
                      <stop offset="0.4" stopColor="#f1f5f6" />
                      <stop offset="0.7" stopColor="#b9c4c8" />
                      <stop offset="1" stopColor="#6c797d" />
                    </linearGradient>
                    <linearGradient id="stamp-base" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#3a2617" />
                      <stop offset="1" stopColor="#21150c" />
                    </linearGradient>
                    <radialGradient id="stamp-knob" cx="0.38" cy="0.32" r="0.75">
                      <stop offset="0" stopColor="#c48a5f" />
                      <stop offset="0.55" stopColor="#8c5a38" />
                      <stop offset="1" stopColor="#4a2d1b" />
                    </radialGradient>
                  </defs>
                  {/* Mânerul (ciuperca de lemn) */}
                  <ellipse cx="110" cy="30" rx="36" ry="24" fill="url(#stamp-knob)" />
                  <ellipse cx="100" cy="20" rx="12" ry="6" fill="#f3d2b4" opacity="0.35" />
                  {/* Gâtul și inelul metalic */}
                  <path d="M96 48Q96 60 92 92H128Q124 60 124 48Z" fill="url(#stamp-wood)" />
                  <rect x="88" y="88" width="44" height="10" rx="2" fill="url(#stamp-metal)" />
                  {/* Talpa de lemn: fața de sus (mai deschisă) și fața din față */}
                  <path d="M22 112L44 98H176L198 112Z" fill="#7a4f31" />
                  <path d="M22 112H198V150H22Z" fill="url(#stamp-base)" />
                  <path d="M22 112H198" stroke="#a8714a" strokeWidth="1.5" opacity="0.7" />
                  {/* Cauciucul cu cerneală */}
                  <rect x="26" y="150" width="168" height="12" rx="1.5" fill="#141b1c" />
                  <rect x="26" y="160" width="168" height="2.5" fill="#8fe6ea" opacity="0.85" />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cerneala neuniformă a parafei: margini ușor zimțate și pete mai deschise */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="parafa-ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1.35" result="speckle" />
          <feComposite in="rough" in2="speckle" operator="in" />
        </filter>
      </svg>
    </div>
  );
}
