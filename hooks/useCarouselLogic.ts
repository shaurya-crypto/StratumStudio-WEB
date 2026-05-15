import { useCallback, useEffect, useRef, useState } from "react";

export interface BoardData {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  texture: string;
  size: [number, number, number];
}

export const BOARDS: BoardData[] = [
  { id: "arduino", name: "Arduino Uno", subtitle: "ATmega328P · 14 Digital I/O", color: "#0066CC", texture: "/boards/arduino.png", size: [2.7, 0.08, 2.1] },
  { id: "pico", name: "Raspberry Pi Pico", subtitle: "RP2040 · Dual-Core ARM Cortex-M0+", color: "#22C55E", texture: "/boards/pico.png", size: [2.1, 0.08, 1.05] },
  { id: "esp32", name: "ESP32", subtitle: "Xtensa LX6 · WiFi + Bluetooth", color: "#3B82F6", texture: "/boards/esp32.png", size: [1.4, 0.06, 0.75] },
  { id: "stm32", name: "STM32 Blue Pill", subtitle: "STM32F103C8T6 · ARM Cortex-M3", color: "#0044AA", texture: "/boards/stm32.png", size: [2.0, 0.06, 1.3] },
];

const INTERVAL = 3500;

export function useCarouselLogic() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timer = useRef<any>(null);

  const resetTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setActiveIndex((p) => (p + 1) % BOARDS.length), INTERVAL);
  }, []);

  const goTo = useCallback((i: number) => {
    setActiveIndex(i);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => { resetTimer(); return () => clearInterval(timer.current); }, [resetTimer]);

  return { activeIndex, goTo, board: BOARDS[activeIndex], boards: BOARDS };
}
