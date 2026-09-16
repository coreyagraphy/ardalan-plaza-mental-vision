import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { usePlaza } from "./store";

const SKIN = [
  new THREE.MeshStandardMaterial({ color: "#c9a882", roughness: 0.62 }),
  new THREE.MeshStandardMaterial({ color: "#8a5a38", roughness: 0.64 }),
  new THREE.MeshStandardMaterial({ color: "#e2c4a4", roughness: 0.6 }),
  new THREE.MeshStandardMaterial({ color: "#6b4428", roughness: 0.66 }),
];
const HAIR = [
  new THREE.MeshStandardMaterial({ color: "#1c1612", roughness: 0.55 }),
  new THREE.MeshStandardMaterial({ color: "#3a2418", roughness: 0.58 }),
  new THREE.MeshStandardMaterial({ color: "#c8b48a", roughness: 0.5 }),
  new THREE.MeshStandardMaterial({ color: "#2a2018", roughness: 0.52 }),
];
const SHIRT: Record<string, THREE.MeshStandardMaterial> = {};
function cloth(hex: string) {
  if (!SHIRT[hex]) SHIRT[hex] = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.72 });
  return SHIRT[hex];
}

const GEO = {
  torso: new THREE.CapsuleGeometry(0.155, 0.42, 4, 8),
  head: new THREE.SphereGeometry(0.128, 10, 8),
  hair: new THREE.SphereGeometry(0.132, 8, 6),
  limb: new THREE.CapsuleGeometry(0.048, 0.34, 3, 6),
  arm: new THREE.CapsuleGeometry(0.042, 0.3, 3, 6),
  hip: new THREE.SphereGeometry(0.09, 8, 6),
};

export type FigureLook = {
  shirt: string;
  pants: string;
  skin?: number;
  hair?: number;
  kid?: boolean;
};

export function Figure({
  look,
  pose = "stand",
  walkPhase = 0,
}: {
  look: FigureLook;
  pose?: "stand" | "sit" | "walk";
  walkPhase?: number;
}) {
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const skin = SKIN[(look.skin ?? 0) % SKIN.length]!;
  const hair = HAIR[(look.hair ?? 0) % HAIR.length]!;
  const shirt = cloth(look.shirt);
  const pants = cloth(look.pants);
  const sitting = pose === "sit";

  useFrame(({ clock }) => {
    if (pose !== "walk") return;
    const st = usePlaza.getState();
    const t = ((st.mode === "film" ? st.filmT : clock.elapsedTime) * 7.2 + walkPhase) % (Math.PI * 2);
    const s = Math.sin(t);
    if (leftLeg.current) leftLeg.current.rotation.x = s * 0.58;
    if (rightLeg.current) rightLeg.current.rotation.x = -s * 0.58;
    if (leftArm.current) leftArm.current.rotation.x = -s * 0.42;
    if (rightArm.current) rightArm.current.rotation.x = s * 0.42;
  });

  return (
    <group scale={look.kid ? 0.72 : 1} position={[0, sitting ? 0.42 : 0, 0]}>
      <mesh position={[0, sitting ? 0.72 : 1.02, sitting ? 0.08 : 0]} geometry={GEO.torso} material={shirt} castShadow />
      <mesh position={[0, sitting ? 1.18 : 1.48, sitting ? 0.1 : 0]} geometry={GEO.head} material={skin} castShadow />
      <mesh
        position={[0, sitting ? 1.26 : 1.56, sitting ? 0.06 : -0.02]}
        scale={[1.05, 0.62, 1.1]}
        geometry={GEO.hair}
        material={hair}
        castShadow
      />
      <mesh position={[0, sitting ? 0.52 : 0.72, 0]} geometry={GEO.hip} material={pants} />
      <group ref={leftLeg} position={[-0.08, sitting ? 0.5 : 0.7, sitting ? 0.12 : 0]} rotation={[sitting ? 1.15 : 0.04, 0, 0.04]}>
        <mesh position={[0, -0.22, 0]} geometry={GEO.limb} material={pants} castShadow />
      </group>
      <group ref={rightLeg} position={[0.08, sitting ? 0.5 : 0.7, sitting ? 0.12 : 0]} rotation={[sitting ? 1.2 : 0.04, 0, -0.04]}>
        <mesh position={[0, -0.22, 0]} geometry={GEO.limb} material={pants} castShadow />
      </group>
      <group ref={leftArm} position={[-0.2, sitting ? 0.92 : 1.18, 0]} rotation={[sitting ? 0.55 : 0.12, 0, 0.18]}>
        <mesh position={[0, -0.2, 0]} geometry={GEO.arm} material={shirt} castShadow />
      </group>
      <group ref={rightArm} position={[0.2, sitting ? 0.92 : 1.18, 0]} rotation={[sitting ? 0.5 : 0.12, 0, -0.18]}>
        <mesh position={[0, -0.2, 0]} geometry={GEO.arm} material={shirt} castShadow />
      </group>
    </group>
  );
}

export function Person({
  x,
  z,
  rot = 0,
  look,
  pose = "stand",
}: {
  x: number;
  z: number;
  rot?: number;
  look: FigureLook;
  pose?: "stand" | "sit";
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Figure look={look} pose={pose} />
    </group>
  );
}

export function Walker({
  x0,
  z0,
  x1,
  z1,
  look,
  speed,
  phase,
}: {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  look: FigureLook;
  speed: number;
  phase: number;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const st = usePlaza.getState();
    const elapsed = st.mode === "film" ? st.filmT : clock.elapsedTime;
    const t = (elapsed * speed + phase) % 2;
    const u = t < 1 ? t : 2 - t;
    const bob = Math.abs(Math.sin(u * Math.PI * 8)) * 0.028;
    g.position.set(x0 + (x1 - x0) * u, bob, z0 + (z1 - z0) * u);
    const going = t < 1;
    g.rotation.y = Math.atan2(going ? x1 - x0 : x0 - x1, going ? z1 - z0 : z0 - z1);
  });
  return (
    <group ref={ref}>
      <Figure look={look} pose="walk" walkPhase={phase * 9} />
    </group>
  );
}
