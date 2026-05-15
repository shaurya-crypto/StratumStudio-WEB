"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ── Constants ── */
const EASE = [0.16, 1, 0.3, 1] as const;
const PROVIDERS = [
  { name: "OpenAI", color: "#10A37F", icon: "◆", desc: "GPT-4o · o3-mini" },
  { name: "Anthropic", color: "#D4A574", icon: "◈", desc: "Claude Opus 4" },
  { name: "Google Gemini", color: "#4285F4", icon: "✦", desc: "Gemini 2.5 Pro" },
  { name: "Groq", color: "#F55036", icon: "⚡", desc: "Llama 3.3 70B" },
  { name: "DeepSeek", color: "#4D6BFE", icon: "◎", desc: "DeepSeek R1" },
  { name: "Mistral", color: "#FF7000", icon: "✧", desc: "Mistral Large" },
];
const API_KEY = "sk-proj-a8F3kL9mN2pQ5rT7vX0yB4cD6eG8hJ1wU3iO";
const LOOP_DURATION = 22000;

/* ── Ambient Particles (client-side only to avoid hydration mismatch) ── */
function AmbientParticles() {
  const [particles, setParticles] = useState<{id:number;left:string;top:string;size:number;delay:number;duration:number}[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${(i * 6.25 + Math.random() * 5) % 100}%`,
      top: `${(i * 6.25 + Math.random() * 5) % 100}%`,
      size: 1 + Math.random() * 1.5,
      delay: i * 0.3,
      duration: 5 + i * 0.5,
    })));
  }, []);
  if (!particles.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-[#3B82F6]/15"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Provider Card ── */
function ProviderCard({ provider, index, isSelected, isHovered, dimmed }: {
  provider: typeof PROVIDERS[0]; index: number;
  isSelected: boolean; isHovered: boolean; dimmed: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{
        opacity: dimmed ? 0.25 : 1,
        y: isSelected ? -16 : 0,
        scale: isSelected ? 1.06 : isHovered ? 1.02 : 1,
      }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
      className="relative"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500"
        style={{
          background: isSelected
            ? `linear-gradient(135deg,${provider.color}50,${provider.color}15,${provider.color}35)`
            : isHovered
            ? "linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))"
            : "rgba(255,255,255,0.03)",
          boxShadow: isSelected ? `0 0 50px ${provider.color}18,0 16px 32px rgba(0,0,0,0.25)` : "none",
        }}
      >
        <div className="relative rounded-2xl bg-[#08090f]/92 backdrop-blur-xl p-5">
          {(isSelected || isHovered) && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ boxShadow: `inset 0 0 16px ${provider.color}08` }} />
          )}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold"
              style={{
                background: `linear-gradient(135deg,${provider.color}18,${provider.color}06)`,
                color: provider.color,
                boxShadow: isSelected ? `0 0 16px ${provider.color}25` : "none",
              }}
            >{provider.icon}</div>
            <div>
              <div className="text-sm font-semibold text-white">{provider.name}</div>
              <div className="text-[11px] text-white/25">{provider.desc}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/25">Latency</span>
              <span className="text-white/40">~{35 + index * 12}ms</span>
            </div>
            <div className="h-0.5 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div className="h-full rounded-full" style={{ background: provider.color }}
                initial={{ width: "0%" }}
                animate={{ width: `${88 - index * 7}%` }}
                transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: EASE }}
              />
            </div>
          </div>
          <AnimatePresence>
            {isSelected && (
              <motion.div className="pointer-events-none absolute inset-0 rounded-2xl"
                initial={{ boxShadow: `0 0 0 0px ${provider.color}35` }}
                animate={{ boxShadow: `0 0 0 10px ${provider.color}00` }}
                transition={{ duration: 1, ease: "easeOut" }} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Animated Cursor ── */
function Cursor({ x, y, clicking, visible }: { x: number; y: number; clicking: boolean; visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div className="pointer-events-none absolute z-50"
      animate={{ x, y, opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" className="drop-shadow-lg">
        <path d="M0 0 L0 16 L4.5 12 L8.5 19 L11 18 L7 11 L12 11 Z"
          fill="white" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      </svg>
      <AnimatePresence>
        {clicking && (
          <motion.div className="absolute -left-2 -top-2 h-5 w-5 rounded-full border border-white/25"
            initial={{ scale: 0.5, opacity: 0.7 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5 }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Premium CTA Button ── */
function CTAButton({ label, active, hovered, clicked }: {
  label: string; active: boolean; hovered: boolean; clicked: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 0 : 10,
        scale: clicked ? 0.96 : hovered ? 1.04 : 1,
      }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative mt-6 flex justify-center"
    >
      <div className={`relative overflow-hidden rounded-xl px-8 py-2.5 text-sm font-semibold text-white transition-all duration-300
        ${hovered ? "shadow-[0_0_30px_rgba(59,130,246,0.2)]" : ""}`}
        style={{
          background: hovered
            ? "linear-gradient(135deg,#3B82F6,#2563eb)"
            : "linear-gradient(135deg,#3B82F6cc,#2563ebcc)",
        }}
      >
        {hovered && (
          <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer-sweep_0.7s_ease-out_forwards] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        )}
        {label}
      </div>
      {clicked && (
        <motion.div className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-8 w-8 rounded-full border border-[#3B82F6]/30" />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── API Key Input ── */
function APIKeyInput({ active, typedChars }: { active: boolean; typedChars: number }) {
  const displayKey = API_KEY.slice(0, typedChars);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mt-5"
    >
      <label className="mb-1.5 block text-[11px] font-medium text-white/30">API Key</label>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 font-mono text-sm text-white/70 backdrop-blur-sm">
        {displayKey}
        <motion.span
          className="inline-block h-4 w-[1.5px] bg-[#3B82F6] align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
        {active && (
          <div className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ boxShadow: "inset 0 0 12px rgba(59,130,246,0.04)" }} />
        )}
      </div>
    </motion.div>
  );
}

/* ── AI Workspace ── */
function AIWorkspace({ active }: { active: boolean }) {
  const codeLines = [
    { kw: "import", txt: " machine" },
    { kw: "from", txt: " Pin " },
    { kw: "", txt: "" },
    { kw: "def", txt: " blink():" },
    { kw: "  ", txt: "led = Pin(25, Pin.OUT)" },
    { kw: "  while", txt: " True:" },
    { kw: "    ", txt: "led.toggle()" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.95 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mt-4 space-y-3"
    >
      {/* Code panel */}
      <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-[#0a0b14]/80">
        <div className="flex items-center gap-1.5 border-b border-white/[0.03] px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ef4444]/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]/60" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E]/60" />
          <span className="ml-2 text-[9px] text-white/20 font-mono">main.py — AI Generated</span>
        </div>
        <div className="p-3 font-mono text-[10px] leading-5">
          {codeLines.map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : -8 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4, ease: EASE }}
            >
              {line.kw && <span className="text-[#c084fc]">{line.kw}</span>}
              <span className="text-white/50">{line.txt}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-4">
        <motion.div className="flex items-center gap-1.5"
          animate={{ opacity: active ? [0.3, 1, 0.3] : 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          <span className="text-[10px] text-white/30">AI generating...</span>
        </motion.div>
        <div className="flex-1 h-px bg-white/[0.03]" />
        <span className="text-[10px] text-white/15 font-mono">247 tokens</span>
      </div>

      {/* Title reveal */}
      <motion.div className="pt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
        transition={{ delay: 1.5, duration: 0.8, ease: EASE }}
      >
        <h3 className="text-lg font-bold text-white" style={{ animation: active ? "breathe-glow 3s ease-in-out infinite" : "none" }}>
          Stratum Studio <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">AI</span>
        </h3>
        <p className="mt-1 text-[11px] text-white/25">Intelligent workflow orchestration.</p>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT — Cinematic Loop Controller
   ════════════════════════════════════════════ */
export default function AIProviderShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.15 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const loopRef = useRef<number>(0);
  const [phase, setPhase] = useState(0);
  // 0=dark, 1=dashboard, 2=cards, 3=hover, 4=selected, 5=continue-hover,
  // 6=continue-click, 7=api-input, 8=typing, 9=continue2-hover, 10=continue2-click,
  // 11=workspace, 12=fadeout
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: -30, y: -30 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnClick, setBtnClick] = useState(false);
  const [apiActive, setApiActive] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [btn2Hover, setBtn2Hover] = useState(false);
  const [btn2Click, setBtn2Click] = useState(false);
  const [workspaceActive, setWorkspaceActive] = useState(false);

  const reset = useCallback(() => {
    setPhase(0); setHoveredIdx(-1); setSelectedIdx(-1);
    setCursorPos({ x: -30, y: -30 }); setCursorVisible(false);
    setClicking(false); setBtnHover(false); setBtnClick(false);
    setApiActive(false); setTypedChars(0);
    setBtn2Hover(false); setBtn2Click(false); setWorkspaceActive(false);
  }, []);

  // Main cinematic sequence — starts on mount OR when scrolled into view
  const shouldPlay = mounted || isInView;
  useEffect(() => {
    if (!shouldPlay) return;
    let cancelled = false;
    const d = (ms: number) => new Promise<void>((r) => {
      const t = setTimeout(() => { if (!cancelled) r(); }, ms);
      loopRef.current = t as any;
    });

    const run = async () => {
      while (!cancelled) {
        reset();
        await d(400);

        // Part 1: Dashboard wakeup
        setPhase(1); await d(1200);
        setPhase(2); await d(800);

        // Part 2: Card hover sequence
        setCursorVisible(true);
        setCursorPos({ x: 70, y: 130 }); await d(600);
        setHoveredIdx(0); await d(900);
        setHoveredIdx(-1); setCursorPos({ x: 350, y: 130 }); await d(500);
        setHoveredIdx(2); await d(700);
        setHoveredIdx(-1); setCursorPos({ x: 210, y: 290 }); await d(400);
        setHoveredIdx(4); await d(600);
        // Back to Gemini and select
        setHoveredIdx(-1); setCursorPos({ x: 350, y: 130 }); await d(400);
        setHoveredIdx(2); await d(500);
        setClicking(true); await d(80);
        setClicking(false); setSelectedIdx(2); setPhase(4); await d(1200);

        // Part 3: Continue button
        setBtnHover(false); setPhase(5);
        setCursorPos({ x: 280, y: 410 }); await d(500);
        setBtnHover(true); await d(600);
        setClicking(true); setBtnClick(true); await d(80);
        setClicking(false); setBtnClick(false); setPhase(6); await d(500);

        // Part 4: API key entry
        setApiActive(true); setPhase(7);
        setCursorPos({ x: 280, y: 450 }); await d(400);
        setClicking(true); await d(80); setClicking(false); await d(300);
        // Type key
        for (let i = 1; i <= API_KEY.length && !cancelled; i++) {
          setTypedChars(i);
          await d(30 + Math.random() * 40);
          if (i === 7 || i === 15 || i === 25) await d(150); // human pauses
        }
        setPhase(8); await d(800);

        // Part 5: Second continue
        setCursorPos({ x: 280, y: 530 }); await d(400);
        setBtn2Hover(true); await d(500);
        setClicking(true); setBtn2Click(true); await d(80);
        setClicking(false); setBtn2Click(false); setPhase(10); await d(400);

        // Part 6: AI workspace
        setWorkspaceActive(true); setCursorVisible(false); setPhase(11); await d(4000);

        // Fadeout for loop
        setPhase(12); await d(1500);
      }
    };
    run();
    return () => { cancelled = true; clearTimeout(loopRef.current); };
  }, [shouldPlay, reset]);

  const showCards = phase >= 2 && phase < 12;
  const showBtn1 = phase >= 4 && phase < 7;
  const showApiInput = phase >= 7 && phase < 11;
  const showBtn2 = phase >= 8 && phase < 11;
  const showWorkspace = phase >= 11 && phase < 12;

  return (
    <section className="relative overflow-hidden py-28 px-6" ref={containerRef}>
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/[0.015] to-transparent" />
        <motion.div className="gradient-orb gradient-orb-3"
          animate={{ opacity: phase >= 1 ? 0.08 : 0 }}
          transition={{ duration: 2 }}
        />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-4 py-1.5 text-xs font-medium tracking-widest text-[#8B5CF6] uppercase">
            AI-Powered
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built-in{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
              AI Agent
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/30 text-sm">
            Connect any provider. Let AI write, debug, and deploy your firmware.
          </p>
        </motion.div>

        {/* ── Cinematic Dashboard Frame ── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={shouldPlay ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
        >
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/[0.04] bg-[#06070c]/70 backdrop-blur-sm"
            animate={{
              opacity: phase === 12 ? 0.3 : phase >= 1 ? 1 : 0.4,
              scale: phase === 6 || phase === 10 ? 1.02 : phase === 12 ? 0.97 : 1,
              y: phase === 6 || phase === 10 ? -4 : 0,
            }}
            transition={{ duration: 1.2, ease: EASE }}
            style={{ transformOrigin: "center center" }}
          >
            <AmbientParticles />

            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent" />

            <div className="relative p-6 sm:p-10">
              {/* Top bar */}
              <motion.div className="mb-6 flex items-center gap-2"
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="h-2 w-2 rounded-full bg-white/8" />
                <div className="h-2 w-2 rounded-full bg-white/8" />
                <div className="h-2 w-2 rounded-full bg-white/8" />
                <span className="ml-2 text-[11px] text-white/15 font-mono">
                  {showWorkspace ? "AI Workspace" : showApiInput ? "Authentication" : "Select AI Provider"}
                </span>
                <div className="ml-auto flex gap-1">
                  <motion.div className="h-1 w-1 rounded-full bg-[#22C55E]"
                    animate={{ opacity: phase >= 1 ? [0.3, 1, 0.3] : 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              </motion.div>

              {/* ── Cards Grid ── */}
              {showCards && !showWorkspace && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROVIDERS.map((p, i) => (
                    <ProviderCard key={p.name} provider={p} index={i}
                      isSelected={selectedIdx === i}
                      isHovered={hoveredIdx === i}
                      dimmed={selectedIdx !== -1 && selectedIdx !== i}
                    />
                  ))}
                </div>
              )}

              {/* ── Continue Button 1 ── */}
              {showBtn1 && !showApiInput && !showWorkspace && (
                <CTAButton label="Continue →" active={true} hovered={btnHover} clicked={btnClick} />
              )}

              {/* ── API Key Input ── */}
              {showApiInput && !showWorkspace && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 text-center"
                  >
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-1.5">
                      <span className="text-xs" style={{ color: PROVIDERS[2].color }}>{PROVIDERS[2].icon}</span>
                      <span className="text-xs text-white/50">{PROVIDERS[2].name} selected</span>
                    </div>
                  </motion.div>
                  <APIKeyInput active={apiActive} typedChars={typedChars} />
                  {showBtn2 && (
                    <CTAButton label="Connect & Start →" active={true} hovered={btn2Hover} clicked={btn2Click} />
                  )}
                </>
              )}

              {/* ── AI Workspace ── */}
              {showWorkspace && <AIWorkspace active={workspaceActive} />}

              {/* ── Cursor ── */}
              <Cursor x={cursorPos.x} y={cursorPos.y} clicking={clicking} visible={cursorVisible} />

              {/* Selection confirmation line */}
              {selectedIdx !== -1 && !showApiInput && !showWorkspace && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-6 flex items-center justify-center gap-3"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#4285F4]/15" />
                  <span className="text-[11px] text-white/30">
                    <span style={{ color: PROVIDERS[selectedIdx].color }}>{PROVIDERS[selectedIdx].name}</span> ready
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#4285F4]/15" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Feature bullets */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["Context-aware autocomplete", "One-click bug fixes", "Code documentation", "Multi-file refactoring"].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
              className="flex items-center gap-2 text-xs text-white/35"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#3B82F6]/8 text-[#3B82F6]">
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
