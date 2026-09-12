import { create } from "zustand";
import { CAMERAS } from "./config";

export type ScenarioId =
  | "base"
  | "morning"
  | "family"
  | "evening"
  | "art"
  | "visitor";
export type LightingId = "day" | "dusk";
export type CameraId = keyof typeof CAMERAS | "orbit" | "walk";
export type ExploreMode = "orbit" | "walk" | "film";
export type OverlayMode = "wipe" | "ghost" | "difference";
export type SplatEngine = "off";

export type PlazaState = {
  scenario: ScenarioId;
  lighting: LightingId;
  camera: CameraId;
  mode: ExploreMode;
  shade: boolean;
  overlay: number;
  overlayMode: OverlayMode;
  splat: boolean;
  splatEngine: SplatEngine;
  showBlockout: boolean;
  showSources: boolean;
  filmPlaying: boolean;
  filmT: number;
  panelOpen: boolean;
  walkYaw: number;
  walkX: number;
  walkZ: number;
  setScenario: (s: ScenarioId) => void;
  setLighting: (l: LightingId) => void;
  setCamera: (c: CameraId) => void;
  setMode: (m: ExploreMode) => void;
  setShade: (v: boolean) => void;
  setOverlay: (v: number) => void;
  setOverlayMode: (m: OverlayMode) => void;
  setSplat: (v: boolean) => void;
  setSplatEngine: (e: SplatEngine) => void;
  setShowBlockout: (v: boolean) => void;
  setShowSources: (v: boolean) => void;
  setFilmPlaying: (v: boolean) => void;
  setFilmT: (v: number) => void;
  setPanelOpen: (v: boolean) => void;
  setWalk: (p: { yaw?: number; x?: number; z?: number }) => void;
  reset: () => void;
};

/** Presentation default: dusk plaza matching the district vision composite. */
const INITIAL = {
  scenario: "base" as ScenarioId,
  lighting: "dusk" as LightingId,
  camera: "establishing" as CameraId,
  mode: "orbit" as ExploreMode,
  shade: false,
  overlay: 0,
  overlayMode: "wipe" as OverlayMode,
  splat: false,
  splatEngine: "off" as SplatEngine,
  showBlockout: false,
  showSources: false,
  filmPlaying: false,
  filmT: 0,
  panelOpen: false,
  walkYaw: Math.PI,
  walkX: 8.5,
  walkZ: 11.4,
};

export const usePlaza = create<PlazaState>((set) => ({
  ...INITIAL,
  setScenario: (scenario) => set({ scenario }),
  setLighting: (lighting) => set({ lighting }),
  setCamera: (camera) =>
    set({
      camera,
      mode: camera === "walk" ? "walk" : camera === "orbit" ? "orbit" : "orbit",
      filmPlaying: false,
      overlay: camera === "source" ? 1 : 0,
    }),
  setMode: (mode) =>
    set({
      mode,
      filmPlaying: mode === "film",
      camera: mode === "walk" ? "walk" : mode === "film" ? "orbit" : "orbit",
    }),
  setShade: (shade) => set({ shade }),
  setOverlay: (overlay) => set({ overlay }),
  setOverlayMode: (overlayMode) => set({ overlayMode }),
  setSplat: () => set({ splat: false }),
  setSplatEngine: (splatEngine) => set({ splatEngine }),
  setShowBlockout: (showBlockout) => set({ showBlockout }),
  setShowSources: (showSources) => set({ showSources }),
  setFilmPlaying: (filmPlaying) =>
    set({
      filmPlaying,
      mode: filmPlaying ? "film" : "orbit",
    }),
  setFilmT: (filmT) => set({ filmT }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  setWalk: (p) =>
    set((s) => ({
      walkYaw: p.yaw ?? s.walkYaw,
      walkX: p.x ?? s.walkX,
      walkZ: p.z ?? s.walkZ,
    })),
  reset: () =>
    set((s) => ({
      ...INITIAL,
      panelOpen: s.panelOpen,
    })),
}));
