import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://stratumstudio.dev"),
  title: "Stratum Studio — The Hardware Engineer's IDE for Pico, Arduino & ESP32",
  description:
    "Download Stratum Studio, the free cross-platform IDE for MicroPython, Arduino, and ESP32 development. Works on PC, Mac, and Android.",
  keywords: [
    "MicroPython IDE",
    "ESP32 editor",
    "Arduino IDE alternative",
    "Raspberry Pi Pico IDE",
    "Stratum Studio",
    "hardware IDE",
    "firmware development",
  ],
  authors: [{ name: "Stratum Studio Team" }],
  creator: "Shaurya Prabhakar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stratumstudio.dev",
    title: "Stratum Studio — The Hardware Engineer's IDE",
    description:
      "Download Stratum Studio, the free cross-platform IDE for MicroPython, Arduino, and ESP32 development.",
    siteName: "Stratum Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stratum Studio — The Hardware Engineer's IDE",
    description:
      "Download Stratum Studio, the free cross-platform IDE for MicroPython, Arduino, and ESP32 development.",
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
};

export const viewport: Viewport = {
  themeColor: "#030306",
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
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
