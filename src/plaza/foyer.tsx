import { useMemo } from "react";
import * as THREE from "three";
import { FOYER, STORY } from "./config";
import { makeCurvedDesk, makeWallWithArch } from "./geometry";
import {
  makeFoyerArtMap,
  makeJuteMap,
  makeReliefArtMap,
  makeTravertineMap,
  makeWalnutMap,
} from "./canvasTextures";
import type { PlazaMats } from "./materials";

function prep(tex: THREE.Texture, rx: number, ry: number) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(rx, ry);
  tex.anisotropy = 8;
  return tex;
}

function Olive({
  position,
  scale = 1,
  mats,
}: {
  position: [number, number, number];
  scale?: number;
  mats: PlazaMats;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]} material={mats.limestone} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 1.1, 10]} />
      </mesh>
      <mesh position={[0, 1.35, 0]} material={mats.wood} castShadow>
        <cylinderGeometry args={[0.045, 0.07, 1.7, 8]} />
      </mesh>
      <mesh position={[0.12, 2.55, 0.08]} material={mats.foliage} castShadow>
        <sphereGeometry args={[0.72, 10, 8]} />
      </mesh>
      <mesh position={[-0.28, 2.35, -0.15]} material={mats.foliageDark} castShadow>
        <sphereGeometry args={[0.48, 8, 7]} />
      </mesh>
      <mesh position={[0.22, 2.85, -0.22]} material={mats.foliageLit} castShadow>
        <sphereGeometry args={[0.38, 8, 7]} />
      </mesh>
    </group>
  );
}

function LeatherChair({
  position,
  rotY = 0,
  leather,
}: {
  position: [number, number, number];
  rotY?: number;
  leather: THREE.Material;
}) {
  const wood = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.55 }),
    [],
  );
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.42, 0]} material={leather} castShadow>
        <boxGeometry args={[0.78, 0.38, 0.74]} />
      </mesh>
      <mesh position={[0, 0.82, -0.28]} material={leather} castShadow>
        <boxGeometry args={[0.78, 0.7, 0.16]} />
      </mesh>
      <mesh position={[-0.34, 0.62, 0.02]} material={leather} castShadow>
        <boxGeometry args={[0.1, 0.28, 0.58]} />
      </mesh>
      <mesh position={[0.34, 0.62, 0.02]} material={leather} castShadow>
        <boxGeometry args={[0.1, 0.28, 0.58]} />
      </mesh>
      {[
        [-0.3, -0.28],
        [0.3, -0.28],
        [-0.3, 0.26],
        [0.3, 0.26],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.12, z]} material={wood} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.24, 8]} />
        </mesh>
      ))}
    </group>
  );
}

function Sofa({
  position,
  rotY = 0,
  fabric,
}: {
  position: [number, number, number];
  rotY?: number;
  fabric: THREE.Material;
}) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.38, 0]} material={fabric} castShadow>
        <boxGeometry args={[2.55, 0.42, 0.92]} />
      </mesh>
      <mesh position={[0, 0.78, -0.34]} material={fabric} castShadow>
        <boxGeometry args={[2.55, 0.62, 0.22]} />
      </mesh>
      <mesh position={[-1.18, 0.62, 0.05]} material={fabric} castShadow>
        <boxGeometry args={[0.18, 0.48, 0.82]} />
      </mesh>
      <mesh position={[1.18, 0.62, 0.05]} material={fabric} castShadow>
        <boxGeometry args={[0.18, 0.48, 0.82]} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0.62, 0.08]} material={fabric}>
          <boxGeometry args={[0.42, 0.16, 0.32]} />
        </mesh>
      ))}
    </group>
  );
}

