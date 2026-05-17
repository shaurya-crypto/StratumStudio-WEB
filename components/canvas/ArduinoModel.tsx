"use client";

import { useRef, useState, Suspense } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

const BW = 2.7, BH = 2.1, BD = 0.08;

function ArduinoTexture() {
  const tex = useTexture("/arduino-top.webp");
  const mats = [
    new THREE.MeshStandardMaterial({ color: "#0066CC", emissive: "#0044AA", emissiveIntensity: 1.0, roughness: 0.35 }),
    new THREE.MeshStandardMaterial({ color: "#0066CC", emissive: "#0044AA", emissiveIntensity: 1.0, roughness: 0.35 }),
    new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: "#ffffff", emissiveIntensity: 0.5, toneMapped: false }),
    new THREE.MeshStandardMaterial({ color: "#003366", emissive: "#002244", emissiveIntensity: 0.8, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: "#0066CC", emissive: "#0044AA", emissiveIntensity: 1.0, roughness: 0.35 }),
    new THREE.MeshStandardMaterial({ color: "#0066CC", emissive: "#0044AA", emissiveIntensity: 1.0, roughness: 0.35 }),
  ];
  return <mesh material={mats}><boxGeometry args={[BW, BD, BH]} /></mesh>;
}

export default function ArduinoModel(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null!);
  const chip = useRef<THREE.Mesh>(null!);
  const [hov, setHov] = useState(false);

  useFrame(({ clock }) => {
    if (!chip.current) return;
    const t = clock.elapsedTime;
    const m = chip.current.material as THREE.MeshStandardMaterial;
    if (hov) { m.emissive.setHex(0xFF6600); m.emissiveIntensity = 1.5 + Math.sin(t * 8) * 1.0; }
    else { m.emissive.setHex(0xFF6600); m.emissiveIntensity = 0.5; }
  });

  return (
    <group ref={group} {...props} onPointerOver={() => setHov(true)} onPointerOut={() => setHov(false)}>
      <Suspense fallback={
        <mesh><boxGeometry args={[BW, BD, BH]} />
          <meshStandardMaterial color="#0066CC" emissive="#0044AA" emissiveIntensity={1.2} roughness={0.3} toneMapped={false} />
        </mesh>
      }>
        <ArduinoTexture />
      </Suspense>



      {/* ATmega chip — CRITICAL: high emissive + orange glow */}
      <mesh ref={chip} position={[0.3, BD / 2 + 0.025, -0.1]}>
        <boxGeometry args={[0.55, 0.05, 0.55]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#FF6600" emissiveIntensity={0.5} roughness={0.6} />
      </mesh>

      {/* USB-B port */}
      <mesh position={[-BW / 2 + 0.18, BD / 2 + 0.08, -0.6]}>
        <boxGeometry args={[0.28, 0.22, 0.32]} />
        <meshStandardMaterial color="#999" emissive="#555" emissiveIntensity={0.6} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* DC Jack */}
      <mesh position={[-BW / 2 + 0.18, BD / 2 + 0.04, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.35, 8]} />
        <meshStandardMaterial color="#333" emissive="#444" emissiveIntensity={0.4} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Crystal */}
      <mesh position={[-0.2, BD / 2 + 0.015, 0.1]}>
        <boxGeometry args={[0.15, 0.03, 0.06]} />
        <meshStandardMaterial color="#d0d0d0" emissive="#999" emissiveIntensity={0.5} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Reset button */}
      <mesh position={[0.5, BD / 2 + 0.02, 0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#cc0000" emissive="#cc0000" emissiveIntensity={0.6} />
      </mesh>

      {/* Pin headers (Optimized) */}
      <mesh position={[BW / 2 - 0.8, BD / 2 + 0.06, BH / 2 - 0.08]}>
        <boxGeometry args={[1.4, 0.12, 0.05]} />
        <meshStandardMaterial color="#333" emissive="#444" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[BW / 2 - 0.75, BD / 2 + 0.06, -(BH / 2 - 0.08)]}>
        <boxGeometry args={[1.0, 0.12, 0.05]} />
        <meshStandardMaterial color="#333" emissive="#444" emissiveIntensity={0.4} />
      </mesh>

      {/* Power LED */}
      <mesh position={[-0.6, BD / 2 + 0.012, 0.4]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      {/* TX LED */}
      <mesh position={[-0.4, BD / 2 + 0.012, 0.4]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* CRITICAL: Self-illumination — this light travels WITH the Arduino */}
      <pointLight position={[0, 0.8, 0]} intensity={hov ? 4 : 2.5} color="#0066CC" distance={5} />

      {/* Hover: orange cube wireframe */}
      {hov && (
        <mesh>
          <boxGeometry args={[BW + 0.3, BD + 0.8, BH + 0.3]} />
          <meshBasicMaterial color="#FF6600" wireframe transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
