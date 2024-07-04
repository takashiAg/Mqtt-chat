import { Hono } from "hono";
import { user } from "./schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as hash from "./utils/hash";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import * as auth from "./utils/auth";

type Bindings = {
  DB: D1Database;

  PRIVATE_KEY: string;
  PUBLIC_KEY: string;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

type SignupDto = {
  email: string;
  password: string;
};
app.post("/signup", async (c) => {
  const params = await c.req.json<SignupDto>();

  const email = params.email;
  const password = params.password;

  const hashedPassword = await hash.hash(password);

  const db = drizzle(c.env.DB);

  await db.insert(user).values({ email, password: hashedPassword }).execute();

  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  const foundUser = result?.[0];
  if (!foundUser) throw new Error("user not found");

  const PRIVATE_KEY = env(c)?.PRIVATE_KEY;
  const token = await auth.getToken(
    { email, id: `{foundUser.id}` },
    PRIVATE_KEY
  );

  return c.json({ token });
});

type LoginDto = {
  email: string;
  password: string;
};
app.post("/signin", async (c) => {
  const params = await c.req.json<LoginDto>();

  const email = params.email;
  const password = params.password;

  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  const foundUser = result?.[0];
  if (!foundUser) throw new Error("user not found");

  const isAuthenticated = await hash.compare(foundUser?.password, password);
  if (!isAuthenticated) throw new Error("user not found");

  const PRIVATE_KEY = env(c)?.PRIVATE_KEY;
  const token = await auth.getToken(
    { email, id: `${foundUser.id}` },
    PRIVATE_KEY
  );

  return c.json({ token });
});

app.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split?.(" ")?.[1];
  if (!token) throw new Error("token not found");

  const PUBLIC_KEY = env(c)?.PUBLIC_KEY;

  const { email, ...payload } = await auth.verifyToken(token, PUBLIC_KEY);
  console.log(payload);
  // 混ん感じで他のpayloadも取得できる
  // const { email, ...payload } = await auth.verifyToken(token, PUBLIC_KEY);

  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  const result2 = result?.[0];
  const userId = result2?.id;

  if (!userId) throw new Error("user not found");

  return c.json({ message: "me", userId, email });
});

export default app;
