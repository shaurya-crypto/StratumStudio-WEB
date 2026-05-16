"use client";


import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:border-[#3B82F6]/20 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-[#3B82F6]/[0.06] animate-fade-up"
      style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "both" }}
    >
      {/* Glow effect */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#3B82F6]/[0.04] blur-3xl transition-all duration-500 group-hover:bg-[#3B82F6]/[0.08]" />

      <div className="relative z-10">
        <div className="mb-5 inline-flex rounded-xl bg-[#3B82F6]/10 p-3 text-[#3B82F6] ring-1 ring-[#3B82F6]/20">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="text-[15px] leading-relaxed text-white/50">{description}</p>
      </div>
    </div>
  );
}
