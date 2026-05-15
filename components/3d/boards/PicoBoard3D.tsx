"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const PIN_GEO = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6);
const LED_GEO = new THREE.SphereGeometry(0.02, 8, 8);

export default function PicoBoard3D() {
  const tex = useTexture("/boards/pico.png");
  tex.flipY = false;

  const pinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#C0A040", metalness: 0.85, roughness: 0.2 }), []);

  return (
    <group>
      {/* PCB Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.08, 1.05]} />
        <meshStandardMaterial color="#1B8C3D" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top decal texture */}
      <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 0.95]} />
        <meshStandardMaterial map={tex} transparent opacity={0.85} roughness={0.5} />
      </mesh>

      {/* RP2040 chip — raised square */}
      <mesh position={[0.1, 0.09, 0]} castShadow>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* RP2040 chip markings — tiny silver square */}
      <mesh position={[0.1, 0.116, 0]}>
        <boxGeometry args={[0.15, 0.001, 0.15]} />
        <meshStandardMaterial color="#888" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Chip QFN pads */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`qfn-${i}`} position={[0.1 + (i < 6 ? -0.24 : 0.24), 0.07, (i % 6 - 2.5) * 0.06]} castShadow>
          <boxGeometry args={[0.05, 0.015, 0.02]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* BOOTSEL button */}
      <mesh position={[-0.4, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} />
      </mesh>

      {/* USB Micro port */}
      <group position={[-0.98, 0.06, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.08, 0.2]} />
          <meshStandardMaterial color="#999" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.14]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      </group>

      {/* Flash chip */}
      <mesh position={[0.5, 0.07, 0.2]} castShadow>
        <boxGeometry args={[0.18, 0.04, 0.18]} />
        <meshStandardMaterial color="#222" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* GPIO pins — 20 per side (2 rows of 20) */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={`pin-t-${i}`} position={[-0.85 + i * 0.09, -0.08, 0.45]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={`pin-b-${i}`} position={[-0.85 + i * 0.09, -0.08, -0.45]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* Debug SWD pads */}
      {[0.15, 0, -0.15].map((z, i) => (
        <mesh key={`swd-${i}`} position={[0.95, 0.045, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.025, 12]} />
          <meshStandardMaterial color="#C0A040" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* LED */}
      <group>
        <mesh position={[-0.6, 0.06, 0.15]} geometry={LED_GEO}>
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={4} toneMapped={false} />
        </mesh>
        <pointLight position={[-0.6, 0.06, 0.15]} intensity={0.3} color="#00ff00" distance={0.4} />
      </group>
    </group>
  );
}
