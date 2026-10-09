"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { BELT_COLORS, beltRotationAt, ease, fabricTexture, rankAt, ribbonGeometry } from "./experienceGeometry";

const point = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export function JiuJitsuBelt({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const resources = useMemo(() => {
    const weave = fabricTexture(true);
    weave.repeat.set(1, 12);
    const material = new THREE.MeshStandardMaterial({ color: BELT_COLORS[0], roughness: 0.95, metalness: 0, bumpMap: weave, bumpScale: 0.024, side: THREE.DoubleSide });
    const loop = Array.from({ length: 25 }, (_, i) => { const a = i / 24 * Math.PI * 2; return point(Math.sin(a) * 1.04, 0.68 + 0.06 * Math.sin(a * 2), Math.cos(a) * 0.47); });
    const paths = [
      { points: loop, horizontal: true },
      { points: [point(-0.3,0.7,0.5),point(-0.08,0.87,0.61),point(0.2,0.65,0.67),point(0.05,0.4,0.56),point(-0.25,0.64,0.49)] },
      { points: [point(0.27,0.71,0.49),point(0.01,0.5,0.72),point(-0.13,0.39,0.62),point(-0.29,-0.3,0.55),point(-0.53,-1.08,0.33),point(-0.6,-1.8,0.44)] },
      { points: [point(-0.12,0.68,0.49),point(0.19,0.42,0.58),point(0.31,-0.18,0.45),point(0.51,-0.9,0.62),point(0.4,-1.63,0.4)] },
    ];
    const geometries = paths.map(path => ribbonGeometry(path.points, 0.25, 0.052, path.horizontal));
    return { weave, material, geometries, rest: geometries.map(geometry => geometry.getAttribute("position").array.slice()), colors: BELT_COLORS.map(color => new THREE.Color(color)) };
  }, []);
  useEffect(() => () => {
    resources.geometries.forEach(geometry => geometry.dispose());
    resources.material.dispose(); resources.weave.dispose();
  }, [resources]);
  useFrame(() => {
    if (!group.current) return;
    const p = scrollProgress.get(), reveal = ease((p - 0.18) / 0.32);
    const rank = rankAt(p);
    resources.material.color.copy(resources.colors[rank.index]).lerp(resources.colors[rank.index + 1], rank.mix);
    // Keep the belt centered now that it is the only object in the presentation.
    group.current.position.set(0, 0.2, 0.15 * reveal);
    group.current.rotation.set(0.06 + Math.sin(p * Math.PI * 2) * 0.12, -0.3 + beltRotationAt(p), -0.13 * reveal);
    group.current.scale.setScalar(1.2 - 0.05 * reveal);
    // Small bending of the free ends, derived only from scroll: reversible and idle at rest.
    for (let index = 2; index < 4; index++) {
      const geometry = resources.geometries[index], rest = resources.rest[index];
      const position = geometry.getAttribute("position");
      for (let vertex = 0; vertex < position.count; vertex++) {
        const y = rest[vertex * 3 + 1], weight = ease((0.35 - y) / 2);
        position.setXYZ(vertex, rest[vertex * 3] + 0.055 * weight * Math.sin(p * Math.PI * 2 + y), y, rest[vertex * 3 + 2] + 0.08 * weight * Math.sin(p * Math.PI * 2 + y * 1.8));
      }
      position.needsUpdate = true; geometry.computeVertexNormals();
    }
  });
  return <group ref={group} dispose={null}>{resources.geometries.map((geometry, index) => <mesh key={index} geometry={geometry} material={resources.material} castShadow receiveShadow />)}</group>;
}
