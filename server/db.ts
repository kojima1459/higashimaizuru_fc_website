import { eq, desc, and, like, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, news, InsertNews, matchResults, InsertMatchResult, contacts, InsertContact, bbsPosts, InsertBbsPost, schedules, InsertSchedule, photos, InsertPhoto, Photo, adminPassword, bbsComments, InsertBbsComment } from "../drizzle/schema";
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
export async function getAllNews(filters?: { mainCategory?: string; subCategory?: string }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.mainCategory && filters.mainCategory !== "全ての記事") {
    conditions.push(eq(news.mainCategory, filters.mainCategory as any));
  }

  if (filters?.subCategory && filters.subCategory !== "全て") {
    conditions.push(eq(news.subCategory, filters.subCategory as any));
  }

  if (conditions.length > 0) {
    return await db.select().from(news).where(and(...conditions)).orderBy(desc(news.createdAt));
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
export async function getAllMatchResults(filters?: {
  matchTitle?: string;
  opponent?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.matchTitle) {
    conditions.push(like(matchResults.matchTitle, `%${filters.matchTitle}%`));
  }

  if (filters?.opponent) {
    conditions.push(like(matchResults.opponent, `%${filters.opponent}%`));
  }

  if (filters?.category && filters.category !== "全て") {
    conditions.push(eq(matchResults.category, filters.category as any));
  }

  if (filters?.startDate) {
    conditions.push(gte(matchResults.matchDate, new Date(filters.startDate)));
  }

  if (filters?.endDate) {
    conditions.push(lte(matchResults.matchDate, new Date(filters.endDate)));
  }

  if (conditions.length > 0) {
    return await db.select().from(matchResults).where(and(...conditions)).orderBy(desc(matchResults.matchDate));
  }

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

// BBSコメント関連
export async function getAllBbsComments(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bbsComments).where(eq(bbsComments.postId, postId)).orderBy(desc(bbsComments.createdAt));
}

export async function createBbsComment(data: InsertBbsComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bbsComments).values(data);
  return result;
}

export async function deleteBbsComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(bbsComments).where(eq(bbsComments.id, id));
}

// スケジュール関連
export async function getAllSchedules(filters?: {
  opponent?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.opponent) {
    conditions.push(like(schedules.opponent, `%${filters.opponent}%`));
  }

  if (filters?.eventType && filters.eventType !== "全て") {
    conditions.push(eq(schedules.eventType, filters.eventType as any));
  }

  if (filters?.startDate) {
    conditions.push(gte(schedules.eventDate, new Date(filters.startDate)));
  }

  if (filters?.endDate) {
    conditions.push(lte(schedules.eventDate, new Date(filters.endDate)));
  }

  if (conditions.length > 0) {
    return await db.select().from(schedules).where(and(...conditions)).orderBy(desc(schedules.eventDate));
  }

  return await db.select().from(schedules).orderBy(desc(schedules.eventDate));
}

export async function createSchedule(data: InsertSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(schedules).values(data);
  return result;
}

export async function updateSchedule(id: number, data: Partial<InsertSchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(schedules).set(data).where(eq(schedules.id, id));
}

export async function deleteSchedule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(schedules).where(eq(schedules.id, id));
}

// ==================== Photos ====================

export async function getAllPhotos(filters?: { category?: string }): Promise<Photo[]> {
  const db = await getDb();
  if (!db) return [];

  if (filters?.category && filters.category !== "全て") {
    return await db.select().from(photos).where(eq(photos.category, filters.category as any)).orderBy(desc(photos.createdAt));
  }

  return await db.select().from(photos).orderBy(desc(photos.createdAt));
}

export async function getPhotoById(id: number): Promise<Photo | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(photos).where(eq(photos.id, id));
  return result[0] || null;
}

export async function createPhoto(data: InsertPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(photos).values(data);
  return result;
}

export async function deletePhoto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(photos).where(eq(photos.id, id));
}

// Admin Password helpers
export async function getAdminPassword() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(adminPassword).limit(1);
  return result[0] || null;
}

export async function updateAdminPassword(newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .update(adminPassword)
    .set({ password: newPassword })
    .where(eq(adminPassword.id, 1));
  return result;
}

export async function initializeAdminPassword(initialPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getAdminPassword();
  if (!existing) {
    await db.insert(adminPassword).values({
      password: initialPassword,
    });
  }
}
