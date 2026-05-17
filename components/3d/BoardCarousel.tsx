"use client";

import { useRef, useEffect, useMemo, Suspense, useState, lazy } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import { useCarouselLogic, BOARDS } from "@/hooks/useCarouselLogic";
import { useTheme } from "@/hooks/useTheme";

/* ── Performance detection ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ── Lazy load board components ── */
const ArduinoBoard3D = lazy(() => import("./boards/ArduinoBoard3D"));
const PicoBoard3D = lazy(() => import("./boards/PicoBoard3D"));
const ESP32Board3D = lazy(() => import("./boards/ESP32Board3D"));
const STM32Board3D = lazy(() => import("./boards/STM32Board3D"));

const BOARD_COMPONENTS: Record<string, React.LazyExoticComponent<any>> = {
  arduino: ArduinoBoard3D,
  pico: PicoBoard3D,
  esp32: ESP32Board3D,
  stm32: STM32Board3D,
};

/* ── Glowing Platform ── */
function GlowPlatform({ color, isCenter }: { color: string; isCenter: boolean }) {
  return (
    <group position={[0, -0.12, 0]}>
      {/* Metallic disc */}
      <mesh>
        <cylinderGeometry args={[1.6, 1.6, 0.04, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive={color}
          emissiveIntensity={isCenter ? 0.25 : 0.08}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
      {/* Holographic ring */}
      <mesh position={[0, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.65, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isCenter ? 0.4 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ── Board with Platform ── */
function BoardSlot({
  index,
  activeIndex,
  board,
  isMobile,
}: {
  index: number;
  activeIndex: number;
  board: (typeof BOARDS)[0];
  isMobile: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const isCenter = index === activeIndex;

  const positions = useMemo(
    () => [
      { x: -4.5, z: -0.5, scale: 0.6, rotY: 0.25 },
      { x: 0, z: 2, scale: isMobile ? 0.9 : 1.3, rotY: 0 },
      { x: 4.5, z: -0.5, scale: 0.6, rotY: -0.25 },
      { x: 0, z: -4, scale: 0.2, rotY: 0 },
    ],
    [isMobile]
  );

  const getSlot = () => {
    const count = BOARDS.length;
    if (index === activeIndex) return 1;
    if (index === (activeIndex - 1 + count) % count) return 0;
    if (index === (activeIndex + 1) % count) return 2;
    return 3;
  };

  useFrame(() => {
    if (!group.current) return;
    const pos = positions[getSlot()];
    
    // Lerp position, scale, and rotation
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pos.x, 0.08);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, pos.z, 0.08);
    
    const currScale = group.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currScale, pos.scale, 0.08);
    group.current.scale.setScalar(newScale);
    
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pos.rotY, 0.08);
    
    // Float effect for center item
    if (isCenter) {
      group.current.position.y = Math.sin(Date.now() * 0.002) * 0.15;
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.08);
    }
  });

  // Initial position
  useEffect(() => {
    if (!group.current) return;
    const pos = positions[getSlot()];
    group.current.position.set(pos.x, 0, pos.z);
    group.current.scale.setScalar(pos.scale);
    group.current.rotation.y = pos.rotY;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const BoardComponent = BOARD_COMPONENTS[board.id];

  const boardContent = (
    <group>
      <Suspense fallback={
        <mesh>
          <boxGeometry args={[2, 0.08, 1.5]} />
          <meshStandardMaterial color={board.color} roughness={0.5} />
        </mesh>
      }>
        {BoardComponent && <BoardComponent />}
      </Suspense>
      <GlowPlatform color={board.color} isCenter={isCenter} />
    </group>
  );

  return (
    <group ref={group}>
      {boardContent}
    </group>
  );
}

/* ── Spotlight follows center ── */
function FollowSpot({ isMobile }: { isMobile: boolean }) {
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => { target.position.set(0, 0, 2); }, [target]);

  return (
    <>
      <primitive object={target} />
      <spotLight
        position={[0, 8, 5]}
        target={target}
        angle={0.3}
        penumbra={0.5}
        intensity={4}
        color="#e8eeff"
        distance={20}
      />
    </>
  );
}

/* ── Touch handler for mobile swipe ── */
function useTouchSwipe(onNext: () => void, onPrev: () => void) {
  const touchStart = useRef(0);
  
  useEffect(() => {
    const handleStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientX; };
    const handleEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) onPrev();
        else onNext();
      }
    };
    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [onNext, onPrev]);
}

