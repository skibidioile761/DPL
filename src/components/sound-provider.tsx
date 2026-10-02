"use client";

import Cookies from "js-cookie";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const cookie = Cookies.get("soundEnabled");
    if (cookie) {
      setSoundEnabled(cookie === "true");
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setReducedMotion(media.matches);
    updateReduced();
    media.addEventListener("change", updateReduced);

    const audio = new Audio("/sounds/click.wav");
    audio.preload = "auto";
    audio.volume = 0.22;
    audioRef.current = audio;

    return () => media.removeEventListener("change", updateReduced);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      Cookies.set("soundEnabled", String(next), { expires: 365 });
      return next;
    });
  }, []);

  const playClick = useCallback(() => {
    if (!soundEnabled || reducedMotion || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => undefined);
  }, [reducedMotion, soundEnabled]);

  const value = useMemo(
    () => ({ soundEnabled, toggleSound, playClick }),
    [soundEnabled, toggleSound, playClick],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used inside SoundProvider");
  }
  return context;
}
