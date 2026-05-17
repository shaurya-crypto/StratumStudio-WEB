"use client";

import { useRef, memo, useEffect } from "react";

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
    <div className={`overflow-hidden rounded-2xl ${mobile ? "w-[240px]" : "w-full max-w-[540px]"}`}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-float)",
      }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full dot-red" />
          <div className="h-2.5 w-2.5 rounded-full dot-yellow" />
          <div className="h-2.5 w-2.5 rounded-full dot-green" />
        </div>
        <span className="ml-3 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>main.py — Stratum Studio</span>
      </div>

      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="px-4 py-1.5" style={{ borderBottom: "2px solid var(--primary)", background: "var(--bg-secondary)" }}>
          <span className="font-mono text-[10px]" style={{ color: "var(--text)" }}>main.py</span>
        </div>
        <div className="px-4 py-1.5">
          <span className="font-mono text-[10px]" style={{ color: "var(--text-subtle)" }}>boot.py</span>
        </div>
      </div>

      {/* Code area */}
      <div className={`${mobile ? "p-3" : "p-4"} font-mono text-[11px] leading-[1.7]`}>
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 inline-block w-5 text-right select-none" style={{ color: "var(--text-subtle)" }}>{i + 1}</span>
            <span style={{ paddingLeft: line.indent * 16 }}>
              {line.comment && <span style={{ color: "var(--text-subtle)" }}>{line.comment}</span>}
              {line.keyword && <span style={{ color: "#a78bfa" }}>{line.keyword}</span>}
              {line.text && <span style={{ color: "var(--text)" }}>{line.text}</span>}
              {line.keyword2 && <span style={{ color: "#a78bfa" }}>{line.keyword2}</span>}
              {line.text2 && <span style={{ color: "var(--text)" }}>{line.text2}</span>}
              {line.number && <span style={{ color: "#34a853" }}>{line.number}</span>}
              {line.number2 && <span style={{ color: "#34a853" }}>{line.number2}</span>}
              {line.text3 && <span style={{ color: "var(--text)" }}>{line.text3}</span>}
              {line.number3 && <span style={{ color: "#34a853" }}>{line.number3}</span>}
            </span>
          </div>
        ))}
        <div className="flex">
          <span className="mr-4 inline-block w-5 text-right select-none" style={{ color: "var(--text-subtle)" }}>13</span>
          <span className="inline-block h-[14px] w-[1.5px] animate-pulse" style={{ background: "var(--primary)" }} />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full dot-green" />
          <span className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>Pico W Connected</span>
        </div>
        <span className="font-mono text-[9px]" style={{ color: "var(--text-subtle)" }}>MicroPython v1.24</span>
      </div>
    </div>
  );
}

const PhoneMockup = memo(function PhoneMockup() {
  return (
    <div className="w-[200px] rounded-[28px] p-2" style={{
      background: "var(--bg-elevated)",
      border: "2px solid var(--border-strong)",
      boxShadow: "var(--shadow-float)",
    }}>
      <div className="mx-auto mb-2 h-5 w-20 rounded-b-xl" style={{ background: "var(--bg)" }} />
      <div className="overflow-hidden rounded-[20px]">
        <CodeEditorMockup mobile />
      </div>
      <div className="mx-auto mt-2 h-1 w-16 rounded-full" style={{ background: "var(--border-strong)" }} />
    </div>
  );
});

const LaptopMockup = memo(function LaptopMockup() {
  return (
    <div className="w-full max-w-[600px]">
      <div className="rounded-t-xl p-3 pb-0" style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderBottom: "none",
      }}>
        <CodeEditorMockup />
      </div>
      <div className="mx-auto h-3 w-full rounded-b-lg" style={{ background: "var(--border-strong)" }} />
      <div className="mx-auto h-1 w-[60%] rounded-b-lg" style={{ background: "var(--border)" }} />
    </div>
  );
});

export default function DeviceMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || !laptopRef.current || !phoneRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = 1 - Math.max(0, Math.min(1, (rect.bottom) / (viewportHeight + rect.height)));
      const laptopX = Math.min(0, -120 + (progress * 240));
      const phoneX = Math.max(0, 120 - (progress * 240));
      const opacity = Math.min(1, progress * 3);
      laptopRef.current.style.transform = `translateX(${laptopX}px)`;
      laptopRef.current.style.opacity = opacity.toString();
      phoneRef.current.style.transform = `translateX(${phoneX}px)`;
      phoneRef.current.style.opacity = opacity.toString();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center gap-12 lg:flex-row lg:gap-16 overflow-visible p-4">
      <div ref={laptopRef} className="transition-transform duration-100 ease-out will-change-transform" style={{ opacity: 0 }}>
        <LaptopMockup />
      </div>
      <div ref={phoneRef} className="transition-transform duration-100 ease-out will-change-transform" style={{ opacity: 0 }}>
        <PhoneMockup />
      </div>
    </div>
  );
}
