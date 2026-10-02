"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useCallback, useState, type MouseEvent, type ReactNode } from "react";
import { useSound } from "@/components/sound-provider";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type InteractiveButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function InteractiveButton({
  children,
  className = "",
  variant = "primary",
  onClick,
  ...props
}: InteractiveButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const { playClick } = useSound();

  const variantStyles: Record<string, string> = {
    primary:
      "bg-[var(--accent)] text-white border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,.06),0_10px_30px_rgba(88,101,242,.26)] hover:bg-[var(--accent-light)]",
    secondary:
      "bg-[var(--surface)] text-[var(--text-primary)] border border-white/10 hover:bg-[var(--surface-hover)]",
    ghost:
      "bg-transparent text-[var(--text-primary)] border border-white/10 hover:bg-white/5",
  };

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const nextRipple: Ripple = {
        id: Date.now(),
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
      };

      setRipples((prev) => [...prev, nextRipple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== nextRipple.id));
      }, 700);

      playClick();
      onClick?.(event);
    },
    [onClick, playClick],
  );

  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl px-5 py-3 text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute inset-0">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/25"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              transform: "scale(0)",
              animation: "ripple 680ms ease-out forwards",
            }}
          />
        ))}
      </span>
    </motion.button>
  );
}
