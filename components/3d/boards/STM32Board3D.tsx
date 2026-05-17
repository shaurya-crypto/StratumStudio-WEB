"use client";

import { useMemo, memo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const PIN_GEO = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6);
const LED_GEO = new THREE.SphereGeometry(0.02, 8, 8);

const STM32Board3D = memo(function STM32Board3D() {
  const tex = useTexture("/boards/stm32.webp");
  tex.flipY = false;

  const pinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#C0A040", metalness: 0.85, roughness: 0.2 }), []);

  return (
    <group>
      {/* PCB Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.06, 1.3]} />
        <meshStandardMaterial color="#0044AA" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top decal texture */}
      <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 1.2]} />
        <meshStandardMaterial map={tex} transparent opacity={0.85} roughness={0.5} />
      </mesh>

      {/* STM32F103 LQFP-48 chip */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.45, 0.04, 0.45]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Chip marking dot */}
      <mesh position={[-0.12, 0.101, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.02, 8]} />
        <meshStandardMaterial color="#888" metalness={0.3} />
      </mesh>
      {/* Gull-wing pins — 12 per side */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`gw-t-${i}`} position={[(i - 5.5) * 0.035, 0.065, -0.26]}>
          <boxGeometry args={[0.02, 0.012, 0.06]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`gw-b-${i}`} position={[(i - 5.5) * 0.035, 0.065, 0.26]}>
          <boxGeometry args={[0.02, 0.012, 0.06]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`gw-l-${i}`} position={[-0.26, 0.065, (i - 5.5) * 0.035]}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`gw-r-${i}`} position={[0.26, 0.065, (i - 5.5) * 0.035]}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* Crystal oscillator */}
      <mesh position={[0.4, 0.06, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Boot jumpers — 2 yellow blocks */}
      {[0.3, 0.15].map((z, i) => (
        <group key={`boot-${i}`} position={[-0.6, 0.05, z]}>
          <mesh>
            <boxGeometry args={[0.08, 0.04, 0.04]} />
            <meshStandardMaterial color="#FFD700" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ST-Link pads */}
      {[0.2, 0.1, 0, -0.1].map((z, i) => (
        <mesh key={`stlink-${i}`} position={[0.9, 0.035, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.025, 10]} />
          <meshStandardMaterial color="#C0A040" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* USB Micro port */}
      <group position={[-0.92, 0.06, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.07, 0.18]} />
          <meshStandardMaterial color="#999" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[0.06, 0.035, 0.12]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      </group>

      {/* Reset button */}
      <mesh position={[0.6, 0.06, -0.4]} castShadow>
        <boxGeometry args={[0.06, 0.035, 0.06]} />
        <meshStandardMaterial color="#444" roughness={0.5} />
      </mesh>

      {/* Header pins — 20 per side */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={`pin-t-${i}`} position={[-0.8 + i * 0.08, -0.06, 0.58]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={`pin-b-${i}`} position={[-0.8 + i * 0.08, -0.06, -0.58]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* LED */}
      <group>
        <mesh position={[0.5, 0.05, -0.3]} geometry={LED_GEO}>
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={4} toneMapped={false} />
        </mesh>
        <pointLight position={[0.5, 0.05, -0.3]} intensity={0.3} color="#00ff00" distance={0.4} />
      </group>
      {/* Power LED */}
      <group>
        <mesh position={[-0.7, 0.05, 0.4]} geometry={LED_GEO}>
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <pointLight position={[-0.7, 0.05, 0.4]} intensity={0.2} color="#ff0000" distance={0.3} />
      </group>
    </group>
  );
});

export default STM32Board3D;