function DoorLeaf({
  side,
  steel,
  glass,
  brass,
}: {
  side: "L" | "R";
  steel: THREE.Material;
  glass: THREE.Material;
  brass: THREE.Material;
}) {
  const sign = side === "L" ? -1 : 1;
  const w = FOYER.doorW / 2;
  const h = FOYER.glassH;
  const hinge = w * sign;
  const open = side === "L" ? -0.78 : 0.78;
  return (
    <group position={[hinge, 0, 0]} rotation={[0, open, 0]}>
      <group position={[-sign * (w / 2), h / 2, 0]}>
        <mesh position={[-(w / 2) + 0.04, 0, 0]} material={steel} castShadow>
          <boxGeometry args={[0.08, h, 0.06]} />
        </mesh>
        <mesh position={[w / 2 - 0.04, 0, 0]} material={steel} castShadow>
          <boxGeometry args={[0.08, h, 0.06]} />
        </mesh>
        <mesh position={[0, h / 2 - 0.04, 0]} material={steel}>
          <boxGeometry args={[w, 0.08, 0.06]} />
        </mesh>
        <mesh position={[0, -(h / 2) + 0.04, 0]} material={steel}>
          <boxGeometry args={[w, 0.08, 0.06]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={steel}>
          <boxGeometry args={[w - 0.04, 0.05, 0.06]} />
        </mesh>
        <mesh position={[0, 0, 0]} material={glass}>
          <boxGeometry args={[w - 0.14, h - 0.18, 0.02]} />
        </mesh>
        <mesh position={[-sign * 0.36, -0.1, 0.05]} material={brass} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.55, 10]} />
        </mesh>
      </group>
    </group>
  );
}

function TrackRow({ z, x0, x1, dusk }: { z: number; x0: number; x1: number; dusk: boolean }) {
  const n = 3;
  return (
    <group position={[0, FOYER.ceiling - 0.08, z]}>
      <mesh>
        <boxGeometry args={[x1 - x0, 0.03, 0.05]} />
        <meshStandardMaterial color="#2a2622" roughness={0.4} metalness={0.5} />
      </mesh>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
        return (
          <group key={i} position={[x, -0.08, 0]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.05, 0.1, 10]} />
              <meshStandardMaterial color="#2a2622" roughness={0.35} metalness={0.55} />
            </mesh>
            <pointLight
              intensity={dusk ? 6.5 : 8}
              color="#ffe8c4"
              distance={8}
              decay={2}
              position={[0, -0.12, 0]}
            />
          </group>
        );
      })}
    </group>
  );
}

