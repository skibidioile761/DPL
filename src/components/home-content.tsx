"use client";

import Cookies from "js-cookie";
import { Link2, Search, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { InteractiveButton } from "@/components/interactive-button";
import { SectionReveal } from "@/components/section-reveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const oauthError = searchParams.get("error");

  useEffect(() => {
    const recent = Cookies.get("lastSearchUsername");
    if (recent) setUsername(recent);
  }, []);


  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = username.trim().toLowerCase();

    if (!normalized) {
      setError("Username không được để trống.");
      return;
    }

    if (!/^[a-z0-9_.-]{2,32}$/i.test(normalized)) {
      setError("Username chỉ gồm chữ, số, _, ., - và từ 2-32 ký tự.");
      return;
    }

    setError("");
    Cookies.set("lastSearchUsername", normalized, { expires: 365 });
    router.push(`/${normalized}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:px-10">
      <motion.section
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[var(--surface)]/75 p-7 shadow-[0_24px_90px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-10"
      >
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : 0.1,
                },
              },
            }}
            className="space-y-5"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[var(--text-secondary)]"
            >
              <Sparkles size={14} />
              Premium Discord Identity
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--text-primary)] sm:text-6xl"
            >
              Discord Profile Hub
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE }}
              className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg"
            >
              Kết nối Discord để lấy tên, avatar và tạo profile cá nhân. Người khác có thể tìm kiếm bạn hoặc truy cập trực tiếp link profile của bạn trên website.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-wrap items-center gap-3"
            >
              <InteractiveButton onClick={() => router.push("/api/discord/connect")}>Connect Discord</InteractiveButton>
            </motion.div>

            {oauthError && (
              <p className="text-sm text-amber-300">
                Không thể kết nối Discord ({oauthError}). Kiểm tra lại cấu hình OAuth.
              </p>
            )}
          </motion.div>

          <motion.div
            id="search"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.7, ease: EASE }}
            className="rounded-3xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl"
          >
            <p className="mb-3 text-sm text-[var(--text-secondary)]">Search Discord username</p>
            <form onSubmit={onSubmit} className="space-y-3">
              <label htmlFor="discord-username" className="sr-only">
                Enter Discord username
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[var(--background)]/90 px-4 py-3 focus-within:border-[var(--accent)]/70">
                <Search size={18} className="text-[var(--text-muted)]" />
                <input
                  id="discord-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Discord username"
                  className="w-full bg-transparent text-base text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </div>

              <motion.p
                key={error}
                initial={error ? { opacity: 0, y: -4 } : false}
                animate={
                  error
                    ? { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
                    : { opacity: 0, y: -4, x: 0 }
                }
                transition={{ duration: 0.36 }}
                className="min-h-5 text-xs text-rose-300"
              >
                {error}
              </motion.p>

              <InteractiveButton type="submit" className="w-full justify-center">
                View Profile
              </InteractiveButton>
            </form>

          </motion.div>
        </div>
      </motion.section>

      <SectionReveal id="about" delay={0.08} className="mt-14 rounded-3xl border border-white/10 bg-[var(--surface)]/65 p-6 backdrop-blur-xl sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <h3 className="text-base font-medium text-[var(--text-primary)]">Giới thiệu website</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Đây là nền tảng tạo profile Discord cá nhân với giao diện tối giản, mượt và hiện đại. Bạn có thể kết nối tài khoản,
              cập nhật mô tả/sở thích và quản lý hồ sơ trong dashboard.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <h3 className="text-base font-medium text-[var(--text-primary)]">Chia sẻ & tìm kiếm</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Người khác có thể xem profile của bạn qua link dạng
              <span className="mx-1 inline-flex items-center gap-1 text-[var(--text-primary)]">
                <Link2 size={13} /> /username
              </span>
              hoặc dùng ô tìm kiếm ở trang chủ để truy cập nhanh.
            </p>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
