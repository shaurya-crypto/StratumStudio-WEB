"use client";

import { useRef, useState, useEffect } from "react";

const useTypewriter = (text: string, speed = 50, onDone?: () => void) => {
  const [displayed, setDisplayed] = useState('');
  const onDoneRef = useRef(onDone);
  
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);
  
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (onDoneRef.current) onDoneRef.current();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return displayed;
};

const PROVIDERS = [
  { name: "OpenAI", color: "#10A37F", icon: "◆", desc: "GPT-4o · o3" },
  { name: "Anthropic", color: "#D4A574", icon: "◈", desc: "Claude Opus 4" },
  { name: "Gemini", color: "#4285F4", icon: "✦", desc: "Gemini 2.5 Pro" },
  { name: "Groq", color: "#F55036", icon: "⚡", desc: "Llama 3.3 70B" },
  { name: "DeepSeek", color: "#4D6BFE", icon: "◎", desc: "DeepSeek R1" },
  { name: "Mistral", color: "#FF7000", icon: "✧", desc: "Mistral Large" },
];

const SELECTED = 2; // Gemini

/* ── Cursor ── */
function AnimCursor({ x, y, clicking, visible }: { x: number; y: number; clicking: boolean; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute z-50 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
      style={{ transform: `translate(${x}px, ${y}px)` }}>
      <svg width="18" height="18" viewBox="0 0 20 20" className="drop-shadow-lg">
        <path d="M0 0 L0 16 L4.5 12 L8.5 19 L11 18 L7 11 L12 11 Z" fill="var(--text)" stroke="var(--bg)" strokeWidth="1" />
      </svg>
      {clicking && (
        <div className="absolute -left-2 -top-2 h-5 w-5 rounded-full border border-current animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_1]"
          style={{ color: "var(--primary)" }} />
      )}
    </div>
  );
}

