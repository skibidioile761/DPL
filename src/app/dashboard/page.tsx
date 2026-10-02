import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";
import { db } from "@/db";
import { discordProfiles } from "@/db/schema";
import { getSessionFromRequestCookies } from "@/lib/session";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = getSessionFromRequestCookies(cookieStore);

  if (!session) {
    redirect("/");
  }

  const rows = await db
    .select()
    .from(discordProfiles)
    .where(eq(discordProfiles.discordId, session.discordId))
    .limit(1);

  const profile = rows[0];
  if (!profile) {
    redirect("/");
  }

  return (
    <DashboardContent
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
