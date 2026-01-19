import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, news, InsertNews, matchResults, InsertMatchResult, contacts, InsertContact, bbsPosts, InsertBbsPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// お知らせ記事関連
export async function getAllNews(category?: string) {
  const db = await getDb();
  if (!db) return [];

  if (category && category !== "全ての記事") {
    return await db.select().from(news).where(eq(news.category, category as any)).orderBy(desc(news.createdAt));
  }
  return await db.select().from(news).orderBy(desc(news.createdAt));
}

export async function getNewsById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNews(data: InsertNews) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(news).values(data);
  return result;
}

export async function updateNews(id: number, data: Partial<InsertNews>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(news).set(data).where(eq(news.id, id));
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(news).where(eq(news.id, id));
}

// 試合結果関連
export async function getAllMatchResults() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(matchResults).orderBy(desc(matchResults.matchDate));
}

export async function createMatchResult(data: InsertMatchResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(matchResults).values(data);
  return result;
}

export async function updateMatchResult(id: number, data: Partial<InsertMatchResult>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(matchResults).set(data).where(eq(matchResults.id, id));
}

export async function deleteMatchResult(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(matchResults).where(eq(matchResults.id, id));
}

// お問い合わせ関連
export async function createContact(data: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contacts).values(data);
  return result;
}

export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

// BBS投稿関連
export async function getAllBbsPosts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bbsPosts).orderBy(desc(bbsPosts.createdAt));
}

export async function createBbsPost(data: InsertBbsPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bbsPosts).values(data);
  return result;
}

export async function deleteBbsPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(bbsPosts).where(eq(bbsPosts.id, id));
}
