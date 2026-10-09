import * as THREE from "three";

export const BELT_COLORS = ["#e8e4dc", "#2454ac", "#704393", "#70482d", "#292c31"];
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Dwell on every rank, then blend without replacing the belt mesh. */
export function rankAt(progress: number) {
  const phase = clamp((progress - 0.08) / 0.78) * 4;
  const index = Math.min(3, Math.floor(phase));
  const mix = ease((phase - index - 0.25) / 0.75);
  return { index, mix };
}

/** A single gradual turn across the entire scroll, independent of rank dwell times. */
export function beltRotationAt(progress: number) {
  return ease(progress) * Math.PI * 2;
}

/** Open, UV-mapped cloth shell. The sampling function also drives the seams. */
export function surfaceGeometry(sample: (u: number, v: number) => THREE.Vector3, rows: number, columns: number) {
  const positions: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++) {
      const u = col / columns, v = row / rows;
      const point = sample(u, v);
      positions.push(point.x, point.y, point.z);
      uvs.push(u, v);
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col, b = a + columns + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function torsoPoint(u: number, v: number) {
  const y = -1.55 + v * 2.98;
  const a = u * Math.PI * 2;
  const shoulder = ease((v - 0.84) / 0.16);
  const width = THREE.MathUtils.lerp(0.76 + 0.17 * Math.sin(v * Math.PI * 0.8) - 0.08 * Math.sin(v * Math.PI * 2), 0.31, shoulder);
  const depth = THREE.MathUtils.lerp(0.32 + 0.1 * Math.sin(v * Math.PI), 0.245, shoulder);
  const fold = (0.012 * Math.sin(a * 11 + v * 8) + 0.008 * Math.sin(a * 19 - v * 15)) * Math.sin(v * Math.PI);
  return new THREE.Vector3(Math.cos(a) * (width + fold), y - 0.10 * Math.max(0, Math.sin(a)) * shoulder, Math.sin(a) * (depth + fold));
}

export function sleevePoint(side: number, u: number, v: number) {
  const a = u * Math.PI * 2;
  const r = THREE.MathUtils.lerp(0.365, 0.255, ease(v));
  const fold = 0.008 * Math.sin(a * 8 + v * 12) * Math.sin(v * Math.PI);
  return new THREE.Vector3(side * (0.55 + v * 0.98 + Math.cos(a) * (r + fold) * 0.55), 0.84 - v * 0.65 + Math.cos(a) * (r + fold) * 0.83, Math.sin(a) * (r + fold) * (0.7 + 0.3 * ease(v)));
}

export function seamGeometry(points: THREE.Vector3[], radius = 0.008) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), points.length * 2, radius, 4, false);
}

/** A swept, bevelled rectangular section: real thickness instead of a flat ribbon. */
export function ribbonGeometry(points: THREE.Vector3[], width: number, thickness: number, horizontal = false) {
  const curve = new THREE.CatmullRomCurve3(points);
  const cross = [[-0.46,-0.5],[0.46,-0.5],[0.5,-0.3],[0.5,0.3],[0.46,0.5],[-0.46,0.5],[-0.5,0.3],[-0.5,-0.3],[-0.46,-0.5]];
  const geometry = surfaceGeometry((u, v) => {
    const p = curve.getPointAt(v), tangent = curve.getTangentAt(v);
    const normal = horizontal ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    const [x, z] = cross[Math.round(u * 8)];
    return p.addScaledVector(normal, x * width).addScaledVector(binormal, z * thickness);
  }, 72, 8);
  const uv = geometry.getAttribute("uv");
  for (let row = 0; row <= 72; row++) for (let col = 0; col <= 8; col++) uv.setX(row * 9 + col, cross[col][0] + 0.5);
  // Close both cut ends with triangle fans.
  const indices = Array.from(geometry.index!.array);
  for (let i = 1; i < 7; i++) { indices.push(0, i + 1, i); indices.push(648, 648 + i, 649 + i); }
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Small deterministic woven texture; no image requests and no per-frame allocation. */
export function fabricTexture(stitched = false) {
  const size = 128, data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    const value = 125 + 24 * Math.sin(x * Math.PI / 2) * Math.cos(y * Math.PI / 2) + ((x * 17 + y * 13) % 11);
    const stitch = stitched && x % 18 < 2 ? (y % 8 < 6 ? 75 : 15) : 0;
    data[i] = data[i + 1] = data[i + 2] = value + stitch; data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}
