"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { InteractiveButton } from "@/components/interactive-button";

export function NotFoundView() {
  const router = useRouter();

  return (
    <div className="mx-auto grid min-h-[72vh] w-full max-w-4xl place-items-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[var(--surface)]/75 p-8 text-center backdrop-blur-xl"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">404 • Profile Missing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">User not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          Không tìm thấy profile tương ứng. Hãy quay lại trang chủ để tìm kiếm username khác hoặc kết nối Discord để tạo profile mới.
        </p>
        <div className="mt-7 flex justify-center">
          <InteractiveButton onClick={() => router.push("/")}>Back to Home</InteractiveButton>
        </div>
      </motion.div>
    </div>
  );
}
