"use client";

import { useRef, useEffect, useMemo, Suspense, useState, lazy } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import { Float, ContactShadows, AdaptiveDpr, AdaptiveEvents, Preload, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { useCarouselLogic, BOARDS } from "@/hooks/useCarouselLogic";

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

const BOARD_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
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
      <mesh receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.04, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive={color}
          emissiveIntensity={isCenter ? 0.2 : 0.05}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Holographic ring */}
      <mesh position={[0, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.65, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isCenter ? 0.35 : 0.08}
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

  // Determine slot index
  const getSlot = () => {
    const count = BOARDS.length;
    if (index === activeIndex) return 1;
    if (index === (activeIndex - 1 + count) % count) return 0;
    if (index === (activeIndex + 1) % count) return 2;
    return 3;
  };

  useEffect(() => {
    if (!group.current) return;
    const pos = positions[getSlot()];
    gsap.to(group.current.position, { x: pos.x, z: pos.z, duration: 1.4, ease: "power3.inOut", onUpdate: invalidate });
    gsap.to(group.current.scale, { x: pos.scale, y: pos.scale, z: pos.scale, duration: 1.4, ease: "power3.inOut", onUpdate: invalidate });
    gsap.to(group.current.rotation, { y: pos.rotY, duration: 1.4, ease: "power3.inOut", onUpdate: invalidate });
  }, [activeIndex]);

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
      {isCenter ? (
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
          {boardContent}
        </Float>
      ) : (
        boardContent
      )}
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
        castShadow={!isMobile}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
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

      <ContactShadows
        position={[0, -0.16, 0]}
        opacity={0.35}
        scale={12}
        blur={2.5}
        far={4}
        resolution={isMobile ? 128 : 256}
      />

      <EffectComposer multisampling={isMobile ? 0 : 2}>
        <Bloom intensity={isMobile ? 0.3 : 0.5} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur={!isMobile} />
        <Vignette offset={0.3} darkness={0.4} eskil={false} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Preload all />
    </>
  );
}

/* ── Info panel overlay ── */
function BoardInfo({ board }: { board: (typeof BOARDS)[0] }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={board.id}
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <h3 className="text-2xl font-bold text-white sm:text-3xl">{board.name}</h3>
        <p className="mt-1 text-sm text-white/40">{board.subtitle}</p>
      </motion.div>
    </AnimatePresence>
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
          className="group relative flex h-8 w-8 items-center justify-center"
          aria-label={`Show ${board.name}`}
        >
          <motion.div
            animate={{
              scale: i === activeIndex ? 1 : 0.6,
              opacity: i === activeIndex ? 1 : 0.3,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: i === activeIndex ? board.color : "#ffffff" }}
          />
          {i === activeIndex && (
            <motion.div
              layoutId="dot-ring"
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: `${board.color}40` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
      <AnimatePresence mode="wait">
        <motion.div
          key={boards[activeIndex].id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-sm"
        >
          <div className="mx-auto mb-6 h-20 w-20 rounded-2xl" style={{ background: `linear-gradient(135deg, ${boards[activeIndex].color}20, ${boards[activeIndex].color}08)` }}>
            <div className="flex h-full items-center justify-center text-3xl font-bold" style={{ color: boards[activeIndex].color }}>
              {boards[activeIndex].name.charAt(0)}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">{boards[activeIndex].name}</h3>
          <p className="mt-2 text-sm text-white/40">{boards[activeIndex].subtitle}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex gap-3">
        {boards.map((b, i) => (
          <button key={b.id} onClick={() => goTo(i)} className="h-2 w-2 rounded-full transition-all" style={{ backgroundColor: i === activeIndex ? b.color : "rgba(255,255,255,0.2)", transform: i === activeIndex ? "scale(1.5)" : "scale(1)" }} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function BoardCarousel() {
  const { activeIndex, goTo, board, boards } = useCarouselLogic();
  const isMobile = useIsMobile();
  const [webglAvailable, setWebglAvailable] = useState(true);

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
        dpr={[1, 1.5]}
        gl={{
          antialias: !isMobile,
          powerPreference: isMobile ? "default" : "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.8,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        frameloop="demand"
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#030306"]} />
        <fog attach="fog" args={["#030306", 12, 28]} />
        <CarouselScene activeIndex={activeIndex} isMobile={isMobile} />
      </Canvas>

      <BoardInfo board={board} />
      <DotNav boards={boards} activeIndex={activeIndex} goTo={goTo} />

      {/* Arrow buttons (desktop only) */}
      <div className="hidden sm:block">
        <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-white/40 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:text-white" aria-label="Previous board">
          ‹
        </button>
        <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-white/40 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:text-white" aria-label="Next board">
          ›
        </button>
      </div>
    </div>
  );
}
