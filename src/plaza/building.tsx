import { useMemo } from "react";
import * as THREE from "three";
import { BAYS, NORTH_Z, STORY, eaveHeight } from "./config";
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
  const W = BAYS.west;
  const L = BAYS.loggia;
  const T = BAYS.tower;
  const E = BAYS.east;
  const zN = NORTH_Z;

  const westH = eaveHeight(W.stories);
  const loggiaH = eaveHeight(L.stories);
  const towerH = eaveHeight(3) + STORY.attic;
  const eastH = eaveHeight(E.stories);

  const westWindowsN = spaced(W.x0, W.x1, 2, 2.2);
  const westWindowsW = [zN - 4.2, zN - 8.6];
  const loggiaXs = spaced(L.x0, L.x1, 2, 1.55);
  const towerXs = spaced(T.x0, T.x1, 3, 1.9);
  const eastXs = spaced(E.x0, E.x1, 4, 1.9);
  const eastWinXs = spaced(E.x0, E.x1, 4, 2.05);

  const y2 = STORY.ground + 0.55;
  const y3 = STORY.ground + STORY.typical + 0.55;
  const y4 = STORY.ground + STORY.typical * 2 + 0.4;

  return (
    <group name="01_ARDALAN_BUILDING">
      {/* WEST PAVILION */}
      <group name="WEST_PAVILION">
        <Mass x0={W.x0} x1={W.x1} zNorth={zN} depth={W.depth} height={westH} mats={mats} />
        <Belt x0={W.x0} x1={W.x1} zNorth={zN} depth={W.depth} y={STORY.ground} mats={mats} />
        <Belt x0={W.x0} x1={W.x1} zNorth={zN} depth={W.depth} y={STORY.ground + STORY.typical} mats={mats} />
        <Cornice x0={W.x0} x1={W.x1} zNorth={zN} depth={W.depth} y={westH} mats={mats} />
        <RoofOn x0={W.x0} x1={W.x1} zNorth={zN} depth={W.depth} y={westH + 0.12} mats={mats} rise={3.05} />
        <Dormer x={(W.x0 + W.x1) / 2 - 1.6} y={westH + 1.15} z={zN - 2.2} mats={mats} room={0} />
        <Dormer x={(W.x0 + W.x1) / 2 + 1.6} y={westH + 1.15} z={zN - 2.2} mats={mats} room={1} />
        <Quoins x={W.x0} zNorth={zN} depth={W.depth} height={westH} mats={mats} />
        <Quoins x={W.x1} zNorth={zN} depth={W.depth} height={westH} mats={mats} />
        {spaced(W.x0, W.x1, 2, 2.1).map((x, i) => (
          <ArchUnit key={`wa${i}`} x={x} y={0.18} z={zN + 0.04} w={2.35} h={3.4} mats={mats} glow={glow} room={i} />
        ))}
        {westWindowsN.map((x, i) => (
          <WindowUnit key={`wn2${i}`} x={x} y={y2} z={zN + 0.02} mats={mats} room={i} />
        ))}
        {westWindowsN.map((x, i) => (
          <WindowUnit key={`wn3${i}`} x={x} y={y3} z={zN + 0.02} mats={mats} room={i + 2} />
        ))}
        {westWindowsW.map((z, i) => (
          <ArchUnit
            key={`wwa${i}`}
            x={W.x0 - 0.02}
            y={0.18}
            z={z}
            w={2.2}
            h={3.3}
            face="west"
            mats={mats}
            glow={glow}
            room={i}
          />
        ))}
        {westWindowsW.map((z, i) => (
          <WindowUnit key={`ww2${i}`} x={W.x0 - 0.02} y={y2} z={z} face="west" mats={mats} room={i} />
        ))}
        {westWindowsW.map((z, i) => (
          <WindowUnit key={`ww3${i}`} x={W.x0 - 0.02} y={y3} z={z} face="west" mats={mats} room={i + 1} />
        ))}
        <Chimney x={(W.x0 + W.x1) / 2 - 1.6} y={westH + 2.4} z={zN - W.depth * 0.38} mats={mats} />
        <Chimney x={(W.x0 + W.x1) / 2 + 1.6} y={westH + 2.4} z={zN - W.depth * 0.38} mats={mats} />
      </group>

      {/* LOGGIA */}
      <group name="LOGGIA">
        <Mass
          x0={L.x0}
          x1={L.x1}
          zNorth={zN - L.setback}
          depth={L.depth}
          height={loggiaH}
          mats={mats}
          stoneH={1.1}
        />
        <Belt x0={L.x0} x1={L.x1} zNorth={zN - L.setback} depth={L.depth} y={STORY.ground} mats={mats} />
        <Belt
          x0={L.x0}
          x1={L.x1}
          zNorth={zN - L.setback}
          depth={L.depth}
          y={STORY.ground + STORY.typical}
          mats={mats}
        />
        <Cornice x0={L.x0} x1={L.x1} zNorth={zN - L.setback} depth={L.depth} y={loggiaH} mats={mats} />
        <RoofOn
          x0={L.x0}
          x1={L.x1}
          zNorth={zN - L.setback}
          depth={L.depth}
          y={loggiaH + 0.1}
          mats={mats}
          rise={2.6}
        />
        {loggiaXs.map((x, i) => (
          <group key={`lg${i}`}>
            <ArchUnit x={x} y={0.18} z={zN - L.setback + 0.06} w={2.05} h={3.35} mats={mats} glow={glow} open />
            <ArchUnit x={x} y={y2 - 0.15} z={zN - L.setback + 0.06} w={1.85} h={2.7} mats={mats} open />
            <ArchUnit x={x} y={y3 - 0.15} z={zN - L.setback + 0.06} w={1.7} h={2.45} mats={mats} open />
            <Column x={x - 1.05} y={0} z={zN - L.setback + 0.22} h={loggiaH - 0.2} mats={mats} />
          </group>
        ))}
        <Column x={L.x1 - 0.35} y={0} z={zN - L.setback + 0.22} h={loggiaH - 0.2} mats={mats} />
        <Balustrade x0={L.x0 + 0.3} x1={L.x1 - 0.3} y={STORY.ground} z={zN - L.setback + 0.28} mats={mats} />
      </group>

      {/* TOWER — ground floor is the foyer cavity */}
      <group name="TOWER">
        <Mass
          x0={T.x0}
          x1={T.x1}
          zNorth={zN}
          depth={T.depth}
          height={towerH - STORY.ground}
          y0={STORY.ground}
          mats={mats}
        />
        {/* West ground infill where the loggia sets back */}
        <mesh position={[T.x0, STORY.ground / 2, zN - 0.85]} material={mats.stucco} castShadow>
          <boxGeometry args={[0.36, STORY.ground, 1.7]} />
        </mesh>
        <mesh position={[T.x0, 0.55, zN - 0.85]} material={mats.limestone} castShadow>
          <boxGeometry args={[0.4, 1.1, 1.75]} />
        </mesh>
        <Belt x0={T.x0} x1={T.x1} zNorth={zN} depth={T.depth} y={STORY.ground} mats={mats} />
        <Belt x0={T.x0} x1={T.x1} zNorth={zN} depth={T.depth} y={STORY.ground + STORY.typical} mats={mats} />
        <Belt x0={T.x0} x1={T.x1} zNorth={zN} depth={T.depth} y={STORY.ground + STORY.typical * 2} mats={mats} />
        <Cornice x0={T.x0} x1={T.x1} zNorth={zN} depth={T.depth} y={towerH} mats={mats} />
        <RoofOn x0={T.x0} x1={T.x1} zNorth={zN} depth={T.depth} y={towerH + 0.12} mats={mats} rise={3.4} />
        <Dormer x={(T.x0 + T.x1) / 2} y={towerH + 1.35} z={zN - 2.4} mats={mats} room={2} />
        <Quoins x={T.x0} zNorth={zN} depth={T.depth} height={towerH} mats={mats} />
        <Quoins x={T.x1} zNorth={zN} depth={T.depth} height={towerH} mats={mats} />
        {towerXs.map((x, i) => (
          <WindowUnit key={`t2${i}`} x={x} y={y2} z={zN + 0.02} w={1.0} mats={mats} room={i} />
        ))}
        {towerXs.map((x, i) => (
          <WindowUnit key={`t3${i}`} x={x} y={y3} z={zN + 0.02} w={1.0} mats={mats} room={i + 1} />
        ))}
        {towerXs.map((x, i) => (
          <WindowUnit key={`t4${i}`} x={x} y={y4} z={zN + 0.02} w={0.85} h={1.45} shutters={false} mats={mats} room={i} />
        ))}
        <Lantern x={(T.x0 + T.x1) / 2} y={towerH + 3.15} z={zN - T.depth / 2} mats={mats} />
        <RoofTerrace
          x={(T.x0 + T.x1) / 2}
          y={towerH + 0.22}
          z={zN - 1.55}
          w={T.x1 - T.x0 - 1.4}
          d={4.6}
          mats={mats}
        />
        <mesh position={[(T.x0 + T.x1) / 2, towerH - 0.52, zN + 0.26]} material={mats.ardalanSign}>
          <planeGeometry args={[7.6, 1.15]} />
        </mesh>
      </group>

      {/* EAST WING */}
      <group name="EAST_WING">
        <Mass x0={E.x0} x1={E.x1} zNorth={zN} depth={E.depth} height={eastH} mats={mats} />
        <Belt x0={E.x0} x1={E.x1} zNorth={zN} depth={E.depth} y={STORY.ground} mats={mats} />
        <Belt x0={E.x0} x1={E.x1} zNorth={zN} depth={E.depth} y={STORY.ground + STORY.typical} mats={mats} />
        <Cornice x0={E.x0} x1={E.x1} zNorth={zN} depth={E.depth} y={eastH} mats={mats} />
        <RoofOn x0={E.x0} x1={E.x1} zNorth={zN} depth={E.depth} y={eastH + 0.12} mats={mats} rise={3.2} />
        <Dormer x={E.x0 + 4.2} y={eastH + 1.2} z={zN - 2.2} mats={mats} room={0} />
        <Dormer x={E.x0 + 10.2} y={eastH + 1.2} z={zN - 2.2} mats={mats} room={3} />
        <Dormer x={E.x1 - 4.4} y={eastH + 1.2} z={zN - 2.2} mats={mats} room={1} />
        <Quoins x={E.x0} zNorth={zN} depth={E.depth} height={eastH} mats={mats} />
        <Quoins x={E.x1} zNorth={zN} depth={E.depth} height={eastH} mats={mats} />
        {eastXs.map((x, i) => (
          <ArchUnit key={`ea${i}`} x={x} y={0.18} z={zN + 0.04} w={2.7} h={3.5} mats={mats} glow={glow} room={i} />
        ))}
        {eastWinXs.map((x, i) => (
          <WindowUnit
            key={`e2${i}`}
            x={x}
            y={y2}
            z={zN + 0.02}
            mats={mats}
            balcony={i === 2}
            room={i}
          />
        ))}
        {eastWinXs.map((x, i) => (
          <WindowUnit key={`e3${i}`} x={x} y={y3} z={zN + 0.02} mats={mats} room={i + 1} />
        ))}
        <Chimney x={E.x0 + 4.2} y={eastH + 2.5} z={zN - E.depth * 0.4} mats={mats} />
        <Chimney x={E.x1 - 4.2} y={eastH + 2.5} z={zN - E.depth * 0.4} mats={mats} />
      </group>

      {/* simplified south elevation — labeled inferred */}
      <group name="SOUTH_INFERRED" userData={{ assumption: true }}>
        <mesh position={[(W.x0 + E.x1) / 2, 0.4, zN - 16.55]} material={mats.limestone}>
          <boxGeometry args={[E.x1 - W.x0 + 0.4, 0.8, 0.2]} />
        </mesh>
        {[-16, -6, 4, 14].map((x) => (
          <mesh key={x} position={[x, 6.2, zN - 16.45]} material={glow > 0.2 ? mats.glow : mats.darkInterior}>
            <boxGeometry args={[7.2, 2.4, 0.08]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
