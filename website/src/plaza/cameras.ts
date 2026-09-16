import * as THREE from "three";
import { CAMERAS, FILM_SECONDS, SOURCE_PLATE } from "./config";

export function lerpVec(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): [number, number, number] {
  const s = t * t * (3 - 2 * t);
  return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];
}

function catmull(
  p0: readonly number[],
  p1: readonly number[],
  p2: readonly number[],
  p3: readonly number[],
  t: number,
): [number, number, number] {
  const t2 = t * t;
  const t3 = t2 * t;
  const out: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    out[i] =
      0.5 *
      (2 * p1[i]! +
        (-p0[i]! + p2[i]!) * t +
        (2 * p0[i]! - 5 * p1[i]! + 4 * p2[i]! - p3[i]!) * t2 +
        (-p0[i]! + 3 * p1[i]! - 3 * p2[i]! + p3[i]!) * t3);
  }
  return out;
}

/** 20s intro: sidewalk life → palazzo reveal → fountain → aerial. */
const EXTERIOR = [
  { t: 0.0, pos: [22.4, 1.66, 11.6] as const, look: [14.2, 2.6, 1.2] as const },
  { t: 0.16, pos: [12.8, 1.72, 12.2] as const, look: [8.4, 3.1, 0.4] as const },
  { t: 0.32, pos: [-4.2, 4.2, 16.4] as const, look: [8.6, 5.8, -6.2] as const },
  { t: 0.5, pos: [-16.8, 8.4, 18.6] as const, look: [8.2, 5.4, -8.4] as const },
  { t: 0.66, pos: [-18.4, 14.2, 20.4] as const, look: [10.5, 5.0, -10.2] as const },
  { t: 0.84, pos: [-20.8, 26.0, 22.8] as const, look: [13.0, 4.4, -11.6] as const },
  { t: 1.0, pos: [-22.5, 36.5, 24.8] as const, look: [14.0, 4.0, -12.5] as const },
];

export function filmSample(seconds: number) {
  const t = Math.max(0, Math.min(1, seconds / FILM_SECONDS));
  let i = 0;
  while (i < EXTERIOR.length - 2 && EXTERIOR[i + 1]!.t < t) i++;
  const a = EXTERIOR[Math.max(0, i - 1)]!;
  const b = EXTERIOR[i]!;
  const c = EXTERIOR[Math.min(EXTERIOR.length - 1, i + 1)]!;
  const d = EXTERIOR[Math.min(EXTERIOR.length - 1, i + 2)]!;
  const span = Math.max(1e-4, c.t - b.t);
  const u = (t - b.t) / span;
  const pos = catmull(a.pos, b.pos, c.pos, d.pos, u);
  const look = catmull(a.look, b.look, c.look, d.look, u);
  const fov = t < 0.22 ? 52 : t < 0.55 ? 38 : t > 0.82 ? 42 : 36;
  return { pos, look, t, fov, duskBlend: 1, galleryCut: false as const };
}

/** Vertical FOV so a CSS object-fit:cover plate stays registered as the viewport aspect changes. */
export function coverMatchedFov(nativeFov: number, photoAspect: number, viewAspect: number) {
  if (viewAspect > photoAspect) {
    return THREE.MathUtils.radToDeg(
      2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(nativeFov) / 2) * (photoAspect / viewAspect)),
    );
  }
  return nativeFov;
}

export function applyCamera(
  cam: THREE.PerspectiveCamera,
  id: keyof typeof CAMERAS,
  viewAspect?: number,
) {
  const c = CAMERAS[id];
  cam.position.set(c.position[0], c.position[1], c.position[2]);
  let fov: number = c.fov;
  if (id === "source" && viewAspect && viewAspect > 0) {
    fov = coverMatchedFov(c.fov, SOURCE_PLATE.aspect, viewAspect);
  }
  cam.fov = fov;
  cam.near = 0.12;
  cam.far = id === "aerial" ? 420 : 280;
  cam.lookAt(c.target[0], c.target[1], c.target[2]);
  cam.updateProjectionMatrix();
}
