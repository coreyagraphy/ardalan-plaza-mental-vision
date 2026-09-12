import { useMemo } from "react";
import { makeHipRoof } from "./geometry";
import { eaveHeight, FOURTH_AVE, STORY } from "./config";
import type { PlazaMats } from "./materials";

type Palette = "brick" | "tan" | "cream" | "stone";

type Block = {
  x: number;
  z: number;
  w: number;
  d: number;
  stories: 2 | 3 | 4;
  palette: Palette;
  rot?: number;
  near?: boolean;
};

const BLOCKS: Block[] = [
  // North side of Main — Arts & Design District, east of the roundabout
  { x: -4.2, z: 36.8, w: 15.2, d: 12.6, stories: 3, palette: "tan", rot: Math.PI },
  { x: 12.8, z: 37.2, w: 14.4, d: 13.0, stories: 3, palette: "brick", rot: Math.PI },
  { x: 28.6, z: 36.4, w: 13.8, d: 12.4, stories: 4, palette: "cream", rot: Math.PI },
  { x: 44.2, z: 37.0, w: 13.2, d: 12.8, stories: 3, palette: "brick", rot: Math.PI },
  // Across 3rd Ave SW (next block east)
  { x: 64.5, z: -1.0, w: 13.8, d: 14.4, stories: 3, palette: "brick", near: true },
  { x: 78.6, z: -1.3, w: 12.6, d: 13.6, stories: 3, palette: "tan", near: true },
  // North of Main, west of 4th Ave (across the roundabout)
  { x: -58.8, z: 38.4, w: 14.2, d: 12.8, stories: 3, palette: "brick", rot: Math.PI },
  { x: -74.2, z: 37.6, w: 13.0, d: 12.2, stories: 3, palette: "cream", rot: Math.PI },
  // Rear of the 1-acre block (south of the alley) — simplified, not landmarks
  { x: 6.4, z: -34.8, w: 16.2, d: 12.4, stories: 2, palette: "tan" },
  { x: -10.2, z: -35.2, w: 14.4, d: 12.0, stories: 2, palette: "cream" },
];

function facadeMat(palette: Palette, mats: PlazaMats) {
  if (palette === "brick") return mats.brickFacade;
  if (palette === "tan") return mats.brickTan;
  if (palette === "stone") return mats.limestone;
  return mats.stucco;
}

function ShopBay({
  x,
  z,
  w,
  h,
  mats,
  dusk,
  room,
}: {
  x: number;
  z: number;
  w: number;
  h: number;
  mats: PlazaMats;
  dusk: boolean;
  room: number;
}) {
  const glass = dusk ? mats.glow : mats.interiors[room % mats.interiors.length]!;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, -0.12]} material={mats.darkInterior}>
        <boxGeometry args={[w + 0.12, h + 0.1, 0.4]} />
      </mesh>
      <mesh position={[0, h / 2, 0.04]} material={mats.trim} castShadow>
        <boxGeometry args={[w + 0.22, h + 0.16, 0.1]} />
      </mesh>
      <mesh position={[0, h / 2 + 0.02, 0.1]} material={glass}>
        <boxGeometry args={[w - 0.12, h - 0.22, 0.04]} />
      </mesh>
      <mesh position={[0, 2.42, 0.42]} rotation={[-0.28, 0, 0]} material={mats.awning} castShadow>
        <boxGeometry args={[w + 0.35, 0.06, 0.85]} />
      </mesh>
    </group>
  );
}

function UpperWindow({
  x,
  y,
  z,
  mats,
  dusk,
  room,
}: {
  x: number;
  y: number;
  z: number;
  mats: PlazaMats;
  dusk: boolean;
  room: number;
}) {
  const glass = dusk ? mats.glow : mats.interiors[room % mats.interiors.length]!;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.7, -0.04]} material={mats.darkInterior}>
        <boxGeometry args={[1.05, 1.55, 0.18]} />
      </mesh>
      <mesh position={[0, 0.7, 0.04]} material={mats.trim} castShadow>
        <boxGeometry args={[1.12, 1.62, 0.08]} />
      </mesh>
      <mesh position={[0, 0.7, 0.09]} material={glass}>
        <planeGeometry args={[0.92, 1.38]} />
      </mesh>
      <mesh position={[-0.66, 0.7, 0.08]} material={mats.shutter} castShadow>
        <boxGeometry args={[0.22, 1.4, 0.05]} />
      </mesh>
      <mesh position={[0.66, 0.7, 0.08]} material={mats.shutter} castShadow>
        <boxGeometry args={[0.22, 1.4, 0.05]} />
      </mesh>
    </group>
  );
}

