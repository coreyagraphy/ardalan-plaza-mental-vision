import * as THREE from "three";

export function archShape(width: number, height: number, inset = 0) {
  const w = width - inset * 2;
  const h = height - inset;
  const r = Math.min(w / 2, h * 0.46);
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(w / 2, h - r);
  s.absarc(0, h - r, r, 0, Math.PI, false);
  s.closePath();
  return s;
}

export function makeArchFrame(width: number, height: number, thick = 0.16, depth = 0.28) {
  const outer = archShape(width, height, 0);
  const inner = archShape(width, height, thick);
  outer.holes.push(inner);
  const g = new THREE.ExtrudeGeometry(outer, {
    depth,
    bevelEnabled: false,
    curveSegments: 16,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

export function makeArchFill(width: number, height: number, depth = 0.04) {
  const s = archShape(width, height, 0.02);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: false,
    curveSegments: 16,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/** Hip roof sitting on a rectangle. Local Y is rise from eave. Ridge along X. */
export function makeHipRoof(width: number, depth: number, rise: number) {
  const hw = width / 2;
  const hd = depth / 2;
  const ridge = Math.max(0.6, width - depth);
  const hx = ridge / 2;
  const positions: number[] = [];
  const uvs: number[] = [];
  const normals: number[] = [];

  const v = {
    sw: new THREE.Vector3(-hw, 0, -hd),
    se: new THREE.Vector3(hw, 0, -hd),
    ne: new THREE.Vector3(hw, 0, hd),
    nw: new THREE.Vector3(-hw, 0, hd),
    rw: new THREE.Vector3(-hx, rise, 0),
    re: new THREE.Vector3(hx, rise, 0),
  };

  function addFace(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d?: THREE.Vector3) {
    const n = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a))
      .normalize();
    const verts = d ? [a, b, c, a, c, d] : [a, b, c];
    for (const p of verts) {
      positions.push(p.x, p.y, p.z);
      normals.push(n.x, n.y, n.z);
      uvs.push((p.x + hw) / width, (p.z + hd) / depth);
    }
  }

  addFace(v.sw, v.se, v.re, v.rw); // south, outward -Z +Y
  addFace(v.nw, v.ne, v.re, v.rw); // north, outward +Z +Y
  addFace(v.sw, v.nw, v.rw); // west, outward -X
  addFace(v.ne, v.se, v.re); // east, outward +X

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.computeVertexNormals();
  return g;
}

export function makeDome(radius: number, segs = 20) {
  const g = new THREE.SphereGeometry(radius, segs, Math.max(8, segs / 2), 0, Math.PI * 2, 0, Math.PI / 2);
  return g;
}

/** Rectangular wall in XY with an arched doorway hole. Extrudes along +Z. */
export function makeWallWithArch(width: number, height: number, thick: number, archW: number, archH: number) {
  const outer = new THREE.Shape();
  outer.moveTo(-width / 2, 0);
  outer.lineTo(width / 2, 0);
  outer.lineTo(width / 2, height);
  outer.lineTo(-width / 2, height);
  outer.closePath();
  const hole = archShape(archW, archH, 0);
  outer.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(outer, { depth: thick, bevelEnabled: false, curveSegments: 20 });
  g.translate(0, 0, -thick / 2);
  g.computeVertexNormals();
  return g;
}

/** D-shaped reception desk, top in XZ, height along Y. */
export function makeCurvedDesk(width = 4.6, depth = 1.15, height = 1.08) {
  const shape = new THREE.Shape();
  const hw = width / 2;
  shape.moveTo(-hw, 0);
  shape.lineTo(-hw, depth * 0.28);
  shape.absarc(0, depth * 0.28, hw, Math.PI, 0, true);
  shape.lineTo(hw, 0);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: 28 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, 0);
  g.computeVertexNormals();
  return g;
}

