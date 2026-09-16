import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { FILM_SECONDS } from "./config";
import { applyCamera, filmSample } from "./cameras";
import { usePlaza } from "./store";
import { CAMERAS } from "./config";

export function CameraRig() {
  const { camera, size } = useThree();
  const lastSnap = useRef(0);

  useFrame((_, dt) => {
    const st = usePlaza.getState();
    const pcam = camera as PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);

    if (st.mode === "film" || st.filmPlaying) {
      if (st.filmPlaying) {
        const next = Math.min(FILM_SECONDS, st.filmT + Math.min(dt, 0.1));
        if (next >= FILM_SECONDS) {
          usePlaza.setState({ filmT: FILM_SECONDS, filmPlaying: false, mode: "orbit", camera: "aerial" });
        } else if (Math.abs(next - st.filmT) > 0.0001) {
          usePlaza.setState({ filmT: next });
        }
      }
      const sample = filmSample(usePlaza.getState().filmT);
      camera.position.set(sample.pos[0], sample.pos[1], sample.pos[2]);
      camera.lookAt(sample.look[0], sample.look[1], sample.look[2]);
      pcam.fov = sample.fov;
      pcam.near = 0.12;
      pcam.far = 420;
      pcam.updateProjectionMatrix();
      if (st.lighting !== "dusk") {
        usePlaza.setState({ lighting: "dusk" });
      }
      return;
    }

    if (st.mode === "walk") return;
    if (st.camera in CAMERAS && st.snapId !== lastSnap.current) {
      applyCamera(pcam, st.camera as keyof typeof CAMERAS, aspect);
      lastSnap.current = st.snapId;
    }
  });

  return null;
}
