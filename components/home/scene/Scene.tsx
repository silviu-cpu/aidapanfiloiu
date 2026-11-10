"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Grasper } from "./Grasper";
import { Tray, TRAY_POSITION } from "./Tray";
import {
  clamp01,
  easeInOutCubic,
  easeInQuad,
  easeOutCubic,
  lerp,
  range,
  type HeroStore,
} from "./utils";

/*
 * Cronologia scroll-ului (progres 0 → 1):
 *   0.00–0.08  hero: pensa plutește
 *   0.08–0.60  zborul spre tavă (cu o rotire completă) și închiderea fălcilor
 *   0.06–0.72  camera coboară deasupra tăvii
 *   0.60–0.76  pensa coboară în locaș, cu un mic recul la final
 *   0.78–1.00  camera se retrage și se vede toată tava
 */
const T = {
  flyStart: 0.08,
  flyEnd: 0.6,
  camStart: 0.06,
  camEnd: 0.72,
  dropEnd: 0.76,
  pullStart: 0.78,
};

export const CAMERA_FOV = 35;
export const CAMERA_START = new THREE.Vector3(0, 0, 9);

const TAN = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2));
const END_DIR = new THREE.Vector3(0, 6, 3.4).normalize();
const HOVER = 0.9;
const X_AXIS = new THREE.Vector3(1, 0, 0);
const ORIGIN = new THREE.Vector3();

// Obiecte refolosite în fiecare cadru, ca să nu alocăm memorie la scroll.
// Există o singură scenă pe pagină, deci pot fi comune.
const tmp = {
  pointer: new THREE.Vector2(),
  start: new THREE.Vector3(),
  mid: new THREE.Vector3(),
  hover: new THREE.Vector3(),
  end: new THREE.Vector3(),
  up: new THREE.Vector3(),
  euler: new THREE.Euler(),
  qStart: new THREE.Quaternion(),
  qEnd: new THREE.Quaternion(),
  qRoll: new THREE.Quaternion(),
  camEnd: new THREE.Vector3(),
  camTarget: new THREE.Vector3(),
  lookEnd: new THREE.Vector3(),
  fit: new THREE.Matrix4(),
  heroPos: new THREE.Vector3(),
};

/** Cât de înaltă apare pensa în hero, raportat la scara ei (unități de lume, cu tot cu înclinare). */
const GRASPER_HERO_HEIGHT = 1.9;

/** Colțurile tăvii (cu tot cu margine), în lume, ca să știm cât ocupă pe ecran. */
function trayCorners(portrait: boolean) {
  const halfX = (portrait ? 3.9 : 5.9) / 2;
  const halfZ = (portrait ? 5.9 : 3.9) / 2;
  const corners: THREE.Vector3[] = [];
  for (const x of [-halfX, halfX])
    for (const z of [-halfZ, halfZ])
      for (const y of [-0.42, 0.03]) corners.push(new THREE.Vector3(x, y, z).add(TRAY_POSITION));
  return corners;
}

/** Spațiul lăsat liber sub text și la marginea de jos a ecranului (în coordonate -1..1). */
const FIT_GAP_TOP = 0.05;
const FIT_GAP_BOTTOM = 0.06;
const FIT_MIN_SCALE = 0.55;

