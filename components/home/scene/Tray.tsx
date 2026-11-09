"use client";

import { Line } from "@react-three/drei";
import { useMemo, type Ref, type RefObject } from "react";
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
import { extrudeCentered, roundedRect, smoothOutline, type Placement } from "./utils";

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

export function Tray({
  portrait,
  anchorRef,
  glowRef,
}: {
  portrait: boolean;
  anchorRef: RefObject<THREE.Object3D | null>;
  glowRef: Ref<GlowLine>;
}) {
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

    const base = extrudeCentered(roundedRect(OUTER.w, OUTER.h, OUTER.r) as THREE.Shape, 0.08, 0.02);
    base.translate(0, 0, (BASE_BOTTOM + FLOOR_Z) / 2);

    const rimShape = roundedRect(OUTER.w, OUTER.h, OUTER.r) as THREE.Shape;
    rimShape.holes = [roundedRect(INNER.w, INNER.h, INNER.r, new THREE.Path())];
    const rim = extrudeCentered(rimShape, RIM_TOP - BASE_BOTTOM - 0.05, 0.025, 24);
    rim.translate(0, 0, (RIM_TOP + BASE_BOTTOM) / 2);

    const floor = new THREE.ShapeGeometry(roundedRect(INNER.w, INNER.h, INNER.r) as THREE.Shape);
    floor.translate(0, 0, FLOOR_Z + 0.001);

    // Conturul luminos al locașului pensei, ridicat puțin deasupra inserției.
    const glow = slots[0].map((p) => new THREE.Vector3(p.x, p.y, INSERT_TOP + 0.004));
    glow.push(glow[0].clone());

    return { insert, base, rim, floor, glow };
  }, []);

  return (
    <group position={TRAY_POSITION} rotation={[-Math.PI / 2, 0, portrait ? Math.PI / 2 : 0]}>
      <mesh geometry={geo.base} material={mats.tray} receiveShadow />
      <mesh geometry={geo.rim} material={mats.tray} castShadow receiveShadow />
      <mesh geometry={geo.floor} material={mats.foamDeep} receiveShadow />
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

      <group position={[PLACE.scissors.x, PLACE.scissors.y, FLOOR_Z + SCISSORS_HALF_THICKNESS]} rotation-z={PLACE.scissors.r}>
        <Scissors />
      </group>
      <group position={[PLACE.scalpel.x, PLACE.scalpel.y, FLOOR_Z + SCALPEL_HALF_THICKNESS]} rotation-z={PLACE.scalpel.r}>
        <Scalpel />
      </group>
      <group position={[PLACE.forceps.x, PLACE.forceps.y, FLOOR_Z + FORCEPS_HALF_THICKNESS]} rotation-z={PLACE.forceps.r}>
        <Forceps />
      </group>
    </group>
  );
}
