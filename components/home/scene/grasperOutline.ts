import type { Point } from "./utils";

/*
 * Forma pensei, separată de modelul 3D ca să poată fi folosită și fără three.js
 * (de exemplu în loader). Coordonate „brute”: vârful spre +X, inelele în jos.
 */

/** Mijlocul pensei; modelul e mutat cu minus această valoare ca să se rotească în jurul lui. */
export const GRASPER_CENTER: Point = [0.43, -0.33];

/** Conturul locașului din tavă (coordonate brute, cu o margine de ~5 cm la scară). */
export const GRASPER_OUTLINE: Point[] = [
  [2.47, 0],
  [2.32, 0.1],
  [2.0, 0.11],
  [1.0, 0.11],
  [-0.5, 0.11],
  [-0.6, 0.2],
  [-0.84, 0.21],
  [-0.92, 0.2],
  [-0.95, 0.33],
  [-1.08, 0.33],
  [-1.12, 0.2],
  [-1.27, 0.18],
  [-1.34, 0.04],
  [-1.32, -0.3],
  [-1.5, -0.56],
  [-1.6, -0.76],
  [-1.54, -0.94],
  [-1.38, -1.0],
  [-1.17, -0.93],
  [-0.96, -1.04],
  [-0.77, -0.96],
  [-0.71, -0.8],
  [-0.77, -0.6],
  [-0.79, -0.35],
  [-0.73, -0.19],
  [-0.6, -0.17],
  [-0.5, -0.11],
  [1.0, -0.11],
  [2.0, -0.11],
  [2.32, -0.1],
];