export function Scene({ store }: { store: RefObject<HeroStore> }) {
  const scene = useThree((s) => s.scene);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const aspect = width / height;
  const portrait = aspect < 0.9;

  const instrument = useRef<THREE.Group>(null!);
  const anchor = useRef<THREE.Object3D>(null);
  const glow = useRef<{ material: { opacity: number } }>(null);
  const sun = useRef<THREE.DirectionalLight>(null!);
  const rig = useRef({ open: 0.6 });

  // Poziția din hero și distanța camerei depind de forma ecranului.
  const layout = useMemo(() => {
    const h0 = 2 * CAMERA_START.z * TAN;
    const w0 = h0 * aspect;
    const heroPos = portrait
      ? new THREE.Vector3(0, h0 * 0.2, 0)
      : new THREE.Vector3(w0 * 0.24, 0.1, 0);
    const heroScale = Math.min(1.15, (w0 * (portrait ? 0.82 : 0.46)) / 4.1);
    const heroTilt = portrait ? 0.22 : 0.38;

    // Camera finală stă destul de departe cât să încapă toată tava, plus loc pentru text.
    const trayW = portrait ? 3.9 : 5.9;
    const trayH = (portrait ? 5.9 : 3.9) * 0.87;
    const dist = Math.max(7.6, (trayW * (portrait ? 1.45 : 1.3)) / (2 * TAN * aspect), (trayH * 2.45) / (2 * TAN));
    // Ținta camerei e mutată spre marginea îndepărtată a tăvii, ca tava să coboare pe ecran și să lase loc textului.
    const lookOffset = new THREE.Vector3(0, 0, portrait ? -1.7 : -1.8);

    // Cât ocupă tava pe verticală în cadrul final (camera retrasă complet), de la -1 (jos) la 1 (sus).
    const probe = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, 0.1, 60);
    const look = TRAY_POSITION.clone().add(lookOffset);
    probe.position.copy(look).addScaledVector(END_DIR, dist);
    probe.lookAt(look);
    probe.updateMatrixWorld();
    let trayTop = -Infinity;
    let trayBottom = Infinity;
    for (const corner of trayCorners(portrait)) {
      const y = corner.project(probe).y;
      trayTop = Math.max(trayTop, y);
      trayBottom = Math.min(trayBottom, y);
    }
    return { h0, heroPos, heroScale, heroTilt, dist, lookOffset, trayTop, trayBottom };
  }, [aspect, portrait]);

  useEffect(() => {
    const light = sun.current;
    light.target.position.copy(TRAY_POSITION);
    scene.add(light.target);
    return () => {
      scene.remove(light.target);
    };
  }, [scene]);

  useFrame((state, dt) => {
    const a = anchor.current;
    if (!a) return;
    const st = store.current;
    const camera = state.camera;

    const p = st.reduced ? 0 : st.progress;
    const idle = st.reduced ? 0 : 1;
    const time = state.clock.elapsedTime;

    // Mouse-ul, netezit.
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 3);
    tmp.pointer.x += (st.pointerX * idle - tmp.pointer.x) * k;
    tmp.pointer.y += (st.pointerY * idle - tmp.pointer.y) * k;

    const fly = easeInOutCubic(range(p, T.flyStart, T.flyEnd));
    const drop = range(p, T.flyEnd, T.dropEnd);
    const cam = easeInOutCubic(range(p, T.camStart, T.camEnd));
    const pull = easeInOutCubic(range(p, T.pullStart, 1));
    const hero = 1 - fly;

    // Intrarea după loader: pensa urcă de jos, crește și se rotește în poziție.
    const intro = st.reduced
      ? 1
      : st.revealedAt
        ? easeOutCubic(clamp01((performance.now() - st.revealedAt - 150) / 1500))
        : 0;
    const enter = 1 - intro;

    // Unde trebuie să ajungă pensa: locașul din tavă.
    a.updateWorldMatrix(true, false);
    a.getWorldPosition(tmp.end);
    a.getWorldQuaternion(tmp.qEnd);
    tmp.up.set(0, 0, 1).applyQuaternion(tmp.qEnd);
    tmp.hover.copy(tmp.end).addScaledVector(tmp.up, HOVER);

    // Poziția din hero, cu plutire și reacție la mouse.
    // Pe telefon, pensa se așază în spațiul liber dintre bara de navigare și titlu,
    // și se micșorează dacă spațiul e mic, ca să nu treacă peste text.
    let heroScale = layout.heroScale;
    tmp.heroPos.copy(layout.heroPos);
    if (portrait && st.heroTextTop > st.heroBandTop && st.heroTextTop > 0) {
      const top = (0.5 - Math.max(st.heroBandTop, 0.08)) * layout.h0;
      const bottom = (0.5 - st.heroTextTop) * layout.h0;
      tmp.heroPos.set(0, (top + bottom) / 2, 0);
      heroScale = Math.max(0.3, Math.min(heroScale, ((top - bottom) * 0.85) / GRASPER_HERO_HEIGHT));
    }
    tmp.start.copy(tmp.heroPos);
    tmp.start.y += Math.sin(time * 0.9) * 0.08 * idle - enter * 2.2;
    tmp.euler.set(
      0.22 - tmp.pointer.y * 0.14,
      -0.32 + Math.sin(time * 0.35) * 0.16 * idle + tmp.pointer.x * 0.22,
      layout.heroTilt + Math.sin(time * 0.5) * 0.04 * idle + enter * 0.6,
    );
    tmp.qStart.setFromEuler(tmp.euler);

    const g = instrument.current;
    if (drop <= 0) {
      // Curbă Bézier: din hero, pe lângă cameră, până deasupra locașului.
      tmp.mid.addVectors(tmp.start, tmp.hover).multiplyScalar(0.5);
      tmp.mid.x += portrait ? 0.4 : -1.2;
      tmp.mid.z += portrait ? 1.2 : 2.4;
      const u = fly;
      const iu = 1 - u;
      g.position
        .copy(tmp.start)
        .multiplyScalar(iu * iu)
        .addScaledVector(tmp.mid, 2 * iu * u)
        .addScaledVector(tmp.hover, u * u);
    } else {
      // Coborârea în locaș: cade, apoi un recul mic, ca un „clic”.
      const fall = easeInQuad(Math.min(1, drop / 0.82));
      const hop = drop > 0.82 ? Math.sin(((drop - 0.82) / 0.18) * Math.PI) * 0.045 : 0;
      g.position.copy(tmp.end).addScaledVector(tmp.up, HOVER * (1 - fall) + hop);
    }

    // Rotația: din poza din hero în poza din tavă, plus o rotire completă pe lungime.
    const turn = easeInOutCubic(range(p, T.flyStart, T.flyEnd - 0.03));
    tmp.qRoll.setFromAxisAngle(X_AXIS, Math.PI * 2 * turn - enter * 2.4);
    g.quaternion.slerpQuaternions(tmp.qStart, tmp.qEnd, turn).multiply(tmp.qRoll);
    g.scale.setScalar(
      lerp(heroScale * lerp(1, 0.7, enter), 1, easeOutCubic(range(p, T.flyStart, T.flyEnd))),
    );

    // Fălcile „respiră” în hero și se închid în timpul zborului.
    const breathing = st.reduced ? 0.6 : 0.5 + 0.5 * Math.sin(time * 1.3);
    rig.current.open = breathing * hero * hero;

    // Conturul locașului se aprinde când pensa se apropie, apoi se stinge.
    if (glow.current) {
      glow.current.material.opacity = range(p, 0.42, 0.6) * (1 - range(p, T.dropEnd, 0.9)) * 0.9;
    }

    // Camera: din fața hero-ului până deasupra tăvii, apoi se retrage puțin.
    tmp.lookEnd.copy(TRAY_POSITION).add(layout.lookOffset);
    tmp.camEnd.copy(tmp.lookEnd).addScaledVector(END_DIR, layout.dist * lerp(0.86, 1, pull));
    camera.position.lerpVectors(CAMERA_START, tmp.camEnd, cam);
    camera.position.x += tmp.pointer.x * 0.25 * hero;
    camera.position.y += tmp.pointer.y * 0.15 * hero;
    tmp.camTarget.lerpVectors(ORIGIN, tmp.lookEnd, cam);
    camera.lookAt(tmp.camTarget);

    // La final, tava se micșorează și coboară cât e nevoie ca să nu intre sub text.
    // Mutăm doar imaginea (proiecția), deci perspectiva și umbrele rămân aceleași.
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    const textTop = st.textBottom > 0 ? 1 - 2 * st.textBottom - FIT_GAP_TOP : 1;
    const floor = -1 + FIT_GAP_BOTTOM;
    const fitScale = Math.min(1, Math.max(FIT_MIN_SCALE, (textTop - floor) / (layout.trayTop - layout.trayBottom)));
    const fitShift = Math.min(0, textTop - fitScale * layout.trayTop);
    const s = lerp(1, fitScale, pull);
    const shift = lerp(0, fitShift, pull);
    if (s !== 1 || shift !== 0) {
      tmp.fit.set(s, 0, 0, 0, 0, s, 0, shift, 0, 0, 1, 0, 0, 0, 0, 1);
      camera.projectionMatrix.premultiply(tmp.fit);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      {/* Lumina care face umbra pensei pe tavă */}
      <directionalLight
        ref={sun}
        position={[TRAY_POSITION.x + 2.5, TRAY_POSITION.y + 8, TRAY_POSITION.z + 3.5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-4, 3, 5]} intensity={0.5} color="#c8eef0" />

      {/* Reflexii de studio, generate local (fără fișiere HDR externe) */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0b1f22"]} />
        <Lightformer form="rect" intensity={3} position={[0, 6, -2]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-7, 1, 1]} scale={[3, 9, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#dff6f7" position={[7, 0, 2]} scale={[2, 9, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#7fd0d4" position={[0, 1, 9]} scale={4} />
        <Lightformer form="rect" intensity={0.8} position={[0, -6, 4]} scale={[12, 2, 1]} />
      </Environment>

      <group ref={instrument}>
        <Grasper rig={rig} />
      </group>

      <Tray portrait={portrait} anchorRef={anchor} glowRef={glow} store={store} />
    </>
  );
}
