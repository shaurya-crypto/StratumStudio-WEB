"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function BackgroundBeams() {
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate beam paths
  const beams = Array.from({ length: 12 }, (_, i) => {
    const startX = Math.random() * 100;
    const endX = startX + (Math.random() - 0.5) * 40;
    const cp1x = startX + (Math.random() - 0.5) * 20;
    const cp2x = endX + (Math.random() - 0.5) * 20;
    return {
      id: i,
      d: `M${startX} -10 C${cp1x} 30, ${cp2x} 70, ${endX} 110`,
      delay: i * 0.8 + Math.random() * 2,
      duration: 4 + Math.random() * 3,
      color: i % 3 === 0 ? "#3B82F6" : i % 3 === 1 ? "#8B5CF6" : "#06B6D4",
      opacity: 0.08 + Math.random() * 0.08,
      width: 0.5 + Math.random() * 1.5,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ filter: "blur(0.5px)" }}
      >
        <defs>
          {beams.map((beam) => (
            <linearGradient key={`g-${beam.id}`} id={`beam-grad-${beam.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={beam.color} stopOpacity="0" />
              <stop offset="30%" stopColor={beam.color} stopOpacity={beam.opacity} />
              <stop offset="70%" stopColor={beam.color} stopOpacity={beam.opacity} />
              <stop offset="100%" stopColor={beam.color} stopOpacity="0" />
            </linearGradient>
          ))}
          <filter id="beam-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {beams.map((beam) => (
          <motion.path
            key={beam.id}
            d={beam.d}
            stroke={`url(#beam-grad-${beam.id})`}
            strokeWidth={beam.width}
            fill="none"
            filter="url(#beam-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
