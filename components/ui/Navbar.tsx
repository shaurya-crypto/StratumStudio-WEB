"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
];

function AnimatedLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      className="flex items-center gap-2.5 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105 overflow-hidden border border-white/10"
        style={{ background: "linear-gradient(135deg, rgba(66, 133, 244, 0.15), rgba(234, 67, 53, 0.15))" }}>
        <img src="/favicon.ico" alt="Logo" className="h-[3000px] w-[2600px] object-contain" />
      </div>
      <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
        {"Stratum".split("").map((char, i) => (
          <span
            key={`a-${i}`}
            className="inline-block transition-transform duration-300"
            style={{ transform: hovered ? "translateY(-2px)" : "translateY(0)", transitionDelay: `${i * 30}ms` }}
          >
            {char}
          </span>
        ))}
        <span className="inline-block mx-0.5" />
        {"Studio".split("").map((char, i) => (
          <span
            key={`b-${i}`}
            className="inline-block transition-transform duration-300"
            style={{
              color: "var(--primary)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transitionDelay: `${(7 + i) * 30}ms`
            }}
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
    <a href={href} className="group relative py-1 text-sm font-medium transition-colors duration-300"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
    >
      {label}
      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{ background: "var(--primary)" }} />
    </a>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl rounded-3xl px-6 py-3 md:py-4 transition-all duration-300 animate-fade-up border"
      style={{
        animationDelay: "0.2s",
        animationFillMode: "both",
        background: "var(--navbar-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "var(--border-strong)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-center justify-between">
        <AnimatedLogo />

        {/* Desktop links + actions */}
        <div className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-8 mr-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* Integrated Theme Toggle + Download button */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#download"
              className="btn-primary group relative overflow-hidden text-sm"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
            >
              Download
            </a>
          </div>
        </div>

        {/* Mobile actions (Logo | ThemeToggle | HamburgerMenu) */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 active:scale-95"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border-strong)",
              boxShadow: "var(--shadow)",
              color: "var(--text)",
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu expansion */}
      <div
        className={`overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-64 mt-4 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pt-2 pb-4 flex flex-col gap-3 border-t border-white/[0.04] mt-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium transition-colors px-2 rounded-lg hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}>
              {link.label}
            </a>
          ))}
          <a href="#download" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm py-2.5 mt-1">
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
