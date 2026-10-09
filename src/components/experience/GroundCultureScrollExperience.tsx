"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import styles from "./experience.module.css";

const Scene = dynamic(() => import("./RashguardScene"), { ssr: false });
const ranks = ["Branca", "Azul", "Roxa", "Marrom", "Preta"];
const colors = ["#e8e4dc", "#2454ac", "#704393", "#70482d", "#17191d"];

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function GroundCultureScrollExperience() {
  const container = useRef<HTMLElement>(null);
  const [settings, setSettings] = useState({ enabled: false, compact: false, static: false });
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const rank = useTransform(scrollYProgress, value => ranks[Math.min(4, Math.max(0, Math.round((value - 0.08) / 0.78 * 4)))]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    // Preserve the document position if WebGL fails midway through the experience.
    if (window.scrollY < 10) setSettings(previous => ({ ...previous, static: true }));
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      const simple = (mobile.matches && window.innerHeight < 620) || reduced.matches || Boolean(connection?.saveData) || (memory !== undefined && memory <= 2);
      let supported = false;
      if (!simple) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
        supported = Boolean(context);
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      }
      setSettings({ enabled: supported, compact: mobile.matches, static: simple || !supported });
    };
    const frame = requestAnimationFrame(update);
    reduced.addEventListener("change", update); mobile.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "100px" });
    if (container.current) observer.observe(container.current);
    return () => { cancelAnimationFrame(frame); reduced.removeEventListener("change", update); mobile.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!settings.enabled || ready || failed) return;
    const timeout = window.setTimeout(onFailure, 12000);
    return () => window.clearTimeout(timeout);
  }, [settings.enabled, ready, failed, onFailure]);

  return <>
    <section ref={container} className={styles.experience} data-static={settings.static} aria-label="Ground Culture — evolução no Jiu-Jítsu">
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h1 className="font-display font-medium tracking-tighter">Premium<br />Fightwear</h1>
          <p>Equipamentos de alta performance para quem respira Jiu-Jitsu e Submission. Desenvolvidos para suportar as batalhas mais duras no tatame.</p>
          <Link href="/produtos" className={styles.primary}>Explorar Coleção <span aria-hidden="true">↗</span></Link>
          <Link href="/produtos" className={styles.secondary}>Ver Todos os Equipamentos</Link>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.halo} />
          <div className={styles.poster} data-hidden={ready && !failed && settings.enabled}>
            <Image src="/images/products/core-blue-mc.webp" alt="" fill sizes="(max-width: 767px) 90vw, 55vw" priority className={styles.posterImage} />
          </div>
          {settings.enabled && !failed && <SceneBoundary onFailure={onFailure}>
            <Scene scrollProgress={scrollYProgress} compact={settings.compact} active={active} onReady={onReady} onFailure={onFailure} />
          </SceneBoundary>}
        </div>
        <div className={styles.caption}>
          <div className={styles.ranks} aria-label="Graduações: branca, azul, roxa, marrom e preta">
            {colors.map((color, index) => <span key={color} style={{ background: color }} title={ranks[index]} />)}
          </div>
          <motion.span className={styles.rank} aria-hidden="true">{rank}</motion.span>
          <a href="#ground-culture-content" className={styles.skip} onClick={event => {
            if (!settings.static) return;
            event.preventDefault();
            const destination = document.getElementById("ground-culture-content");
            destination?.scrollIntoView({ behavior: "instant" });
            destination?.focus({ preventScroll: true });
          }}>Continuar para a loja <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
    <div id="ground-culture-content" tabIndex={-1} className={styles.destination} />
    <noscript><style>{`.${styles.experience}{height:auto}.${styles.stage}{position:relative}`}</style></noscript>
  </>;
}