/* ── Scene ── */
function CarouselScene({ activeIndex, isMobile }: { activeIndex: number; isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 3]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 5, -3]} intensity={0.8} color="#4488ff" />
      <hemisphereLight args={["#1a3a6e", "#0a1a0a", 0.6]} />
      <FollowSpot isMobile={isMobile} />

      {BOARDS.map((board, i) => (
        <BoardSlot key={board.id} index={i} activeIndex={activeIndex} board={board} isMobile={isMobile} />
      ))}

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

/* ── Info panel overlay ── */
function BoardInfo({ board }: { board: (typeof BOARDS)[0] }) {
  return (
    <div
      key={board.id}
      className="pointer-events-none absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-center animate-fade-up"
    >
      <h3 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--text)" }}>{board.name}</h3>
      <p className="mt-1 text-sm font-medium" style={{ color: "var(--text-muted)" }}>{board.subtitle}</p>
    </div>
  );
}

/* ── Dot navigation ── */
function DotNav({ boards, activeIndex, goTo }: { boards: typeof BOARDS; activeIndex: number; goTo: (i: number) => void }) {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2.5">
      {boards.map((board, i) => (
        <button
          key={board.id}
          onClick={() => goTo(i)}
          className="group relative flex h-8 w-8 items-center justify-center cursor-pointer"
          aria-label={`Show ${board.name}`}
        >
          <div
            className="h-2 w-2 rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ 
              backgroundColor: i === activeIndex ? board.color : "var(--text)",
              transform: i === activeIndex ? 'scale(1.2)' : 'scale(0.8)',
              opacity: i === activeIndex ? 1 : 0.3
            }}
          />
          {i === activeIndex && (
            <div
              className="absolute inset-0 rounded-full border transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ borderColor: `${board.color}40` }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── WebGL Fallback ── */
function BoardFallback2D({ boards, activeIndex, goTo }: { boards: typeof BOARDS; activeIndex: number; goTo: (i: number) => void }) {
  return (
    <div className="relative h-[70vh] flex flex-col items-center justify-center px-6">
      <div
        key={boards[activeIndex].id}
        className="relative w-full max-w-sm rounded-3xl p-8 text-center backdrop-blur-xl animate-fade-up"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="mx-auto mb-6 h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
          style={{ background: `linear-gradient(135deg, ${boards[activeIndex].color}20, ${boards[activeIndex].color}08)`, color: boards[activeIndex].color }}>
          {boards[activeIndex].name.charAt(0)}
        </div>
        <h3 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{boards[activeIndex].name}</h3>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{boards[activeIndex].subtitle}</p>
      </div>
      <div className="mt-6 flex gap-3">
        {boards.map((b, i) => (
          <button key={b.id} onClick={() => goTo(i)} className="h-2.5 w-2.5 rounded-full transition-all"
            style={{ backgroundColor: i === activeIndex ? b.color : "var(--border-strong)", transform: i === activeIndex ? "scale(1.3)" : "scale(1)" }} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function BoardCarousel() {
  const { activeIndex, goTo, board, boards } = useCarouselLogic();
  const isMobile = useIsMobile();
  const theme = useTheme();
  const [webglAvailable, setWebglAvailable] = useState(true);

  const bgColor = theme === "dark" ? "#060610" : "#ffffff";

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebglAvailable(false);
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  const handleNext = () => goTo((activeIndex + 1) % boards.length);
  const handlePrev = () => goTo((activeIndex - 1 + boards.length) % boards.length);
  useTouchSwipe(handleNext, handlePrev);

  if (!webglAvailable) {
    return <BoardFallback2D boards={boards} activeIndex={activeIndex} goTo={goTo} />;
  }

  return (
    <div className="relative h-[80vh] w-full">
      <Canvas
        camera={{ position: [0, 3, 7], fov: isMobile ? 55 : 42 }}
        dpr={[1, 1]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.8,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        frameloop="always"
        performance={{ min: 0.1 }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 12, 28]} />
        <CarouselScene activeIndex={activeIndex} isMobile={isMobile} />
      </Canvas>

      <BoardInfo board={board} />
      <DotNav boards={boards} activeIndex={activeIndex} goTo={goTo} />

      {/* Arrow buttons (desktop only) */}
      <div className="hidden sm:block">
        <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            boxShadow: "var(--shadow)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          aria-label="Previous board">
          ‹
        </button>
        <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            boxShadow: "var(--shadow)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          aria-label="Next board">
          ›
        </button>
      </div>
    </div>
  );
}
