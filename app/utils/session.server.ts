import { createCookieSessionStorage } from "react-router";

const sessionSecret = process.env.SESSION_SECRET || "super-secret-key-change-in-production";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

export const { getSession, commitSession, destroySession } = storage;
