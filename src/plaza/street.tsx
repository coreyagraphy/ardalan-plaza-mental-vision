import { FOOTPRINT, FOURTH_AVE, FOUNTAIN, NORTH_Z, ROUNDABOUT, STREET, THIRD_AVE, TREES } from "./config";
import type { PlazaMats } from "./materials";

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/** Crossed-plane + volume canopy — the arch-viz tree used in live Three.js city demos. */
export function Tree({ x, z, s = 1, mats }: { x: number; z: number; s?: number; mats: PlazaMats }) {
  const h = hash(x * 13.1 + z * 7.7);
  const h2 = hash(x * 3.3 + z * 19.1);
  const canopyY = 3.55 + h * 0.4;
  const blobs: [number, number, number, number][] = [
    [0, 0, 0, 1.55],
    [0.82, 0.38, 0.22, 1.08],
    [-0.78, 0.22, -0.32, 1.02],
    [0.14, 0.62, -0.74, 0.96],
    [-0.28, 0.5, 0.7, 0.92],
    [0.58, -0.08, -0.48, 0.82],
    [-0.52, 0.02, 0.42, 0.78],
    [0.32, 0.78, 0.14, 0.74],
  ];
  const cardH = 3.4 + h * 0.5;
  return (
    <group position={[x, 0, z]} scale={s} rotation={[0, h * 6.2, 0]}>
      <mesh position={[0, 1.35, 0]} material={mats.bronze} castShadow>
        <cylinderGeometry args={[0.16, 0.3, 2.7, 8]} />
      </mesh>
      <mesh position={[0.35, 2.4, 0.1]} rotation={[0.2, 0.4, 0.5]} material={mats.bronze} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 1.4, 6]} />
      </mesh>
      <mesh position={[0, canopyY - 0.35, 0]} material={mats.foliageDark} castShadow>
        <icosahedronGeometry args={[1.28, 1]} />
      </mesh>
      {blobs.map(([bx, by, bz, br], i) => (
        <mesh
          key={i}
          position={[bx + (h - 0.5) * 0.12, canopyY + by, bz + (h2 - 0.5) * 0.12]}
          scale={[1, 0.82 + h * 0.12, 1]}
          material={i % 2 === 0 ? mats.foliage : mats.foliageLit}
          castShadow
        >
          <icosahedronGeometry args={[br, 1]} />
        </mesh>
      ))}
      {[0, 1.05, 2.1].map((ry) => (
        <mesh
          key={ry}
          position={[0, canopyY + 0.15, 0]}
          rotation={[0, ry, 0]}
          material={mats.foliageCard}
        >
          <planeGeometry args={[cardH, cardH * 0.92]} />
        </mesh>
      ))}
    </group>
  );
}

