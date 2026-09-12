import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { FOUNTAIN } from "./config";
import type { PlazaMats } from "./materials";
import { usePlaza } from "./store";

function Jet({
  x,
  z,
  h,
  r,
  delay,
  mats,
}: {
  x: number;
  z: number;
  h: number;
  r: number;
  delay: number;
  mats: PlazaMats;
}) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const st = usePlaza.getState();
    const t = st.mode === "film" ? st.filmT : clock.elapsedTime;
    const pulse = 0.88 + Math.sin(t * 3.4 + delay) * 0.12;
    if (ref.current) {
      ref.current.scale.y = pulse;
      ref.current.position.y = (h * pulse) / 2 + 0.28;
    }
  });
  return (
    <mesh ref={ref} position={[x, h / 2, z]} material={mats.water}>
      <cylinderGeometry args={[r * 0.35, r, h, 10]} />
    </mesh>
  );
}

export function PlazaFountain({ mats }: { mats: PlazaMats }) {
  const { x, z, poolR } = FOUNTAIN;
  const outer = useMemo(() => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2), []);
  const inner = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2 + 0.3), []);

  return (
    <group name="FOUNTAIN_ROUNDABOUT" position={[x, 0, z]} userData={{ assumption: "island at Main & 4th Ave SW, estimated" }}>
      <mesh position={[0, 0.28, 0]} material={mats.limestone} receiveShadow castShadow>
        <cylinderGeometry args={[poolR, poolR + 0.32, 0.56, 48]} />
      </mesh>
      <mesh position={[0, 0.58, 0]} material={mats.limestone} castShadow>
        <cylinderGeometry args={[poolR + 0.1, poolR + 0.02, 0.14, 48]} />
      </mesh>
      <mesh position={[0, 0.38, 0]} material={mats.water}>
        <cylinderGeometry args={[poolR - 0.42, poolR - 0.42, 0.16, 48]} />
      </mesh>
      <mesh position={[0, 1.05, 0]} material={mats.limestone} castShadow>
        <cylinderGeometry args={[1.05, 1.55, 1.45, 16]} />
      </mesh>
      <mesh position={[0, 1.82, 0]} material={mats.limestone} castShadow>
        <cylinderGeometry args={[1.85, 1.95, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 1.92, 0]} material={mats.water}>
        <cylinderGeometry args={[1.62, 1.62, 0.1, 24]} />
      </mesh>
      <mesh position={[0, 2.55, 0]} material={mats.limestone} castShadow>
        <cylinderGeometry args={[0.32, 0.42, 1.15, 12]} />
      </mesh>
      <mesh position={[0, 3.28, 0]} material={mats.limestone} castShadow>
        <sphereGeometry args={[0.38, 12, 10]} />
      </mesh>
      <mesh position={[0, 3.72, 0]} material={mats.trim} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
      </mesh>

      <Jet x={0} z={0} h={3.6} r={0.1} delay={0} mats={mats} />
      {inner.map((a, i) => (
        <Jet
          key={`i${i}`}
          x={Math.sin(a) * 0.95}
          z={Math.cos(a) * 0.95}
          h={3.2}
          r={0.055}
          delay={i * 0.55}
          mats={mats}
        />
      ))}
      {outer.map((a, i) => (
        <Jet
          key={`o${i}`}
          x={Math.sin(a) * 2.55}
          z={Math.cos(a) * 2.55}
          h={1.45}
          r={0.045}
          delay={i * 0.4}
          mats={mats}
        />
      ))}

      <mesh position={[0, 0.48, poolR - 0.14]} material={mats.inscription}>
        <planeGeometry args={[3.15, 0.42]} />
      </mesh>
      <mesh position={[0, 0.48, -(poolR - 0.14)]} rotation={[0, Math.PI, 0]} material={mats.inscription}>
        <planeGeometry args={[3.15, 0.42]} />
      </mesh>
    </group>
  );
}
