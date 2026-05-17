import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ui/ThemeToggle";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stratum-studio.vercel.app"),
  title: "Stratum Studio - AI-Powered Mobile IDE for Arduino, ESP32, Pico",
  description:
    "Download Stratum Studio: Free mobile-friendly IDE with built-in AI agent for MicroPython, Arduino, ESP32, and Raspberry Pi Pico development. Code anywhere.",
  keywords: [
    "mobile IDE",
    "Arduino IDE",
    "ESP32 IDE",
    "MicroPython editor",
    "AI code assistant",
    "Raspberry Pi Pico IDE",
    "embedded development",
    "IoT programming",
    "Arduino IDE alternative",
    "embedded systems IDE"
  ],
  authors: [{ name: "Stratum Studio" }],
  openGraph: {
    title: "Stratum Studio - Mobile IDE with AI Agent",
    description: "Code Arduino, ESP32, Pico from your phone. AI-powered autocompletion.",
    url: "https://stratum-studio.vercel.app",
    siteName: "Stratum Studio",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { 
    card: "summary_large_image" 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "67SJcLJlz8icbSVWqjn8RWoDQmBFBs0Jf0vn8wom9dE",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060610" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme');
            if (t === 'light') document.documentElement.classList.remove('dark');
          } catch(e) {}
        ` }} />
      </head>
      <body className="min-h-screen antialiased font-sans" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
