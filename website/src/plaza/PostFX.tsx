import { EffectComposer, SMAA, Bloom, Vignette } from "@react-three/postprocessing";
import { usePlaza } from "./store";

const DESKTOP = typeof window !== "undefined" && window.innerWidth >= 720;

export function PostFX() {
  const lighting = usePlaza((s) => s.lighting);
  const dusk = lighting === "dusk";
  if (!DESKTOP) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={dusk ? 0.42 : 1.35} intensity={dusk ? 0.62 : 0.08} mipmapBlur />
      <Vignette offset={0.32} darkness={dusk ? 0.22 : 0.2} />
      <SMAA />
    </EffectComposer>
  );
}
