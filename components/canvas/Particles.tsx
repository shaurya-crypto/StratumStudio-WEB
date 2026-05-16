"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 80;
const RADIUS = 12;

export default function Particles() {
  const ref = useRef<THREE.Points>(null!);
  const [geometryData, setGeometryData] = useState<{ pos: Float32Array; sz: Float32Array } | null>(null);

  useEffect(() => {
    const pos = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * Math.cbrt(Math.random());
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.5 + Math.random() * 1.5;
    }
    setGeometryData({ pos, sz });
  }, []);

  const posAttr = useMemo(() => {
    return geometryData ? new THREE.BufferAttribute(geometryData.pos, 3) : null;
  }, [geometryData]);
  
  const sizeAttr = useMemo(() => {
    return geometryData ? new THREE.BufferAttribute(geometryData.sz, 1) : null;
  }, [geometryData]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  if (!posAttr || !sizeAttr) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={posAttr} />
        <primitive attach="attributes-size" object={sizeAttr} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
