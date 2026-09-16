import { useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Overlay } from "./Overlay";
import { PlazaScene } from "./PlazaScene";
import { CAMERAS } from "./config";
import { usePlaza } from "./store";

const narrow = typeof window !== "undefined" && window.innerWidth < 720;
const filmCapture =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("film");

export default function PlazaApp() {
  const camera = usePlaza((s) => s.camera);
  const overlay = usePlaza((s) => s.overlay);

  useLayoutEffect(() => {
    usePlaza.getState().reset();
  }, []);

  const show3d = camera !== "source" || overlay < 0.5;

  return (
    <div className={show3d ? "plaza-root is-3d" : "plaza-root"}>
      <Canvas
        shadows={narrow ? false : "percentage"}
        dpr={filmCapture || narrow ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !narrow,
          preserveDrawingBuffer: true,
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
          if ("shadowMap" in gl && gl.shadowMap) gl.shadowMap.enabled = !narrow;
          cam.lookAt(...CAMERAS.establishing.target);
        }}
      >
        <PlazaScene />
      </Canvas>
      <Overlay />
    </div>
  );
}
