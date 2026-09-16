import { useEffect, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { BUSINESS, LABEL, SOURCE_PLATE } from "./config";
import { usePlaza, type CameraId, type LightingId, type OverlayMode, type ScenarioId } from "./store";

const CAM_BTNS: { id: CameraId; label: string }[] = [
  { id: "establishing", label: "Plaza" },
  { id: "street", label: "Street" },
  { id: "foyer", label: "Foyer" },
  { id: "walk", label: "Walk" },
  { id: "aerial", label: "Aerial" },
  { id: "orbit", label: "Orbit" },
  { id: "source", label: "Source" },
  { id: "gallery", label: "Gallery" },
];

function captionFor(camera: CameraId, mode: string) {
  if (mode === "walk" || camera === "walk") return "Walkable. Vibrant. Connected.";
  if (camera === "street") return "Walkable. Vibrant. Connected.";
  if (camera === "aerial") return "Building a stronger Carmel together.";
  if (camera === "source") return "Published Studio M exterior — camera matched.";
  if (camera === "gallery") return "Interior concept — layout and location unverified.";
  if (camera === "foyer") return "Foyer entrance — interior concept, not an approved plan.";
  return "Corner palazzo at Main & 4th — chamfer facing the fountain.";
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={active ? "chip chip-on" : "chip"} onClick={onClick}>
      {children}
    </button>
  );
}

function WipeHandle({ value }: { value: number }) {
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const root = e.currentTarget.closest(".overlay");
    if (!root) return;
    const move = (ev: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (ev.clientX - r.left) / Math.max(1, r.width)));
      usePlaza.getState().setOverlay(t);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    move(e.nativeEvent);
  };

  return (
    <div
      className="wipe-bar"
      role="slider"
      aria-label="Wipe between reconstruction and published exterior"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      style={{ left: `${value * 100}%` }}
      onPointerDown={onDown}
    />
  );
}

function SourcePlate() {
  const overlay = usePlaza((s) => s.overlay);
  const overlayMode = usePlaza((s) => s.overlayMode);
  const camera = usePlaza((s) => s.camera);
  if (overlay <= 0.01 || camera !== "source") return null;

  const style = {
    "--plate-x": `${SOURCE_PLATE.tx}%`,
    "--plate-y": `${SOURCE_PLATE.ty}%`,
    "--plate-s": String(SOURCE_PLATE.scale),
    ...(overlayMode === "wipe"
      ? { clipPath: `inset(0 ${((1 - overlay) * 100).toFixed(3)}% 0 0)` }
      : { opacity: overlayMode === "ghost" ? overlay * 0.82 : overlay }),
  } as unknown as CSSProperties;

  return (
    <>
      <div className={`ref-plate is-${overlayMode}`} style={style}>
        <img
          src={SOURCE_PLATE.src}
          alt="Published Studio M exterior, camera-matched to this view"
        />
      </div>
      {overlayMode === "wipe" && overlay < 0.98 && overlay > 0.02 && <WipeHandle value={overlay} />}
    </>
  );
}

