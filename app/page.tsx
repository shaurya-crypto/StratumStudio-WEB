"use client";

import React, { Suspense, useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Zap, Code2, Gamepad2, Radio, ChevronDown, Monitor, Laptop, Smartphone, Terminal } from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import GlowCard from "@/components/ui/GlowCard";
import DownloadButton from "@/components/ui/DownloadButton";
import DeviceMockup from "@/components/ui/DeviceMockup";
import BackgroundBeams from "@/components/ui/BackgroundBeams";
import AIProviderShowcase from "@/components/ui/AIProviderShowcase";
import { SmoothScrollProvider } from "@/hooks/useSmoothScroll";

const BoardCarousel = dynamic(() => import("@/components/3d/BoardCarousel"), {
  ssr: false,
  loading: () => <div className="h-[90vh] bg-[#030306]" />,
});

const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

/* ── Animation Constants ── */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ── Character animation for hero title ── */
const TITLE_PARTS = [
  { text: "Stratum", colored: false },
  { text: " Studio", colored: true },
];

const charVariants: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: 90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

/* ── Subtitle word-by-word animation ── */
const SUBTITLE_WORDS = "The hardware engineer's IDE. Code your Pico, Arduino & ESP32 from any device.".split(" ");

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ── CTA button animation ── */
const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ── Features data ── */
const features = [
  {
    icon: Code2,
    title: "Zero-Latency Autocomplete",
    description: "Context-aware code completion for MicroPython and C++ with inline documentation, type hints, and intelligent imports.",
  },
  {
    icon: Gamepad2,
    title: "WiFi / BT Gamepad Support",
    description: "Control physical hardware live from any device. Map gamepad axes and buttons directly to GPIO pins and motor drivers.",
  },
  {
    icon: Radio,
    title: "MicroPython Ready",
    description: "Flash firmware, upload scripts, and monitor serial output in real-time. One-click deploy directly to your connected device.",
  },
];

