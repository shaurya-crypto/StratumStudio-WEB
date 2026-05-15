"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface DownloadButtonProps {
  platform: string;
  icon: React.ReactNode;
  href?: string;
  subtitle?: string;
}

export default function DownloadButton({ platform, icon, href = "#", subtitle }: DownloadButtonProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] px-6 py-4 backdrop-blur-sm transition-all duration-500 hover:border-[#3B82F6]/15 hover:bg-white/[0.03]"
    >
      {/* Hover shimmer */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

      {/* Top border glow */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] text-white/50 ring-1 ring-white/[0.06] transition-all duration-500 group-hover:bg-[#3B82F6]/10 group-hover:text-[#3B82F6] group-hover:ring-[#3B82F6]/20">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-sm font-bold text-white">{platform}</div>
        {subtitle && <div className="text-xs text-white/30">{subtitle}</div>}
      </div>
      <motion.span
        className="ml-auto text-white/20 transition-all duration-300 group-hover:text-[#3B82F6]/60 group-hover:translate-x-1"
      >
        →
      </motion.span>
    </motion.a>
  );
}
