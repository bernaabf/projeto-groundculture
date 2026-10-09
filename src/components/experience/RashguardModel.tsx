"use client";

import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ease, fabricTexture, seamGeometry, sleevePoint, surfaceGeometry, torsoPoint } from "./experienceGeometry";

// Procedural CORE Blue study. Replace this component with an official GLB when available.
// The catalog only supplies a front view; the back deliberately carries no invented artwork.
export function RashguardModel({ progress, compact }: { progress: MotionValue<number>; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree(state => state.invalidate);
  const resources = useMemo(() => {
    const rows = compact ? 32 : 56, columns = compact ? 40 : 64;
    const weave = fabricTexture();
    const cloth = new THREE.MeshStandardMaterial({ color: "#102345", roughness: 0.88, metalness: 0, bumpMap: weave, bumpScale: 0.009, side: THREE.DoubleSide });
    const thread = new THREE.MeshStandardMaterial({ color: "#9ca5b1", roughness: 1 });
    const dark = new THREE.MeshStandardMaterial({ color: "#07111f", roughness: 1, side: THREE.DoubleSide });
    const shell = [surfaceGeometry(torsoPoint, rows, columns), ...[-1, 1].map(side => surfaceGeometry((u, v) => sleevePoint(side, u, v), rows / 2, columns))];
    const sample = (fn: (t: number) => THREE.Vector3) => Array.from({ length: 49 }, (_, i) => fn(i / 48));
    const seams = [
      seamGeometry(sample(t => torsoPoint(t, 0.015))),
      seamGeometry(sample(t => torsoPoint(t, 0.995)), 0.022),
      ...[0.09, 0.41, 0.59, 0.91].map(u => seamGeometry(sample(t => torsoPoint(u + (u < 0.5 ? 1 : -1) * 0.045 * ease((t - 0.65) / 0.35), t * 0.90)))),
      ...[-1, 1].map(side => seamGeometry(sample(t => sleevePoint(side, t, 0.97)))),
    ];
    // Neck facing and hems have depth and open interiors, rather than solid caps.
    const collar = surfaceGeometry((u, v) => { const p = torsoPoint(u, 1); p.y -= v * 0.09; p.x *= 0.985; p.z *= 0.985; return p; }, 3, columns);
    const logoGeometry = surfaceGeometry((u, v) => {
      const x = (u - 0.5) * 0.72, y = 0.48 + v * 0.384;
      const height = (y + 1.55) / 2.98;
      const width = torsoPoint(0, height).x;
      return torsoPoint(Math.acos(x / width) / (Math.PI * 2), height).add(new THREE.Vector3(0, 0, 0.006));
    }, 10, 20);
    const logo = new THREE.MeshStandardMaterial({ color: "#e4e6e9", side: THREE.DoubleSide, transparent: true, opacity: 0, roughness: 0.96, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 });
    return { shell, seams, collar, weave, cloth, thread, dark, logo, logoGeometry };
  }, [compact]);

  useEffect(() => {
    let cancelled = false;
    let texture: THREE.CanvasTexture | undefined;
    const image = new window.Image();
    image.onload = () => {
      if (cancelled) return;
      // Extract the actual white chest mark from the existing photo; never redraw the logo.
      const canvas = document.createElement("canvas"); canvas.width = 160; canvas.height = 82;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 242, 227, 122, 65, 0, 0, 160, 82);
      const pixels = context.getImageData(0, 0, 160, 82);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const brightness = Math.min(pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]);
        pixels.data[i + 3] = Math.round(ease((brightness - 100) / 110) * 255);
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255;
      }
      context.putImageData(pixels, 0, 0);
      texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      resources.logo.map = texture; resources.logo.opacity = 1; resources.logo.needsUpdate = true;
      invalidate();
    };
    image.src = "/images/products/core-blue-mc.webp";
    return () => {
      cancelled = true; image.onload = null; texture?.dispose();
      [...resources.shell, ...resources.seams, resources.collar, resources.logoGeometry].forEach(geometry => geometry.dispose());
      [resources.cloth, resources.thread, resources.dark, resources.logo].forEach(material => material.dispose());
      resources.weave.dispose();
    };
  }, [resources, invalidate]);

  useFrame(() => {
    if (!group.current) return;
    const p = progress.get(), reveal = ease((p - 0.2) / 0.25);
    const detail = Math.sin(ease((p - 0.62) / 0.38) * Math.PI);
    group.current.visible = reveal > 0;
    group.current.position.set(0.56 + (1 - reveal) * 4, 0.22 + (1 - reveal) * 0.4, -0.3);
    // Front → side → back → front; the final detail push stays inside the viewport.
    group.current.rotation.set(0.035, -0.28 + ease((p - 0.3) / 0.55) * Math.PI * 2, -0.035);
    group.current.scale.setScalar(0.72 + 0.06 * reveal + detail * 0.12);
  });

  return <group ref={group} dispose={null}>
    {resources.shell.map((geometry, index) => <mesh key={index} geometry={geometry} material={resources.cloth} castShadow receiveShadow />)}
    {resources.seams.map((geometry, index) => <mesh key={index} geometry={geometry} material={resources.thread} />)}
    <mesh geometry={resources.collar} material={resources.dark} />
    <mesh geometry={resources.logoGeometry} material={resources.logo} />
  </group>;
}
