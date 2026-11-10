import * as THREE from "three";

/** Starea comună dintre pagina HTML și scena 3D. Se modifică direct, fără re-randare React. */
export type HeroStore = {
  /** Progresul scroll-ului prin secțiunea fixată, de la 0 la 1. */
  progress: number;
  /** Poziția mouse-ului, între -1 și 1. */
  pointerX: number;
  pointerY: number;
  /** Utilizatorul a cerut mișcare redusă din sistem. */
  reduced: boolean;
  /** Momentul (performance.now) în care a plecat loader-ul; 0 cât încă se încarcă. */
  revealedAt: number;
  /** Unde se termină textul de deasupra tăvii, ca fracție din înălțimea ecranului (0 = sus). */
  textBottom: number;
};

export type Point = [number, number];

/** Așezarea unui obiect în tavă: poziție și rotație în planul tăvii. */
export type Placement = { x: number; y: number; r: number };

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Cât de departe a ajuns `p` între `a` și `b`, limitat la 0..1. */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeInQuad = (t: number) => t * t;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Dreptunghi cu colțuri rotunjite, centrat în origine. */
export function roundedRect(w: number, h: number, r: number, target: THREE.Path = new THREE.Shape()) {
  const x = -w / 2;
  const y = -h / 2;
  target.moveTo(x + r, y);
  target.lineTo(x + w - r, y);
  target.quadraticCurveTo(x + w, y, x + w, y + r);
  target.lineTo(x + w, y + h - r);
  target.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  target.lineTo(x + r, y + h);
  target.quadraticCurveTo(x, y + h, x, y + h - r);
  target.lineTo(x, y + r);
  target.quadraticCurveTo(x, y, x + r, y);
  return target;
}

/**
 * Transformă câteva puncte de control într-un contur neted și închis,
 * mutat și rotit după `place`. Folosit pentru locașurile din tavă.
 */
export function smoothOutline(points: Point[], place: Placement, offset: Point = [0, 0], samples = 180) {
  const cos = Math.cos(place.r);
  const sin = Math.sin(place.r);
  const controls = points.map(([px, py]) => {
    const x = px + offset[0];
    const y = py + offset[1];
    return new THREE.Vector3(x * cos - y * sin + place.x, x * sin + y * cos + place.y, 0);
  });
  const curve = new THREE.CatmullRomCurve3(controls, true, "centripetal");
  return curve
    .getSpacedPoints(samples)
    .slice(0, -1)
    .map((p) => new THREE.Vector2(p.x, p.y));
}

/** Extrudare centrată pe axa Z (grosimea totală = depth + 2 × bevel). */
export function extrudeCentered(shape: THREE.Shape, depth: number, bevel = 0, curveSegments = 16) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 3,
    curveSegments,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Tub de-a lungul unei curbe netede prin punctele date. */
export function tube(points: [number, number, number][], radius: number, segments = 40) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.TubeGeometry(curve, segments, radius, 14, false);
}
