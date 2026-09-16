import { useMemo } from "react";
import * as THREE from "three";
import { BUILDING, NORTH_Z, STORY, eaveHeight } from "./config";
import { makeArchFill, makeArchFrame, makeDome, makeHipRoof } from "./geometry";
import type { PlazaMats } from "./materials";

type Mats = PlazaMats;
type Face = "north" | "west" | "east" | "south";

function faceRot(face: Face) {
  if (face === "north") return 0;
  if (face === "south") return Math.PI;
  if (face === "west") return Math.PI / 2;
  return -Math.PI / 2;
}

function WindowUnit({
  x,
  y,
  z,
  w = 1.05,
  h = 1.85,
  face = "north",
  shutters = false,
  balcony = false,
  mats,
  room = 0,
}: {
  x: number;
  y: number;
  z: number;
  w?: number;
  h?: number;
  face?: Face;
  shutters?: boolean;
  balcony?: boolean;
  mats: Mats;
  room?: number;
}) {
  const rot = faceRot(face);
  const glass = mats.interiors[room % mats.interiors.length]!;
  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, -0.1]} material={mats.darkInterior} castShadow>
        <boxGeometry args={[w + 0.18, h + 0.18, 0.28]} />
      </mesh>
      <mesh position={[0, h / 2, 0.02]} material={mats.trim} castShadow>
        <boxGeometry args={[w + 0.22, h + 0.22, 0.08]} />
      </mesh>
      <mesh position={[0, h / 2, 0.07]} material={glass}>
        <planeGeometry args={[w - 0.08, h - 0.08]} />
      </mesh>
      <mesh position={[-w * 0.25, h / 2, 0.09]} material={mats.trim}>
        <boxGeometry args={[0.035, h - 0.14, 0.03]} />
      </mesh>
      <mesh position={[w * 0.25, h / 2, 0.09]} material={mats.trim}>
        <boxGeometry args={[0.035, h - 0.14, 0.03]} />
      </mesh>
      <mesh position={[0, h * 0.33, 0.09]} material={mats.trim}>
        <boxGeometry args={[w - 0.12, 0.035, 0.03]} />
      </mesh>
      <mesh position={[0, h * 0.66, 0.09]} material={mats.trim}>
        <boxGeometry args={[w - 0.12, 0.035, 0.03]} />
      </mesh>
      <mesh position={[0, -0.06, 0.12]} material={mats.limestone} castShadow>
        <boxGeometry args={[w + 0.28, 0.1, 0.16]} />
      </mesh>
      {shutters && (
        <>
          <mesh position={[-(w / 2 + 0.22), h / 2, 0.1]} material={mats.shutter} castShadow>
            <boxGeometry args={[0.32, h * 0.92, 0.06]} />
          </mesh>
          <mesh position={[w / 2 + 0.22, h / 2, 0.1]} material={mats.shutter} castShadow>
            <boxGeometry args={[0.32, h * 0.92, 0.06]} />
          </mesh>
        </>
      )}
      {balcony && (
        <group position={[0, 0.05, 0.38]}>
          <mesh material={mats.iron} castShadow>
            <boxGeometry args={[w + 0.7, 0.06, 0.55]} />
          </mesh>
          {[-0.5, -0.25, 0, 0.25, 0.5].map((sx) => (
            <mesh key={sx} position={[sx * (w + 0.4), 0.42, 0.24]} material={mats.iron}>
              <boxGeometry args={[0.04, 0.8, 0.04]} />
            </mesh>
          ))}
          <mesh position={[0, 0.82, 0.24]} material={mats.iron}>
            <boxGeometry args={[w + 0.72, 0.04, 0.04]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function ArchUnit({
  x,
  y,
  z,
  w = 2.55,
  h = 3.55,
  face = "north",
  glow = 0,
  mats,
  open = false,
  room = 0,
}: {
  x: number;
  y: number;
  z: number;
  w?: number;
  h?: number;
  face?: Face;
  glow?: number;
  mats: Mats;
  open?: boolean;
  room?: number;
}) {
  const rot = faceRot(face);
  const frame = useMemo(() => makeArchFrame(w, h, 0.16, 0.32), [w, h]);
  const fill = useMemo(() => makeArchFill(w - 0.28, h - 0.18, 0.04), [w, h]);
  const interior = useMemo(() => makeArchFill(w - 0.2, h - 0.1, 0.4), [w, h]);
  const glowMat = useMemo(() => {
    const m = mats.glow.clone();
    m.emissiveIntensity = glow;
    return m;
  }, [mats.glow, glow]);
  const glass = mats.interiors[room % mats.interiors.length]!;
  return (
    <group position={[x, y, z]} rotation={[0, rot, 0]}>
      <mesh geometry={interior} position={[0, 0, -0.45]} material={open ? mats.darkInterior : glow > 0.4 ? glowMat : mats.darkInterior} />
      <mesh geometry={frame} material={mats.trim} castShadow receiveShadow />
      <mesh geometry={fill} position={[0, 0, 0.04]} material={open ? mats.darkInterior : glow > 0.4 ? glowMat : glass} />
      {glow > 0.05 && !open && (
        <mesh geometry={fill} position={[0, 0, -0.12]} material={glowMat} />
      )}
      <mesh position={[0, 0.08, 0.18]} material={mats.limestone} castShadow>
        <boxGeometry args={[w + 0.35, 0.16, 0.28]} />
      </mesh>
    </group>
  );
}

function Mass({
  x0,
  x1,
  zNorth,
  depth,
  height,
  mats,
  stoneH = 1.25,
  y0 = 0,
}: {
  x0: number;
  x1: number;
  zNorth: number;
  depth: number;
  height: number;
  mats: Mats;
  stoneH?: number;
  y0?: number;
}) {
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const cz = zNorth - depth / 2;
  return (
    <group>
      <mesh position={[cx, y0 + height / 2, cz]} material={mats.stucco} castShadow receiveShadow>
        <boxGeometry args={[w, height, depth]} />
      </mesh>
      {y0 < 0.05 && (
        <mesh position={[cx, stoneH / 2, cz]} material={mats.limestone} castShadow receiveShadow>
          <boxGeometry args={[w + 0.08, stoneH, depth + 0.08]} />
        </mesh>
      )}
    </group>
  );
}

function Cornice({
  x0,
  x1,
  zNorth,
  depth,
  y,
  mats,
}: {
  x0: number;
  x1: number;
  zNorth: number;
  depth: number;
  y: number;
  mats: Mats;
}) {
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const cz = zNorth - depth / 2;
  return (
    <group>
      <mesh position={[cx, y, cz]} material={mats.trim} castShadow>
        <boxGeometry args={[w + 0.45, 0.22, depth + 0.45]} />
      </mesh>
      <mesh position={[cx, y + 0.18, cz]} material={mats.trim} castShadow>
        <boxGeometry args={[w + 0.28, 0.12, depth + 0.28]} />
      </mesh>
    </group>
  );
}

function Belt({
  x0,
  x1,
  zNorth,
  depth,
  y,
  mats,
}: {
  x0: number;
  x1: number;
  zNorth: number;
  depth: number;
  y: number;
  mats: Mats;
}) {
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const cz = zNorth - depth / 2;
  return (
    <mesh position={[cx, y, cz]} material={mats.trim} castShadow>
      <boxGeometry args={[w + 0.12, 0.16, depth + 0.12]} />
    </mesh>
  );
}

function Quoins({
  x,
  zNorth,
  depth,
  height,
  mats,
}: {
  x: number;
  zNorth: number;
  depth: number;
  height: number;
  mats: Mats;
}) {
  const blocks = [];
  const h = 0.42;
  for (let i = 0, y = 0.15; y < height - 0.3; i++, y += h + 0.04) {
    const long = i % 2 === 0;
    const bw = long ? 0.72 : 0.46;
    const bh = h;
    blocks.push(
      <mesh key={`n${i}`} position={[x, y + bh / 2, zNorth + 0.06]} material={mats.limestone} castShadow>
        <boxGeometry args={[bw, bh, 0.14]} />
      </mesh>,
    );
    blocks.push(
      <mesh
        key={`s${i}`}
        position={[x, y + bh / 2, zNorth - depth - 0.06]}
        material={mats.limestone}
        castShadow
      >
        <boxGeometry args={[bw, bh, 0.14]} />
      </mesh>,
    );
  }
  return <group>{blocks}</group>;
}

function Chimney({ x, y, z, mats }: { x: number; y: number; z: number; mats: Mats }) {
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.95, 0]} material={mats.stucco} castShadow>
        <boxGeometry args={[0.72, 1.9, 0.55]} />
      </mesh>
      <mesh position={[0, 1.95, 0]} material={mats.limestone} castShadow>
        <boxGeometry args={[0.88, 0.16, 0.7]} />
      </mesh>
      <mesh position={[0, 2.12, 0]} material={mats.bronze}>
        <boxGeometry args={[0.22, 0.28, 0.22]} />
      </mesh>
    </group>
  );
}

