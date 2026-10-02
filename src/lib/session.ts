type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

type CookieWriter = {
  set: (
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      maxAge?: number;
      secure?: boolean;
    },
  ) => void;
};

export const SESSION_COOKIE = "discordSession";
export const OAUTH_STATE_COOKIE = "discordOauthState";

export type SessionUser = {
  discordId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
};

export function encodeSession(session: SessionUser): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value?: string | null): SessionUser | null {
  if (!value) return null;
  try {
    const text = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(text) as SessionUser;
    if (!parsed?.discordId || !parsed?.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getSessionFromRequestCookies(cookies: CookieReader): SessionUser | null {
  const raw = cookies.get(SESSION_COOKIE)?.value;
  return decodeSession(raw);
}

export function setSessionCookie(cookies: CookieWriter, session: SessionUser) {
  cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(cookies: CookieWriter) {
  cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
}
