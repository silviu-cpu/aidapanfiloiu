"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, type RefObject } from "react";
import { CAMERA_FOV, CAMERA_START, Scene } from "./Scene";
import type { HeroStore } from "./utils";

/**
 * Calitatea scenei, aleasă după dispozitiv. Telefoanele au plăci video mult mai slabe
 * decât un laptop: acolo desenăm la rezoluție mai mică și cu umbre mai ieftine.
 */
function pickQuality() {
  const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const device = window.devicePixelRatio || 1;
  return {
    maxDpr: Math.min(device, mobile ? 1.5 : 1.75),
    minDpr: Math.min(device, mobile ? 1 : 1.25),
    shadowSize: mobile ? 1024 : 2048,
  };
}

/** Canvas-ul 3D. Se încarcă doar în browser și se oprește când secțiunea nu e pe ecran. */
export default function HeroCanvas({
  store,
  active,
  onReady,
}: {
  store: RefObject<HeroStore>;
  active: boolean;
  onReady?: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [quality] = useState(pickQuality);
  const [dpr, setDpr] = useState(quality.maxDpr);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      shadows="percentage"
      camera={{ position: CAMERA_START.toArray(), fov: CAMERA_FOV, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // Umbrele se recalculează doar când se mișcă ceva pe tavă (vezi Scene), nu la fiecare cadru.
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        setReady(true);
      }}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s ease" }}
    >
      {/* Dacă dispozitivul nu ține ritmul, rezoluția scade treptat; dacă are rezervă, crește la loc. */}
      <PerformanceMonitor
        bounds={(refresh) => (refresh > 90 ? [50, 80] : [45, 57])}
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(quality.minDpr, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(quality.maxDpr, d + 0.25))}
        onFallback={() => setDpr(quality.minDpr)}
      />
      <Suspense fallback={null}>
        <Scene store={store} shadowSize={quality.shadowSize} />
        <AfterFirstFrames onDone={onReady} />
      </Suspense>
    </Canvas>
  );
}

/**
 * Anunță că scena e gata abia după primele cadre desenate: atunci s-au compilat
 * materialele și umbrele, deci intrarea pensei nu mai sacadează.
 */
function AfterFirstFrames({ onDone }: { onDone?: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onDone?.();
  });
  return null;
}