function RoofOn({
  x0,
  x1,
  zNorth,
  depth,
  y,
  rise = 3.15,
  mats,
}: {
  x0: number;
  x1: number;
  zNorth: number;
  depth: number;
  y: number;
  rise?: number;
  mats: Mats;
}) {
  const w = x1 - x0 + 0.7;
  const d = depth + 0.7;
  const geom = useMemo(() => makeHipRoof(w, d, rise), [w, d, rise]);
  const cx = (x0 + x1) / 2;
  const cz = zNorth - depth / 2;
  return (
    <mesh position={[cx, y, cz]} geometry={geom} material={mats.roof} castShadow receiveShadow />
  );
}

function Dormer({
  x,
  y,
  z,
  mats,
  room = 0,
}: {
  x: number;
  y: number;
  z: number;
  mats: Mats;
  room?: number;
}) {
  const gable = useMemo(() => makeHipRoof(1.55, 1.7, 0.85), []);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.55, 0.15]} material={mats.stucco} castShadow>
        <boxGeometry args={[1.28, 1.1, 1.35]} />
      </mesh>
      <mesh position={[0, 1.12, 0.1]} geometry={gable} material={mats.roof} castShadow />
      <WindowUnit x={0} y={0.12} z={0.82} w={0.72} h={0.85} shutters={false} mats={mats} room={room} />
    </group>
  );
}

