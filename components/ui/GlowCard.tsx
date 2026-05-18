"use client";

import { useRef, useState, memo } from "react";
import type { LucideIcon } from "lucide-react";

interface GlowCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  className?: string;
}

const GlowCard = memo(function GlowCard({ icon: Icon, title, description, index, className = "" }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const colors = ["#4285f4", "#ea4335", "#34a853"];
  const accentColor = colors[index % 3];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] animate-fade-up ${className}`}
      style={{
        boxShadow: isHovered ? "var(--shadow-hover)" : "var(--shadow)",
        transform: isHovered
          ? `perspective(800px) rotateX(${(mousePos.y - 100) * -0.01}deg) rotateY(${(mousePos.x - 150) * 0.01}deg) scale(1.02)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Mouse-following gradient glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor}12, transparent 50%)`
            : "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className="mb-6 inline-flex rounded-2xl p-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{
            background: `${accentColor}10`,
            color: accentColor,
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>{title}</h3>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
    </div>
  );
});

export default GlowCard;
