"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Download", href: "#download" },
];

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
      <div
        className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
      >
        <Zap className="h-4 w-4 text-white" />
      </div>
      <span className="font-mono text-lg font-bold tracking-tight">
        {brandPart1.split("").map((char, i) => (
          <span
            key={`a-${i}`}
            className="inline-block text-white transition-transform duration-300"
            style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)', transitionDelay: `${i * 30}ms` }}
          >
            {char}
          </span>
        ))}
        <span className="inline-block text-white/30 mx-0.5" />
        {brandPart2.split("").map((char, i) => (
          <span
            key={`b-${i}`}
            className="inline-block bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent transition-transform duration-300"
            style={{ transform: hovered ? 'translateY(-2px)' : 'translateY(0)', transitionDelay: `${(brandPart1.length + i) * 30}ms` }}
          >
            {char}
          </span>
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 animate-fade-up"
      style={{ animationDelay: "0.5s", animationFillMode: "both" }}
    >
      <div
        className="border-b transition-all duration-400"
        style={{ 
          backgroundColor: scrolled ? "rgba(3,3,6,0.85)" : "rgba(3,3,6,0)",
          backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "blur(0px)",
          borderBottomColor: scrolled ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0)",
          borderBottomWidth: 1 
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <AnimatedLogo />

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <a
              href="#download"
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.04] hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)] active:scale-[0.97] group"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Download
            </a>
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
      </div>

      {/* Mobile menu */}
      <div className={`overflow-hidden border-t border-white/[0.04] bg-[#030306]/95 backdrop-blur-2xl px-6 md:hidden transition-all duration-300 ${mobileOpen ? 'max-h-64 pt-4 pb-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-white/50 hover:text-white transition-colors">
            {link.label}
          </a>
        ))}
        <a href="#download" onClick={() => setMobileOpen(false)} className="mt-3 block rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#2563eb] px-5 py-2.5 text-center text-sm font-semibold text-white">
          Download
        </a>
      </div>
    </nav>
  );
}
