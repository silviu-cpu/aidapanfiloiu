"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode, type Ref, type RefObject } from "react";
import * as THREE from "three";
import { GRASPER_CENTER, GRASPER_HALF_THICKNESS, GRASPER_OUTLINE } from "./Grasper";
import { mats } from "./materials";
import {
  Forceps,
  FORCEPS_HALF_THICKNESS,
  FORCEPS_OUTLINE,
  SCALPEL_HALF_THICKNESS,
  SCALPEL_OUTLINE,
  Scalpel,
  Scissors,
  SCISSORS_HALF_THICKNESS,
  SCISSORS_OUTLINE,
} from "./TrayInstruments";
import {
  easeInQuad,
  easeOutCubic,
  extrudeCentered,
  lerp,
  range,
  roundedRect,
  smoothOutline,
  type HeroStore,
  type Placement,
} from "./utils";

/** Centrul tăvii în lume: sub hero, ca să apară doar când camera coboară. */
export const TRAY_POSITION = new THREE.Vector3(0, -6, 0);

/*
 * Tava e construită „cu fața în sus” pe axa +Z locală, apoi culcată.
 * Înălțimi (Z local): fundul locașurilor, fața inserției, marginea tăvii.
 */
const BASE_BOTTOM = -0.42;
const FLOOR_Z = -0.3;
const INSERT_TOP = -0.06;
const RIM_TOP = 0.03;

const OUTER = { w: 5.9, h: 3.9, r: 0.3 };
const INNER = { w: 5.62, h: 3.62, r: 0.2 };

const PLACE = {
  grasper: { x: 0, y: 0.68, r: 0 },
  scissors: { x: -1.3, y: -0.82, r: 0 },
  scalpel: { x: 1.15, y: -0.52, r: 0 },
  forceps: { x: 1.15, y: -1.14, r: 0 },
} satisfies Record<string, Placement>;

const GRASPER_OFFSET: [number, number] = [-GRASPER_CENTER[0], -GRASPER_CENTER[1]];

type GlowLine = { material: { opacity: number } };

/*
 * „Masa pregătită”: cât pensa zboară spre tavă, celelalte instrumente apar pe rând
 * deasupra tăvii și coboară încet, fiecare în locașul lui, cu un mic recul la final.
 * Încep când tava e deja la vedere (camera coboară până la 0.72) și se termină la 0.80.
 */
const LAND_DURATION = 0.16;
const LAND_HEIGHT = 1.1;

const LANDINGS = [
  { key: "scissors", start: 0.48, place: PLACE.scissors, half: SCISSORS_HALF_THICKNESS, spin: 0.5, slot: 1 },
  { key: "scalpel", start: 0.56, place: PLACE.scalpel, half: SCALPEL_HALF_THICKNESS, spin: -0.4, slot: 2 },
  { key: "forceps", start: 0.64, place: PLACE.forceps, half: FORCEPS_HALF_THICKNESS, spin: 0.35, slot: 3 },
] as const;

const INSTRUMENT: Record<(typeof LANDINGS)[number]["key"], ReactNode> = {
  scissors: <Scissors />,
  scalpel: <Scalpel />,
  forceps: <Forceps />,
};

