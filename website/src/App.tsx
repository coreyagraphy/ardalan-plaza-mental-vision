import { useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PlazaScene } from "./plaza/PlazaScene";
import { SimpleHUD } from "./SimpleHUD";
import { CAMERAS } from "./plaza/config";
import { usePlaza } from "./plaza/store";

export default function App() {
  useLayoutEffect(() => {
    usePlaza.getState().reset();
  }, []);

  return (
    <div className="plaza-root is-3d">
      <Canvas
        shadows="percentage"
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.22,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{
          position: [...CAMERAS.establishing.position],
          fov: CAMERAS.establishing.fov,
          near: 0.12,
          far: 420,
        }}
        onCreated={({ gl, camera: cam }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          cam.lookAt(...CAMERAS.establishing.target);
        }}
      >
        <PlazaScene />
      </Canvas>
      <SimpleHUD />
    </div>
  );
}
