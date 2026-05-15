"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

export function FloatingCube({ color = "#3B82F6", scale = 1, speed = 2 }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111111",
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
  }), [color]);

  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += dt * 0.2 * speed;
      meshRef.current.rotation.y += dt * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} geometry={geo} material={mat} scale={scale} />
    </Float>
  );
}
