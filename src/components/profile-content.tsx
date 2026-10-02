"use client";

import Cookies from "js-cookie";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InteractiveButton } from "@/components/interactive-button";

type PublicProfile = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  status: "online" | "idle" | "offline";
  interests: string[];
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ProfileContent({ profile }: { profile: PublicProfile }) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Cookies.set("currentProfile", profile.username, { expires: 365 });
    const key = `visitCount_${profile.username}`;
    const currentCount = Number(Cookies.get(key) ?? "0") || 0;
    Cookies.set(key, String(currentCount + 1), { expires: 365 });
  }, [profile.username]);

  const copyUsername = async () => {
    await navigator.clipboard.writeText(profile.username);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:px-10">
      <motion.section
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: EASE }}
        className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[var(--surface)]/75 p-6 shadow-[0_30px_80px_rgba(0,0,0,.34)] backdrop-blur-xl sm:p-10"
      >
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-[var(--accent)]/18 blur-3xl" />

        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.65, ease: EASE }}
            className="rounded-3xl border border-white/10 bg-black/35 p-7"
          >
            <div className="relative mx-auto h-36 w-36">
              <div className="absolute inset-0 rounded-full bg-[var(--accent)]/35 blur-2xl" />
              <Image
                src={profile.avatarUrl}
                alt={`${profile.username} avatar`}
                width={144}
                height={144}
                className="relative rounded-full border border-white/15 bg-black/50 object-cover"
              />
            </div>

            <h1 className="mt-6 text-center text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
              {profile.displayName}
            </h1>
            <p className="mt-1 text-center text-sm text-[var(--text-muted)]">@{profile.username}</p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  profile.status === "online"
                    ? "bg-emerald-400"
                    : profile.status === "idle"
                      ? "bg-amber-300"
                      : "bg-zinc-500"
                }`}
              />
              <span className="text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">{profile.status}</span>
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-3xl border border-white/10 bg-black/30 p-5"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Giới thiệu</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {profile.bio || "Chưa có mô tả. Hãy vào dashboard để cập nhật hồ sơ của bạn."}
              </p>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-3xl border border-white/10 bg-black/30 p-5"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Sở thích</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.length ? (
                  profile.interests.map((interest) => (
                    <span key={interest} className="rounded-xl bg-white/6 px-3 py-1 text-sm text-[var(--text-primary)]">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--text-secondary)]">Chưa cập nhật sở thích.</span>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-wrap gap-3"
            >
              <InteractiveButton onClick={copyUsername} className="inline-flex items-center gap-2">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copy Discord username
              </InteractiveButton>
              <InteractiveButton variant="secondary" onClick={() => router.push("/")}>
                Search user khác
              </InteractiveButton>
              <InteractiveButton
                variant="ghost"
                className="inline-flex items-center gap-2"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size={16} />
                Back to home
              </InteractiveButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 10 }}
        transition={{ duration: 0.26, ease: EASE }}
        className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[var(--surface)]/90 px-4 py-2 text-sm text-[var(--text-primary)] shadow-lg backdrop-blur-xl"
      >
        Copied to clipboard
      </motion.div>
    </div>
  );
}
