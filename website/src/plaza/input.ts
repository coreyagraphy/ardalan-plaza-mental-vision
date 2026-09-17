const held = new Set<string>();

const MOVE = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
] as const;

let wired = false;

export function isHeld(code: string) {
  return held.has(code);
}

export function hold(code: string) {
  held.add(code);
}

export function release(code: string) {
  held.delete(code);
}

export function clearHeld() {
  held.clear();
}

export function setHeld(codes: string[]) {
  held.clear();
  for (const c of codes) held.add(c);
}

export function moveAxis() {
  let x = 0;
  let z = 0;
  if (held.has("KeyW") || held.has("ArrowUp")) z += 1;
  if (held.has("KeyS") || held.has("ArrowDown")) z -= 1;
  if (held.has("KeyD") || held.has("ArrowRight")) x += 1;
  if (held.has("KeyA") || held.has("ArrowLeft")) x -= 1;
  return { x, z, moving: x !== 0 || z !== 0 };
}

export function wireKeyboard() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  const block = new Set<string>([...MOVE, "Space"]);
  const onDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    held.add(e.code);
    if (block.has(e.code)) e.preventDefault();
  };
  const onUp = (e: KeyboardEvent) => {
    held.delete(e.code);
  };
  const clear = () => held.clear();
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  window.addEventListener("blur", clear);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
  });
}