/* ── Social Icons ── */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function HomePage() {
  const heroRef = React.useRef<HTMLElement>(null);

  return (
    <>
      <Navbar />
      <SmoothScrollProvider>

      {/* ====== SECTION 1: HERO ====== */}
      <section ref={heroRef} className="relative h-screen overflow-hidden premium-bg">
        {/* 5-Layer Background */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />

        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#060818] to-[#030306]" />
          }
        >
          <HeroCanvas />
        </Suspense>

        <BackgroundBeams />

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030306]/40 via-transparent to-[#030306]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030306_80%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="max-w-3xl">
            {/* Badge */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs font-medium text-white/40">Now in Open Beta</span>
            </motion.div> */}

            {/* Title — character by character */}
            <h1
              className="font-mono text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
              style={{ animation: "breathe-glow 3s ease-in-out infinite" }}
            >
              {TITLE_PARTS.map((part) =>
                part.text.split("").map((char, i) => (
                  <motion.span
                    key={`${part.text}-${i}`}
                    custom={i}
                    variants={charVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: (part.colored ? 7 : 0) * 0.04 + i * 0.04 }}
                    className="inline-block"
                    style={{
                      color: part.colored ? "transparent" : "#ffffff",
                      backgroundImage: part.colored ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : "none",
                      backgroundClip: part.colored ? "text" : "unset",
                      WebkitBackgroundClip: part.colored ? "text" : "unset",
                      transition: "color 0.075s",
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))
              )}
            </h1>

            {/* Subtitle — word by word */}
            <motion.p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/40 sm:text-xl"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.06, delayChildren: 1.2 }}
            >
              {SUBTITLE_WORDS.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="mr-[0.3em] inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.15, delayChildren: 2.0 }}
            >
              <motion.a
                href="#download"
                variants={buttonVariants}
                whileHover={{
                  y: -3,
                  boxShadow: "0 20px 40px rgba(59,130,246,0.3), inset 0 0 0 1px rgba(59,130,246,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563eb] px-7 py-3.5 text-sm font-bold text-white"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Monitor className="h-4 w-4" />
                Download for PC
              </motion.a>

              <motion.a
                href="#download"
                variants={buttonVariants}
                whileHover={{
                  y: -3,
                  boxShadow: "0 20px 40px rgba(6,182,212,0.15), inset 0 0 0 1px rgba(6,182,212,0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-[#06B6D4]/20 hover:bg-white/[0.04]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Smartphone className="h-4 w-4" />
                Get Mobile App
              </motion.a>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className="h-6 w-6 text-white/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ====== CINEMATIC BOARD CAROUSEL ====== */}
      <section className="relative premium-bg">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
            <motion.span
              className="mb-4 inline-block rounded-full border border-[#3B82F6]/20 bg-[#3B82F6]/5 px-4 py-1.5 text-xs font-medium tracking-widest text-[#3B82F6] uppercase"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Hardware
            </motion.span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Hardware <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Showcase</span></h2>
            <p className="mx-auto mt-4 max-w-lg text-white/35">Four boards. One IDE. Explore the hardware that Stratum Studio supports out of the box.</p>
          </motion.div>
        </div>
        <Suspense fallback={<div className="h-[90vh] bg-[#030306]" />}>
          <BoardCarousel />
        </Suspense>
      </section>

      {/* ====== AI PROVIDER SHOWCASE ====== */}
      <AIProviderShowcase />

      {/* ====== SECTION 2: FEATURES ====== */}
      <section
        id="features"
        className="relative overflow-hidden py-32 premium-bg"
      >
        <div className="gradient-orb gradient-orb-2" style={{ top: "20%", right: "-10%" }} />

        <div className="mx-auto max-w-5xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-16 text-center"
          >
            <motion.span
              className="mb-4 inline-block rounded-full border border-[#22C55E]/20 bg-[#22C55E]/5 px-4 py-1.5 text-xs font-medium tracking-widest text-[#22C55E] uppercase"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Features
            </motion.span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">hardware engineers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/35">
              Everything you need to write, deploy, and debug firmware — in one interface.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 3: DEVICE SHOWCASE ====== */}
      <section id="showcase" className="relative overflow-hidden py-32 premium-bg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.03),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One IDE.{" "}
              <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">Every device.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/35">
              Seamless experience across desktop and mobile. Code anywhere, deploy everywhere.
            </p>
          </motion.div>

          <DeviceMockup />
        </div>
      </section>

      {/* ====== SECTION 4: DOWNLOAD ====== */}
      <section id="download" className="relative overflow-hidden py-32 premium-bg">
        <div className="gradient-orb gradient-orb-1" style={{ top: "-30%", left: "20%" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Start Building. <span className="text-white/30">No account needed.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/35">
              Download Stratum Studio and start coding for your hardware in under 60 seconds.
            </p>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 sm:grid-cols-2 gap-4">
            <DownloadButton platform="Windows" subtitle=".exe installer" icon={<Monitor className="h-5 w-5" />} />
            <DownloadButton platform="macOS" subtitle="Universal binary" icon={<Laptop className="h-5 w-5" />} />
            <DownloadButton platform="Android" subtitle=".apk direct" icon={<Smartphone className="h-5 w-5" />} />
            <DownloadButton platform="Linux" subtitle=".AppImage" icon={<Terminal className="h-5 w-5" />} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 text-sm tracking-wide text-white/20"
          >
            Open Source &middot; Free Forever &middot; Built for Engineers
          </motion.p>
        </div>
      </section>

      {/* ====== SECTION 5: FOOTER ====== */}
      <footer className="border-t border-white/[0.03] py-10 premium-bg">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4]">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-mono text-sm font-bold text-white/70">
              Stratum<span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Studio</span>
            </span>
          </a>

          <p className="text-sm text-white/20">Made with care for the hardware community.</p>

          <div className="flex items-center gap-4">
            <a href="https://github.com/shaurya-crypto" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg text-white/20 transition-colors hover:bg-white/[0.03] hover:text-white/50" aria-label="GitHub">
              <GithubIcon className="h-4 w-4" />
            </a>
            <a href="https://x.com/stratumstudio" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg text-white/20 transition-colors hover:bg-white/[0.03] hover:text-white/50" aria-label="X">
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      </SmoothScrollProvider>
    </>
  );
}
