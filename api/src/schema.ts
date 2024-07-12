import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const message = sqliteTable("message", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  roomId: integer("roomId", { mode: "number" }).notNull(),

  message: text("message").notNull(),

  userId: integer("userId", { mode: "number" }).notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const room = sqliteTable("room", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const user = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey(),

  name: text("name")
    .default(sql`''`)
    .notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),

  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const userTag = sqliteTable("userTag", {
  id: integer("id", { mode: "number" }).primaryKey(),

  userId: integer("userId", { mode: "number" })
    .references(() => user.id)
    .notNull(), // 外部キーとして設定

  key: text("key").notNull(),
  value: text("value").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});
