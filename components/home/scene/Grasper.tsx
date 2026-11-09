"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { mats } from "./materials";
import { GRASPER_CENTER } from "./grasperOutline";
import { extrudeCentered, tube } from "./utils";

export { GRASPER_CENTER, GRASPER_OUTLINE } from "./grasperOutline";

/*
 * Pensă laparoscopică construită din forme simple.
 * Coordonate „brute”: vârful spre +X, mânerul spre -X, inelele în jos (-Y).
 * Întreaga piesă e mutată cu -GRASPER_CENTER ca să se rotească în jurul mijlocului.
 */

/** Raza butonului de rotire: cea mai groasă parte, pe care stă pensa în tavă. */
export const GRASPER_HALF_THICKNESS = 0.14;

const SHAFT_START = -0.56;
const SHAFT_END = 2.0;
const PIVOT_X = 2.04;
const GRIP_PIVOT: [number, number] = [-0.9, -0.08];

function jawGeometry(sign: 1 | -1) {
  const s = new THREE.Shape();
  s.moveTo(-0.03, 0);
  s.lineTo(0.31, 0);
  s.quadraticCurveTo(0.35, 0, 0.345, 0.016 * sign);
  s.quadraticCurveTo(0.2, 0.03 * sign, 0.02, 0.05 * sign);
  s.lineTo(-0.03, 0.046 * sign);
  s.closePath();
  return extrudeCentered(s, 0.058, 0.006, 20);
}

function housingGeometry() {
  // Corpul mânerului: un profil rotunjit, mai înalt în spate.
  const s = new THREE.Shape();
  s.moveTo(-0.84, -0.1);
  s.lineTo(-0.84, 0.08);
  s.quadraticCurveTo(-0.84, 0.11, -0.88, 0.11);
  s.lineTo(-1.16, 0.12);
  s.quadraticCurveTo(-1.27, 0.12, -1.27, 0.02);
  s.quadraticCurveTo(-1.27, -0.1, -1.16, -0.12);
  s.lineTo(-0.88, -0.11);
  s.quadraticCurveTo(-0.84, -0.11, -0.84, -0.1);
  return extrudeCentered(s, 0.15, 0.03, 24);
}

function knobGeometry() {
  // Profil rotit în jurul axei: mai lat spre mâner, îngustat spre tijă.
  const profile = [
    [0, 0],
    [0.09, 0],
    [0.128, 0.025],
    [0.14, 0.08],
    [0.132, 0.15],
    [0.1, 0.2],
    [0.062, 0.22],
    [0, 0.22],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(profile, 48);
  geo.computeVertexNormals();
  return geo;
}

export function Grasper({ rig }: { rig: RefObject<{ open: number }> }) {
  const upperJaw = useRef<THREE.Mesh>(null!);
  const lowerJaw = useRef<THREE.Mesh>(null!);
  const grip = useRef<THREE.Group>(null!);

  const geo = useMemo(() => {
    const shaftLength = SHAFT_END - SHAFT_START;
    return {
      shaft: new THREE.CylinderGeometry(0.045, 0.045, shaftLength, 32, 1),
      shaftLength,
      collar: new THREE.CylinderGeometry(0.052, 0.05, 0.08, 32),
      taper: new THREE.CylinderGeometry(0.047, 0.07, 0.1, 32),
      upper: jawGeometry(1),
      lower: jawGeometry(-1),
      pin: new THREE.CylinderGeometry(0.016, 0.016, 0.085, 16),
      knob: knobGeometry(),
      rib: new THREE.BoxGeometry(0.12, 0.026, 0.024),
      housing: housingGeometry(),
      post: new THREE.CylinderGeometry(0.034, 0.038, 0.13, 24),
      postPin: new THREE.CylinderGeometry(0.012, 0.012, 0.07, 12),
      fixedGrip: tube(
        [
          [-1.13, -0.06, 0],
          [-1.18, -0.3, 0],
          [-1.27, -0.5, 0],
          [-1.36, -0.61, 0],
        ],
        0.04,
      ),
      fixedRing: new THREE.TorusGeometry(0.145, 0.033, 20, 56),
      movingGrip: tube(
        [
          [0, 0, 0],
          [-0.01, -0.24, 0],
          [-0.04, -0.46, 0],
          [-0.055, -0.6, 0],
        ],
        0.038,
      ),
      movingRing: new THREE.TorusGeometry(0.135, 0.032, 20, 56),
    };
  }, []);

  useFrame(() => {
    const o = rig.current.open;
    upperJaw.current.rotation.z = o * 0.45;
    lowerJaw.current.rotation.z = -o * 0.45;
    grip.current.rotation.z = o * 0.14;
  });

  const ribs = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

  return (
    <group position={[-GRASPER_CENTER[0], -GRASPER_CENTER[1], 0]}>
      {/* Tija izolată */}
      <mesh
        geometry={geo.shaft}
        material={mats.shaft}
        position={[(SHAFT_START + SHAFT_END) / 2, 0, 0]}
        rotation-z={-Math.PI / 2}
        castShadow
      />
      <mesh geometry={geo.taper} material={mats.brushed} position={[-0.58, 0, 0]} rotation-z={-Math.PI / 2} castShadow />
      <mesh geometry={geo.collar} material={mats.steel} position={[SHAFT_END, 0, 0]} rotation-z={-Math.PI / 2} castShadow />

      {/* Fălcile, care se deschid în jurul pivotului */}
      <mesh ref={upperJaw} geometry={geo.upper} material={mats.steel} position={[PIVOT_X, 0, 0]} castShadow />
      <mesh ref={lowerJaw} geometry={geo.lower} material={mats.steel} position={[PIVOT_X, 0, 0]} castShadow />
      <mesh geometry={geo.pin} material={mats.brushed} position={[PIVOT_X, 0, 0]} rotation-x={Math.PI / 2} />

      {/* Butonul de rotire cu nervuri */}
      <mesh geometry={geo.knob} material={mats.accent} position={[-0.84, 0, 0]} rotation-z={-Math.PI / 2} castShadow />
      {ribs.map((a) => (
        <mesh
          key={a}
          geometry={geo.rib}
          material={mats.accent}
          position={[-0.72, Math.cos(a) * 0.132, Math.sin(a) * 0.132]}
          rotation-x={a}
        />
      ))}

      {/* Corpul mânerului și conectorul pentru cauter */}
      <mesh geometry={geo.housing} material={mats.brushed} castShadow />
      <mesh geometry={geo.post} material={mats.plastic} position={[-1.02, 0.18, 0]} castShadow />
      <mesh geometry={geo.postPin} material={mats.steel} position={[-1.02, 0.27, 0]} />

      {/* Inelul fix */}
      <mesh geometry={geo.fixedGrip} material={mats.brushed} scale-z={0.8} castShadow />
      <mesh geometry={geo.fixedRing} material={mats.steel} position={[-1.38, -0.76, 0]} castShadow />

      {/* Inelul mobil: când se deschide, se deschid și fălcile */}
      <group ref={grip} position={[GRIP_PIVOT[0], GRIP_PIVOT[1], 0]}>
        <mesh geometry={geo.movingGrip} material={mats.brushed} scale-z={0.8} castShadow />
        <mesh geometry={geo.movingRing} material={mats.steel} position={[-0.06, -0.73, 0]} castShadow />
      </group>
    </group>
  );
}
