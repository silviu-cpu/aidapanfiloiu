"use client";

import { useEffect, useRef, useState } from "react";
import { SIGNATURE_HEIGHT, SIGNATURE_PATHS, SIGNATURE_WIDTH } from "./signature";

type Phase = "drawing" | "waiting" | "leaving" | "gone";

/** Cât durează cusutul semnăturii, nodul de la final, cât mai așteptăm scena 3D și cât ține ieșirea. */
const DRAW_MS = 2600;
const KNOT_MS = 550;
/** Cât durează ștampila: coborâre, apăsare, ridicare. */
const STAMP_MS = 1100;
const MAX_WAIT_MS = 4000;
const HOLD_MS = 350;
const EXIT_MS = 800;

/*
 * Instrumentul care scrie: un portac (pensa cu inele folosită la suturi) care ține un ac
 * chirurgical curb, cu firul ieșind din coada acului. Vârful acului e în origine (punctul
 * care scrie), iar portacul urcă spre dreapta-sus, ca un stilou ținut în mână.
 * Unități ale semnăturii (aprox. 9 unități = 1 px).
 */
type Vec = [number, number];
const add = (a: Vec, b: Vec, k = 1): Vec => [a[0] + b[0] * k, a[1] + b[1] * k];
const unit = (v: Vec): Vec => {
  const l = Math.hypot(v[0], v[1]);
  return [v[0] / l, v[1] / l];
};
const pt = (v: Vec) => `${v[0].toFixed(1)} ${v[1].toFixed(1)}`;

/** Acul curb (aprox. 3/8 de cerc), de la vârf până la coadă. */
const NEEDLE = "M0 0C8 -66 -40 -138 -122 -150";
/** Coada acului (partea în care e prins firul), puțin mai groasă. */
const NEEDLE_SWAGE = "M-104 -149L-122 -150";
/** Firul care pleacă din coada acului. */
const THREAD = "M-122 -150C-180 -156 -236 -120 -268 -70";

const DIR = unit([0.55, -0.83]);
const PERP: Vec = [-DIR[1], DIR[0]];
/** Punctul în care fălcile portacului prind acul (pe curba acului). */
const GRIP: Vec = [-41, -111];
const JOINT = add(GRIP, DIR, 150);
const RING_BASE = add(JOINT, DIR, 430);
const RINGS: Vec[] = [add(RING_BASE, PERP, 64), add(RING_BASE, PERP, -64)];
const RING_R = 58;

const HOLDER = {
  jaws: `M${pt(add(GRIP, PERP, 7))}L${pt(add(JOINT, PERP, 16))}M${pt(add(GRIP, PERP, -7))}L${pt(add(JOINT, PERP, -16))}`,
  shanks: RINGS.map((ring, i) => {
    const from = add(JOINT, PERP, i === 0 ? 16 : -16);
    const edge = add(ring, unit([JOINT[0] - ring[0], JOINT[1] - ring[1]]), RING_R);
    return `M${pt(from)}L${pt(edge)}`;
  }).join(""),
};

/** Mărimea instrumentului față de semnătură (să se recunoască, fără să acopere literele). */
const NEEDLE_SCALE = 1.25;
/** Nodul de la finalul cusăturii, desenat față de ultimul punct al semnăturii. */
const KNOT = "M0 0C26 -44 86 -40 70 4C58 38 8 26 22 -6C34 -34 74 -30 104 -8";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Pornește direct, curge constant și încetinește puțin spre final. */
const ease = (t: number) => 1 - Math.pow(1 - t, 1.5);
/** Cea mai scurtă diferență dintre două unghiuri (grade). */
const angleDelta = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

