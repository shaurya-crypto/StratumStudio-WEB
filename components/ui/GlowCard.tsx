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
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] p-8 transition-all duration-500 hover:scale-105 animate-fade-up ${className}`}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${(mousePos.y - 100) * -0.02}deg) rotateY(${(mousePos.x - 150) * 0.02}deg)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Mouse-following gradient glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.08), transparent 50%)`
            : "none",
        }}
      />

      {/* Top border glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10">
        <div
          className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 p-3.5 text-[#3B82F6] ring-1 ring-[#3B82F6]/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-xl font-bold tracking-tight text-white">{title}</h3>
        <p className="text-[15px] leading-relaxed text-white/40">{description}</p>
      </div>

      {/* Bottom ambient glow */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#3B82F6]/[0.02] blur-3xl transition-all duration-700 group-hover:bg-[#3B82F6]/[0.06]" />
    </div>
  );
});

export default GlowCard;
