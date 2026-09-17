import { LABEL } from "./plaza/config";
import { MovePad } from "./plaza/MovePad";
import { usePlaza, type CameraId, type LightingId } from "./plaza/store";

const VIEWS: { id: CameraId; label: string }[] = [
  { id: "establishing", label: "Corner" },
  { id: "street", label: "Street" },
  { id: "aerial", label: "Aerial" },
  { id: "foyer", label: "Foyer" },
  { id: "walk", label: "Walk" },
];

export function SimpleHUD() {
  const camera = usePlaza((s) => s.camera);
  const mode = usePlaza((s) => s.mode);
  const lighting = usePlaza((s) => s.lighting);

  return (
    <div className="hud">
      <header>
        <p className="eyebrow">Ardalan Plaza · Carmel</p>
        <h1>3D world</h1>
        <p className="hint">
          {mode === "walk"
            ? "Click the scene to look · arrows or WASD to walk"
            : "Drag to look · arrows or WASD to move · scroll to zoom"}
        </p>
      </header>
      <nav>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={camera === v.id || (v.id === "walk" && mode === "walk") ? "on" : ""}
            onClick={() => {
              if (v.id === "walk") usePlaza.getState().setMode("walk");
              else usePlaza.getState().setCamera(v.id);
            }}
          >
            {v.label}
          </button>
        ))}
        {(["dusk", "day"] as LightingId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={lighting === id ? "on" : ""}
            onClick={() => usePlaza.getState().setLighting(id)}
          >
            {id === "dusk" ? "Dusk" : "Day"}
          </button>
        ))}
      </nav>
      <MovePad />
      <p className="legal">
        {LABEL}
        <strong> Corey Ellis / CoreyAgraphy</strong>
      </p>
    </div>
  );
}
