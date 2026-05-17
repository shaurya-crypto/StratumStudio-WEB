"use client";

import { useRef, useState, Suspense } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

const BW = 1.4, BH = 0.75, BD = 0.06;

function WifiRing({ delay, active }: { delay: number; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current || !active) return;
    const t = ((clock.elapsedTime - delay) % 1.2) / 1.2;
    ref.current.scale.setScalar(0.3 + t * 1.5);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 * (1 - t));
    ref.current.position.y = 0.3 + t * 0.8;
  });
  if (!active) return null;
  return (
    <mesh ref={ref} position={[BW / 2 + 0.1, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.15, 0.01, 8, 32]} />
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

function ESP32Texture() {
  const tex = useTexture("/esp32-top.webp");
  const mats = [
    new THREE.MeshStandardMaterial({ color: "#1a1a3e", emissive: "#0a0a2e", emissiveIntensity: 1.0, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: "#1a1a3e", emissive: "#0a0a2e", emissiveIntensity: 1.0, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: "#ffffff", emissiveIntensity: 0.5, toneMapped: false }),
    new THREE.MeshStandardMaterial({ color: "#0a0a1e", emissive: "#050510", emissiveIntensity: 0.8, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: "#1a1a3e", emissive: "#0a0a2e", emissiveIntensity: 1.0, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: "#1a1a3e", emissive: "#0a0a2e", emissiveIntensity: 1.0, roughness: 0.4 }),
  ];
  return <mesh material={mats}><boxGeometry args={[BW, BD, BH]} /></mesh>;
}

export default function ESP32Model(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null!);
  const ant = useRef<THREE.Mesh>(null!);
  const [hov, setHov] = useState(false);

  useFrame(({ clock }) => {
    if (ant.current) ant.current.rotation.z = Math.sin(clock.elapsedTime * 2) * (hov ? 0.2 : 0.08);
  });

  return (
    <group ref={group} {...props} onPointerOver={() => setHov(true)} onPointerOut={() => setHov(false)}>
      <Suspense fallback={
        <mesh><boxGeometry args={[BW, BD, BH]} />
          <meshStandardMaterial color="#1a1a3e" emissive="#0a0a2e" emissiveIntensity={1.2} roughness={0.4} toneMapped={false} />
        </mesh>
      }>
        <ESP32Texture />
      </Suspense>



      {/* Silver edge frame */}
      {[[0, BH / 2, BW, 0.015], [0, -BH / 2, BW, 0.015], [BW / 2, 0, 0.015, BH], [-BW / 2, 0, 0.015, BH]].map((e, i) => (
        <mesh key={`e${i}`} position={[e[0], BD / 2 + 0.002, e[1]]}>
          <boxGeometry args={[e[2], 0.005, e[3]]} />
          <meshStandardMaterial color="#C0C0C0" emissive="#808080" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* ESP32 module */}
      <mesh position={[0.1, BD / 2 + 0.025, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.4]} />
        <meshStandardMaterial color="#C0C0C0" emissive="#505050" emissiveIntensity={hov ? 1.5 : 0.8} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Antenna */}
      <mesh ref={ant} position={[BW / 2 - 0.02, BD / 2 + 0.01, 0]}>
        <boxGeometry args={[0.12, 0.03, 0.35]} />
        <meshStandardMaterial color="#B87333" emissive="#B87333" emissiveIntensity={hov ? 2.0 : 1.0} metalness={0.5} roughness={0.4} toneMapped={false} />
      </mesh>

      {/* WiFi rings */}
      <WifiRing delay={0} active={hov} />
      <WifiRing delay={0.4} active={hov} />
      <WifiRing delay={0.8} active={hov} />

      {/* Micro-USB */}
      <mesh position={[-BW / 2 + 0.06, BD / 2 + 0.02, 0]}>
        <boxGeometry args={[0.14, 0.05, 0.2]} />
        <meshStandardMaterial color="#999" emissive="#666" emissiveIntensity={0.5} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Pins (Optimized) */}
      <mesh position={[0.05, -BD / 2 - 0.04, BH / 2 - 0.03]}>
        <boxGeometry args={[1.35, 0.08, 0.03]} />
        <meshStandardMaterial color="#FFD700" emissive="#BB9900" emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.05, -BD / 2 - 0.04, -(BH / 2 - 0.03)]}>
        <boxGeometry args={[1.35, 0.08, 0.03]} />
        <meshStandardMaterial color="#FFD700" emissive="#BB9900" emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Buttons */}
      <mesh position={[-0.45, BD / 2 + 0.015, 0.2]}><cylinderGeometry args={[0.03, 0.03, 0.02, 8]} /><meshStandardMaterial color="#555" emissive="#666" emissiveIntensity={0.4} /></mesh>
      <mesh position={[-0.45, BD / 2 + 0.015, -0.2]}><cylinderGeometry args={[0.03, 0.03, 0.02, 8]} /><meshStandardMaterial color="#555" emissive="#666" emissiveIntensity={0.4} /></mesh>

      {/* Blue LED */}
      <mesh position={[-0.3, BD / 2 + 0.01, 0.25]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#0088ff" emissive="#0088ff" emissiveIntensity={6} toneMapped={false} />
      </mesh>

      {/* BT indicator on hover */}
      {hov && <mesh position={[0.15, BD / 2 + 0.15, 0.2]}><sphereGeometry args={[0.03, 12, 12]} /><meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={4} toneMapped={false} /></mesh>}

      {/* Self-illumination */}
      <pointLight position={[0, 0.8, 0]} intensity={hov ? 3 : 1.5} color="#3B82F6" distance={5} />
    </group>
  );
}
