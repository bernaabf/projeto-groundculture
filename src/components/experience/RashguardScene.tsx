"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { JiuJitsuBelt } from "./JiuJitsuBelt";
import { PCFShadowMap } from "three";
import { ease } from "./experienceGeometry";

interface SceneProps {
  scrollProgress: MotionValue<number>;
  compact: boolean;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
}

function Studio({ scrollProgress, compact, active, onReady, onFailure }: SceneProps) {
  const { invalidate, gl, setDpr } = useThree();
  const ready = useRef(false);
  const readyFrame = useRef(0);
  const timing = useRef({ samples: 0, slow: 0, previous: 0, degraded: false });
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    const unsubscribe = scrollProgress.on("change", () => { if (active && !document.hidden) invalidate(); });
    const resume = () => { if (active && !document.hidden) invalidate(); };
    document.addEventListener("visibilitychange", resume);
    if (active) invalidate();
    return () => { unsubscribe(); gl.domElement.removeEventListener("webglcontextlost", lost); document.removeEventListener("visibilitychange", resume); };
  }, [active, gl, invalidate, onFailure, scrollProgress]);
  useEffect(() => () => cancelAnimationFrame(readyFrame.current), []);
  useFrame(({ camera, viewport }) => {
    const p = scrollProgress.get();
    camera.position.z = 7.2 - 0.4 * ease(p / 0.2) - 0.25 * Math.sin(ease((p - 0.62) / 0.38) * Math.PI);
    // Fit portrait and landscape with the same physical proportions.
    camera.zoom = Math.min(1, viewport.aspect / 0.9);
    camera.updateProjectionMatrix();
    if (!ready.current) { ready.current = true; readyFrame.current = requestAnimationFrame(onReady); }
    const now = performance.now(), elapsed = now - timing.current.previous;
    timing.current.previous = now;
    if (elapsed > 0 && elapsed < 150 && active) {
      timing.current.samples++;
      if (elapsed > 45) timing.current.slow++;
      if (timing.current.samples === 90 && !timing.current.degraded && timing.current.slow > 45) {
        timing.current.degraded = true; setDpr(0.85);
      }
    }
  });
  return <>
    <ambientLight intensity={0.65} />
    <hemisphereLight args={["#e1edff", "#292323", 1.4]} />
    <directionalLight position={[-3, 5, 5]} intensity={3.5} castShadow={!compact} shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-normalBias={0.035} shadow-bias={-0.0001} shadow-radius={3} />
    <directionalLight position={[4, 2, -3]} intensity={4.5} color="#b5c9e5" />
    <directionalLight position={[3, -1, 3]} intensity={0.7} color="#fff0de" />
    <JiuJitsuBelt scrollProgress={scrollProgress} />
    {!compact && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]} receiveShadow><planeGeometry args={[20, 20]} /><shadowMaterial transparent opacity={0.23} /></mesh>}
  </>;
}

export default function RashguardScene(props: SceneProps) {
  return <Canvas
    aria-hidden="true"
    tabIndex={-1}
    frameloop="demand"
    dpr={props.compact ? 1 : [1, 1.5]}
    shadows={props.compact ? false : { type: PCFShadowMap }}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true }}
    camera={{ position: [0, 0, 7.2], fov: 40, near: 0.1, far: 30 }}
    fallback={null}
    style={{ pointerEvents: "none" }}
  ><Studio {...props} /></Canvas>;
}