export function Tray({
  portrait,
  anchorRef,
  glowRef,
  store,
}: {
  portrait: boolean;
  anchorRef: RefObject<THREE.Object3D | null>;
  glowRef: Ref<GlowLine>;
  store: RefObject<HeroStore>;
}) {
  const landed = useRef<(THREE.Group | null)[]>([]);
  const slotGlows = useRef<(GlowLine | null)[]>([]);
  const geo = useMemo(() => {
    const slots = [
      smoothOutline(GRASPER_OUTLINE, PLACE.grasper, GRASPER_OFFSET),
      smoothOutline(SCISSORS_OUTLINE, PLACE.scissors),
      smoothOutline(SCALPEL_OUTLINE, PLACE.scalpel),
      smoothOutline(FORCEPS_OUTLINE, PLACE.forceps),
    ];

    const insertShape = roundedRect(INNER.w - 0.03, INNER.h - 0.03, INNER.r) as THREE.Shape;
    insertShape.holes = slots.map((pts) => new THREE.Path(pts));
    const insertDepth = INSERT_TOP - FLOOR_Z - 0.024;
    const insert = extrudeCentered(insertShape, insertDepth, 0.012, 24);
    insert.translate(0, 0, (FLOOR_Z + INSERT_TOP) / 2);

    const rimShape = roundedRect(OUTER.w, OUTER.h, OUTER.r) as THREE.Shape;
    rimShape.holes = [roundedRect(INNER.w, INNER.h, INNER.r, new THREE.Path())];
    const rim = extrudeCentered(rimShape, RIM_TOP - BASE_BOTTOM - 0.05, 0.025, 24);
    rim.translate(0, 0, (RIM_TOP + BASE_BOTTOM) / 2);

    const floor = new THREE.ShapeGeometry(roundedRect(INNER.w, INNER.h, INNER.r) as THREE.Shape);
    floor.translate(0, 0, FLOOR_Z + 0.001);

    // Contururile luminoase ale locașurilor, ridicate puțin deasupra inserției.
    const outlines = slots.map((slot) => {
      const pts = slot.map((p) => new THREE.Vector3(p.x, p.y, INSERT_TOP + 0.004));
      pts.push(pts[0].clone());
      return pts;
    });

    return { insert, rim, floor, glow: outlines[0], outlines };
  }, []);

  useFrame(() => {
    const st = store.current;
    // Cu mișcare redusă scena rămâne în hero; instrumentele stau direct în tavă.
    const p = st.reduced ? 1 : st.progress;

    LANDINGS.forEach((l, i) => {
      const g = landed.current[i];
      if (!g) return;
      const t = range(p, l.start, l.start + LAND_DURATION);

      g.visible = t > 0;
      // 1) apare deasupra locașului, 2) coboară, 3) mic recul la final („clic”).
      const appear = easeOutCubic(range(t, 0, 0.3));
      const fall = easeInQuad(range(t, 0.3, 0.84));
      const hop = t > 0.84 ? Math.sin(((t - 0.84) / 0.16) * Math.PI) * 0.035 : 0;
      const air = 1 - fall;

      g.scale.setScalar(lerp(0.001, 1, appear));
      g.position.z = FLOOR_Z + l.half + LAND_HEIGHT * air + hop;
      g.rotation.set(air * 0.22, air * -0.12, l.place.r + air * l.spin);

      const glow = slotGlows.current[l.slot];
      if (glow) glow.material.opacity = range(t, 0.15, 0.6) * (1 - range(t, 0.86, 1)) * 0.9;
    });
  });

  return (
    <group position={TRAY_POSITION} rotation={[-Math.PI / 2, 0, portrait ? Math.PI / 2 : 0]}>
      <mesh geometry={geo.rim} material={mats.tray} castShadow receiveShadow />
      {/* Fundul se desenează după inserție: partea acoperită de ea e sărită de placa video. */}
      <mesh geometry={geo.floor} material={mats.foamDeep} receiveShadow renderOrder={1} />
      <mesh geometry={geo.insert} material={mats.foam} castShadow receiveShadow />

      <Line
        ref={glowRef as never}
        points={geo.glow}
        color="#8fe6ea"
        lineWidth={2}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />

      {/* Locul exact unde aterizează pensa */}
      <object3D
        ref={anchorRef}
        position={[PLACE.grasper.x, PLACE.grasper.y, FLOOR_Z + GRASPER_HALF_THICKNESS]}
        rotation-z={PLACE.grasper.r}
      />

      {/* Conturul luminos al fiecărui locaș, aprins când îi coboară instrumentul */}
      {LANDINGS.map((l) => (
        <Line
          key={`glow-${l.key}`}
          ref={((el: GlowLine | null) => {
            slotGlows.current[l.slot] = el;
          }) as never}
          points={geo.outlines[l.slot]}
          color="#8fe6ea"
          lineWidth={2}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      ))}

      {/* Celelalte instrumente: aterizează pe rând (poziția pe înălțime e setată în useFrame) */}
      {LANDINGS.map((l, i) => (
        <group
          key={l.key}
          ref={(el) => {
            landed.current[i] = el;
          }}
          position={[l.place.x, l.place.y, FLOOR_Z + l.half]}
          rotation-z={l.place.r}
          visible={false}
        >
          {INSTRUMENT[l.key]}
        </group>
      ))}
    </group>
  );
}
