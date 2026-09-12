import { NORTH_Z } from "./config";
import type { PlazaMats } from "./materials";
import type { ScenarioId } from "./store";
import { Person, Walker, type FigureLook } from "./people";

const A: FigureLook = { shirt: "#2c3340", pants: "#1c1c1c", skin: 0, hair: 0 };
const B: FigureLook = { shirt: "#efe6d4", pants: "#3a322c", skin: 2, hair: 2 };
const C: FigureLook = { shirt: "#6a3a2c", pants: "#2a2420", skin: 1, hair: 1 };
const D: FigureLook = { shirt: "#3d4a3a", pants: "#2c2824", skin: 3, hair: 0 };
const E: FigureLook = { shirt: "#4a4038", pants: "#1a1816", skin: 0, hair: 3 };
const F: FigureLook = { shirt: "#8a5a44", pants: "#2a2420", skin: 2, hair: 1 };
const G: FigureLook = { shirt: "#1c1c1c", pants: "#2a2824", skin: 1, hair: 0 };
const H: FigureLook = { shirt: "#c4b49a", pants: "#3a322c", skin: 0, hair: 2 };
const KID: FigureLook = { shirt: "#5c4a62", pants: "#2a2420", skin: 2, hair: 1, kid: true };

function Bike({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[-0.45, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.32, 0.03, 8, 16]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.45, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.32, 0.03, 8, 16]} />
        <meshStandardMaterial color="#1e1e1e" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

