import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProfileContent } from "@/components/profile-content";
import { db } from "@/db";
import { discordProfiles } from "@/db/schema";

export default async function DiscordProfilePage({
  params,
}: {
  params: Promise<{ discordName: string }>;
}) {
  const { discordName } = await params;
  const normalized = discordName.toLowerCase().trim();

  if (!/^[a-z0-9_.-]{2,32}$/i.test(normalized)) {
    notFound();
  }

  const rows = await db
    .select()
    .from(discordProfiles)
    .where(eq(discordProfiles.username, normalized))
    .limit(1);

  const profile = rows[0];
  if (!profile) {
    notFound();
  }

  return (
    <ProfileContent
      profile={{
        username: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        status: (profile.status as "online" | "idle" | "offline") || "online",
        interests: profile.interests,
      }}
    />
  );
}
