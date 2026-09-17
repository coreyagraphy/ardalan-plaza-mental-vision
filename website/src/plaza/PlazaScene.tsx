import { Suspense, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3, MOUSE } from "three";
import { ArdalanBuilding } from "./building";
import { CameraRig } from "./FilmRig";
import { District } from "./district";
import { FoyerInterior } from "./foyer";
import { PlazaFountain } from "./fountain";
import { PlazaLighting } from "./Lighting";
import { PostFX } from "./PostFX";
import { StreetContext } from "./street";
import { ScenarioLayer } from "./scenarios";
import { WalkController } from "./WalkController";
import { usePlazaMaterials } from "./materials";
import { usePlaza } from "./store";
import { CAMERAS } from "./config";
import { moveAxis, wireKeyboard } from "./input";

function SceneBody() {
  const mats = usePlazaMaterials();
  const lighting = usePlaza((s) => s.lighting);
  const scenario = usePlaza((s) => s.scenario);
  const shade = usePlaza((s) => s.shade);
  const dusk = lighting === "dusk";
  const glow = dusk ? (scenario === "evening" ? 2.35 : 1.65) : 0.05;
  mats.glow.emissiveIntensity = glow;

  return (
    <>
      <PlazaLighting />
      <ArdalanBuilding mats={mats} glow={glow} />
      <StreetContext mats={mats} dusk={dusk} />
      <District mats={mats} dusk={dusk} />
      <PlazaFountain mats={mats} />
      <FoyerInterior mats={mats} dusk={dusk} />
      <ScenarioLayer id={scenario} shade={shade} mats={mats} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0.018, -8]} receiveShadow>
        <circleGeometry args={[22, 48]} />
        <meshStandardMaterial
          color={dusk ? "#3a3228" : "#4a443c"}
          transparent
          opacity={dusk ? 0.22 : 0.14}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </>
  );
}

function CaptureBridge() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    window.__plaza = {
      setFilmT: (t) => usePlaza.setState({ filmT: t, mode: "film", filmPlaying: false }),
      playFilm: () =>
        usePlaza.setState({
          filmT: 0,
          mode: "film",
          filmPlaying: true,
          lighting: "dusk",
          scenario: "evening",
          overlay: 0,
        }),
      reset: () => usePlaza.getState().reset(),
      setLighting: (l) => usePlaza.setState({ lighting: l }),
      setCamera: (c) => usePlaza.getState().setCamera(c as never),
      setScenario: (c) => usePlaza.setState({ scenario: c as never }),
      setShade: (v) => usePlaza.setState({ shade: v }),
      setOverlay: (v) => usePlaza.setState({ overlay: v, camera: "source", mode: "orbit" }),
      setOverlayMode: (m) => usePlaza.setState({ overlayMode: m as never }),
      setSplat: () => usePlaza.setState({ splat: false }),
      splatEngine: "off",
      captureCanvas: () => gl.domElement,
      getCam: () => ({ x: camera.position.x, y: camera.position.y, z: camera.position.z }),
      exportGLB: async () => {
        const { GLTFExporter } = await import("three/addons/exporters/GLTFExporter.js");
        const exporter = new GLTFExporter();
        const stripped: { mat: { map: unknown; [k: string]: unknown }; map: unknown }[] = [];
        scene.traverse((obj) => {
          const mesh = obj as { material?: { map?: unknown } | { map?: unknown }[] };
          const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
          for (const mat of mats) {
            if (mat && mat.map) {
              stripped.push({ mat, map: mat.map });
              mat.map = undefined;
            }
          }
        });
        try {
          return (await exporter.parseAsync(scene, { binary: true })) as ArrayBuffer;
        } finally {
          for (const s of stripped) s.mat.map = s.map;
        }
      },
    };
    return () => {
      delete window.__plaza;
    };
  }, [gl, scene, camera]);
  return null;
}

function OrbitRig() {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControlsImpl | null>(null);
  const snapId = usePlaza((s) => s.snapId);
  const cameraId = usePlaza((s) => s.camera);
  const pan = useRef(new Vector3());
  useEffect(() => {
    wireKeyboard();
  }, []);
  useEffect(() => {
    const c = new OrbitControlsImpl(camera, gl.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.minDistance = 3.5;
    c.maxDistance = 160;
    c.maxPolarAngle = Math.PI / 2 - 0.04;
    c.enablePan = true;
    c.screenSpacePanning = true;
    c.panSpeed = 1.1;
    c.rotateSpeed = 0.72;
    c.zoomSpeed = 0.85;
    c.mouseButtons.LEFT = MOUSE.ROTATE;
    c.mouseButtons.MIDDLE = MOUSE.DOLLY;
    c.mouseButtons.RIGHT = MOUSE.PAN;
    const t = cameraId in CAMERAS ? CAMERAS[cameraId as keyof typeof CAMERAS].target : CAMERAS.establishing.target;
    c.target.set(t[0], t[1], t[2]);
    controls.current = c;
    return () => {
      c.dispose();
      controls.current = null;
    };
  }, [camera, gl]);
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    if (cameraId in CAMERAS) {
      const t = CAMERAS[cameraId as keyof typeof CAMERAS].target;
      c.target.set(t[0], t[1], t[2]);
    }
  }, [snapId, cameraId]);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    const { x: ax, z: az, moving } = moveAxis();
    if (moving) {
      const eye = camera.position;
      const tgt = c.target;
      const fx = tgt.x - eye.x;
      const fz = tgt.z - eye.z;
      const flen = Math.hypot(fx, fz) || 1;
      const fX = fx / flen;
      const fZ = fz / flen;
      const rX = fZ;
      const rZ = -fX;
      const speed = 22 * Math.min(dt, 0.1);
      // Left/right follow the view: right button moves the scene the way you look right.
      pan.current.set((fX * az + rX * -ax) * speed, 0, (fZ * az + rZ * -ax) * speed);
      eye.add(pan.current);
      tgt.add(pan.current);
    }
    c.update();
  });
  return null;
}

export function PlazaScene() {
  const mode = usePlaza((s) => s.mode);
  const camera = usePlaza((s) => s.camera);
  const lighting = usePlaza((s) => s.lighting);
  const film = mode === "film";
  const walk = mode === "walk";
  const aerial = camera === "aerial" || camera === "orbit" || film;
  const dusk = lighting === "dusk";
  const interior = camera === "foyer" || camera === "gallery";

  return (
    <>
      <color attach="background" args={[dusk ? "#c9a07a" : "#c5d0da"]} />
      <fog
        attach="fog"
        args={
          interior
            ? dusk
              ? ["#e8d2b4", 28, 80]
              : ["#f2eadc", 24, 70]
            : dusk
              ? aerial
                ? ["#c9a07a", 95, 300]
                : ["#d4aa82", 62, 190]
              : ["#d4dce4", 90, 220]
        }
      />
      <Suspense fallback={null}>
        <SceneBody />
      </Suspense>
      <CameraRig />
      <WalkController />
      <CaptureBridge />
      <PostFX />
      {!film && !walk && <OrbitRig />}
    </>
  );
}
