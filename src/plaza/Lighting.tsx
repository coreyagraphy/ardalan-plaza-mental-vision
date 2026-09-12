import { usePlaza } from "./store";

const DESKTOP = typeof window !== "undefined" && window.innerWidth >= 720;

export function PlazaLighting() {
  const lighting = usePlaza((s) => s.lighting);
  const dusk = lighting === "dusk";
  const sun: [number, number, number] = dusk ? [-18, 5.2, 14] : [-22, 14, 16];

  return (
    <>
      <hemisphereLight
        color={dusk ? "#f0c8a0" : "#e4edf4"}
        groundColor={dusk ? "#6a4a38" : "#9a8c72"}
        intensity={dusk ? 1.05 : 0.78}
      />
      <ambientLight intensity={dusk ? 0.62 : 0.42} color={dusk ? "#ffd8b8" : "#f6f1e8"} />
      <directionalLight
        position={sun}
        intensity={dusk ? 2.15 : 2.55}
        color={dusk ? "#ffc090" : "#fff4dc"}
        castShadow
        shadow-mapSize-width={DESKTOP ? 2048 : 1024}
        shadow-mapSize-height={DESKTOP ? 2048 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={40}
        shadow-camera-bottom={-28}
        shadow-bias={-0.00025}
      />
      <directionalLight position={[18, 10, -16]} intensity={dusk ? 0.28 : 0.32} color="#c5d2de" />
      {dusk && <directionalLight position={[6, 5, 12]} intensity={0.42} color="#8aa0c4" />}
    </>
  );
}
