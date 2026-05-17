"use client";

import { useRef, useEffect, useState, memo } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import PicoModel from "./PicoModel";
import ArduinoModel from "./ArduinoModel";
import ESP32Model from "./ESP32Model";
import Particles from "./Particles";
import { useTheme } from "@/hooks/useTheme";

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

function easeOut(t: number) {
  return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
}

const Scene = memo(function Scene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const picoRef = useRef<THREE.Group>(null!);
  const arduinoRef = useRef<THREE.Group>(null!);
  const espRef = useRef<THREE.Group>(null!);
  const elapsed = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mousePos.x * 0.12, 0.03);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mousePos.y * 0.06, 0.03);
    }

    const ENTRY_DUR = 2.5;

    if (t < 3.5) {
      if (t < 2) {
        camera.position.x = Math.sin(t * 12) * 0.03 * (1 - t / 2);
        camera.position.y = 2 + Math.cos(t * 15) * 0.02 * (1 - t / 2);
      } else {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2, 0.05);
      }

      if (picoRef.current) {
        const p = easeOut(t / ENTRY_DUR);
        picoRef.current.position.x = THREE.MathUtils.lerp(-12, -3.5, p);
        picoRef.current.position.y = THREE.MathUtils.lerp(8, 1.2, p);
        picoRef.current.position.z = THREE.MathUtils.lerp(-25, 0, p);
        picoRef.current.rotation.x = (1 - p) * Math.PI * 3;
        picoRef.current.rotation.y = (1 - p) * Math.PI * 2 + p * 0.5;
        if (p > 0.95) {
          picoRef.current.scale.setScalar(1.1 + Math.sin((p - 0.95) * 20 * Math.PI) * 0.08);
        } else {
          picoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.1, 1.1, p));
        }
      }

      if (arduinoRef.current) {
        const p = easeOut(Math.max(0, t - 0.3) / ENTRY_DUR);
        arduinoRef.current.position.x = 0;
        arduinoRef.current.position.y = THREE.MathUtils.lerp(-6, -0.5, p);
        arduinoRef.current.position.z = THREE.MathUtils.lerp(-30, -1, p);
        arduinoRef.current.rotation.y = (1 - p) * Math.PI * 4;
        arduinoRef.current.rotation.z = (1 - p) * Math.PI * 1.5;
        if (p > 0.95) {
          arduinoRef.current.scale.setScalar(0.85 + Math.sin((p - 0.95) * 20 * Math.PI) * 0.06);
        } else {
          arduinoRef.current.scale.setScalar(THREE.MathUtils.lerp(0.05, 0.85, p));
        }
      }

      if (espRef.current) {
        const p = easeOut(Math.max(0, t - 0.6) / ENTRY_DUR);
        espRef.current.position.x = THREE.MathUtils.lerp(12, 3.5, p);
        espRef.current.position.y = THREE.MathUtils.lerp(6, 0.8, p);
        espRef.current.position.z = THREE.MathUtils.lerp(-25, -0.5, p);
        espRef.current.rotation.z = (1 - p) * Math.PI * 2;
        espRef.current.rotation.x = (1 - p) * Math.PI * 2.5 + p * 0.4;
        if (p > 0.95) {
          espRef.current.scale.setScalar(1.0 + Math.sin((p - 0.95) * 20 * Math.PI) * 0.07);
        } else {
          espRef.current.scale.setScalar(THREE.MathUtils.lerp(0.08, 1.0, p));
        }
      }
    } else {
      const ft = t - 3.5;

      if (picoRef.current) {
        picoRef.current.position.x = -3.5 + Math.sin(ft * 0.6) * 0.8;
        picoRef.current.position.y = 1.2 + Math.sin(ft * 0.4) * 0.4;
        picoRef.current.position.z = Math.cos(ft * 0.6) * 0.5;
        picoRef.current.rotation.x = Math.sin(ft * 0.3) * 0.15;
        picoRef.current.rotation.y += 0.004;
        picoRef.current.rotation.z = Math.cos(ft * 0.25) * 0.1;
        picoRef.current.scale.setScalar(1.1 + Math.sin(ft * 0.8) * 0.04);
      }

      if (arduinoRef.current) {
        arduinoRef.current.position.x = Math.cos(ft * 0.3) * 1.5;
        arduinoRef.current.position.y = -0.5 + Math.sin(ft * 0.5) * 0.3;
        arduinoRef.current.position.z = -1 + Math.sin(ft * 0.3) * 1.2;
        arduinoRef.current.rotation.x = Math.sin(ft * 0.2) * 0.2;
        arduinoRef.current.rotation.y += 0.006;
        arduinoRef.current.rotation.z = Math.cos(ft * 0.18) * 0.15;
      }

      if (espRef.current) {
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
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 5]} intensity={3} color="#ffffff" />

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
    </>
  );
});

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
  const theme = useTheme();
  const [webglOk, setWebglOk] = useState(true);

  const bgColor = theme === "dark" ? "#060610" : "#ffffff";

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
      <div className="absolute inset-0" style={{ background: "var(--bg)" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_60%)]" />
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: isMobile ? 65 : 50 }}
      dpr={[1, 1]}
      gl={{
        antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 2.5,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: "high-performance",
      }}
      frameloop="always"
      performance={{ min: 0.1 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 10, 25]} />
      <Scene isMobile={isMobile} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  );
}
