"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, type RefObject } from "react";
import { CAMERA_FOV, CAMERA_START, Scene } from "./Scene";
import type { HeroStore } from "./utils";

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

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      shadows
      camera={{ position: CAMERA_START.toArray(), fov: CAMERA_FOV, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => setReady(true)}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s ease" }}
    >
      <Suspense fallback={null}>
        <Scene store={store} />
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
