"use client";

import React from "react";

const VS_CODE = {
  keyword: '#569cd6',  // blue
  string: '#ce9178',  // orange
  comment: '#6a9955',  // green
  number: '#b5cea8',  // lt green
  function: '#dcdcaa',  // yellow
  builtin: '#4ec9b0',  // teal
  parameter: '#9cdcfe',  // lt blue
  operator: '#d4d4d4',  // white
  plain: '#d4d4d4',  // white
  bracket: '#ffd700',  // gold
};

const tokenize = (code: string): { text: string; color: string }[] => {
  if (!code.trim()) return [{ text: code || ' ', color: VS_CODE.plain }]

  const tokens: { text: string; color: string }[] = []
  let i = 0

  const KEYWORDS = /^(import|from|def|class|while|for|in|return|True|False|None|if|else|elif|try|except|with|as|pass|break|continue|lambda|yield|not|and|or|is)\b/
  const BUILTINS = /^(machine|utime|print|len|range|Pin|sleep|value|OUT|IN)\b/
  const COMMENT = /^(#.*)/
  const STRING = /^(["'])(?:(?!\1).)*\1/
  const NUMBER = /^(\d+\.?\d*)/
  const BRACKET = /^([\(\)\[\]\{\}])/
  const OPERATOR = /^([=\+\-\*\/\.,:<>!]+)/
  const FUNCTION = /^([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/
  const WORD = /^([a-zA-Z_][a-zA-Z0-9_]*)/
  const SPACE = /^( +)/

  while (i < code.length) {
    const rest = code.slice(i)
    let m: RegExpMatchArray | null

    if ((m = rest.match(COMMENT))) {
      tokens.push({ text: m[1], color: VS_CODE.comment }); i += m[1].length
    } else if ((m = rest.match(STRING))) {
      tokens.push({ text: m[0], color: VS_CODE.string }); i += m[0].length
    } else if ((m = rest.match(KEYWORDS))) {
      tokens.push({ text: m[1], color: VS_CODE.keyword }); i += m[1].length
    } else if ((m = rest.match(BUILTINS))) {
      tokens.push({ text: m[1], color: VS_CODE.builtin }); i += m[1].length
    } else if ((m = rest.match(FUNCTION))) {
      tokens.push({ text: m[1], color: VS_CODE.function }); i += m[1].length
    } else if ((m = rest.match(NUMBER))) {
      tokens.push({ text: m[1], color: VS_CODE.number }); i += m[1].length
    } else if ((m = rest.match(BRACKET))) {
      tokens.push({ text: m[1], color: VS_CODE.bracket }); i += m[1].length
    } else if ((m = rest.match(OPERATOR))) {
      tokens.push({ text: m[1], color: VS_CODE.operator }); i += m[1].length
    } else if ((m = rest.match(SPACE))) {
      tokens.push({ text: m[1], color: VS_CODE.plain }); i += m[1].length
    } else if ((m = rest.match(WORD))) {
      tokens.push({ text: m[1], color: VS_CODE.parameter }); i += m[1].length
    } else {
      tokens.push({ text: rest[0], color: VS_CODE.plain }); i++
    }
  }
  return tokens
}

const SyntaxLine = ({ code }: { code: string }) => (
  <div className="leading-5 whitespace-pre">
    {tokenize(code).map((t, i) => (
      <span key={i} style={{ color: t.color }}>{t.text}</span>
    ))}
  </div>
)

interface LaptopAnimationProps {
  lines: string[];
  currentLine: string;
  screenshot: string;
  lidAngle: number;
  screenOpacity: number;
}

export default function LaptopAnimation({ lines, currentLine, screenshot, lidAngle, screenOpacity }: LaptopAnimationProps) {
  return (
    <div className="laptop-scene select-none transition-all duration-300">
      {/* 3D Scene Wrapper */}
      <div
        className="laptop-scene-3d select-none transition-all duration-500 scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.95]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Cinematic Ambient Glow */}
        <div
          className="absolute -inset-10 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, var(--primary), transparent 70%)",
            opacity: screenOpacity * 0.2,
          }}
        />

        {/* Laptop Lid (rotating screen backplate) */}
        <div
          className="laptop-lid relative bg-[#181826] border-2 border-[#2c2c3e] shadow-2xl transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: "480px",
            height: "300px",
            borderRadius: "12px 12px 4px 4px",
            transformOrigin: "bottom center",
            transform: `rotateX(-${lidAngle}deg)`,
            overflow: "hidden",
            boxShadow: screenOpacity ? "0 0 60px rgba(66, 133, 244, 0.15)" : "none",
          }}
        >
          {/* Laptop Screen Content Container — FORCES DARK THEME ALWAYS */}
          <div
            className="laptop-screen w-full h-full relative transition-opacity duration-700"
            data-force-dark
            style={{
              opacity: screenOpacity,
              background: '#0a0a0f',
              color: '#d4d4d4',
              colorScheme: 'dark',
              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
              fontSize: '11px',
            }}
          >
            {/* Screen Inner Bezel Layout */}
            <div className="w-full h-full flex flex-col font-mono text-[10px]" style={{ background: '#0a0a0f' }}>

              {/* Titlebar */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#111118] border-b border-white/[0.04]">
                <div className="w-2 h-2 rounded-full" style={{ background: '#f87171' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#fbbf24' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#34d399' }} />
                <span className="ml-2 text-white/30 text-[9px] font-mono select-none">main.py — Stratum Studio</span>
              </div>

              {/* Editor Workspace */}
              <div className="flex flex-1 overflow-hidden relative" style={{ background: '#0a0a0f' }}>
                {/* Microcontroller Blueprint Background */}
                <img
                  src={screenshot}
                  alt="Stratum IDE Screenshot"
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.06] blur-[0.5px] pointer-events-none select-none"
                />

                {/* Live typewriter layout overlay with VS Code-style gutter */}
                <div className="relative z-10 p-4 flex-1 font-mono text-[11px] overflow-hidden leading-relaxed">
                  <div className="flex">
                    {/* Gutter */}
                    <div className="w-8 pr-2 text-right select-none" style={{ color: '#3c3c3c' }}>
                      {lines.map((_, i) => (
                        <div key={i} className="leading-5">{i + 1}</div>
                      ))}
                      <div className="leading-5">{lines.length + 1}</div>
                    </div>

                    {/* Code Editor Body */}
                    <div className="flex-1 pl-2 border-l border-[#1e293b]">
                      {lines.map((line, i) => (
                        <SyntaxLine key={i} code={line} />
                      ))}
                      <div className="leading-5 flex items-center">
                        <SyntaxLine code={currentLine} />
                        <span className="animate-[blink_1s_infinite] ml-0.5 select-none font-bold" style={{ color: '#818cf8' }}>▋</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="px-3 py-1.5 bg-[#111118] border-t border-white/[0.04] flex justify-between text-[9px] text-white/40">
                <span>● Raspberry Pi Pico W</span>
                <span className="text-[#34d399] font-semibold">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base (keyboard bottom plate) */}
        <div
          className="laptop-base relative bg-gradient-to-b from-[#252538] to-[#12121f] border-t border-white/[0.08]"
          style={{
            width: "496px",
            height: "12px",
            borderRadius: "0 0 16px 16px",
            transform: "rotateX(-5deg) translateY(-2px)",
            marginLeft: "-8px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(66, 133, 244, 0.08)",
          }}
        >
          {/* Trackpad cutout details */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[1px] w-28 h-1 rounded-b bg-[#1a1a2e]/60 border-t border-[#3b3b55]"
          />
        </div>
      </div>

      {/* Embedded style block to enforce dark bleed restriction */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        [data-force-dark] *:not([style*="color"]) {
          color: inherit;
        }
      `}</style>
    </div>
  );
}