export function Overlay() {
  const scenario = usePlaza((s) => s.scenario);
  const lighting = usePlaza((s) => s.lighting);
  const camera = usePlaza((s) => s.camera);
  const mode = usePlaza((s) => s.mode);
  const shade = usePlaza((s) => s.shade);
  const overlay = usePlaza((s) => s.overlay);
  const overlayMode = usePlaza((s) => s.overlayMode);
  const showSources = usePlaza((s) => s.showSources);
  const filmPlaying = usePlaza((s) => s.filmPlaying);
  const filmT = usePlaza((s) => s.filmT);
  const panelOpen = usePlaza((s) => s.panelOpen);

  const hideChrome =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("film");

  const gallery = camera === "gallery" || camera === "foyer";
  const caption = captionFor(camera, mode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const st = usePlaza.getState();
      if (e.code === "Digit1") st.setScenario("base");
      if (e.code === "Digit2") st.setScenario("morning");
      if (e.code === "Digit3") st.setScenario("family");
      if (e.code === "Digit4") st.setScenario("evening");
      if (e.code === "Digit5") st.setScenario("art");
      if (e.code === "Digit6") st.setScenario("visitor");
      if (e.code === "KeyL") st.setLighting(st.lighting === "day" ? "dusk" : "day");
      if (e.code === "KeyR" && !e.metaKey && !e.ctrlKey) st.reset();
      if (e.code === "Space") {
        e.preventDefault();
        if (st.filmPlaying) st.setFilmPlaying(false);
        else {
          st.setFilmT(0);
          st.setLighting("dusk");
          st.setFilmPlaying(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (hideChrome) {
    return null;
  }

  return (
    <div className="overlay">
      <SourcePlate />
      <header className="topbar">
        <div>
          <p className="eyebrow">People &nbsp;|&nbsp; Place &nbsp;|&nbsp; Possibility</p>
          <h1>Ardalan</h1>
          <p className="sub">{caption}</p>
          <p className="hint">Drag to look · Scroll to zoom · Right-drag to pan</p>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="text-btn"
            onClick={() => usePlaza.getState().setPanelOpen(!panelOpen)}
          >
            {panelOpen ? "Hide controls" : "Controls"}
          </button>
        </div>
      </header>

      <nav className="view-row" aria-label="Presentation views">
        {CAM_BTNS.slice(0, 5).map((c) => (
          <Chip
            key={c.id}
            active={camera === c.id || (c.id === "walk" && mode === "walk")}
            onClick={() => {
              if (c.id === "walk") usePlaza.getState().setMode("walk");
              else usePlaza.getState().setCamera(c.id);
            }}
          >
            {c.label}
          </Chip>
        ))}
      </nav>

      {gallery && (
        <div className="gallery-banner" role="status">
          Interior concept — foyer entrance, layout and location unverified
        </div>
      )}

      {panelOpen && (
        <aside className="panel">
          <section>
            <h2>Lighting</h2>
            <div className="row">
              {(["day", "dusk"] as LightingId[]).map((id) => (
                <Chip
                  key={id}
                  active={lighting === id}
                  onClick={() => usePlaza.getState().setLighting(id)}
                >
                  {id === "day" ? "Daylight" : "Dusk"}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h2>Camera</h2>
            <div className="row wrap">
              {CAM_BTNS.map((c) => (
                <Chip
                  key={c.id}
                  active={camera === c.id || (c.id === "walk" && mode === "walk")}
                  onClick={() => {
                    if (c.id === "walk") usePlaza.getState().setMode("walk");
                    else usePlaza.getState().setCamera(c.id);
                  }}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h2>Workshop perspectives</h2>
            <p className="fine">
              Named businesses are discussion lenses, not tenants or confirmed participants.
            </p>
            <div className="stack">
              <Chip active={scenario === "base"} onClick={() => usePlaza.getState().setScenario("base")}>
                Base architecture
              </Chip>
              {BUSINESS.map((b) => (
                <Chip
                  key={b.id}
                  active={scenario === b.id}
                  onClick={() => usePlaza.getState().setScenario(b.id as ScenarioId)}
                >
                  {b.short}
                </Chip>
              ))}
              <Chip
                active={scenario === "visitor"}
                onClick={() => usePlaza.getState().setScenario("visitor")}
              >
                Visitor overlay
              </Chip>
            </div>
          </section>

          <section>
            <h2>Live reversible change</h2>
            <p className="fine">Storefront shade. Architecture stays fixed.</p>
            <Chip active={shade} onClick={() => usePlaza.getState().setShade(!shade)}>
              {shade ? "Shade on" : "Add shade"}
            </Chip>
          </section>

          <section>
            <h2>Source match</h2>
            <p className="fine">
              Published Studio M exterior. Wipe to compare the reconstruction. No photo
              projection onto the mesh.
            </p>
            <div className="row wrap">
              {(["wipe", "ghost", "difference"] as OverlayMode[]).map((id) => (
                <Chip
                  key={id}
                  active={overlayMode === id}
                  onClick={() => {
                    usePlaza.setState({
                      overlayMode: id,
                      camera: "source",
                      mode: "orbit",
                      overlay: overlay < 0.02 ? 0.5 : overlay,
                    });
                  }}
                >
                  {id === "wipe" ? "Wipe" : id === "ghost" ? "Ghost" : "Check"}
                </Chip>
              ))}
            </div>
            <label className="slider">
              <span>{overlayMode === "wipe" ? "Wipe across published view" : "Published exterior"}</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={overlay}
                onChange={(e) => {
                  usePlaza.setState({
                    overlay: Number(e.target.value),
                    camera: "source",
                    mode: "orbit",
                  });
                }}
              />
            </label>
          </section>

          <div className="row">
            <button
              type="button"
              className="primary"
              onClick={() => {
                usePlaza.setState({
                  filmT: 0,
                  lighting: "dusk",
                  filmPlaying: true,
                  mode: "film",
                  overlay: 0,
                });
              }}
            >
              Play 20s film
            </button>
            <button type="button" className="ghost" onClick={() => usePlaza.getState().reset()}>
              Reset
            </button>
          </div>
          <button
            type="button"
            className="ghost full"
            onClick={() => usePlaza.getState().setShowSources(!showSources)}
          >
            {showSources ? "Hide sources" : "Sources and assumptions"}
          </button>
        </aside>
      )}

      {showSources && (
        <div className="sources">
          <h2>Evidence hierarchy</h2>
          <ol>
            <li>District vision composite — presentation mood, not a surveyed plan.</li>
            <li>Published Studio M exterior — visible architecture. Source camera shows this still.</li>
            <li>
              Site: SE corner of Main Street and 4th Ave SW, north half of the block toward 3rd Ave SW.
              Fountain is the roundabout island. Estimated, not surveyed.
            </li>
            <li>Foyer lobby plates — appearance study for a street-level entrance. Not a surveyed floor plan.</li>
            <li>Published gallery interior — appearance only, not a floor plan.</li>
            <li>Historical May 2025 groundbreaking photos — context, not current site.</li>
          </ol>
          <p>
            Dimensions are estimated. Hidden elevations are simplified. Named businesses are
            workshop lenses. No city, architect, or business endorsement is implied.
          </p>
          <div className="thumbs">
            <img src="/references/vision/district-composite.png" alt="District vision composite" />
            <img src="/references/official/01_StudioM_Exterior.jpg" alt="Studio M exterior" />
            <img src="/references/foyer/01_entrance_looking_in.png" alt="Foyer entrance concept" />
          </div>
        </div>
      )}

      <p className="place-mark">Carmel, Indiana — redevelopment in progress</p>

      <footer className="foot">
        <span>{LABEL}</span>
        <span>Corey Ellis / CoreyAgraphy</span>
        {mode === "walk" && <span>Click to look · WASD to walk · Shift to hurry</span>}
        {filmPlaying && <span>Film {filmT.toFixed(1)}s / 20s</span>}
        {camera === "source" && overlay > 0.98 && <span>Published Studio M exterior</span>}
      </footer>
    </div>
  );
}
