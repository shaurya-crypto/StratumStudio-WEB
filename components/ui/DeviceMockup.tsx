"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function CodeEditorMockup({ mobile = false }: { mobile?: boolean }) {
  const lines = [
    { indent: 0, keyword: "from", text: " machine ", keyword2: "import", text2: " Pin, PWM" },
    { indent: 0, keyword: "from", text: " time ", keyword2: "import", text2: " sleep" },
    { indent: 0, text: "" },
    { indent: 0, comment: "# Initialize LED on GPIO 25" },
    { indent: 0, text: "led = Pin(", number: "25", text2: ", Pin.OUT)" },
    { indent: 0, text: "pwm = PWM(led)" },
    { indent: 0, text: "" },
    { indent: 0, keyword: "while", text: " True:" },
    { indent: 1, keyword: "for", text: " duty ", keyword2: "in", text2: " range(" },
    { indent: 2, number: "0", text: ", ", number2: "65535", text2: ", ", number3: "256", text3: "):" },
    { indent: 2, text: "pwm.duty_u16(duty)" },
    { indent: 2, text: "sleep(", number: "0.002", text2: ")" },
  ];

  return (
    <div className={`overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0b14] shadow-2xl ${mobile ? "w-[240px]" : "w-full max-w-[540px]"}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]/80" />
        </div>
        <span className="ml-3 font-mono text-[10px] text-white/30">main.py — Stratum Studio</span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-white/[0.04]">
        <div className="border-b-2 border-[#3B82F6] bg-white/[0.02] px-4 py-1.5">
          <span className="font-mono text-[10px] text-white/70">main.py</span>
        </div>
        <div className="px-4 py-1.5">
          <span className="font-mono text-[10px] text-white/25">boot.py</span>
        </div>
      </div>

      {/* Code area */}
      <div className={`${mobile ? "p-3" : "p-4"} font-mono text-[11px] leading-[1.7]`}>
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 inline-block w-5 text-right text-white/15 select-none">
              {i + 1}
            </span>
            <span style={{ paddingLeft: line.indent * 16 }}>
              {line.comment && <span className="text-white/25">{line.comment}</span>}
              {line.keyword && <span className="text-[#c084fc]">{line.keyword}</span>}
              {line.text && <span className="text-white/70">{line.text}</span>}
              {line.keyword2 && <span className="text-[#c084fc]">{line.keyword2}</span>}
              {line.text2 && <span className="text-white/70">{line.text2}</span>}
              {line.number && <span className="text-[#22C55E]">{line.number}</span>}
              {line.number2 && <span className="text-[#22C55E]">{line.number2}</span>}
              {line.text3 && <span className="text-white/70">{line.text3}</span>}
              {line.number3 && <span className="text-[#22C55E]">{line.number3}</span>}
            </span>
          </div>
        ))}
        {/* Cursor blink */}
        <div className="flex">
          <span className="mr-4 inline-block w-5 text-right text-white/15 select-none">13</span>
          <span className="inline-block h-[14px] w-[1.5px] animate-pulse bg-[#3B82F6]" />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-4 py-1.5">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
          <span className="font-mono text-[9px] text-white/30">Pico W Connected</span>
        </div>
        <span className="font-mono text-[9px] text-white/20">MicroPython v1.24</span>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="w-[200px] rounded-[28px] border-2 border-white/[0.08] bg-[#050508] p-2 shadow-2xl">
      {/* Notch */}
      <div className="mx-auto mb-2 h-5 w-20 rounded-b-xl bg-black" />
      <div className="overflow-hidden rounded-[20px]">
        <CodeEditorMockup mobile />
      </div>
      {/* Home indicator */}
      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-white/20" />
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="w-full max-w-[600px]">
      {/* Screen */}
      <div className="rounded-t-xl border border-white/[0.08] border-b-0 bg-[#111] p-3 pb-0">
        <CodeEditorMockup />
      </div>
      {/* Base */}
      <div className="mx-auto h-3 w-full rounded-b-lg bg-gradient-to-b from-white/[0.08] to-white/[0.03]" />
      <div className="mx-auto h-1 w-[60%] rounded-b-lg bg-white/[0.04]" />
    </div>
  );
}

export default function DeviceMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const laptopX = useTransform(scrollYProgress, [0, 0.5], [-120, 0]);
  const phoneX = useTransform(scrollYProgress, [0, 0.5], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center gap-12 lg:flex-row lg:gap-16">
      <motion.div style={{ x: laptopX, opacity }}>
        <LaptopMockup />
      </motion.div>
      <motion.div style={{ x: phoneX, opacity }}>
        <PhoneMockup />
      </motion.div>
    </div>
  );
}
