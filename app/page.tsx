"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Zap, Code2, Gamepad2, Radio, ChevronDown, Monitor, Smartphone, Laptop, Terminal } from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import GlowCard from "@/components/ui/GlowCard";
import DownloadButton from "@/components/ui/DownloadButton";
import DeviceMockup from "@/components/ui/DeviceMockup";
import AIProviderShowcase from "@/components/ui/AIProviderShowcase";
import { SmoothScrollProvider } from "@/hooks/useSmoothScroll";

const BoardCarousel = dynamic(() => import("@/components/3d/BoardCarousel"), {
  ssr: false,
  loading: () => <div className="h-[90vh]" style={{ background: "var(--bg)" }} />,
});

const HeroCanvas = dynamic(() => import("@/components/canvas/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

const TITLE_PARTS = [
  { text: "Stratum ", colored: false },
  { text: "Studio", colored: true },
];

const SUBTITLE_WORDS = "The ultimate mobile-first IDE for embedded systems. AI-powered, browser-native, zero setup.".split(" ");

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
  const [show3D, setShow3D] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const carouselRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    let idleCallbackId: number;
    let fallbackTimeoutId: NodeJS.Timeout;

    if ('requestIdleCallback' in window) {
      idleCallbackId = (window as any).requestIdleCallback(() => setShow3D(true), { timeout: 2000 });
    } else {
      fallbackTimeoutId = setTimeout(() => setShow3D(true), 500);
    }

    return () => {
      if ('cancelIdleCallback' in window && idleCallbackId) {
        (window as any).cancelIdleCallback(idleCallbackId);
      }
      if (fallbackTimeoutId) {
        clearTimeout(fallbackTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCarousel(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SmoothScrollProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Stratum Studio",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Windows, macOS, Linux, Android, iOS",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "AI-powered mobile IDE for embedded development",
        "screenshot": "https://stratum-studio.vercel.app/screenshot.png"
      }) }} />
      <h1 className="sr-only">Stratum Studio - Mobile IDE with AI Agent</h1>
      <Navbar />

      {/* ====== SECTION 1: HERO ====== */}
      <section ref={heroRef} className="relative h-screen overflow-hidden premium-bg flex items-center justify-center">
        {/* Background Gradients */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />

        <Suspense fallback={<div className="absolute inset-0" style={{ background: "var(--bg)" }} />}>
          {show3D && <HeroCanvas />}
        </Suspense>

        {/* Dynamic theme-aware overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, var(--bg) 80%)" }} />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto pt-16">
          <div className="max-w-3xl">
            {/* Title — character by character */}
            <div
              className="font-sans text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
              aria-hidden="true"
              style={{ animation: "breathe-glow 3s ease-in-out infinite" }}
            >
              {TITLE_PARTS.map((part) =>
                part.text.split("").map((char, i) => (
                  <span
                    key={`${part.text}-${i}`}
                    className="inline-block animate-fade-up"
                    style={{
                      animationDelay: `${(part.colored ? 7 : 0) * 0.04 + i * 0.04}s`,
                      color: part.colored ? "transparent" : "var(--text)",
                      backgroundImage: part.colored ? "linear-gradient(135deg, var(--primary), var(--cyan))" : "none",
                      backgroundClip: part.colored ? "text" : "unset",
                      WebkitBackgroundClip: part.colored ? "text" : "unset",
                      transition: "color 0.3s ease",
                      animationFillMode: "both"
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))
              )}
            </div>

            {/* Subtitle — word by word */}
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed sm:text-xl font-medium" style={{ color: "var(--text-muted)" }}>
              {SUBTITLE_WORDS.map((word, i) => (
                <span 
                  key={i} 
                  className="mr-[0.3em] inline-block animate-fade-up" 
                  style={{ animationDelay: `${1.2 + i * 0.06}s`, animationFillMode: "both" }}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up" style={{ animationDelay: "2.0s", animationFillMode: "both" }}>
              <a
                href="#download"
                className="btn-primary group relative overflow-hidden"
              >
                <Monitor className="h-4 w-4" />
                Download for PC
              </a>

              <a
                href="#download"
                className="btn-secondary group relative overflow-hidden"
              >
                <Smartphone className="h-4 w-4" />
                Get Mobile App
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-up"
            style={{ animationDelay: "2.5s", animationFillMode: "both" }}
          >
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6" style={{ color: "var(--text-subtle)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====== CINEMATIC BOARD CAROUSEL ====== */}
      <section className="relative premium-bg" ref={carouselRef}>
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-8 text-center">
          <div className="animate-fade-up">
            <span
              className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
              style={{ borderColor: "var(--border-strong)", background: "var(--bg-secondary)", color: "var(--primary)" }}
            >
              Hardware
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>
              Supported <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Boards</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg" style={{ color: "var(--text-muted)" }}>
              Four boards. One IDE. Explore the hardware that Stratum Studio supports out of the box.
            </p>
          </div>
        </div>
        <Suspense fallback={<div className="h-[90vh]" style={{ background: "var(--bg)" }} />}>
          {showCarousel && <BoardCarousel />}
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
          <div
            className="mb-16 text-center animate-fade-up"
          >
            <span
              className="mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
              style={{ borderColor: "var(--border-strong)", background: "var(--bg-secondary)", color: "var(--accent)" }}
            >
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>
              Built for <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">hardware engineers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg" style={{ color: "var(--text-muted)" }}>
              Everything you need to write, deploy, and debug firmware — in one interface.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, i) => (
              <GlowCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 3: DEVICE SHOWCASE ====== */}
      <section id="showcase" className="relative overflow-hidden py-32 premium-bg">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom, var(--shadow-color) 10%, transparent 60%)" }} />
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div
            className="mb-16 text-center animate-fade-up"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>
              One IDE. <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Every device.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg" style={{ color: "var(--text-muted)" }}>
              Seamless experience across desktop and mobile. Code anywhere, deploy everywhere.
            </p>
          </div>

          <DeviceMockup />
        </div>
      </section>

      {/* ====== SECTION 4: DOWNLOAD ====== */}
      <section id="download" className="relative overflow-hidden py-32 premium-bg">
        <div className="gradient-orb gradient-orb-1" style={{ top: "-30%", left: "20%" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center z-10">
          <div
            className="animate-fade-up"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--text)" }}>
              Download Now. <span style={{ color: "var(--text-muted)" }}>No account needed.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md" style={{ color: "var(--text-muted)" }}>
              Download Stratum Studio and start coding for your hardware in under 60 seconds.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 sm:grid-cols-2 gap-4">
            <DownloadButton platform="Windows" subtitle=".exe installer" icon={<Monitor className="h-5 w-5" />} />
            <DownloadButton platform="macOS" subtitle="Universal binary" icon={<Laptop className="h-5 w-5" />} />
            <DownloadButton platform="Android" subtitle=".apk direct" icon={<Smartphone className="h-5 w-5" />} />
            <DownloadButton platform="Linux" subtitle=".AppImage" icon={<Terminal className="h-5 w-5" />} />
          </div>

          <p
            className="mt-10 text-sm tracking-wide font-medium animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both", color: "var(--text-subtle)" }}
          >
            Open Source &middot; Free Forever &middot; Built for Engineers
          </p>
        </div>
      </section>

      {/* ====== SECTION 5: FOOTER ====== */}
      <footer className="py-10 premium-bg" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #4285f4, #ea4335, #fbbc04, #34a853)" }}>
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-sans text-sm font-bold" style={{ color: "var(--text)" }}>
              Stratum<span style={{ color: "var(--primary)" }}>Studio</span>
            </span>
          </a>

          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Made with care for the hardware community.</p>

          <div className="flex items-center gap-4">
            <a href="https://github.com/shaurya-crypto" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95" style={{ color: "var(--text-muted)" }} aria-label="GitHub">
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href="https://x.com/stratumstudio" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95" style={{ color: "var(--text-muted)" }} aria-label="X">
              <XIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

      </SmoothScrollProvider>
    </>
  );
}
