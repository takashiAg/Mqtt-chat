import { Hono, Context } from "hono";
import { html } from "hono/html";
import { sessionMiddleware } from "./middleware/session";
import * as auth from "./middleware/auth";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

const loginPage = html`
  <form>
    <input />
    <input />
    <button />
  </form>
`;

type Bindings = {
  DB: D1Database;

  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use("/*", cors());
app.use("/*", sessionMiddleware);

app.get("/", (c) => {
  return c.html(loginPage);
});

app.post("/verify-token", async (c: Context) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split?.(" ")?.[1];
  if (!token) throw new Error("token not found");

  const PUBLIC_KEY = env(c)?.PUBLIC_KEY;

  const { email, id, ...payload } = await auth.verifyToken(token, PUBLIC_KEY);

  const session = c.get("session");
  session.set("email", email);
  session.set("id", id);

  return c.json({ message: "verified!", email, id });
});

export default app;
