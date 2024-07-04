import { Context } from "hono";
import Session from "../lib/session";
import { getCookie, setCookie } from "hono/cookie";

const SESSION_EXPIRE = 60 * 60 * 24;

function generateAndSetSessionId(c: Context) {
  const sessionId = crypto.randomUUID();
  setCookie(c, "session_id", sessionId, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_EXPIRE,
  });
  return sessionId;
}

export const sessionMiddleware = async (
  c: Context,
  next: () => Promise<void>
) => {
  const sessionId = getCookie(c, "session_id") || generateAndSetSessionId(c);
  c.set("session", new Session(c, sessionId, SESSION_EXPIRE));
  await next();
};
