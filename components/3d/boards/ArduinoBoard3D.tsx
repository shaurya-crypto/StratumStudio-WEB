"use client";

import { useMemo, memo } from "react";
import * as THREE from "three";
import { useTexture, Decal } from "@react-three/drei";

const PIN_GEO = new THREE.CylinderGeometry(0.015, 0.015, 0.16, 6);
const LED_GEO = new THREE.SphereGeometry(0.025, 8, 8);
const CAP_GEO = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8);

const ArduinoBoard3D = memo(function ArduinoBoard3D() {
  const tex = useTexture("/boards/arduino.webp");
  tex.flipY = false;

  const pcbMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0066CC", roughness: 0.4, metalness: 0.1 }), []);
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#888888", metalness: 0.9, roughness: 0.2 }), []);
  const blackMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.7, metalness: 0.1 }), []);
  const pinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#444", metalness: 0.85, roughness: 0.25 }), []);

  return (
    <group>
      {/* PCB Base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.08, 2.1]} />
        <meshStandardMaterial color="#0066CC" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Top decal texture */}
      <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 2.0]} />
        <meshStandardMaterial map={tex} transparent opacity={0.85} roughness={0.5} />
      </mesh>

      {/* ATmega328P chip — raised */}
      <mesh position={[0.3, 0.09, -0.1]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.55]} />
        <primitive object={blackMat} attach="material" />
      </mesh>
      {/* Chip legs */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={`cl-${i}`} position={[0.3 + (i < 7 ? -0.33 : 0.33), 0.07, -0.1 + (i % 7 - 3) * 0.07]} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.02]} />
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* USB-B port */}
      <group position={[-1.2, 0.1, -0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.2, 0.32]} />
          <primitive object={metalMat} attach="material" />
        </mesh>
        <mesh position={[0.08, 0, 0]}>
          <boxGeometry args={[0.1, 0.12, 0.24]} />
          <meshStandardMaterial color="#222" roughness={0.8} />
        </mesh>
      </group>

      {/* Power jack */}
      <mesh position={[-1.2, 0.08, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.35, 12]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Reset button */}
      <mesh position={[-0.8, 0.07, 0.6]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#CC0000" roughness={0.3} />
      </mesh>

      {/* Crystal oscillator */}
      <mesh position={[0.7, 0.06, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Digital pins (14) — top row */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={`dp-${i}`} position={[1.2 - i * 0.15, -0.08, 0.92]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* Analog pins (6) — bottom row */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={`ap-${i}`} position={[0.5 - i * 0.15, -0.08, -0.92]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* Power pins */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={`pp-${i}`} position={[-0.5 - i * 0.15, -0.08, -0.92]} geometry={PIN_GEO}>
          <primitive object={pinMat} attach="material" />
        </mesh>
      ))}

      {/* LEDs */}
      {[
        { pos: [-0.6, 0.06, 0.4] as [number, number, number], color: "#ff0000", label: "L" },
        { pos: [-0.45, 0.06, 0.4] as [number, number, number], color: "#ff6600", label: "TX" },
        { pos: [-0.3, 0.06, 0.4] as [number, number, number], color: "#00ff00", label: "RX" },
        { pos: [0.9, 0.06, -0.7] as [number, number, number], color: "#00ff00", label: "PWR" },
      ].map((led, i) => (
        <group key={`led-${i}`}>
          <mesh position={led.pos} geometry={LED_GEO}>
            <meshStandardMaterial color={led.color} emissive={led.color} emissiveIntensity={4} toneMapped={false} />
          </mesh>
          <pointLight position={led.pos} intensity={0.3} color={led.color} distance={0.5} />
        </group>
      ))}

      {/* Capacitors */}
      {[
        [0.8, 0.08, 0.3] as [number, number, number],
        [-0.3, 0.08, -0.4] as [number, number, number],
      ].map((pos, i) => (
        <mesh key={`cap-${i}`} position={pos} geometry={CAP_GEO} castShadow>
          <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Voltage regulator */}
      <mesh position={[-0.5, 0.1, 0.65]} castShadow>
        <boxGeometry args={[0.12, 0.14, 0.05]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
});

export default ArduinoBoard3D;