/**
 * Ecranul de încărcare: un ac chirurgical „coase” semnătura doamnei doctor,
 * literă cu literă; firul lăsat în urmă devine scrisul. La final se face un nod și
 * se aplică parafa, iar după ce s-a încărcat scena 3D loader-ul pleacă.
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
  const needle = useRef<SVGGElement>(null);
  const knot = useRef<SVGPathElement>(null);
  const parafa = useRef<HTMLDivElement>(null);
  const stampTool = useRef<HTMLDivElement>(null);
  const stampShadow = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onDrawn, onDone });

  useEffect(() => {
    callbacks.current = { onDrawn, onDone };
  });

  // Etapa 1: cusutul. Elementele SVG se modifică direct, fără re-randări React la fiecare cadru.
  useEffect(() => {
    const paths = main.current.filter((p): p is SVGPathElement => !!p);
    const lengths = paths.map((p) => p.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
    const filled = new Array(paths.length).fill(false);

    const duration = reduced ? 600 : DRAW_MS;
    const pos = { x: 0, y: 0, angle: 0, placed: false };
    let end = { x: SIGNATURE_WIDTH, y: SIGNATURE_HEIGHT * 0.6 };
    let raf = 0;
    let start = 0;

    const placeNeedle = (x: number, y: number, angle: number, opacity: number) => {
      if (!needle.current) return;
      needle.current.setAttribute("transform", `translate(${x} ${y}) rotate(${angle})`);
      needle.current.style.opacity = String(opacity);
    };

    const drawFrame = (p: number) => {
      const L = p * total;
      let active = -1;
      paths.forEach((path, i) => {
        const local = clamp01((L - starts[i]) / lengths[i]);
        const offset = String(1 - local);
        path.style.strokeDashoffset = offset;
        const g = glow.current[i];
        if (g) g.style.strokeDashoffset = offset;
        if (local > 0 && local < 1) active = i;
        // Litera terminată se „umple”, ca o semnătură cu cerneală.
        if (local >= 1 && !filled[i]) {
          filled[i] = true;
          path.style.fillOpacity = "0.95";
        }
      });

      if (reduced || active < 0) return;
      const path = paths[active];
      const at = (L - starts[active]);
      const pt = path.getPointAtLength(at);
      const ahead = path.getPointAtLength(Math.min(lengths[active], at + 6));
      const target = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      if (!pos.placed) {
        Object.assign(pos, { x: pt.x, y: pt.y, angle: 0, placed: true });
      }
      // Instrumentul alunecă lin între puncte (și peste salturile dintre litere).
      pos.x += (pt.x - pos.x) * 0.45;
      pos.y += (pt.y - pos.y) * 0.45;
      // Rămâne aproape drept, ca un stilou în mână: se înclină doar puțin după direcția scrisului.
      const lean = Math.max(-9, Math.min(9, angleDelta(0, target) * 0.08));
      pos.angle += (lean - pos.angle) * 0.15;
      end = { x: pt.x, y: pt.y };
      placeNeedle(pos.x, pos.y, pos.angle, 1);
    };

    // Ordinea: întâi numele scris, apoi ștampila aplică parafa.
    const knotMs = reduced ? 0 : KNOT_MS;
    const stampStart = duration + knotMs * 0.7;
    const endMs = reduced ? duration : stampStart + STAMP_MS;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;

      // 1) Numele, scris de portac.
      const t = clamp01(elapsed / duration);
      drawFrame(ease(t));

      // Nodul de la final: firul face o buclă, iar portacul iese în sus și dispare.
      if (t >= 1 && !reduced) {
        const k = clamp01((elapsed - duration) / KNOT_MS);
        if (knot.current) {
          knot.current.setAttribute("transform", `translate(${end.x} ${end.y})`);
          knot.current.style.strokeDashoffset = String(1 - k);
        }
        const out = k * k;
        placeNeedle(end.x + 104 + out * 260, end.y - 8 - out * 360, 0, 1 - out);
      }

      // 2) Ștampila: coboară, apasă (parafa apare la impact), apoi se ridică și dispare.
      if (!reduced && elapsed > stampStart) {
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
      } else if (reduced && t >= 1) {
        parafa.current?.classList.add("is-stamped");
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

        {/* Nodul de la final */}
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

        {/* Portacul care ține acul curb, cu firul din coada acului */}
        {!reduced && (
          <g ref={needle} style={{ opacity: 0 }}>
            <g transform={`scale(${NEEDLE_SCALE})`} stroke="#dfe7ea" vectorEffect="non-scaling-stroke">
              <path d={THREAD} stroke="#8fe6ea" strokeOpacity={0.6} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              {/* Acul */}
              <path d={NEEDLE} strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
              <path d={NEEDLE} stroke="#ffffff" strokeOpacity={0.75} strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
              <path d={NEEDLE_SWAGE} strokeWidth={3.2} vectorEffect="non-scaling-stroke" />
              {/* Portacul: fălcile, încheietura, brațele și inelele */}
              <path d={HOLDER.jaws} strokeWidth={1.8} vectorEffect="non-scaling-stroke" />
              <circle cx={JOINT[0]} cy={JOINT[1]} r={20} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
              <path d={HOLDER.shanks} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
              {RINGS.map((ring) => (
                <circle
                  key={pt(ring)}
                  cx={ring[0]}
                  cy={ring[1]}
                  r={RING_R}
                  strokeWidth={1.6}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </g>
        )}
      </svg>

        {/* Parafa sub nume, iar deasupra ei ștampila care coboară, apasă și pleacă */}
        <div aria-hidden="true" className="absolute -bottom-16 right-[2%] sm:-bottom-20">
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
                className="pointer-events-none absolute -inset-x-[8%] bottom-0 origin-bottom"
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
