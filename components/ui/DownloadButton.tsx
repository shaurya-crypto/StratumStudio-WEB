"use client";

interface DownloadButtonProps {
  platform: string;
  icon: React.ReactNode;
  href?: string;
  subtitle?: string;
}

export default function DownloadButton({ platform, icon, href = "#", subtitle }: DownloadButtonProps) {
  return (
    <a
      href={href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] animate-fade-up"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-hover)";
        e.currentTarget.style.borderColor = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
        }}>
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{platform}</div>
        {subtitle && <div className="text-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</div>}
      </div>
      <span
        className="ml-auto transition-all duration-300 group-hover:translate-x-1"
        style={{ color: "var(--text-subtle)" }}
      >
        →
      </span>
    </a>
  );
}