function Column({ x, y, z, h, mats }: { x: number; y: number; z: number; h: number; mats: Mats }) {
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.14, 0]} material={mats.limestone} castShadow>
        <boxGeometry args={[0.5, 0.28, 0.5]} />
      </mesh>
      <mesh position={[0, h / 2, 0]} material={mats.trim} castShadow>
        <cylinderGeometry args={[0.15, 0.19, h - 0.52, 16]} />
      </mesh>
      <mesh position={[0, h - 0.36, 0]} material={mats.trim} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.16, 16]} />
      </mesh>
      <mesh position={[0, h - 0.16, 0]} material={mats.limestone} castShadow>
        <boxGeometry args={[0.52, 0.22, 0.52]} />
      </mesh>
    </group>
  );
}

function Balustrade({
  x0,
  x1,
  y,
  z,
  mats,
}: {
  x0: number;
  x1: number;
  y: number;
  z: number;
  mats: Mats;
}) {
  const n = Math.max(4, Math.round((x1 - x0) / 0.55));
  const xs = Array.from({ length: n }, (_, i) => x0 + ((x1 - x0) * i) / (n - 1));
  return (
    <group>
      <mesh position={[(x0 + x1) / 2, y + 0.72, z]} material={mats.trim} castShadow>
        <boxGeometry args={[x1 - x0 + 0.12, 0.08, 0.14]} />
      </mesh>
      {xs.map((x) => (
        <mesh key={x.toFixed(2)} position={[x, y + 0.38, z]} material={mats.trim} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.7, 8]} />
        </mesh>
      ))}
    </group>
  );
}

function ClockFace({ x, y, z, face = "west", mats }: { x: number; y: number; z: number; face?: Face; mats: Mats }) {
  return (
    <group position={[x, y, z]} rotation={[0, faceRot(face), 0]}>
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={mats.trim} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.1, 28]} />
      </mesh>
      <mesh position={[0, 0, 0.14]}>
        <circleGeometry args={[0.62, 28]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.45} />
      </mesh>
      <mesh position={[0.16, 0.06, 0.16]} rotation={[0, 0, -0.7]} material={mats.bronze}>
        <boxGeometry args={[0.05, 0.42, 0.03]} />
      </mesh>
      <mesh position={[-0.04, 0.14, 0.16]} rotation={[0, 0, 0.35]} material={mats.bronze}>
        <boxGeometry args={[0.04, 0.3, 0.03]} />
      </mesh>
    </group>
  );
}

