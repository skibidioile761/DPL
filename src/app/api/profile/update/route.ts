import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discordProfiles } from "@/db/schema";
import { getSessionFromRequestCookies } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = getSessionFromRequestCookies(request.cookies);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    bio?: string;
    status?: string;
    interests?: string[];
  };

  const bio = (body.bio ?? "").trim().slice(0, 280);
  const status = ["online", "idle", "offline"].includes(body.status ?? "") ? body.status! : "online";
  const interests = (Array.isArray(body.interests) ? body.interests : [])
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);

  await db
    .update(discordProfiles)
    .set({
      bio,
      status,
      interests,
      updatedAt: new Date(),
    })
    .where(eq(discordProfiles.discordId, session.discordId));

  return NextResponse.json({ ok: true });
}