function CafeTable({
  x,
  z,
  mats,
  umbrella = false,
}: {
  x: number;
  z: number;
  mats: PlazaMats;
  umbrella?: boolean;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.38, 0]} material={mats.iron} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.76, 8]} />
      </mesh>
      <mesh position={[0, 0.78, 0]} material={mats.wood} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.05, 16]} />
      </mesh>
      {[-0.42, 0.42].map((sx) => (
        <mesh key={sx} position={[sx, 0.42, 0.18]} material={mats.iron} castShadow>
          <boxGeometry args={[0.32, 0.06, 0.32]} />
        </mesh>
      ))}
      {umbrella && (
        <group>
          <mesh position={[0, 1.35, 0]} material={mats.iron}>
            <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
          </mesh>
          <mesh position={[0, 1.92, 0]} castShadow material={mats.umbrella}>
            <coneGeometry args={[1.28, 0.24, 14]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function SignPost({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 2.2, 8]} />
        <meshStandardMaterial color="#2a2a28" />
      </mesh>
      <mesh position={[0, 2.15, 0.04]}>
        <boxGeometry args={[0.9, 0.38, 0.06]} />
        <meshStandardMaterial color="#efe6d4" />
      </mesh>
    </group>
  );
}

function AmbientLife({ mats }: { mats: PlazaMats }) {
  const z = NORTH_Z + 1.55;
  return (
    <group name="AMBIENT_LIFE">
      <CafeTable x={8.2} z={z} mats={mats} umbrella />
      <CafeTable x={11.4} z={z + 0.45} mats={mats} umbrella />
      <CafeTable x={14.6} z={z} mats={mats} umbrella />
      <CafeTable x={17.8} z={z + 0.2} mats={mats} umbrella />
      <CafeTable x={-8.5} z={z} mats={mats} umbrella />
      <CafeTable x={-11.6} z={z + 0.35} mats={mats} umbrella />

      <Person x={8.05} z={z + 0.55} look={A} rot={0.4} pose="sit" />
      <Person x={8.55} z={z + 0.5} look={B} rot={-0.5} pose="sit" />
      <Person x={11.2} z={z + 0.95} look={C} rot={2.6} pose="sit" />
      <Person x={14.4} z={z + 0.55} look={E} rot={0.2} pose="sit" />
      <Person x={-8.3} z={z + 0.5} look={F} rot={-0.3} pose="sit" />

      <Person x={2.4} z={z + 1.8} look={D} rot={0.8} />
      <Person x={3.0} z={z + 2.05} look={B} rot={-2.2} />
      <Person x={16.8} z={z + 1.35} look={E} rot={-1.2} />
      <Person x={17.2} z={z + 1.55} look={H} rot={2.1} />
      <Person x={-18.6} z={z + 1.6} look={G} rot={2.1} />
      <Person x={22.6} z={z + 1.9} look={C} rot={-0.6} />

      {/* Corner sidewalk — watching the roundabout, not sitting in the roadway */}
      <Person x={-20.4} z={2.8} look={B} rot={-0.9} />
      <Person x={-19.6} z={3.15} look={A} rot={2.4} />
      <Person x={-22.2} z={-1.4} look={F} rot={0.4} />

      <Walker x0={-16} z0={z + 1.6} x1={18} z1={z + 2.1} look={A} speed={0.09} phase={0.12} />
      <Walker x0={22} z0={z + 2.4} x1={-6} z1={z + 1.9} look={C} speed={0.08} phase={0.55} />
      <Walker x0={14} z0={z + 1.85} x1={-2} z1={z + 2.2} look={G} speed={0.095} phase={0.02} />
      <Walker x0={6} z0={z + 2.6} x1={20} z1={z + 2.15} look={F} speed={0.085} phase={0.72} />
      <Walker x0={-20.5} z0={-2.2} x1={-21.2} z1={-10.4} look={D} speed={0.1} phase={0.3} />
      <Walker x0={-21.4} z0={-8.8} x1={-20.2} z1={1.6} look={E} speed={0.07} phase={0.18} />
      <Walker x0={18} z0={z + 2.0} x1={8} z1={z + 2.5} look={B} speed={0.088} phase={0.41} />
      <Walker x0={-4} z0={z + 2.8} x1={12} z1={z + 1.7} look={H} speed={0.078} phase={0.88} />
    </group>
  );
}

export function ScenarioLayer({
  id,
  shade,
  mats,
}: {
  id: ScenarioId;
  shade: boolean;
  mats: PlazaMats;
}) {
  const z = NORTH_Z + 1.55;
  const showMorning = id === "morning";
  const showFamily = id === "family";
  const showEvening = id === "evening";
  const showArt = id === "art";
  const showVisitor = id === "visitor";

  return (
    <group name="13_BUSINESS_EXPERIENCE">
      <AmbientLife mats={mats} />
      {shade && (
        <group name="SHADE_TOGGLE">
          <CafeTable x={21.2} z={z + 0.2} mats={mats} umbrella />
          <CafeTable x={5.4} z={z + 0.15} mats={mats} umbrella />
        </group>
      )}

      {showMorning && (
        <group name="BUSINESS_LENS_01_COFFEE">
          <Person x={7.2} z={z + 1.2} look={D} rot={0.4} />
          <Person x={6.4} z={z + 0.6} look={F} rot={-0.2} />
          <Person x={10.1} z={z + 1.8} look={D} rot={2.4} />
          <Bike x={5.1} z={z + 2.1} rot={0.3} />
          <Bike x={4.3} z={z + 1.5} rot={-0.2} />
        </group>
      )}
      {showFamily && (
        <group name="BUSINESS_LENS_02_RESTAURANT">
          <Person x={9.2} z={z + 0.9} look={C} />
          <Person x={9.7} z={z + 0.7} look={KID} />
          <Person x={10.6} z={z + 1.4} look={A} rot={-0.6} />
          <Person x={13.2} z={z + 0.5} look={E} rot={1.2} />
          <Person x={13.8} z={z + 0.35} look={KID} />
          <Person x={16.1} z={z + 1.6} look={D} rot={2.8} />
        </group>
      )}
      {showEvening && (
        <group name="BUSINESS_LENS_03_EVENING">
          <Person x={15.4} z={z + 0.8} look={G} />
          <Person x={-9.2} z={z + 1.4} look={A} rot={2.2} />
        </group>
      )}
      {showArt && (
        <group name="BUSINESS_LENS_03_ART_RETAIL">
          <Person x={1.2} z={z + 1.3} look={H} rot={3.1} />
          <Person x={2.0} z={z + 1.1} look={B} rot={-0.2} />
          <Person x={-1.4} z={z + 0.7} look={A} rot={0.5} />
        </group>
      )}
      {showVisitor && (
        <group name="BUSINESS_LENS_04_VISITOR_WAYFINDING">
          <SignPost x={-12.5} z={z + 2.4} />
          <SignPost x={24.5} z={z + 2.2} />
          <SignPost x={-27} z={8.5} />
          <Person x={-11.6} z={z + 2.8} look={D} rot={-0.4} />
        </group>
      )}
    </group>
  );
}
