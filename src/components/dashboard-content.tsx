"use client";

import { LogOut, Save } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InteractiveButton } from "@/components/interactive-button";

type DashboardContentProps = {
  profile: {
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    status: "online" | "idle" | "offline";
    interests: string[];
  };
};

export function DashboardContent({ profile }: DashboardContentProps) {
  const router = useRouter();
  const [bio, setBio] = useState(profile.bio);
  const [status, setStatus] = useState<"online" | "idle" | "offline">(profile.status);
  const [interestsText, setInterestsText] = useState(profile.interests.join(", "));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");
    const interests = interestsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, status, interests }),
    });

    setSaving(false);
    if (!res.ok) {
      setMessage("Không thể lưu thay đổi. Vui lòng thử lại.");
      return;
    }

    setMessage("Đã lưu thành công.");
    router.refresh();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8 lg:px-10">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] border border-white/10 bg-[var(--surface)]/75 p-6 backdrop-blur-xl sm:p-9"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatarUrl}
              alt={`${profile.username} avatar`}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border border-white/10"
            />
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">Dashboard</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {profile.displayName} • @{profile.username}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <InteractiveButton variant="secondary" onClick={() => router.push(`/${profile.username}`)}>
              Xem public profile
            </InteractiveButton>
            <InteractiveButton variant="ghost" onClick={logout} className="inline-flex items-center gap-2">
              <LogOut size={15} /> Log out
            </InteractiveButton>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Mô tả</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              rows={4}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/70"
              placeholder="Viết vài dòng giới thiệu về bạn..."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Sở thích / kỹ năng (cách nhau bằng dấu phẩy)</span>
            <input
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/70"
              placeholder="UI/UX, Motion, TypeScript"
            />
          </label>

          <label className="grid gap-2 sm:max-w-xs">
            <span className="text-sm text-[var(--text-secondary)]">Trạng thái</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "online" | "idle" | "offline")}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/70"
            >
              <option value="online">Online</option>
              <option value="idle">Idle</option>
              <option value="offline">Offline</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <InteractiveButton onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-2">
            <Save size={15} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </InteractiveButton>
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        </div>
      </motion.section>
    </div>
  );
}