function Lantern({ x, y, z, mats }: { x: number; y: number; z: number; mats: Mats }) {
  const dome = useMemo(() => makeDome(1.15, 24), []);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.15, 0]} material={mats.trim} castShadow>
        <cylinderGeometry args={[1.35, 1.45, 0.3, 8]} />
      </mesh>
      <mesh position={[0, 1.35, 0]} material={mats.stucco} castShadow>
        <cylinderGeometry args={[1.12, 1.18, 2.2, 8]} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 1.12, 1.35, Math.cos(a) * 1.12]}
            rotation={[0, a, 0]}
            material={mats.darkInterior}
          >
            <boxGeometry args={[0.55, 1.35, 0.06]} />
          </mesh>
        );
      })}
      <mesh position={[0, 2.55, 0]} material={mats.trim} castShadow>
        <cylinderGeometry args={[1.28, 1.2, 0.22, 8]} />
      </mesh>
      <mesh geometry={dome} position={[0, 2.66, 0]} material={mats.copper} castShadow />
      <mesh position={[0, 3.9, 0]} material={mats.copper} castShadow>
        <sphereGeometry args={[0.16, 12, 10]} />
      </mesh>
      <mesh position={[0, 4.2, 0]} material={mats.bronze}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
      </mesh>
      <ClockFace x={0} y={1.55} z={1.18} face="north" mats={mats} />
      <ClockFace x={-1.18} y={1.55} z={0} face="west" mats={mats} />
    </group>
  );
}

function spaced(x0: number, x1: number, n: number, margin = 1.4) {
  const inner = x1 - x0 - margin * 2;
  const step = inner / Math.max(1, n - 1);
  return Array.from({ length: n }, (_, i) => x0 + margin + i * step);
}

function RoofTerrace({
  x,
  y,
  z,
  w,
  d,
  mats,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  mats: Mats;
}) {
  const posts = [-w * 0.38, w * 0.38];
  const beams = [-d * 0.32, 0, d * 0.32];
  return (
    <group position={[x, y, z]} name="ROOF_TERRACE">
      <mesh position={[0, 0.06, 0]} material={mats.limestone} receiveShadow>
        <boxGeometry args={[w, 0.12, d]} />
      </mesh>
      <Balustrade x0={-w / 2 + 0.1} x1={w / 2 - 0.1} y={0.08} z={d / 2 - 0.08} mats={mats} />
      {posts.map((px) =>
        [-d * 0.35, d * 0.28].map((pz) => (
          <mesh key={`${px}-${pz}`} position={[px, 1.35, pz]} material={mats.wood} castShadow>
            <boxGeometry args={[0.12, 2.5, 0.12]} />
          </mesh>
        )),
      )}
      {beams.map((bz) => (
        <mesh key={bz} position={[0, 2.55, bz]} material={mats.wood} castShadow>
          <boxGeometry args={[w * 0.82, 0.08, 0.1]} />
        </mesh>
      ))}
      <mesh position={[0, 2.62, 0]} material={mats.wood} castShadow>
        <boxGeometry args={[w * 0.82, 0.06, d * 0.72]} />
      </mesh>
      {[-0.9, 0.9].map((px) => (
        <mesh key={px} position={[px, 0.42, -d * 0.22]} material={mats.hedge} castShadow>
          <boxGeometry args={[1.1, 0.7, 0.55]} />
        </mesh>
      ))}
    </group>
  );
}

