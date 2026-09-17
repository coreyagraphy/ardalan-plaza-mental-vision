import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { hold, release } from "./input";

function MoveKey({ code, label, children }: { code: string; label: string; children: ReactNode }) {
  const press = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    hold(code);
  };
  const lift = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    release(code);
  };
  return (
    <button
      type="button"
      className="move-key"
      aria-label={label}
      onPointerDown={press}
      onPointerUp={lift}
      onPointerCancel={lift}
    >
      {children}
    </button>
  );
}

export function MovePad() {
  return (
    <div className="move-pad hit" aria-label="Move around the plaza">
      <p className="move-label">Move</p>
      <div className="move-grid">
        <span />
        <MoveKey code="ArrowUp" label="Move forward">
          <ChevronUp size={22} strokeWidth={2.4} />
        </MoveKey>
        <span />
        <MoveKey code="ArrowLeft" label="Move left">
          <ChevronLeft size={22} strokeWidth={2.4} />
        </MoveKey>
        <MoveKey code="ArrowDown" label="Move back">
          <ChevronDown size={22} strokeWidth={2.4} />
        </MoveKey>
        <MoveKey code="ArrowRight" label="Move right">
          <ChevronRight size={22} strokeWidth={2.4} />
        </MoveKey>
      </div>
      <p className="move-help">Arrows or WASD</p>
    </div>
  );
}
