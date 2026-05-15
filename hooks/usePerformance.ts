"use client";

import { useState, useEffect, useMemo } from "react";

export type PerformanceMode = "high" | "balanced" | "low";

interface PerformanceConfig {
  mode: PerformanceMode;
  particles: number;
  dpr: [number, number];
  shadows: boolean;
  bloom: boolean;
  postProcessing: boolean;
  antialias: boolean;
  multisampling: number;
  webgl: boolean;
}

const HIGH: PerformanceConfig = {
  mode: "high",
  particles: 600,
  dpr: [1, 2],
  shadows: true,
  bloom: true,
  postProcessing: true,
  antialias: true,
  multisampling: 4,
  webgl: true,
};

const BALANCED: PerformanceConfig = {
  mode: "balanced",
  particles: 200,
  dpr: [1, 1.5],
  shadows: false,
  bloom: true,
  postProcessing: true,
  antialias: false,
  multisampling: 0,
  webgl: true,
};

const LOW: PerformanceConfig = {
  mode: "low",
  particles: 0,
  dpr: [1, 1],
  shadows: false,
  bloom: false,
  postProcessing: false,
  antialias: false,
  multisampling: 0,
  webgl: false,
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectPerformance(): PerformanceMode {
  if (typeof window === "undefined") return "balanced";

  // Check WebGL availability first
  if (!detectWebGL()) return "low";

  // Check device memory (Chrome only)
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 4) return "low";
  if (nav.deviceMemory && nav.deviceMemory < 8) return "balanced";

  // Check hardware concurrency
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return "low";
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return "balanced";

  // Check mobile via touch + screen
  const isMobile = "ontouchstart" in window && window.innerWidth < 768;
  if (isMobile) return "balanced";

  // Check GPU via WebGL renderer string
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Low-end GPU indicators
        if (renderer.includes("adreno 3") || renderer.includes("adreno 4") ||
            renderer.includes("mali-4") || renderer.includes("mali-t6") ||
            renderer.includes("swiftshader") || renderer.includes("llvmpipe")) {
          return "low";
        }
        if (renderer.includes("adreno 5") || renderer.includes("mali-t7") ||
            renderer.includes("mali-g5") || renderer.includes("intel hd")) {
          return "balanced";
        }
      }
    }
  } catch { /* ignore */ }

  return "high";
}

export function usePerformance(): PerformanceConfig {
  const [mode, setMode] = useState<PerformanceMode>("balanced");

  useEffect(() => {
    setMode(detectPerformance());
  }, []);

  return useMemo(() => {
    switch (mode) {
      case "high": return HIGH;
      case "low": return LOW;
      default: return BALANCED;
    }
  }, [mode]);
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
