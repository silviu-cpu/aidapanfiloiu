import * as THREE from "three";

/** Materialele sunt create o singură dată și împărțite între toate piesele. */
export const mats = {
  /** Oțel lustruit: fălci, inele, lame. */
  steel: new THREE.MeshStandardMaterial({ color: "#e4e9eb", metalness: 1, roughness: 0.14 }),
  /** Oțel periat: corpul mânerului, tava. */
  brushed: new THREE.MeshStandardMaterial({ color: "#c2cacd", metalness: 1, roughness: 0.32 }),
  /** Tija izolată, negru satinat. */
  shaft: new THREE.MeshStandardMaterial({ color: "#151d20", metalness: 0.45, roughness: 0.3 }),
  /** Butonul de rotire, în culoarea site-ului. */
  accent: new THREE.MeshStandardMaterial({ color: "#3f9499", metalness: 0.55, roughness: 0.28 }),
  /** Mici piese de plastic (conectorul de cauter). */
  plastic: new THREE.MeshStandardMaterial({ color: "#222c2f", metalness: 0.1, roughness: 0.45 }),
  /** Tava de inox. */
  tray: new THREE.MeshStandardMaterial({ color: "#b4bdc0", metalness: 1, roughness: 0.36 }),
  /** Inserția din silicon în care stau instrumentele. */
  /*
   * Inserția acoperă cea mai mare parte din ecran când se vede tava, deci folosește
   * un material mat simplu (Lambert): arată la fel, dar e mult mai ușor pentru telefoane.
   */
  foam: new THREE.MeshLambertMaterial({ color: "#324e51" }),
  /** Fundul locașurilor, puțin mai închis. */
  foamDeep: new THREE.MeshLambertMaterial({ color: "#1f3236" }),
};
