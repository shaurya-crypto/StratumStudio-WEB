"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Download", href: "#download" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function AnimatedLogo() {
  const [hovered, setHovered] = useState(false);
  const brandPart1 = "Stratum";
  const brandPart2 = "Studio";

  return (
    <a
      href="#"
      className="flex items-center gap-2.5 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4]"
        whileHover={{ rotate: 10, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Zap className="h-4 w-4 text-white" />
      </motion.div>
      <span className="font-mono text-lg font-bold tracking-tight">
        {brandPart1.split("").map((char, i) => (
          <motion.span
            key={`a-${i}`}
            className="inline-block text-white"
            animate={
              hovered
                ? { y: [0, -3, 0], transition: { delay: i * 0.03, duration: 0.3 } }
                : { y: 0 }
            }
          >
            {char}
          </motion.span>
        ))}
        <motion.span className="inline-block text-white/30 mx-0.5" />
        {brandPart2.split("").map((char, i) => (
          <motion.span
            key={`b-${i}`}
            className="inline-block bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent"
            animate={
              hovered
                ? { y: [0, -3, 0], transition: { delay: (brandPart1.length + i) * 0.03, duration: 0.3 } }
                : { y: 0 }
            }
          >
            {char}
          </motion.span>
        ))}
      </span>
    </a>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="group relative py-1 text-sm font-medium text-white/50 transition-colors duration-300 hover:text-white">
      {label}
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled ? "rgba(3,3,6,0.85)" : "rgba(3,3,6,0)",
          backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "blur(0px)",
          borderBottomColor: scrolled ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0)",
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className="border-b"
        style={{ borderBottomWidth: 1 }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <AnimatedLogo />

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <motion.a
              href="#download"
              whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(59,130,246,0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition-all"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Download
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile menu */}
      {/* <AnimatePresence> */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-white/[0.04] bg-[#030306]/95 backdrop-blur-2xl px-6 pb-6 pt-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-white/50 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
            <a href="#download" onClick={() => setMobileOpen(false)} className="mt-3 block rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#2563eb] px-5 py-2.5 text-center text-sm font-semibold text-white">
              Download
            </a>
          </motion.div>
        )}
      {/* </AnimatePresence> */}
    </motion.nav>
  );
}
