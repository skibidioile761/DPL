"use client";

import Cookies from "js-cookie";
import { MoonStar, Sun, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { InteractiveButton } from "@/components/interactive-button";
import { PageTransition } from "@/components/page-transition";
import { SoundProvider, useSound } from "@/components/sound-provider";

function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { soundEnabled, toggleSound } = useSound();

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = Cookies.get("theme") as "dark" | "light" | undefined;
    if (savedTheme) setTheme(savedTheme);

    const hasVisited = Cookies.get("hasVisited") === "true";
    const delay = hasVisited ? 360 : 880;
    setShowIntro(true);
    const timer = window.setTimeout(() => {
      setShowIntro(false);
      Cookies.set("hasVisited", "true", { expires: 365 });
    }, delay);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    Cookies.set("theme", theme, { expires: 365 });
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/#search", label: "Search" },
      { href: "/#about", label: "About" },
      { href: "/dashboard", label: "Dashboard" },
    ],
    [],
  );

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--background)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="noise-layer" />
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl"
              animate={{ x: [0, 30, -10, 0], y: [0, 20, -10, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-white/6 blur-3xl"
              animate={{ x: [0, -30, 12, 0], y: [0, -20, 10, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-black/55 shadow-[0_8px_30px_rgba(0,0,0,.25)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="text-lg font-semibold tracking-[-0.03em]">
            DZ
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
            >
              {theme === "dark" ? <Sun size={17} /> : <MoonStar size={17} />}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle click sound"
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[var(--text-secondary)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)] md:hidden"
            >
              <span className="relative h-4 w-5">
                <motion.span
                  animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-[6px] h-[2px] w-5 rounded-full bg-current"
                />
                <motion.span
                  animate={menuOpen ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-3 h-[2px] w-5 rounded-full bg-current"
                />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
              className="border-t border-white/10 bg-black/80 px-5 py-4 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl bg-white/5 px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <div className="max-w-xl">
            <p className="text-sm text-[var(--text-primary)]">Discord Profile Hub</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              Kết nối Discord để tạo profile cá nhân, chỉnh mô tả/sở thích và chia sẻ bằng link công khai để người khác tìm kiếm hoặc truy cập trực tiếp.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]" href="/dashboard">
              Dashboard
            </a>
            <a className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]" href="/#search">
              Search
            </a>
            <InteractiveButton
              variant="ghost"
              className="px-4 py-2 text-xs"
              onClick={async () => navigator.clipboard.writeText(window.location.origin)}
            >
              Copy website link
            </InteractiveButton>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-[#080808]"
          >
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="text-5xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">DPH</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Discord Profile Hub</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SoundProvider>
      <AppFrame>{children}</AppFrame>
    </SoundProvider>
  );
}
