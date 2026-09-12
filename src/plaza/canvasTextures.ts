import * as THREE from "three";

function canvas(size: number, paint: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d canvas unavailable");
  paint(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function canvasRect(
  w: number,
  h: number,
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d canvas unavailable");
  paint(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/** Warm clay hip-roof tiles — district vision + Higgsfield terracotta. */
export function makeTerracottaRoofMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.fillStyle = "#6a2e1c";
    ctx.fillRect(0, 0, s, s);
    const rows = 16;
    const cols = 9;
    const rh = s / rows;
    const cw = s / cols;
    for (let r = 0; r < rows; r++) {
      const stagger = (r % 2) * 0.5;
      for (let c = -1; c <= cols; c++) {
        const n = hash(r * 29 + c * 13);
        const rr = 168 + n * 52;
        const gg = 78 + n * 28;
        const bb = 48 + n * 16;
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        const x = (c + stagger) * cw + 1;
        const y = r * rh + 1;
        ctx.fillRect(x, y, cw - 2.2, rh - 1.6);
        ctx.strokeStyle = `rgba(90,32,18,${0.28 + n * 0.25})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cw - 2.2, rh - 1.6);
        ctx.fillStyle = `rgba(255,190,140,${0.08 + n * 0.1})`;
        ctx.fillRect(x + 2, y + 1, cw * 0.45, 2);
      }
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 5);
  return tex;
}

/** Dark charcoal slate courses — kept for metal/copper accents. */
export function makeSlateRoofMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.fillStyle = "#2c3036";
    ctx.fillRect(0, 0, s, s);
    const rows = 18;
    const cols = 10;
    const rh = s / rows;
    const cw = s / cols;
    for (let r = 0; r < rows; r++) {
      const stagger = (r % 2) * 0.5;
      for (let c = -1; c <= cols; c++) {
        const n = hash(r * 31 + c * 17);
        const v = 38 + n * 22;
        ctx.fillStyle = `rgb(${v + 4},${v + 2},${v - 2})`;
        const x = (c + stagger) * cw + 1;
        const y = r * rh + 1;
        ctx.fillRect(x, y, cw - 2, rh - 2);
        ctx.strokeStyle = `rgba(18,20,24,${0.35 + n * 0.25})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cw - 2, rh - 2);
      }
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 5);
  return tex;
}

/** Pale cream limestone grain matching Studio M's sun-bleached stucco. */
export function makeCreamStuccoMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.fillStyle = "#f4efe6";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 4200; i++) {
      const n = hash(i + 2.2);
      const n2 = hash(i * 3.7);
      const a = 0.04 + n * 0.08;
      const v = 220 + n * 28;
      ctx.fillStyle = `rgba(${v},${v - 4},${v - 14},${a})`;
      ctx.fillRect(n * s, n2 * s, 1 + n * 3, 1 + n2 * 2);
    }
    ctx.strokeStyle = "rgba(190,178,158,0.12)";
    ctx.lineWidth = 1;
    for (let y = 64; y < s; y += 86) {
      ctx.beginPath();
      ctx.moveTo(0, y + hash(y) * 4);
      ctx.lineTo(s, y + hash(y + 1) * 4);
      ctx.stroke();
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3.2, 2.4);
  return tex;
}

/**
 * 2×2 interior-room atlas (van Dongen / three-fenestra impostor).
 * Baked one-point rooms so daytime windows read as dark recessed interiors
 * instead of flat tinted glass.
 */
