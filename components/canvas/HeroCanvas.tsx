"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import PicoModel from "./PicoModel";
import ArduinoModel from "./ArduinoModel";
import ESP32Model from "./ESP32Model";
import Particles from "./Particles";

const mousePos = { x: 0, y: 0 };

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ── Ease out cubic ── */
function easeOut(t: number) {
  return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
}

function Scene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const picoRef = useRef<THREE.Group>(null!);
  const arduinoRef = useRef<THREE.Group>(null!);
  const espRef = useRef<THREE.Group>(null!);
  const elapsed = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    /* ── Mouse parallax on parent group ── */
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mousePos.x * 0.12, 0.03);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mousePos.y * 0.06, 0.03);
    }

    // Always invalidate during animation
    invalidate();

    /* ── OPENING SEQUENCE: 0-3s ── */
    const ENTRY_DUR = 2.5;

    if (t < 3.5) {
      // Camera shake during entry (subtle)
      if (t < 2) {
        camera.position.x = Math.sin(t * 12) * 0.03 * (1 - t / 2);
        camera.position.y = 2 + Math.cos(t * 15) * 0.02 * (1 - t / 2);
      } else {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2, 0.05);
      }

      // PICO: flies in from left-deep (starts at t=0)
      if (picoRef.current) {
        const p = easeOut(t / ENTRY_DUR);
        picoRef.current.position.x = THREE.MathUtils.lerp(-12, -3.5, p);
        picoRef.current.position.y = THREE.MathUtils.lerp(8, 1.2, p);
        picoRef.current.position.z = THREE.MathUtils.lerp(-25, 0, p);
        picoRef.current.rotation.x = (1 - p) * Math.PI * 3;
        picoRef.current.rotation.y = (1 - p) * Math.PI * 2 + p * 0.5;
        // Landing pulse
        if (p > 0.95) {
          const pulse = Math.sin((p - 0.95) * 20 * Math.PI) * 0.08;
          const s = 1.1 + pulse;
          picoRef.current.scale.setScalar(s);
        } else {
          picoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.1, 1.1, p));
        }
      }

      // ARDUINO: flies in from center-deep (starts at t=0.3s)
      if (arduinoRef.current) {
        const p = easeOut(Math.max(0, t - 0.3) / ENTRY_DUR);
        arduinoRef.current.position.x = THREE.MathUtils.lerp(0, 0, p);
        arduinoRef.current.position.y = THREE.MathUtils.lerp(-6, -0.5, p);
        arduinoRef.current.position.z = THREE.MathUtils.lerp(-30, -1, p);
        arduinoRef.current.rotation.y = (1 - p) * Math.PI * 4;
        arduinoRef.current.rotation.z = (1 - p) * Math.PI * 1.5;
        if (p > 0.95) {
          const pulse = Math.sin((p - 0.95) * 20 * Math.PI) * 0.06;
          arduinoRef.current.scale.setScalar(0.85 + pulse);
        } else {
          arduinoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.05, 0.85, p));
        }
      }

      // ESP32: flies in from right-deep (starts at t=0.6s)
      if (espRef.current) {
        const p = easeOut(Math.max(0, t - 0.6) / ENTRY_DUR);
        espRef.current.position.x = THREE.MathUtils.lerp(12, 3.5, p);
        espRef.current.position.y = THREE.MathUtils.lerp(6, 0.8, p);
        espRef.current.position.z = THREE.MathUtils.lerp(-25, -0.5, p);
        espRef.current.rotation.z = (1 - p) * Math.PI * 2;
        espRef.current.rotation.x = (1 - p) * Math.PI * 2.5 + p * 0.4;
        if (p > 0.95) {
          const pulse = Math.sin((p - 0.95) * 20 * Math.PI) * 0.07;
          espRef.current.scale.setScalar(1.0 + pulse);
        } else {
          espRef.current.scale.setScalar(THREE.MathUtils.lerp(0.08, 1.0, p));
        }
      }
    }

    /* ── IDLE FLOATING: after 3.5s ── */
    else {
      const ft = t - 3.5; // float time

      if (picoRef.current) {
        // Lissajous figure-8
        picoRef.current.position.x = -3.5 + Math.sin(ft * 0.6) * 0.8;
        picoRef.current.position.y = 1.2 + Math.sin(ft * 0.4) * 0.4;
        picoRef.current.position.z = Math.cos(ft * 0.6) * 0.5;
        picoRef.current.rotation.x = Math.sin(ft * 0.3) * 0.15;
        picoRef.current.rotation.y += 0.004;
        picoRef.current.rotation.z = Math.cos(ft * 0.25) * 0.1;
        const s = 1.1 + Math.sin(ft * 0.8) * 0.04;
        picoRef.current.scale.setScalar(s);
      }

      if (arduinoRef.current) {
        // Orbital motion
        arduinoRef.current.position.x = Math.cos(ft * 0.3) * 1.5;
        arduinoRef.current.position.y = -0.5 + Math.sin(ft * 0.5) * 0.3;
        arduinoRef.current.position.z = -1 + Math.sin(ft * 0.3) * 1.2;
        arduinoRef.current.rotation.x = Math.sin(ft * 0.2) * 0.2;
        arduinoRef.current.rotation.y += 0.006;
        arduinoRef.current.rotation.z = Math.cos(ft * 0.18) * 0.15;
      }

      if (espRef.current) {
        // Counter-orbital
        espRef.current.position.x = 3.5 + Math.cos(ft * 0.4 + Math.PI) * 0.7;
        espRef.current.position.y = 0.8 + Math.sin(ft * 0.7) * 0.35;
        espRef.current.position.z = Math.sin(ft * 0.4 + Math.PI) * 0.6;
        espRef.current.rotation.x = Math.PI * 0.1 + Math.sin(ft * 0.35) * 0.08;
        espRef.current.rotation.y += 0.005;
        espRef.current.rotation.z = Math.cos(ft * 0.3) * 0.12;
      }
    }
  });

  return (
    <>
      {/* ── Full-power lighting ── */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-8, 5, -5]} intensity={1.8} color="#4488ff" />
      <pointLight position={[0, 5, 3]} intensity={4} color="#22C55E" distance={15} />
      <pointLight position={[0, -3, -2]} intensity={3} color="#3B82F6" distance={12} />
      <hemisphereLight args={["#1a4a7e", "#0a2a0a", 1.5]} />

      <group ref={groupRef}>
        <group ref={picoRef} position={[-12, 8, -25]} scale={0.1}>
          <PicoModel />
        </group>
        <group ref={arduinoRef} position={[0, -6, -30]} scale={0.05}>
          <ArduinoModel />
        </group>
        <group ref={espRef} position={[12, 6, -25]} scale={0.08}>
          <ESP32Model />
        </group>
      </group>

      {!isMobile && <Particles />}

      {/* ── Post-processing ── */}
      <EffectComposer multisampling={isMobile ? 0 : 4}>
        <Bloom intensity={isMobile ? 0.4 : 1.0} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur={!isMobile} />
        <Vignette offset={0.25} darkness={0.5} eskil={false} />
      </EffectComposer>
    </>
  );
}

// Suppress THREE.Clock deprecation warnings
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    origWarn.apply(console, args);
  };
}

export default function HeroCanvas() {
  const isMobile = useIsMobile();
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!(c.getContext("webgl2") || c.getContext("webgl"))) setWebglOk(false);
    } catch { setWebglOk(false); }
  }, []);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate();
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  if (!webglOk) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#060818] to-[#030306]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_60%)]" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: isMobile ? 65 : 50 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 2.5,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: isMobile ? "default" : "high-performance",
      }}
      frameloop="demand"
      performance={{ min: 0.5 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#030306"]} />
      <fog attach="fog" args={["#030306", 10, 25]} />
      <Scene isMobile={isMobile} />
      <Preload all />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