export function FlowerPatch({ x, z, mats }: { x: number; z: number; mats: PlazaMats }) {
  const n = 22;
  const flowers = Array.from({ length: n }, (_, i) => {
    const a = hash(i * 4.2 + x);
    const b = hash(i * 9.1 + z);
    return {
      px: (a - 0.5) * 3.6,
      pz: (b - 0.5) * 1.4,
      s: 0.18 + hash(i + 3) * 0.16,
      ry: a * 6,
    };
  });
  return (
    <group position={[x, 0.12, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={mats.grass} receiveShadow>
        <planeGeometry args={[4.2, 1.8]} />
      </mesh>
      {flowers.map((f, i) => (
        <mesh
          key={i}
          position={[f.px, f.s * 0.45, f.pz]}
          rotation={[-0.4, f.ry, 0]}
          scale={f.s}
          material={mats.bloom}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

function Lamp({
  x,
  z,
  on,
  mats,
  banner,
  lit = true,
}: {
  x: number;
  z: number;
  on: boolean;
  mats: PlazaMats;
  banner?: "art" | "district";
  lit?: boolean;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.85, 0]} material={mats.iron} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 3.7, 8]} />
      </mesh>
      <mesh position={[0, 3.72, 0]} material={mats.iron}>
        <boxGeometry args={[0.72, 0.08, 0.14]} />
      </mesh>
      <mesh position={[0, 3.55, 0]}>
        <sphereGeometry args={[0.2, 12, 10]} />
        <meshStandardMaterial
          color={on ? "#ffe6b8" : "#d8c8a8"}
          emissive={on ? "#ffcc88" : "#000000"}
          emissiveIntensity={on ? 1.8 : 0}
          roughness={0.25}
        />
      </mesh>
      {on && lit && <pointLight position={[0, 3.35, 0]} intensity={5.2} distance={14} color="#ffc888" />}
      {banner && (
        <mesh position={[0.42, 2.35, 0]} material={banner === "art" ? mats.bannerArt : mats.bannerDistrict}>
          <planeGeometry args={[0.72, 2.15]} />
        </mesh>
      )}
    </group>
  );
}

export function StreetContext({ mats, dusk }: { mats: PlazaMats; dusk: boolean }) {
  const zWalk = NORTH_Z + STREET.sidewalkW / 2 + 0.15;
  const zCurb = NORTH_Z + STREET.sidewalkW + 0.05;
  const zRoad = NORTH_Z + STREET.sidewalkW + STREET.laneW / 2 + 0.3;
  const westWalkX = FOOTPRINT.west - STREET.sidewalkW / 2 - 0.1;
  const fourthX = FOURTH_AVE.centerX;
  const thirdX = THIRD_AVE.centerX;
  const lamps: { x: number; z: number; banner?: "art" | "district"; lit?: boolean }[] = [
    { x: -18.4, z: NORTH_Z + 2.9, banner: "art", lit: true },
    { x: -6.2, z: NORTH_Z + 2.9, banner: "district", lit: true },
    { x: 6.8, z: NORTH_Z + 2.9, banner: "art", lit: true },
    { x: 18.6, z: NORTH_Z + 2.9, banner: "district", lit: true },
    { x: FOOTPRINT.west - 1.6, z: -5.2, banner: "art", lit: true },
    { x: FOOTPRINT.west - 1.6, z: -12.4, banner: "district", lit: true },
    { x: thirdX - 5.5, z: NORTH_Z + 2.9, banner: "district", lit: true },
  ];

  return (
    <group name="05_MAIN_STREET">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 8]} material={mats.grass} receiveShadow>
        <planeGeometry args={[260, 200]} />
      </mesh>

      {/* Main Street — east of the roundabout */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[18, 0.015, zRoad]}
        material={mats.asphalt}
        receiveShadow
      >
        <planeGeometry args={[90, STREET.laneW + 2.4]} />
      </mesh>
      {/* Main Street — west of the roundabout */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-58, 0.015, zRoad + 4]}
        material={mats.asphalt}
        receiveShadow
      >
        <planeGeometry args={[42, STREET.laneW + 3]} />
      </mesh>
      {/* 4th Ave SW — south of the roundabout, along the west facade */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[fourthX, 0.015, -12]}
        material={mats.asphalt}
        receiveShadow
      >
        <planeGeometry args={[FOURTH_AVE.laneW + 1.6, 48]} />
      </mesh>
      {/* 3rd Ave SW — east edge of the block */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[thirdX, 0.015, -4]}
        material={mats.asphalt}
        receiveShadow
      >
        <planeGeometry args={[THIRD_AVE.laneW + 1.2, 42]} />
      </mesh>

      {/* Roundabout circulatory roadway */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ROUNDABOUT.x, 0.02, ROUNDABOUT.z]}
        material={mats.asphalt}
        receiveShadow
      >
        <ringGeometry args={[ROUNDABOUT.islandR + 0.2, ROUNDABOUT.outerR, 64]} />
      </mesh>
      {/* Island planting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ROUNDABOUT.x, 0.04, ROUNDABOUT.z]}
        material={mats.grass}
        receiveShadow
      >
        <circleGeometry args={[ROUNDABOUT.islandR, 48]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ROUNDABOUT.x, 0.05, ROUNDABOUT.z]}
        material={mats.brick}
        receiveShadow
      >
        <ringGeometry args={[FOUNTAIN.poolR + 0.6, ROUNDABOUT.islandR - 0.35, 48]} />
      </mesh>

      {/* Main sidewalk along Ardalan */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[(FOOTPRINT.west + FOOTPRINT.east) / 2, 0.03, zWalk]}
        material={mats.brick}
        receiveShadow
      >
        <planeGeometry args={[FOOTPRINT.east - FOOTPRINT.west + 8, STREET.sidewalkW + 0.4]} />
      </mesh>
      <mesh
        position={[(FOOTPRINT.west + FOOTPRINT.east) / 2, STREET.curb / 2, zCurb]}
        material={mats.limestone}
        receiveShadow
      >
        <boxGeometry args={[FOOTPRINT.east - FOOTPRINT.west + 6, STREET.curb, 0.22]} />
      </mesh>
      {/* 4th Ave sidewalk against the west pavilion */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[westWalkX, 0.03, FOOTPRINT.south / 2]}
        material={mats.brick}
        receiveShadow
      >
        <planeGeometry args={[STREET.sidewalkW + 0.3, -FOOTPRINT.south + 4]} />
      </mesh>
      <mesh position={[FOOTPRINT.west - STREET.sidewalkW - 0.05, STREET.curb / 2, FOOTPRINT.south / 2]} material={mats.limestone}>
        <boxGeometry args={[0.22, STREET.curb, -FOOTPRINT.south + 3]} />
      </mesh>
      {/* Corner apron between building and roundabout */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[FOOTPRINT.west - 2.2, 0.032, 2.4]}
        material={mats.brick}
        receiveShadow
      >
        <circleGeometry args={[6.4, 28]} />
      </mesh>

      <group name="07_LANDSCAPE">
        {TREES.map(([tx, tz, sc], i) => (
          <Tree key={i} x={tx} z={tz} mats={mats} s={sc} />
        ))}
        <FlowerPatch x={FOOTPRINT.west - 1.2} z={2.4} mats={mats} />
        <FlowerPatch x={12.4} z={1.15} mats={mats} />
        <FlowerPatch x={-8.6} z={1.2} mats={mats} />
        <FlowerPatch x={ROUNDABOUT.x + 5.2} z={ROUNDABOUT.z + 4.6} mats={mats} />
        <mesh position={[FOOTPRINT.west - 1.5, 0.38, -3.2]} material={mats.hedge} castShadow>
          <boxGeometry args={[0.7, 0.7, 3.4]} />
        </mesh>
      </group>

      <group name="08_STREET_FURNITURE">
        {lamps.map((l) => (
          <Lamp key={`${l.x}-${l.z}`} x={l.x} z={l.z} on={dusk} mats={mats} banner={l.banner} lit={!!l.lit} />
        ))}
      </group>
    </group>
  );
}
