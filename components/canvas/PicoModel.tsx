"use client";

import { useRef, useState, Suspense } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

const BW = 2.1, BH = 1.05, BD = 0.08, PINS = 20;

function PicoTexture() {
  const tex = useTexture("/pico-top.webp");
  const mats = [
    new THREE.MeshStandardMaterial({ color: "#2d5a1b", emissive: "#1a3a0f", emissiveIntensity: 0.8, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: "#2d5a1b", emissive: "#1a3a0f", emissiveIntensity: 0.8, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: "#ffffff", emissiveIntensity: 0.6, toneMapped: false }),
    new THREE.MeshStandardMaterial({ color: "#1a3a0f", emissive: "#0d1f08", emissiveIntensity: 0.6, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: "#2d5a1b", emissive: "#1a3a0f", emissiveIntensity: 0.8, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: "#2d5a1b", emissive: "#1a3a0f", emissiveIntensity: 0.8, roughness: 0.4 }),
  ];
  return (
    <mesh material={mats}>
      <boxGeometry args={[BW, BD, BH]} />
    </mesh>
  );
}

export default function PicoModel(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null!);
  const leds = useRef<THREE.Mesh[]>([]);
  const [hov, setHov] = useState(false);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    leds.current.forEach((led, i) => {
      if (!led) return;
      const m = led.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = hov ? (((t * 4 + i * 0.8) % 2) < 1 ? 6 : 1.5) : 2.5 + Math.sin(t * 2 + i) * 0.8;
    });
  });

  const ledPos: [number, number, number][] = [[-0.7, BD / 2 + 0.015, 0.3], [-0.6, BD / 2 + 0.015, 0.3], [-0.5, BD / 2 + 0.015, 0.3]];

  return (
    <group ref={group} {...props} onPointerOver={() => setHov(true)} onPointerOut={() => setHov(false)}>
      {/* Board with texture on top face */}
      <Suspense fallback={
        <mesh><boxGeometry args={[BW, BD, BH]} />
          <meshStandardMaterial color="#2d5a1b" emissive="#1a3a0f" emissiveIntensity={1.0} roughness={0.3} toneMapped={false} />
        </mesh>
      }>
        <PicoTexture />
      </Suspense>



      {/* Gold pins — two rows (Optimized) */}
      <mesh position={[0, -BD / 2 - 0.04, BH / 2 - 0.04]}>
        <boxGeometry args={[1.9, 0.12, 0.04]} />
        <meshStandardMaterial color="#FFD700" emissive="#BB9900" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -BD / 2 - 0.04, -(BH / 2 - 0.04)]}>
        <boxGeometry args={[1.9, 0.12, 0.04]} />
        <meshStandardMaterial color="#FFD700" emissive="#BB9900" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* USB-C */}
      <mesh position={[BW / 2 + 0.05, 0.02, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.25]} />
        <meshStandardMaterial color="#C0C0C0" emissive="#707070" emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* RP2040 chip */}
      <mesh position={[0.2, BD / 2 + 0.02, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial color="#111" emissive={hov ? "#22C55E" : "#333"} emissiveIntensity={hov ? 1.5 : 0.8} roughness={0.8} />
      </mesh>

      {/* LEDs */}
      {ledPos.map((pos, i) => (
        <mesh key={i} position={pos} ref={(el) => { if (el) leds.current[i] = el; }}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}

      {/* Circuit traces */}
      {[
        [[-0.8, 0.2], [0.2, 0.2]], [[-0.8, -0.2], [0.2, -0.2]],
        [[0.2, 0.2], [0.5, 0]], [[0.2, -0.2], [0.5, 0]],
      ].map(([s, e], i) => {
        const dx = (e as number[])[0] - (s as number[])[0], dz = (e as number[])[1] - (s as number[])[1];
        const len = Math.sqrt(dx * dx + dz * dz);
        return (
          <mesh key={`tr${i}`} position={[((s as number[])[0] + (e as number[])[0]) / 2, BD / 2 + 0.002, ((s as number[])[1] + (e as number[])[1]) / 2]} rotation={[0, -Math.atan2(dz, dx), 0]}>
            <boxGeometry args={[len, 0.003, 0.008]} />
            <meshStandardMaterial color="#44ff88" emissive="#44ff88" emissiveIntensity={hov ? 3 : 0.5} transparent opacity={hov ? 0.9 : 0.3} toneMapped={false} />
          </mesh>
        );
      })}

      {/* Self-illumination light (travels with board) */}
      <pointLight position={[0, 0.8, 0]} intensity={hov ? 3 : 1.5} color="#22C55E" distance={5} />

      {/* Hover ring */}
      {hov && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.4, 0.02, 16, 16]} />
          <meshBasicMaterial color="#22C55E" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}