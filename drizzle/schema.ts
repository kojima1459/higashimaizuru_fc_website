import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * お知らせ記事テーブル
 */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  mainCategory: mysqlEnum("mainCategory", ["練習", "試合", "連絡事項", "その他"]).notNull(),
  subCategory: mysqlEnum("subCategory", ["U7", "U8", "U9", "U10", "U11", "U12", "全体", "その他"]).notNull(),
  authorId: int("authorId"), // nullableに変更（認証不要のため）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

/**
 * 試合結果テーブル
 */
export const matchResults = mysqlTable("match_results", {
  id: int("id").autoincrement().primaryKey(),
  matchTitle: varchar("matchTitle", { length: 15 }).notNull(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  ourScore: int("ourScore").notNull(),
  opponentScore: int("opponentScore").notNull(),
  matchDate: timestamp("matchDate").notNull(),
  category: mysqlEnum("category", ["U7", "U8", "U9", "U10", "U11", "U12", "その他"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchResult = typeof matchResults.$inferSelect;
export type InsertMatchResult = typeof matchResults.$inferInsert;

/**
 * お問い合わせテーブル
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * BBS投稿テーブル
 */
export const bbsPosts = mysqlTable("bbs_posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BbsPost = typeof bbsPosts.$inferSelect;
export type InsertBbsPost = typeof bbsPosts.$inferInsert;

/**
 * BBSコメントテーブル
 */
export const bbsComments = mysqlTable("bbs_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BbsComment = typeof bbsComments.$inferSelect;
export type InsertBbsComment = typeof bbsComments.$inferInsert;

/**
 * スケジュールテーブル
 */
export const schedules = mysqlTable("schedules", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  eventType: mysqlEnum("eventType", ["練習", "試合", "大会", "その他"]).notNull(),
  grade: mysqlEnum("grade", ["U7", "U8", "U9", "U10", "U11", "U12", "全体"]).notNull(),
  opponent: varchar("opponent", { length: 255 }),
  eventDate: timestamp("eventDate").notNull(),
  meetingTime: varchar("meetingTime", { length: 5 }),
  venue: varchar("venue", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;

/**
 * 写真ギャラリーテーブル
 */
export const photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  caption: text("caption"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  category: mysqlEnum("category", ["練習風景", "試合", "イベント", "その他"]).notNull(),
  uploadedBy: int("uploadedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

/**
 * 管理画面パスワードテーブル
 */
export const adminPassword = mysqlTable("admin_password", {
  id: int("id").autoincrement().primaryKey(),
  password: varchar("password", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminPassword = typeof adminPassword.$inferSelect;
export type InsertAdminPassword = typeof adminPassword.$inferInsert;