export function ArdalanBuilding({ mats, glow = 0 }: { mats: Mats; glow?: number }) {
  const B = BUILDING;
  const zN = NORTH_Z;
  const h = eaveHeight(B.stories);
  const cut = B.chamfer;
  const y2 = STORY.ground + 0.5;
  const y3 = STORY.ground + STORY.typical + 0.45;

  const northXs = spaced(B.west + cut + 1.6, B.east - 1.4, 9, 1.8);
  const westZs = spaced(B.south + 1.6, zN - cut - 1.4, 7, 1.8);
  const chamferMidX = B.west + cut / 2;
  const chamferMidZ = zN - cut / 2;

  return (
    <group name="01_ARDALAN_BUILDING" userData={{ assumption: "corner palazzo, estimated" }}>
      {/* Main mass: east of the chamfer, full depth along Main */}
      <Mass x0={B.west + cut} x1={B.east} zNorth={zN} depth={-B.south} height={h} mats={mats} />
      {/* West mass: south of the chamfer, along 4th Ave */}
      <Mass
        x0={B.west}
        x1={B.west + cut}
        zNorth={zN - cut}
        depth={-B.south - cut}
        height={h}
        mats={mats}
      />

      <Cornice x0={B.west} x1={B.east} zNorth={zN} depth={-B.south} y={h} mats={mats} />
      <Belt x0={B.west} x1={B.east} zNorth={zN} depth={-B.south} y={STORY.ground} mats={mats} />
      <Belt
        x0={B.west}
        x1={B.east}
        zNorth={zN}
        depth={-B.south}
        y={STORY.ground + STORY.typical}
        mats={mats}
      />
      <Quoins x={B.east} zNorth={zN} depth={-B.south} height={h} mats={mats} />
      <Quoins x={B.west} zNorth={zN - cut} depth={-B.south - cut} height={h} mats={mats} />

      <RoofOn
        x0={B.west - 0.2}
        x1={B.east + 0.2}
        zNorth={zN + 0.25}
        depth={-B.south + 0.4}
        y={h + 0.28}
        rise={6.4}
        mats={mats}
      />

      {/* Chamfered corner — faces the fountain, rotated 45° */}
      <group
        name="CHAMFER_ENTRANCE"
        position={[chamferMidX, 0, chamferMidZ]}
        rotation={[0, -Math.PI / 4, 0]}
      >
        <mesh position={[0, h / 2, 0.08]} material={mats.stucco} castShadow receiveShadow>
          <boxGeometry args={[cut * Math.SQRT2 - 0.4, h, 0.55]} />
        </mesh>
        <mesh position={[0, 0.62, 0.18]} material={mats.limestone} castShadow>
          <boxGeometry args={[cut * Math.SQRT2 - 0.2, 1.24, 0.7]} />
        </mesh>
        <Column x={-3.15} y={0} z={0.45} h={STORY.ground + 0.15} mats={mats} />
        <Column x={3.15} y={0} z={0.45} h={STORY.ground + 0.15} mats={mats} />
        <Column x={-1.05} y={0} z={0.45} h={STORY.ground + 0.15} mats={mats} />
        <Column x={1.05} y={0} z={0.45} h={STORY.ground + 0.15} mats={mats} />
        <ArchUnit x={0} y={0.12} z={0.42} w={5.6} h={3.7} glow={glow} mats={mats} open room={0} />
        <mesh position={[0, STORY.ground + 0.08, 0.7]} material={mats.limestone} castShadow>
          <boxGeometry args={[6.4, 0.16, 1.15]} />
        </mesh>
        <Balustrade x0={-2.6} x1={2.6} y={STORY.ground + 0.12} z={1.05} mats={mats} />
        <WindowUnit x={-2.15} y={y2} z={0.4} w={1.15} h={1.9} mats={mats} room={1} />
        <WindowUnit x={2.15} y={y2} z={0.4} w={1.15} h={1.9} mats={mats} room={2} />
        <WindowUnit x={-2.15} y={y3} z={0.4} w={1.05} h={1.7} mats={mats} room={3} />
        <WindowUnit x={0} y={y3} z={0.4} w={1.05} h={1.7} mats={mats} room={4} />
        <WindowUnit x={2.15} y={y3} z={0.4} w={1.05} h={1.7} mats={mats} room={5} />
      </group>

      {/* Main Street (north) storefronts + windows */}
      {northXs.map((x, i) => (
        <group key={`n-${i}`}>
          <ArchUnit x={x} y={0.12} z={zN + 0.06} w={2.45} h={3.45} glow={glow} mats={mats} room={i} />
          <WindowUnit x={x} y={y2} z={zN + 0.05} w={1.12} h={1.95} mats={mats} room={i + 2} />
          <WindowUnit x={x} y={y3} z={zN + 0.05} w={1.05} h={1.75} mats={mats} room={i + 4} />
        </group>
      ))}

      {/* 4th Ave (west) storefronts + windows */}
      {westZs.map((z, i) => (
        <group key={`w-${i}`}>
          <ArchUnit
            x={B.west - 0.06}
            y={0.12}
            z={z}
            w={2.35}
            h={3.45}
            face="west"
            glow={glow}
            mats={mats}
            room={i + 1}
          />
          <WindowUnit x={B.west - 0.05} y={y2} z={z} w={1.12} h={1.95} face="west" mats={mats} room={i + 3} />
          <WindowUnit x={B.west - 0.05} y={y3} z={z} w={1.05} h={1.75} face="west" mats={mats} room={i + 5} />
        </group>
      ))}

      <Chimney x={B.east - 6} y={h + 6.6} z={zN - 8} mats={mats} />
      <Chimney x={B.west + 14} y={h + 6.6} z={B.south + 8} mats={mats} />
    </group>
  );
}