function MixedUse({ b, mats, dusk }: { b: Block; mats: PlazaMats; dusk: boolean }) {
  const h = eaveHeight(b.stories);
  const roof = useMemo(() => makeHipRoof(b.w + 0.7, b.d + 0.7, Math.max(1.8, h * 0.22)), [b.w, b.d, h]);
  const body = facadeMat(b.palette, mats);
  const near = !!b.near;
  const shops = near ? 4 : 0;
  const cols = 4;

  return (
    <group position={[b.x, 0, b.z]} rotation={[0, b.rot ?? 0, 0]}>
      <mesh position={[0, h / 2, 0]} material={body} castShadow={near} receiveShadow>
        <boxGeometry args={[b.w, h, b.d]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={mats.limestone} castShadow={near} receiveShadow>
        <boxGeometry args={[b.w + 0.12, 1.1, b.d + 0.12]} />
      </mesh>
      <mesh position={[0, h + 0.08, 0]} material={mats.trim} castShadow={near}>
        <boxGeometry args={[b.w + 0.38, 0.2, b.d + 0.38]} />
      </mesh>
      <mesh position={[0, h + 0.16, 0]} geometry={roof} material={mats.roof} castShadow={near} />
      {near &&
        Array.from({ length: shops }).map((_, i) => {
          const span = b.w * 0.82;
          const x = -span / 2 + (span / (shops - 1)) * i;
          return (
            <ShopBay
              key={`s${i}`}
              x={x}
              z={b.d / 2 + 0.02}
              w={span / shops - 0.35}
              h={2.85}
              mats={mats}
              dusk={dusk}
              room={i}
            />
          );
        })}
      {near &&
        Array.from({ length: b.stories - 1 }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const span = b.w * 0.78;
            const x = -span / 2 + (span / (cols - 1)) * col;
            const y = STORY.ground + row * STORY.typical + 0.35;
            return (
              <UpperWindow
                key={`w${row}-${col}`}
                x={x}
                y={y}
                z={b.d / 2 + 0.02}
                mats={mats}
                dusk={dusk}
                room={col}
              />
            );
          }),
        )}
      {!near && (
        <mesh position={[0, 1.55, b.d / 2 + 0.04]} material={dusk ? mats.glow : mats.darkInterior}>
          <boxGeometry args={[b.w * 0.82, 2.4, 0.08]} />
        </mesh>
      )}
    </group>
  );
}

function CivicTower({ mats }: { mats: PlazaMats }) {
  const roof = useMemo(() => makeHipRoof(8.4, 8.4, 3.2), []);
  return (
    <group position={[22, 0, 78]} name="CIVIC_TOWER_CONTEXT">
      <mesh position={[0, 9, 0]} material={mats.stucco} castShadow receiveShadow>
        <boxGeometry args={[7.6, 18, 7.6]} />
      </mesh>
      <mesh position={[0, 18.4, 0]} material={mats.trim} castShadow>
        <boxGeometry args={[8.2, 0.4, 8.2]} />
      </mesh>
      <mesh position={[0, 20.6, 0]} material={mats.stucco} castShadow>
        <cylinderGeometry args={[2.4, 2.6, 4.2, 8]} />
      </mesh>
      <mesh position={[0, 22.8, 0]} geometry={roof} material={mats.copper} scale={[0.42, 0.42, 0.42]} />
      <mesh position={[0, 13.5, 3.9]}>
        <circleGeometry args={[1.1, 24]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Car({ x, z, rot, color }: { x: number; z: number; rot: number; color: string }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[4.4, 0.7, 1.85]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.35} />
      </mesh>
      <mesh position={[-0.25, 1.12, 0]} castShadow>
        <boxGeometry args={[2.4, 0.55, 1.7]} />
        <meshStandardMaterial color="#1a2228" roughness={0.2} metalness={0.2} />
      </mesh>
    </group>
  );
}

export function District({ mats, dusk }: { mats: PlazaMats; dusk: boolean }) {
  return (
    <group name="DISTRICT_CONTEXT">
      {BLOCKS.map((b, i) => (
        <MixedUse key={i} b={b} mats={mats} dusk={dusk} />
      ))}
      <CivicTower mats={mats} />
      <Car x={10.4} z={8.6} rot={0.04} color="#2c3036" />
      <Car x={24.8} z={8.3} rot={-0.06} color="#4a4038" />
      <Car x={38.2} z={8.8} rot={0.1} color="#c8c4bc" />
      <Car x={FOURTH_AVE.centerX} z={-9.4} rot={Math.PI / 2} color="#3a4650" />
    </group>
  );
}
