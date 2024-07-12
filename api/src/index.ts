import { Hono, Context } from "hono";
import { html } from "hono/html";
import { sessionMiddleware } from "./middleware/session";
import { eq } from "drizzle-orm";
import * as auth from "./middleware/auth";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { room, message, user, userTag } from "./schema";
import { drizzle } from "drizzle-orm/d1";
import mqtt from "mqtt"; // import namespace "mqtt"

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
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"], // 本番と開発環境のURL
    credentials: true,
  })
);
app.use("/*", sessionMiddleware);

app.get("/", (c) => {
  return c.html(loginPage);
});

/*
 * 部屋作成
 */
type CreateRoomDto = {
  neme: string;
};
app.post("/room", async (c: Context) => {
  const params = await c.req.json<CreateRoomDto>();

  const name = params.name;

  const session = c.get("session");
  const userId = session.get("id");

  const db = drizzle(c.env.DB);
  const result = await db.insert(room).values({ name }).execute();
  const roomId = result.meta.last_row_id;

  return c.json({ message: "created", roomId });
});

/*
 * 部屋 一覧
 */
app.get("/room", async (c: Context) => {
  const session = await c.get("session");
  const userId = await session.get("id");

  const db = drizzle(c.env.DB);
  const result = await db.select().from(room);

  return c.json(result);
});

/*
 * メッセージ 投稿
 */

type CreateMessageDto = {
  message: string;
  roomId: number;
};
app.post("/message", async (c: Context) => {
  const params = await c.req.json<CreateMessageDto>();

  const messageText = params.message;
  const roomId: number = params.roomId;

  const session = await c.get("session");
  const userId = (await session.get("id")) as string;

  const db = drizzle(c.env.DB);
  const result = await db
    .insert(message)
    .values({ roomId, message: messageText, userId })
    .execute();
  const messageId = result.meta.last_row_id;

  // TODO: ハードコーディングしちゃったけど、ここは環境変数とかで設定できるようにしたい
  const client = await mqtt.connectAsync("mqtt://localhost:15675");
  await client.publishAsync(`room/${roomId}`, "you should reload message");

  return c.json({ message: "created", messageId });
});

/*
 * メッセージ 一覧
 */

type ListMessageDto = {
  message: string;
  roomId: number;
};
app.get("/message", async (c: Context) => {
  const session = await c.get("session");
  const userId = await session.get("id");

  // 一旦500になるけど無視！
  const roomId = parseInt((await c.req.query("roomId")) ?? "");

  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(message)
    .where(eq(message.roomId, roomId));

  const messages = result.map((m) => {
    return {
      ...m,
      mine: m.userId === userId,
    };
  });

  return c.json(messages);
});

/*
 * ユーザー更新
 */

type UpdateUserDto = {
  name: string;
};
app.put("/user", async (c: Context) => {
  const params = await c.req.json<UpdateUserDto>();

  const name = params.name;

  const session = await c.get("session");
  const userId = (await session.get("id")) as string;

  const db = drizzle(c.env.DB);
  const result = await db
    .update(user)
    .set({ name })
    .where(eq(user.id, userId))
    .execute();

  return c.json({ message: "updated" });
});

/*
 * ユーザー取得
 */

app.get("/user/:userId", async (c: Context) => {
  const userIdQuery = (await c.req.param("userId")) ?? "";

  const loginUserId = (await (await c.get("session")).get("id")) ?? "";

  const userId = parseInt(userIdQuery === "me" ? loginUserId : userIdQuery);

  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  const targetUser = result?.[0];

  if (!targetUser) return c.json({ message: "user not found" }, 404);

  const tag = await db.select().from(userTag).where(eq(userTag.userId, userId));

  return c.json({ ...targetUser, tag });
});

app.post("/verify-token", async (c: Context) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split?.(" ")?.[1];
  if (!token) throw new Error("token not found");

  const PUBLIC_KEY = env(c)?.PUBLIC_KEY;

  const {
    email,
    id: _id,
    ...payload
  } = await auth.verifyToken(token, PUBLIC_KEY);

  const id = parseInt(_id);

  const db = drizzle(c.env.DB);
  const userResult = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .limit(1);
  if (!userResult?.[0]) await db.insert(user).values({ id }).execute();

  const session = await c.get("session");
  await session.set("email", email);
  await session.set("id", id);

  return c.json({ message: "verified!", email, id });
});

export default app;