/* ── Step 0: Provider Grid ── */
function ProvidersView({ hoveredIdx, selectedIdx }: {
  hoveredIdx: number; selectedIdx: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-up">
      {PROVIDERS.map((p, i) => {
        const isHovered = hoveredIdx === i;
        const isSelected = selectedIdx === i;
        const dimmed = selectedIdx !== -1 && selectedIdx !== i;
        return (
          <div key={p.name}
            className={`transition-all duration-500`}
            style={{ 
              opacity: dimmed ? 0.25 : 1, 
              transform: `translateY(${isSelected ? -12 : 0}px) scale(${isSelected ? 1.06 : isHovered ? 1.02 : 1})`,
              animationDelay: `${i * 0.06}s`, animationFillMode: "both"
            }}>
            <div className="relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500" style={{
              background: isSelected ? `linear-gradient(135deg,${p.color}50,${p.color}15,${p.color}35)`
                : isHovered ? "linear-gradient(135deg, var(--primary) 20%, transparent)"
                : "var(--border)",
              boxShadow: isSelected ? `0 0 50px ${p.color}18` : "none",
            }}>
              <div className="rounded-2xl p-5 backdrop-blur-xl" style={{ background: "var(--bg-elevated)" }}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold" style={{
                    background: `linear-gradient(135deg,${p.color}18,${p.color}06)`, color: p.color,
                    boxShadow: isSelected ? `0 0 16px ${p.color}25` : "none",
                  }}>{p.icon}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.name}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.desc}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span style={{ color: "var(--text-muted)" }}>Latency</span>
                    <span style={{ color: "var(--text-subtle)" }}>~{35 + i * 12}ms</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ background: p.color, width: `${88 - i * 7}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Step 1: API Key ── */
function APIKeyView({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex h-full items-center justify-center animate-fade-up">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-lg" style={{ color: PROVIDERS[SELECTED].color }}>{PROVIDERS[SELECTED].icon}</span>
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{PROVIDERS[SELECTED].name}</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>selected</span>
        </div>
        <label className="mb-2 block text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>API Key</label>
        <div className="relative overflow-hidden rounded-xl px-4 py-3 font-mono text-sm backdrop-blur-sm"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}>
          <span>{useTypewriter("AIzaSyC_x8kP3nQ7vR2mL5wT9uJ4dF6hG0bK1eY", 60, onDone)}<span className="animate-pulse" style={{ color: "var(--primary)" }}>|</span></span>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="rounded-xl px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #4285f4, #3b78e7)" }}>
            Continue →
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: AI Chat Bar ── */
function ChatBarView({ onDone }: { onDone: () => void }) {
  return (
    <div className="flex h-full items-center justify-center animate-fade-up">
      <div className="w-full max-w-xl">
        <div className="mb-3 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="h-1.5 w-1.5 rounded-full dot-green animate-pulse" />
          Connected to {PROVIDERS[SELECTED].name}
        </div>
        <div className="overflow-hidden rounded-2xl p-4 backdrop-blur-sm"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="mb-3 text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>AI Assistant</div>
          <div className="rounded-xl px-4 py-3 text-sm font-mono"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text)" }}>
            <span>{useTypewriter("Write a blink LED program for Raspberry Pi Pico in MicroPython", 45, () => setTimeout(() => onDone && onDone(), 1500))}<span className="animate-pulse" style={{ color: "var(--primary)" }}>|</span></span>
          </div>
          <div className="mt-3 flex justify-end">
            <div className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>Send ↵</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: Code Editor ── */
function EditorView() {
  const CODE = `from machine import Pin\nfrom time import sleep\n\nled = Pin(25, Pin.OUT)\n\nwhile True:\n    led.toggle()\n    sleep(0.5)`;

  return (
    <div className="h-full animate-fade-up">
      <div className="overflow-hidden rounded-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div className="flex items-center gap-1.5 px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="h-2 w-2 rounded-full dot-red" />
          <div className="h-2 w-2 rounded-full dot-yellow" />
          <div className="h-2 w-2 rounded-full dot-green" />
          <span className="ml-2 text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>main.py — AI Generated</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full dot-green animate-pulse" />
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>Pico W Connected</span>
          </div>
        </div>
        <div className="p-4 font-mono text-[12px] leading-6">
            <div className="whitespace-pre font-mono" style={{ color: "#34a853" }}>
              {useTypewriter(CODE, 75)}<span className="animate-pulse" style={{ color: "var(--primary)" }}>|</span>
            </div>
        </div>
        <div className="flex items-center gap-4 px-4 py-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-1.5 animate-pulse">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>AI generating...</span>
          </div>
          <div className="flex-1 h-px animate-pulse" style={{ background: "var(--border)" }} />
          <span className="text-[10px] font-mono" style={{ color: "var(--text-subtle)" }}>142 tokens</span>
        </div>
      </div>
      {/* Title reveal */}
      <div className="mt-6 text-center animate-fade-up" style={{ animationDelay: "2s", animationFillMode: "both" }}>
        <h3 className="text-lg font-bold" style={{ color: "var(--text)", animation: "breathe-glow 3s ease-in-out infinite" }}>
          Stratum Studio <span className="bg-gradient-to-r from-[#4285f4] to-[#8b9ef8] bg-clip-text text-transparent">AI</span>
        </h3>
        <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>Intelligent workflow orchestration.</p>
      </div>
    </div>
  );
}

/* ── Ambient Particles (client-only) ── */
function Particles() {
  const [pts, setPts] = useState<{ id: number; left: string; top: string; size: number; delay: number; dur: number }[]>([]);
  useEffect(() => {
    setPts(Array.from({ length: 14 }, (_, i) => ({
      id: i, left: `${(i * 7.1) % 100}%`, top: `${(i * 7.1 + 13) % 100}%`,
      size: 1 + (i % 3) * 0.5, delay: i * 0.3, dur: 5 + i * 0.4,
    })));
  }, []);
  if (!pts.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pts.map((p) => (
        <div key={p.id} className="absolute rounded-full"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size,
            background: "var(--primary)", opacity: 0.08,
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Main Export ── */
export default function AIProviderShowcase() {
  const [step, setStep] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: -30, y: -30 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  // Auto-restart loop
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => {
        setStep(0); setHoveredIdx(-1); setSelectedIdx(-1);
        setCursorVisible(false); setClicking(false);
        setCursorPos({ x: -30, y: -30 });
      }, 8000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Cursor choreography for step 0
  useEffect(() => {
    if (step !== 0) return;
    let cancelled = false;
    const d = (ms: number) => new Promise<void>((r) => { const t = setTimeout(() => { if (!cancelled) r(); }, ms); });

    (async () => {
      await d(800);
      if (cancelled) return;
      setCursorVisible(true);

      // Hover OpenAI
      setCursorPos({ x: 80, y: 100 }); await d(500);
      if (cancelled) return; setHoveredIdx(0); await d(700);

      // Hover Gemini
      if (cancelled) return; setHoveredIdx(-1);
      setCursorPos({ x: 350, y: 100 }); await d(400);
      if (cancelled) return; setHoveredIdx(2); await d(600);

      // Hover DeepSeek
      if (cancelled) return; setHoveredIdx(-1);
      setCursorPos({ x: 200, y: 260 }); await d(400);
      if (cancelled) return; setHoveredIdx(4); await d(500);

      // Back to Gemini — select
      if (cancelled) return; setHoveredIdx(-1);
      setCursorPos({ x: 350, y: 100 }); await d(350);
      if (cancelled) return; setHoveredIdx(2); await d(400);
      setClicking(true); await d(80); setClicking(false);
      setSelectedIdx(SELECTED); await d(1000);

      // Transition to step 1
      if (!cancelled) { setCursorVisible(false); setStep(1); }
    })();

    return () => { cancelled = true; };
  }, [step]);

  return (
    <section className="relative overflow-hidden py-28 px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center animate-fade-up">
          <span className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-medium tracking-widest uppercase"
            style={{ borderColor: "var(--border-strong)", background: "var(--bg-secondary)", color: "var(--primary)" }}>
            AI-Powered
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--text)" }}>
            Built-in <span className="bg-gradient-to-r from-[#4285f4] via-[#ea4335] to-[#34a853] bg-clip-text text-transparent">AI Agent</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm" style={{ color: "var(--text-muted)" }}>
            Connect any provider. Let AI write, debug, and deploy your firmware.
          </p>
        </div>

        {/* Dashboard Frame — fixed height */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl transition-all duration-300"
          style={{ minHeight: 480, background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
          <Particles />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.008] via-transparent to-transparent" />

          <div className="relative p-6 sm:p-10" style={{ minHeight: 480 }}>
            {/* Top bar */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full dot-red" />
              <div className="h-2.5 w-2.5 rounded-full dot-yellow" />
              <div className="h-2.5 w-2.5 rounded-full dot-green" />
              <span className="ml-2 text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                {step === 0 ? "Select AI Provider" : step === 1 ? "Authentication" : step === 2 ? "AI Assistant" : "Workspace"}
              </span>
              <div className="ml-auto"><div className="h-1.5 w-1.5 rounded-full dot-green animate-pulse" /></div>
            </div>

            {/* State Machine Views */}
            <div className="relative">
              <div className={`transition-all duration-500 absolute w-full ${step === 0 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                {step === 0 && <ProvidersView hoveredIdx={hoveredIdx} selectedIdx={selectedIdx} />}
              </div>
              <div className={`transition-all duration-500 absolute w-full ${step === 1 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                {step === 1 && <APIKeyView onDone={() => setStep(2)} />}
              </div>
              <div className={`transition-all duration-500 absolute w-full ${step === 2 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                {step === 2 && <ChatBarView onDone={() => setStep(3)} />}
              </div>
              <div className={`transition-all duration-500 absolute w-full ${step === 3 ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                {step === 3 && <EditorView />}
              </div>
            </div>

            {/* Cursor */}
            <AnimCursor x={cursorPos.x} y={cursorPos.y} clicking={clicking} visible={cursorVisible} />
          </div>
        </div>

        {/* Feature bullets */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["Context-aware autocomplete", "One-click bug fixes", "Code documentation", "Multi-file refactoring"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both", color: "var(--text-muted)" }}>
              <div className="flex h-5 w-5 items-center justify-center rounded-full text-[#4285f4]" style={{ background: "rgba(66, 133, 244, 0.08)" }}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}