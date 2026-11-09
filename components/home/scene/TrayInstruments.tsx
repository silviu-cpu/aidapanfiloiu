"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mats } from "./materials";
import { extrudeCentered, tube, type Point } from "./utils";

/*
 * Instrumentele care stau deja în tavă. Fiecare are vârful spre +X
 * și un contur folosit pentru locașul lui din inserția de silicon.
 */

// ——— Foarfecă Metzenbaum (închisă) ———

export const SCISSORS_OUTLINE: Point[] = [
  [0.95, 0],
  [0.6, 0.09],
  [0, 0.1],
  [-0.35, 0.2],
  [-0.5, 0.34],
  [-0.66, 0.36],
  [-0.8, 0.25],
  [-0.77, 0],
  [-0.8, -0.25],
  [-0.66, -0.36],
  [-0.5, -0.34],
  [-0.35, -0.2],
  [0, -0.1],
  [0.6, -0.09],
];
export const SCISSORS_HALF_THICKNESS = 0.04;

export function Scissors() {
  const geo = useMemo(() => {
    const blade = new THREE.Shape();
    blade.moveTo(-0.12, -0.05);
    blade.quadraticCurveTo(0.45, -0.055, 0.87, 0);
    blade.quadraticCurveTo(0.885, 0.01, 0.865, 0.018);
    blade.quadraticCurveTo(0.45, 0.05, -0.12, 0.05);
    blade.closePath();
    return {
      blade: extrudeCentered(blade, 0.018, 0.004),
      upperShank: tube(
        [
          [-0.05, 0.015, 0.012],
          [-0.25, 0.06, 0.012],
          [-0.5, 0.14, 0.012],
        ],
        0.026,
      ),
      lowerShank: tube(
        [
          [-0.05, -0.015, -0.012],
          [-0.25, -0.06, -0.012],
          [-0.5, -0.14, -0.012],
        ],
        0.026,
      ),
      ring: new THREE.TorusGeometry(0.1, 0.024, 16, 48),
      screw: new THREE.CylinderGeometry(0.03, 0.03, 0.06, 20),
    };
  }, []);

  return (
    <group>
      <mesh geometry={geo.blade} material={mats.steel} position-z={0.013} castShadow receiveShadow />
      <mesh geometry={geo.blade} material={mats.steel} position-z={-0.013} castShadow />
      <mesh geometry={geo.upperShank} material={mats.steel} castShadow />
      <mesh geometry={geo.lowerShank} material={mats.steel} castShadow />
      <mesh geometry={geo.ring} material={mats.steel} position={[-0.6, 0.17, 0.012]} castShadow />
      <mesh geometry={geo.ring} material={mats.steel} position={[-0.6, -0.17, -0.012]} castShadow />
      <mesh geometry={geo.screw} material={mats.brushed} rotation-x={Math.PI / 2} />
    </group>
  );
}

// ——— Bisturiu cu lamă nr. 10 ———

export const SCALPEL_OUTLINE: Point[] = [
  [-0.9, 0],
  [-0.8, 0.12],
  [0.3, 0.1],
  [0.88, 0.09],
  [0.95, 0.03],
  [0.75, -0.11],
  [0.38, -0.12],
  [-0.8, -0.12],
];
export const SCALPEL_HALF_THICKNESS = 0.03;

export function Scalpel() {
  const geo = useMemo(() => {
    const handle = new THREE.Shape();
    handle.moveTo(-0.78, -0.058);
    handle.lineTo(0.18, -0.045);
    handle.lineTo(0.32, -0.024);
    handle.lineTo(0.32, 0.024);
    handle.lineTo(0.18, 0.045);
    handle.lineTo(-0.78, 0.058);
    handle.quadraticCurveTo(-0.84, 0.058, -0.84, 0);
    handle.quadraticCurveTo(-0.84, -0.058, -0.78, -0.058);

    const blade = new THREE.Shape();
    blade.moveTo(0.28, 0.03);
    blade.lineTo(0.85, 0.03);
    blade.quadraticCurveTo(0.7, -0.08, 0.42, -0.045);
    blade.lineTo(0.28, -0.03);
    blade.closePath();

    return {
      handle: extrudeCentered(handle, 0.03, 0.01),
      blade: extrudeCentered(blade, 0.008, 0, 24),
      groove: new THREE.BoxGeometry(0.014, 0.075, 0.008),
    };
  }, []);

  return (
    <group>
      <mesh geometry={geo.handle} material={mats.brushed} castShadow />
      <mesh geometry={geo.blade} material={mats.steel} castShadow />
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} geometry={geo.groove} material={mats.steel} position={[-0.52 + i * 0.05, 0, 0.026]} />
      ))}
    </group>
  );
}

// ——— Pensă anatomică ———

export const FORCEPS_OUTLINE: Point[] = [
  [-0.9, 0],
  [-0.82, 0.11],
  [-0.1, 0.14],
  [0.84, 0.06],
  [0.88, 0],
  [0.84, -0.06],
  [-0.1, -0.14],
  [-0.82, -0.11],
];
export const FORCEPS_HALF_THICKNESS = 0.02;

export function Forceps() {
  const geo = useMemo(() => {
    const arm = new THREE.Shape();
    arm.moveTo(-0.8, -0.05);
    arm.lineTo(-0.1, -0.075);
    arm.lineTo(0.78, -0.012);
    arm.quadraticCurveTo(0.8, 0, 0.78, 0.012);
    arm.lineTo(-0.1, 0.075);
    arm.lineTo(-0.8, 0.05);
    arm.quadraticCurveTo(-0.84, 0, -0.8, -0.05);
    return {
      arm: extrudeCentered(arm, 0.022, 0.006),
      ridge: new THREE.BoxGeometry(0.012, 0.11, 0.006),
    };
  }, []);

  return (
    <group>
      <mesh geometry={geo.arm} material={mats.brushed} castShadow />
      {/* Brațul de sus se ridică ușor spre vârf, ca la o pensă reală */}
      <group position-z={0.03} rotation-y={-0.035}>
        <mesh geometry={geo.arm} material={mats.steel} castShadow />
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} geometry={geo.ridge} material={mats.brushed} position={[0.0 + i * 0.045, 0, 0.018]} />
        ))}
      </group>
    </group>
  );
}
