"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function BrainModel() {
  const group = useRef<THREE.Group>(null!);
  
  // Create nodes (spheres) and lines connecting them
  const nodeCount = 40;
  
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < nodeCount; i++) {
      temp.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ));
    }
    return temp;
  }, []);
  
  const lines = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 1.8) {
          points.push(nodes[i], nodes[j]);
        }
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.06, 8, 8), []);
  const nodeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#3B82F6",
    emissive: "#3B82F6",
    emissiveIntensity: 2,
    toneMapped: false
  }), []);
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: "#22C55E",
    transparent: true,
    opacity: 0.3
  }), []);

  useFrame((state, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.1;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={group}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos} geometry={nodeGeo} material={nodeMat} />
      ))}
      <lineSegments geometry={lines} material={lineMat} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#3B82F6" distance={10} />
    </group>
  );
}