export function FoyerInterior({ mats, dusk }: { mats: PlazaMats; dusk: boolean }) {
  const w = FOYER.x1 - FOYER.x0;
  const cx = (FOYER.x0 + FOYER.x1) / 2;
  const depth = FOYER.zInside - FOYER.zSouth;
  const cz = (FOYER.zInside + FOYER.zSouth) / 2;
  const ceil = FOYER.ceiling;

  const trav = useMemo(() => prep(makeTravertineMap(), 8, 10), []);
  const jute = useMemo(() => prep(makeJuteMap(), 3, 4), []);
  const walnut = useMemo(() => prep(makeWalnutMap(), 1, 3), []);
  const art = useMemo(() => makeFoyerArtMap(), []);
  const relief = useMemo(() => makeReliefArtMap(), []);
  const deskGeom = useMemo(() => makeCurvedDesk(4.35, 1.12, 1.08), []);
  const archWall = useMemo(
    () => makeWallWithArch(w + 0.2, ceil, 0.28, 4.35, 3.55),
    [w, ceil],
  );

  const plaster = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f3e8d8",
        roughness: 0.82,
        emissive: "#e8d8c4",
        emissiveIntensity: 0.08,
      }),
    [],
  );
  const travMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: trav,
        color: "#f7ecdc",
        roughness: 0.2,
        metalness: 0.06,
        emissive: "#d9cbb4",
        emissiveIntensity: 0.12,
      }),
    [trav],
  );
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1a1c1e", roughness: 0.32, metalness: 0.72 }),
    [],
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#dfe8ee",
        roughness: 0.06,
        metalness: 0.02,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    [],
  );
  const brass = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c4a056", roughness: 0.28, metalness: 0.85 }),
    [],
  );
  const leather = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8a4a2c",
        roughness: 0.48,
        metalness: 0.06,
        emissive: "#3a1810",
        emissiveIntensity: 0.12,
      }),
    [],
  );
  const boucle = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f2eadc",
        roughness: 0.9,
        emissive: "#e8dcc8",
        emissiveIntensity: 0.08,
      }),
    [],
  );
  const juteMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: jute, color: "#cbb892", roughness: 0.9 }),
    [jute],
  );
  const walnutMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: walnut, color: "#5c3a22", roughness: 0.55 }),
    [walnut],
  );
  const pendantMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f2ebe0",
        roughness: 0.88,
        emissive: "#f4eee4",
        emissiveIntensity: dusk ? 0.22 : 0.12,
      }),
    [dusk],
  );

  const slats = Array.from({ length: 28 }, (_, i) => i);

  return (
    <group name="FOYER_INTERIOR">
      {/* Floor + ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.04, cz]} material={travMat} receiveShadow>
        <planeGeometry args={[w + 0.4, depth + 1.2]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[cx, ceil, cz]}>
        <planeGeometry args={[w + 0.2, depth + 0.2]} />
        <meshStandardMaterial color="#efe6d8" roughness={0.9} />
      </mesh>

      {/* East / west plaster walls */}
      <mesh position={[FOYER.x1, ceil / 2, cz]} material={plaster} receiveShadow>
        <boxGeometry args={[0.18, ceil, depth]} />
      </mesh>
      <mesh position={[FOYER.x0, ceil / 2, cz]} material={plaster} receiveShadow>
        <boxGeometry args={[0.18, ceil, depth]} />
      </mesh>

      {/* Walnut slat wall (east, reception) */}
      <group position={[FOYER.x1 - 0.16, 0, -3.35]}>
        <mesh position={[0, ceil / 2, 0]} material={walnutMat} receiveShadow>
          <boxGeometry args={[0.08, ceil - 0.1, 5.6]} />
        </mesh>
        {slats.map((i) => (
          <mesh
            key={i}
            position={[-0.05, ceil / 2, -2.7 + i * 0.2]}
            material={walnutMat}
            castShadow
          >
            <boxGeometry args={[0.06, ceil - 0.2, 0.08]} />
          </mesh>
        ))}
        <mesh position={[-0.02, ceil - 0.08, 0]}>
          <boxGeometry args={[0.04, 0.08, 5.6]} />
          <meshStandardMaterial
            color="#e8c9a0"
            emissive="#ffd8a8"
            emissiveIntensity={dusk ? 1.4 : 0.85}
          />
        </mesh>
        <mesh position={[-0.12, 2.15, 1.55]}>
          <boxGeometry args={[0.08, 1.55, 1.15]} />
          <meshStandardMaterial map={relief} color="#d2c4ae" roughness={0.7} />
        </mesh>
      </group>

      {/* South arch wall + gallery shell */}
      <mesh geometry={archWall} position={[cx, 0, FOYER.zArch]} material={plaster} receiveShadow castShadow />
      <mesh position={[cx, ceil / 2, FOYER.zSouth]} material={plaster} receiveShadow>
        <boxGeometry args={[w, ceil, 0.2]} />
      </mesh>
      <mesh position={[FOYER.x0, ceil / 2, (FOYER.zArch + FOYER.zSouth) / 2]} material={plaster}>
        <boxGeometry args={[0.18, ceil, FOYER.zArch - FOYER.zSouth]} />
      </mesh>
      <mesh position={[FOYER.x1, ceil / 2, (FOYER.zArch + FOYER.zSouth) / 2]} material={plaster}>
        <boxGeometry args={[0.18, ceil, FOYER.zArch - FOYER.zSouth]} />
      </mesh>

      {/* North glass curtain + open doors */}
      <group position={[cx, 0, FOYER.zGlass]}>
        <mesh position={[-(FOYER.glassW / 2 + 1.15), STORY.ground / 2, 0]} material={mats.stucco} castShadow>
          <boxGeometry args={[2.3, STORY.ground, 0.32]} />
        </mesh>
        <mesh position={[FOYER.glassW / 2 + 1.15, STORY.ground / 2, 0]} material={mats.stucco} castShadow>
          <boxGeometry args={[2.3, STORY.ground, 0.32]} />
        </mesh>
        <mesh position={[0, FOYER.glassH + (STORY.ground - FOYER.glassH) / 2, 0]} material={mats.stucco}>
          <boxGeometry args={[FOYER.glassW + 0.4, STORY.ground - FOYER.glassH, 0.28]} />
        </mesh>
        {/* Mullion grid sidelights */}
        {[-3.35, -2.55, 2.55, 3.35].map((x) => (
          <mesh key={x} position={[x, FOYER.glassH / 2, 0]} material={steel}>
            <boxGeometry args={[0.06, FOYER.glassH, 0.08]} />
          </mesh>
        ))}
        {[-2.95, 2.95].map((x) => (
          <mesh key={`g${x}`} position={[x, FOYER.glassH / 2, 0.01]} material={glass}>
            <boxGeometry args={[0.72, FOYER.glassH - 0.12, 0.03]} />
          </mesh>
        ))}
        <mesh position={[0, FOYER.glassH, 0]} material={steel}>
          <boxGeometry args={[FOYER.glassW, 0.08, 0.1]} />
        </mesh>
        <mesh position={[0, 0.04, 0]} material={steel}>
          <boxGeometry args={[FOYER.glassW, 0.08, 0.12]} />
        </mesh>
        <mesh position={[-FOYER.doorW / 2, FOYER.glassH / 2, 0]} material={steel}>
          <boxGeometry args={[0.07, FOYER.glassH, 0.09]} />
        </mesh>
        <mesh position={[FOYER.doorW / 2, FOYER.glassH / 2, 0]} material={steel}>
          <boxGeometry args={[0.07, FOYER.glassH, 0.09]} />
        </mesh>
        <DoorLeaf side="L" steel={steel} glass={glass} brass={brass} />
        <DoorLeaf side="R" steel={steel} glass={glass} brass={brass} />
      </group>

      {/* Reception desk (east) */}
      <group position={[FOYER.x1 - 2.15, 0, -3.05]} rotation={[0, -Math.PI * 0.08, 0]}>
        <mesh geometry={deskGeom} castShadow receiveShadow>
          <meshStandardMaterial map={trav} color="#e8d8c4" roughness={0.32} />
        </mesh>
        <mesh position={[0.35, 1.16, 0.35]} material={brass} castShadow>
          <cylinderGeometry args={[0.045, 0.08, 0.08, 12]} />
        </mesh>
        <mesh position={[0.35, 1.42, 0.35]} material={brass} castShadow>
          <sphereGeometry args={[0.16, 14, 10]} />
        </mesh>
        <pointLight position={[0.35, 1.55, 0.35]} intensity={dusk ? 3.2 : 1.6} color="#ffd090" distance={5} />
        <mesh position={[-0.55, 1.22, 0.15]}>
          <boxGeometry args={[0.42, 0.32, 0.08]} />
          <meshStandardMaterial color="#111" roughness={0.3} />
        </mesh>
      </group>

      {/* Lounge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.15, 0.045, -4.15]} material={juteMat} receiveShadow>
        <planeGeometry args={[4.4, 3.3]} />
      </mesh>
      <Sofa position={[-3.55, 0, -4.55]} rotY={Math.PI / 2} fabric={boucle} />
      <LeatherChair position={[-1.35, 0, -3.15]} rotY={-0.55} leather={leather} />
      <LeatherChair position={[-1.55, 0, -5.25]} rotY={-2.45} leather={leather} />
      <mesh position={[-2.05, 0.28, -4.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.78, 0.42, 24]} />
        <meshStandardMaterial map={trav} color="#e6d6c2" roughness={0.35} />
      </mesh>
      <mesh position={[-2.05, 0.52, -4.2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial color="#4a4540" roughness={0.5} />
      </mesh>
      <group position={[-2.55, 0.58, -4.05]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.06, 0.22, 10]} />
          <meshStandardMaterial color="#8a8a86" roughness={0.4} />
        </mesh>
        <mesh position={[0.08, 0.18, 0.04]} rotation={[0.15, 0, 0.2]}>
          <boxGeometry args={[0.02, 0.28, 0.08]} />
          <meshStandardMaterial color="#6a8a4a" roughness={0.7} />
        </mesh>
      </group>

      {/* Abstract on west wall */}
      <group position={[FOYER.x0 + 0.14, 2.45, -4.35]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[2.05, 2.65, 0.05]} />
          <meshStandardMaterial color="#1a1814" roughness={0.4} />
        </mesh>
        <mesh>
          <planeGeometry args={[1.92, 2.5]} />
          <meshStandardMaterial map={art} roughness={0.62} />
        </mesh>
      </group>

      <Olive position={[-4.15, 0, -1.55]} scale={1.08} mats={mats} />
      <Olive position={[FOYER.x1 - 1.05, 0, -6.35]} scale={0.92} mats={mats} />
      <Olive position={[1.15, 0, -8.55]} scale={0.85} mats={mats} />

      {/* Pendant */}
      <mesh position={[-1.55, 3.55, -4.05]} scale={[1.15, 0.55, 0.85]} material={pendantMat} castShadow>
        <sphereGeometry args={[0.55, 18, 14]} />
      </mesh>
      <mesh position={[-1.55, 4.05, -4.05]}>
        <cylinderGeometry args={[0.01, 0.01, 0.7, 6]} />
        <meshStandardMaterial color="#2a2622" />
      </mesh>

      <TrackRow z={-2.4} x0={FOYER.x0 + 0.8} x1={FOYER.x1 - 0.8} dusk={dusk} />
      <TrackRow z={-6.4} x0={FOYER.x0 + 0.8} x1={FOYER.x1 - 0.8} dusk={dusk} />
      <TrackRow z={-11.6} x0={FOYER.x0 + 1.2} x1={FOYER.x1 - 1.2} dusk={dusk} />

      {/* Gallery beyond the arch */}
      <group position={[0, 0, -12.4]} name="FOYER_GALLERY">
        <mesh position={[-1.8, 1.05, 0]} material={mats.wood} castShadow>
          <boxGeometry args={[1.4, 0.08, 0.9]} />
        </mesh>
        <mesh position={[-1.8, 0.52, 0]} material={mats.wood}>
          <boxGeometry args={[0.08, 0.96, 0.08]} />
        </mesh>
        <mesh position={[-1.2, 0.52, 0]} material={mats.wood}>
          <boxGeometry args={[0.08, 0.96, 0.08]} />
        </mesh>
        <mesh position={[1.6, 1.15, -0.4]} material={mats.plaster} castShadow>
          <boxGeometry args={[0.55, 1.15, 0.55]} />
        </mesh>
        <mesh position={[1.6, 1.85, -0.4]} material={mats.bronze} castShadow>
          <sphereGeometry args={[0.2, 10, 8]} />
        </mesh>
        <mesh position={[0.15, 2.15, FOYER.zSouth + 12.4 - 0.18]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.4, 1.7]} />
          <meshStandardMaterial map={art} roughness={0.6} />
        </mesh>
        <pointLight position={[0, 3.4, 0]} intensity={dusk ? 5 : 6.5} color="#ffe6c0" distance={10} />
      </group>

      {/* Exterior planters flanking the doors */}
      <Olive position={[-2.55, 0, 2.15]} scale={0.78} mats={mats} />
      <Olive position={[2.65, 0, 2.15]} scale={0.78} mats={mats} />

      <hemisphereLight color="#fff4e4" groundColor="#c4b49a" intensity={dusk ? 0.55 : 0.85} />
      <directionalLight position={[0.4, 4.2, 7.5]} intensity={dusk ? 1.1 : 2.4} color="#fff1d6" />
      <pointLight position={[cx, 3.2, -3.2]} intensity={dusk ? 14 : 18} color="#ffe9cc" distance={16} />
      <pointLight position={[-2.4, 2.8, -3.0]} intensity={dusk ? 6 : 4} color="#ffd8a8" distance={8} />
      <pointLight position={[2.2, 2.6, -4.0]} intensity={dusk ? 5 : 7} color="#fff0d8" distance={8} />
      <pointLight position={[0.2, 2.4, 0.6]} intensity={dusk ? 8 : 14} color="#fff6e8" distance={12} />
    </group>
  );
}
