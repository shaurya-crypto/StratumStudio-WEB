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
  <div className="leading-4 whitespace-pre text-[9px]">
    {tokenize(code).map((t, i) => (
      <span key={i} style={{ color: t.color }}>{t.text}</span>
    ))}
  </div>
)

interface PhoneAnimationProps {
  lines: string[];
  currentLine: string;
  screenshot: string;
  screenOpacity: number;
}

export default function PhoneAnimation({ lines, currentLine, screenshot, screenOpacity }: PhoneAnimationProps) {
  return (
    <div className="phone-scene select-none transition-all duration-300">
      {/* Phone chassis */}
      <div className="phone relative bg-gradient-to-br from-white/10 to-white/2 border border-white/12 shadow-2xl backdrop-blur-[30px] overflow-hidden">
        
        {/* Notch */}
        <div className="phone-notch absolute top-[10px] left-1/2 -translate-x-1/2 w-[90px] h-[22px] rounded-full bg-[#111] z-50 flex items-center justify-center border border-white/5">
          {/* Subtle camera dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40 ml-4" />
        </div>

        {/* Screen with dynamic, liquid-smooth opacity transitions */}
        <div 
          className="phone-screen m-[8px] rounded-[30px] overflow-hidden bg-[#0a0a0f] h-[calc(100%-16px)] relative border border-black/80 transition-opacity duration-700 ease-in-out"
          style={{ opacity: screenOpacity }}
        >
          
          {/* Mini IDE viewport layout */}
          <div className="w-full h-full flex flex-col font-mono text-[9px] relative" data-force-dark style={{ background: '#0a0a0f', color: '#d4d4d4' }}>
            
            {/* Titlebar (Header) */}
            <div className="flex items-center gap-1.5 px-3 pt-9 pb-2 bg-[#111118] border-b border-white/[0.04]">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f87171' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#fbbf24' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399' }} />
              <span className="ml-1.5 text-white/30 text-[8px] font-mono select-none">main.py</span>
            </div>

            {/* Editor Workspace */}
            <div className="flex flex-1 overflow-hidden relative" style={{ background: '#0a0a0f' }}>
              {/* Microcontroller Blueprint Background */}
              <img 
                src={screenshot} 
                alt="Stratum IDE Screenshot"
                className="absolute inset-0 w-full h-full object-cover opacity-[0.06] blur-[0.5px] pointer-events-none select-none" 
              />
              
              {/* Typewriter layout inside phone */}
              <div className="relative z-10 p-3 pt-4 flex-1 font-mono text-[9px] overflow-hidden leading-relaxed">
                <div className="flex">
                  {/* Gutter */}
                  <div className="w-6 pr-1.5 text-right select-none" style={{ color: '#3c3c3c' }}>
                    {lines.map((_, i) => (
                      <div key={i} className="leading-4">{i + 1}</div>
                    ))}
                    <div className="leading-4">{lines.length + 1}</div>
                  </div>

                  {/* Code Editor Body */}
                  <div className="flex-1 pl-1.5 border-l border-[#1e293b]">
                    {lines.map((line, i) => (
                      <SyntaxLine key={i} code={line} />
                    ))}
                    <div className="leading-4 flex items-center">
                      <SyntaxLine code={currentLine} />
                      <span className="animate-[blink_1s_infinite] ml-0.5 select-none font-bold" style={{ color: '#818cf8' }}>▋</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status bar */}
            <div className="px-3 py-2 bg-[#111118] border-t border-white/[0.04] flex justify-between text-[7px] text-white/30">
              <span>● Pico W</span>
              <span className="text-[#34d399] font-semibold">Live Ready</span>
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        .phone-scene {
          position: absolute;
          left: -80px;
          top: 60px;
          z-index: 100;
          animation: phoneFloat 8s ease-in-out infinite;
        }

        .phone {
          width: 220px;
          height: 450px;
          border-radius: 42px;
          transform: rotate(-12deg);
        }

        @keyframes phoneFloat {
          0%, 100% {
            transform: translateY(0) rotate(-12deg);
          }
          50% {
            transform: translateY(-25px) rotate(-9deg);
          }
        }

        @media (max-width: 768px) {
          .phone-scene {
            position: relative;
            left: 0;
            top: 0;
            transform: none;
            animation: none;
            margin-bottom: 20px;
          }
          .phone {
            transform: none;
            width: 200px;
            height: 410px;
          }
        }
      `}</style>
    </div>
  );
}