export function makeRoomAtlas() {
  const tex = canvas(1024, (ctx, s) => {
    const cell = s / 2;
    const variants: Array<{ wall: string; floor: string; ceil: string; drape: string; warm: number }> = [
      { wall: "#cbbba8", floor: "#3a2a1c", ceil: "#e8e0d4", drape: "#6a5a48", warm: 0.12 },
      { wall: "#d8cfc0", floor: "#2c241c", ceil: "#efe8dc", drape: "#4a4038", warm: 0.08 },
      { wall: "#b8b0a4", floor: "#1c1814", ceil: "#d8d0c4", drape: "#5a5048", warm: 0.04 },
      { wall: "#c4b8a8", floor: "#2a2018", ceil: "#e4dcd0", drape: "#3e3830", warm: 0.16 },
    ];
    variants.forEach((v, i) => {
      const ox = (i % 2) * cell;
      const oy = Math.floor(i / 2) * cell;
      paintRoom(ctx, ox, oy, cell, v);
    });
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

function paintRoom(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  cell: number,
  v: { wall: string; floor: string; ceil: string; drape: string; warm: number },
) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.fillStyle = "#0c0a08";
  ctx.fillRect(0, 0, cell, cell);

  const inset = cell * 0.18;
  const backW = cell - inset * 2;
  const backH = cell * 0.52;
  const backY = cell * 0.22;

  ctx.fillStyle = v.ceil;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(cell, 0);
  ctx.lineTo(inset + backW, backY);
  ctx.lineTo(inset, backY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = v.floor;
  ctx.beginPath();
  ctx.moveTo(0, cell);
  ctx.lineTo(cell, cell);
  ctx.lineTo(inset + backW, backY + backH);
  ctx.lineTo(inset, backY + backH);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = v.wall;
  ctx.fillRect(inset, backY, backW, backH);

  ctx.fillStyle = "#1a1612";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(inset, backY);
  ctx.lineTo(inset, backY + backH);
  ctx.lineTo(0, cell);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cell, 0);
  ctx.lineTo(cell, cell);
  ctx.lineTo(inset + backW, backY + backH);
  ctx.lineTo(inset + backW, backY);
  ctx.closePath();
  ctx.fill();

  const lampX = inset + backW * 0.72;
  const lampY = backY + backH * 0.28;
  const glow = ctx.createRadialGradient(lampX, lampY, 4, lampX, lampY, cell * 0.28);
  glow.addColorStop(0, `rgba(255,190,120,${0.55 + v.warm})`);
  glow.addColorStop(1, "rgba(255,160,80,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(inset, backY, backW, backH);

  ctx.fillStyle = v.drape;
  ctx.fillRect(inset + 8, backY + 10, 10, backH * 0.72);
  ctx.fillRect(inset + backW - 18, backY + 12, 10, backH * 0.7);

  ctx.fillStyle = "#2a2218";
  ctx.fillRect(inset + backW * 0.35, backY + backH * 0.55, backW * 0.32, backH * 0.28);

  ctx.restore();
}

export function makeFoliageCardMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    const cx = s / 2;
    const cy = s / 2;
    for (let i = 0; i < 220; i++) {
      const n = hash(i + 9);
      const n2 = hash(i * 4.1);
      const n3 = hash(i * 7.7);
      const ang = n * Math.PI * 2;
      const rad = (0.08 + n2 * 0.42) * s;
      const x = cx + Math.cos(ang) * rad * (0.7 + n3 * 0.5);
      const y = cy + Math.sin(ang) * rad * 0.85;
      const r = 10 + n * 28;
      const g = 72 + n2 * 70;
      const red = 28 + n3 * 36;
      const blue = 18 + n * 22;
      ctx.fillStyle = `rgba(${red},${g},${blue},${0.55 + n * 0.4})`;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.7 + n2 * 0.4), ang, 0, Math.PI * 2);
      ctx.fill();
    }
    const g = ctx.createRadialGradient(cx, cy, s * 0.12, cx, cy, s * 0.5);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** White/pink flower scatter for the fountain lawn edge. */
export function makeBloomMap() {
  const tex = canvas(256, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    const cx = s / 2;
    const cy = s / 2;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      ctx.fillStyle = i % 2 === 0 ? "#f6f0e4" : "#e8c0c8";
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * 48, cy + Math.sin(a) * 48, 28, 16, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#d8b44a";
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** Running-bond brick for mixed-use street facades. */
export function makeBrickFacadeMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.fillStyle = "#6a3e2c";
    ctx.fillRect(0, 0, s, s);
    const rows = 22;
    const cols = 8;
    const rh = s / rows;
    const cw = s / cols;
    for (let r = 0; r < rows; r++) {
      const stagger = (r % 2) * 0.5;
      for (let c = -1; c <= cols; c++) {
        const n = hash(r * 19 + c * 11);
        const rr = 142 + n * 48;
        const gg = 92 + n * 28;
        const bb = 68 + n * 18;
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        const x = (c + stagger) * cw + 1.5;
        const y = r * rh + 1;
        ctx.fillRect(x, y, cw - 3, rh - 2.2);
      }
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4.2, 6);
  return tex;
}

function paintVerticalBanner(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  lines: string[],
  mark?: "C",
) {
  ctx.fillStyle = "#1a1814";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2a2620";
  ctx.fillRect(10, 10, w - 20, h - 20);
  ctx.strokeStyle = "#cfc3a8";
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  if (mark === "C") {
    ctx.beginPath();
    ctx.arc(w / 2, 88, 36, 0, Math.PI * 2);
    ctx.strokeStyle = "#efe6d4";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#efe6d4";
    ctx.font = "600 42px 'Palatino Linotype', Palatino, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("C", w / 2, 90);
  }

  ctx.fillStyle = "#efe6d4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const top = mark === "C" ? 150 : 70;
  const usable = h - top - 50;
  const step = usable / lines.length;
  lines.forEach((line, i) => {
    const size = line.length > 8 ? 28 : 34;
    ctx.font = `500 ${size}px 'Palatino Linotype', Palatino, serif`;
    ctx.fillText(line, w / 2, top + step * i + step * 0.45);
  });
}

export function makeBannerArt() {
  const tex = canvasRect(256, 768, (ctx, w, h) => {
    paintVerticalBanner(ctx, w, h, ["ART", "LIVES", "HERE"]);
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeBannerDistrict() {
  const tex = canvasRect(256, 768, (ctx, w, h) => {
    paintVerticalBanner(ctx, w, h, ["CARMEL", "ARTS &", "DESIGN", "DISTRICT"], "C");
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeArdalanSign() {
  const tex = canvasRect(1024, 192, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f4efe6";
    ctx.font = "500 118px 'Palatino Linotype', Palatino, Times, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ARDALAN", w / 2, h / 2 + 4);
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function makeFountainInscription() {
  const tex = canvasRect(1024, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f2ead8";
    ctx.font = "500 92px 'Palatino Linotype', Palatino, Times, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CARMEL", w / 2, h * 0.38);
    ctx.font = "500 48px 'Palatino Linotype', Palatino, Times, serif";
    ctx.fillText("INDIANA", w / 2, h * 0.72);
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** Honed cream travertine with veining — foyer floor from the lobby plates. */
export function makeTravertineMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.fillStyle = "#d9cbb6";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) {
      const n = hash(i * 17.3);
      ctx.strokeStyle = `rgba(${190 + n * 40},${170 + n * 30},${140 + n * 20},${0.08 + n * 0.18})`;
      ctx.lineWidth = 1 + n * 3;
      ctx.beginPath();
      ctx.moveTo(n * s, hash(i * 9) * s);
      ctx.bezierCurveTo(
        hash(i * 3) * s,
        hash(i * 5) * s,
        hash(i * 7) * s,
        hash(i * 11) * s,
        hash(i * 13) * s,
        hash(i * 15) * s,
      );
      ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
      const n = hash(i * 23);
      ctx.fillStyle = `rgba(160,140,110,${0.04 + n * 0.08})`;
      ctx.fillRect(n * s, hash(i * 4) * s, 8 + n * 18, 3 + n * 6);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Coarse jute weave for the lounge rug. */
export function makeJuteMap() {
  const tex = canvas(256, (ctx, s) => {
    ctx.fillStyle = "#c4b48a";
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? "#b8a478" : "#d2c49a";
      ctx.fillRect(0, y, s, 2);
    }
    for (let x = 0; x < s; x += 4) {
      ctx.fillStyle = `rgba(90,70,40,${0.08 + hash(x) * 0.1})`;
      ctx.fillRect(x, 0, 1, s);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Vertical walnut slats — reception wall. */
export function makeWalnutMap() {
  const tex = canvas(256, (ctx, s) => {
    ctx.fillStyle = "#5a3a22";
    ctx.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x += 14) {
      const n = hash(x * 0.2);
      ctx.fillStyle = `rgb(${78 + n * 36},${48 + n * 18},${26 + n * 10})`;
      ctx.fillRect(x, 0, 12, s);
      ctx.fillStyle = "rgba(255,210,160,0.12)";
      ctx.fillRect(x + 1, 0, 2, s);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(x + 11, 0, 1, s);
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Large abstract: terracotta / cream / charcoal fields. */
export function makeFoyerArtMap() {
  const tex = canvas(512, (ctx, s) => {
    ctx.fillStyle = "#e6d5b8";
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#c45a2a";
    ctx.beginPath();
    ctx.moveTo(s * 0.08, s * 0.06);
    ctx.lineTo(s * 0.62, s * 0.04);
    ctx.lineTo(s * 0.7, s * 0.72);
    ctx.lineTo(s * 0.12, s * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1a1612";
    ctx.beginPath();
    ctx.moveTo(s * 0.08, s * 0.55);
    ctx.lineTo(s * 0.48, s * 0.48);
    ctx.lineTo(s * 0.52, s * 0.96);
    ctx.lineTo(s * 0.1, s * 0.98);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#d8c4a0";
    ctx.fillRect(s * 0.48, s * 0.12, s * 0.38, s * 0.55);
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = hash(i) > 0.5 ? "#fff" : "#000";
      ctx.fillRect(hash(i * 2) * s, hash(i * 3) * s, 20, 8);
    }
    ctx.globalAlpha = 1;
  });
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** Textured plaster relief for the wood-wall artwork. */
export function makeReliefArtMap() {
  const tex = canvas(256, (ctx, s) => {
    ctx.fillStyle = "#d8cbb8";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 18; i++) {
      const n = hash(i * 8);
      ctx.strokeStyle = `rgba(110,90,70,${0.15 + n * 0.25})`;
      ctx.lineWidth = 2 + n * 4;
      ctx.beginPath();
      ctx.arc(s * n, s * hash(i), 20 + n * 40, 0, Math.PI * (0.6 + n));
      ctx.stroke();
    }
  });
  return tex;
}

