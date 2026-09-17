import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { isHeld, moveAxis, setHeld, wireKeyboard } from "./input";
import { usePlaza } from "./store";

/**
 * Eye-level walk: FPS strafe (controls skill §2a).
 * W/+forward, S/−forward, D/+right, A/−right. Mouse look when pointer-locked.
 * On-screen arrows drive the same axis.
 */
export function WalkController() {
  const mode = usePlaza((s) => s.mode);
  const active = mode === "walk";
  const { camera, gl } = useThree();
  const yaw = useRef(usePlaza.getState().walkYaw);
  const pitch = useRef(-0.08);
  const pos = useRef({ x: usePlaza.getState().walkX, z: usePlaza.getState().walkZ });
  const locked = useRef(false);

  useEffect(() => {
    wireKeyboard();
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    const onClick = () => {
      if (usePlaza.getState().mode === "walk") void el.requestPointerLock();
    };
    const onLock = () => {
      locked.current = document.pointerLockElement === el;
    };
    const onMove = (e: MouseEvent) => {
      if (!locked.current || usePlaza.getState().mode !== "walk") return;
      yaw.current -= e.movementX * 0.0022;
      pitch.current -= e.movementY * 0.0022;
      pitch.current = Math.max(-1.1, Math.min(0.9, pitch.current));
    };
    el.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onLock);
    document.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onLock);
      document.removeEventListener("mousemove", onMove);
    };
  }, [gl]);

  useEffect(() => {
    const probe = {
      getYaw: () => yaw.current,
      getSpeed: () => (moveAxis().moving ? 1 : 0),
      setKeys: (codes: string[]) => setHeld(codes),
    };
    window.__controlsTest = probe;
    return () => {
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, []);

  useFrame((_, dt) => {
    if (!active) return;
    const d = Math.min(dt, 0.1);
    const { x: ax, z: az } = moveAxis();
    const forward = { x: -Math.sin(yaw.current), z: -Math.cos(yaw.current) };
    const right = { x: Math.cos(yaw.current), z: -Math.sin(yaw.current) };
    let mx = forward.x * az + right.x * ax;
    let mz = forward.z * az + right.z * ax;
    const len = Math.hypot(mx, mz) || 1;
    const speed = isHeld("ShiftLeft") ? 5.4 : 2.8;
    if (ax !== 0 || az !== 0) {
      pos.current.x += (mx / len) * speed * d;
      pos.current.z += (mz / len) * speed * d;
    }
    pos.current.x = Math.max(-70, Math.min(80, pos.current.x));
    pos.current.z = Math.max(-42, Math.min(55, pos.current.z));
    const x = pos.current.x;
    const z = pos.current.z;
    const inFootprint = x > 0.25 && x < 38.2 && z < -0.12 && z > -36.1;
    const inFoyer = x < 16.2 && z > -15.2 && x - z > 6;
    if (inFootprint && !inFoyer) {
      if (z > -9) pos.current.z = 0.18;
      else if (x < 8) pos.current.x = -0.18;
      else pos.current.z = 0.18;
    }
    const pcam = camera as PerspectiveCamera;
    pcam.position.set(pos.current.x, 1.7, pos.current.z);
    const lx = pos.current.x - Math.sin(yaw.current) * Math.cos(pitch.current);
    const ly = 1.7 + Math.sin(pitch.current);
    const lz = pos.current.z - Math.cos(yaw.current) * Math.cos(pitch.current);
    pcam.lookAt(lx, ly, lz);
    pcam.near = 0.12;
    pcam.far = 280;
    pcam.fov = 58;
    pcam.updateProjectionMatrix();
  });

  return null;
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
    };
    __plaza?: {
      setFilmT: (t: number) => void;
      playFilm: () => void;
      reset: () => void;
      setLighting?: (l: "day" | "dusk") => void;
      setCamera?: (c: string) => void;
      setScenario?: (c: string) => void;
      setShade?: (v: boolean) => void;
      setOverlay?: (v: number) => void;
      setOverlayMode?: (m: string) => void;
      setSplat?: (v: boolean) => void;
      splatEngine?: string;
      captureCanvas: () => HTMLCanvasElement | null;
      getCam?: () => { x: number; y: number; z: number };
      exportGLB?: () => Promise<ArrayBuffer>;
    };
  }
}
