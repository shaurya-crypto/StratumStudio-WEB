"use client";

import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  // { label: "Download", href: "#download" },
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
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105"
        style={{ background: "linear-gradient(135deg, #4285f4, #ea4335, #fbbc04, #34a853)" }}>
        <Zap className="h-4 w-4 text-white" />
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
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
        className="transition-all duration-400"
        style={{
          backgroundColor: scrolled ? "color-mix(in srgb, var(--bg) 85%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.2)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <AnimatedLogo />

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <a
              href="#download"
              className="btn-primary group relative overflow-hidden text-sm"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
            >
              Download
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden px-6 md:hidden transition-all duration-300 ${mobileOpen ? "max-h-64 pt-4 pb-6 opacity-100" : "max-h-0 py-0 opacity-0"}`}
        style={{
          background: "color-mix(in srgb, var(--bg) 95%, transparent)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
            className="block py-3 text-sm font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}>
            {link.label}
          </a>
        ))}
        <a href="#download" onClick={() => setMobileOpen(false)} className="btn-primary mt-3 block text-center text-sm">
          Download
        </a>
      </div>
    </nav>
  );
}
