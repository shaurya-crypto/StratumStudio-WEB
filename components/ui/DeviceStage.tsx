"use client";

import React, { useState, useEffect } from "react";
import PhoneAnimation from "./PhoneAnimation";
import LaptopAnimation from "./LaptopAnimation";

const CODE_LINES = [
  "import machine, utime",
  "led = machine.Pin(25, machine.Pin.OUT)",
  "",
  "def blink(times, delay):",
  "    for _ in range(times):",
  "        led.value(1)",
  "        utime.sleep(delay)",
  "        led.value(0)",
  "        utime.sleep(delay)",
  "",
  "# Stratum Agent generated ✦",
  "while True:",
  "    blink(3, 0.2)",
  "    utime.sleep(1)",
];

interface Particle {
  left: string;
  top: string;
  delay: string;
  duration: string;
  scale: number;
}

export default function DeviceStage() {
  const [screenOpacity, setScreenOpacity] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles ONLY on client-side mount to completely prevent Next.js hydration mismatches
    const generatedParticles = [...Array(15)].map((_, i) => ({
      left: `${15 + Math.random() * 70}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: `${i * 0.4}s`,
      duration: `${8 + Math.random() * 6}s`,
      scale: 0.5 + Math.random() * 0.8,
    }));
    setParticles(generatedParticles);

    let typeTimeout: NodeJS.Timeout;
    let sequenceTimeout: NodeJS.Timeout;

    const runSequence = () => {
      // 1. Initial State: Screens are off (black), lists are empty
      setScreenOpacity(0);
      setLines([]);
      setCurrentLine("");

      // 2. 0.5s Delay — Fade in screens smoothly (glow up!)
      sequenceTimeout = setTimeout(() => {
        setScreenOpacity(1);

        // 3. 1.2s Delay — Start professional, natural typewriter stream
        sequenceTimeout = setTimeout(() => {
          let lineIndex = 0;
          let charIndex = 0;
          let displayed: string[] = [];

          const typeChar = () => {
            if (lineIndex >= CODE_LINES.length) {
              // Typing complete! Keep screen visible for 3.5 seconds to admire code
              sequenceTimeout = setTimeout(() => {
                // Fade screen back to black
                setScreenOpacity(0);

                // Wait 1.5 seconds in black state, then loop restarts
                sequenceTimeout = setTimeout(() => {
                  runSequence();
                }, 1500);
              }, 3500);
              return;
            }

            const line = CODE_LINES[lineIndex];

            if (charIndex <= line.length) {
              setCurrentLine(line.slice(0, charIndex));
              charIndex++;
              // Smooth, realistic IDE typing speed
              typeTimeout = setTimeout(typeChar, 35 + Math.random() * 35);
            } else {
              displayed = [...displayed, line];
              setLines([...displayed]);
              setCurrentLine("");
              lineIndex++;
              charIndex = 0;
              // Proper structural indentation and line break delays
              typeTimeout = setTimeout(typeChar, line === "" ? 150 : 250);
            }
          };

          typeChar();
        }, 1200);
      }, 500);
    };

    runSequence();

    return () => {
      clearTimeout(typeTimeout);
      clearTimeout(sequenceTimeout);
    };
  }, []);

  return (
    <div className="device-stage relative flex items-center justify-center select-none overflow-visible">
      {/* Floating glass particles */}
      {particles.map((p, i) => (
        <div
          className="particle"
          key={i}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: screenOpacity * 0.4,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}

      {/* Synchronized Phone (Floating in foreground) */}
      <PhoneAnimation 
        lines={lines} 
        currentLine={currentLine} 
        screenshot="/pico-top.webp" 
        screenOpacity={screenOpacity}
      />

      {/* Synchronized Laptop (Cinematic base in center/right background) */}
      <LaptopAnimation 
        lines={lines} 
        currentLine={currentLine} 
        screenshot="/pico-top.webp" 
        screenOpacity={screenOpacity}
        lidAngle={25}
      />

      <style jsx global>{`
        .device-stage {
          position: relative;
          width: 600px;
          height: 500px;
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
        }

        .laptop-scene {
          transform: translateX(80px) translateY(10px);
        }

        .phone-scene {
          z-index: 100;
        }

        @media (max-width: 1200px) {
          .device-stage {
            transform: scale(0.85);
          }
        }

        @media (max-width: 768px) {
          .device-stage {
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 40px;
            transform: scale(0.8);
            margin-top: 20px;
          }

          .phone-scene {
            position: relative;
            left: 0;
            top: 0;
            transform: none;
            order: 1;
          }

          .laptop-scene {
            position: relative;
            transform: none;
            order: 2;
          }
        }
      `}</style>
    </div>
  );
}
