import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discordProfiles } from "@/db/schema";
import { OAUTH_STATE_COOKIE, setSessionCookie, type SessionUser } from "@/lib/session";

function fallbackAvatar(username: string) {
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(username)}&backgroundColor=111827`;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/?error=oauth_state_invalid", request.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/?error=discord_not_configured", request.url));
  }

  const redirectUri = `${request.nextUrl.origin}/api/discord/callback`;

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
  }

  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenJson.access_token;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/?error=missing_access_token", request.url));
  }

  const meRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!meRes.ok) {
    return NextResponse.redirect(new URL("/?error=discord_profile_failed", request.url));
  }

  const me = (await meRes.json()) as {
    id: string;
    username: string;
    avatar: string | null;
    global_name: string | null;
    discriminator?: string;
  };

  const normalizedUsername = me.username.toLowerCase();
  const avatarUrl = me.avatar
    ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=256`
    : fallbackAvatar(me.username);

  await db
    .insert(discordProfiles)
    .values({
      discordId: me.id,
      username: normalizedUsername,
      displayName: me.global_name || me.username,
      avatarUrl,
      bio: "",
      status: "online",
      interests: [],
    })
    .onConflictDoUpdate({
      target: discordProfiles.discordId,
      set: {
        username: normalizedUsername,
        displayName: me.global_name || me.username,
        avatarUrl,
        updatedAt: new Date(),
      },
    });

  const session: SessionUser = {
    discordId: me.id,
    username: normalizedUsername,
    displayName: me.global_name || me.username,
    avatarUrl,
  };

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
  setSessionCookie(response.cookies, session);

  return response;
}
