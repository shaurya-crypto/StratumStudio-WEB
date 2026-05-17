"use client";

import { useMemo, memo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const PIN_GEO = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6);
const LED_GEO = new THREE.SphereGeometry(0.02, 8, 8);

const ESP32Board3D = memo(function ESP32Board3D() {
  const tex = useTexture("/boards/esp32.webp");
  tex.flipY = false;

  const pinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#C0A040", metalness: 0.85, roughness: 0.2 }), []);

  return (
    <group>
      {/* PCB Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 1.1]} />
        <meshStandardMaterial color="#1a3a8a" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top decal texture */}
      <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 1.0]} />
        <meshStandardMaterial map={tex} transparent opacity={0.85} roughness={0.5} />
      </mesh>

      {/* ESP32 module — large raised silver box */}
      <mesh position={[0.6, 0.1, 0]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshStandardMaterial color="#C8C8C8" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Module shield label */}
      <mesh position={[0.6, 0.141, 0]}>
        <boxGeometry args={[0.5, 0.001, 0.5]} />
        <meshStandardMaterial color="#aaa" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* WiFi antenna trace */}
      <mesh position={[1.0, 0.035, 0]} castShadow>
        <boxGeometry args={[0.25, 0.005, 0.5]} />
        <meshStandardMaterial color="#C0A040" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Antenna meander pattern */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`ant-${i}`} position={[1.05, 0.038, -0.2 + i * 0.1]}>
          <boxGeometry args={[0.15, 0.003, 0.01]} />
          <meshStandardMaterial color="#C0A040" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* USB-C port */}
      <group position={[-1.1, 0.06, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.07, 0.22]} />
          <meshStandardMaterial color="#999" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.08, 0.035, 0.16]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      </group>

      {/* Boot button */}
      <mesh position={[-0.5, 0.06, 0.35]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.08]} />
        <meshStandardMaterial color="#444" roughness={0.5} />
      </mesh>

      {/* EN button */}
      <mesh position={[-0.5, 0.06, -0.35]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.08]} />
        <meshStandardMaterial color="#444" roughness={0.5} />
      </mesh>

      {/* CP2102 USB chip */}
      <mesh position={[-0.7, 0.07, 0]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Header pins — 15 per side */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={`pin-l-${i}`} position={[-0.9 + i * 0.12, -0.06, 0.48]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={`pin-r-${i}`} position={[-0.9 + i * 0.12, -0.06, -0.48]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* LED */}
      <group>
        <mesh position={[-0.3, 0.05, 0.3]} geometry={LED_GEO}>
          <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={4} toneMapped={false} />
        </mesh>
        <pointLight position={[-0.3, 0.05, 0.3]} intensity={0.3} color="#3B82F6" distance={0.4} />
      </group>

      {/* Voltage regulator */}
      <mesh position={[-0.85, 0.07, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.08]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
});

export default ESP32Board3D;
