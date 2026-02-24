// server/_core/vercel.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, desc, and, like, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  mainCategory: mysqlEnum("mainCategory", ["\u7DF4\u7FD2", "\u8A66\u5408", "\u9023\u7D61\u4E8B\u9805", "\u305D\u306E\u4ED6"]).notNull(),
  subCategory: mysqlEnum("subCategory", ["U7", "U8", "U9", "U10", "U11", "U12", "\u5168\u4F53", "\u305D\u306E\u4ED6"]).notNull(),
  authorId: int("authorId"),
  // nullableに変更（認証不要のため）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var matchResults = mysqlTable("match_results", {
  id: int("id").autoincrement().primaryKey(),
  matchTitle: varchar("matchTitle", { length: 15 }).notNull(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  ourScore: int("ourScore").notNull(),
  opponentScore: int("opponentScore").notNull(),
  matchDate: timestamp("matchDate").notNull(),
  category: mysqlEnum("category", ["U7", "U8", "U9", "U10", "U11", "U12", "\u305D\u306E\u4ED6"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var bbsPosts = mysqlTable("bbs_posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var bbsComments = mysqlTable("bbs_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var schedules = mysqlTable("schedules", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  eventType: mysqlEnum("eventType", ["\u7DF4\u7FD2", "\u8A66\u5408", "\u5927\u4F1A", "\u305D\u306E\u4ED6"]).notNull(),
  grades: text("grades").notNull(),
  // 複数学年対応（カンマ区切り："U7,U9,U10"）
  opponent: varchar("opponent", { length: 255 }),
  eventDate: timestamp("eventDate").notNull(),
  meetingTime: varchar("meetingTime", { length: 5 }),
  venue: varchar("venue", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var photos = mysqlTable("photos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  caption: text("caption"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  category: mysqlEnum("category", ["\u7DF4\u7FD2\u98A8\u666F", "\u8A66\u5408", "\u30A4\u30D9\u30F3\u30C8", "\u305D\u306E\u4ED6"]).notNull(),
  year: int("year"),
  // 年度（例：2024, 2025）
  eventType: mysqlEnum("eventType", ["\u7DF4\u7FD2", "\u8A66\u5408", "\u5927\u4F1A", "\u4EA4\u6D41\u8A66\u5408", "\u30A4\u30D9\u30F3\u30C8", "\u305D\u306E\u4ED6"]),
  // イベント種別
  uploadedBy: int("uploadedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var adminPassword = mysqlTable("admin_password", {
  id: int("id").autoincrement().primaryKey(),
  password: varchar("password", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getAllNews(filters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.mainCategory && filters.mainCategory !== "\u5168\u3066\u306E\u8A18\u4E8B") {
    conditions.push(eq(news.mainCategory, filters.mainCategory));
  }
  if (filters?.subCategory && filters.subCategory !== "\u5168\u3066") {
    conditions.push(eq(news.subCategory, filters.subCategory));
  }
  if (conditions.length > 0) {
    return await db.select().from(news).where(and(...conditions)).orderBy(desc(news.createdAt));
  }
  return await db.select().from(news).orderBy(desc(news.createdAt));
}
async function getNewsById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createNews(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(news).values(data);
  return result;
}
async function updateNews(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(news).set(data).where(eq(news.id, id));
}
async function deleteNews(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(news).where(eq(news.id, id));
}
async function getAllMatchResults(filters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.matchTitle) {
    conditions.push(like(matchResults.matchTitle, `%${filters.matchTitle}%`));
  }
  if (filters?.opponent) {
    conditions.push(like(matchResults.opponent, `%${filters.opponent}%`));
  }
  if (filters?.category && filters.category !== "\u5168\u3066") {
    conditions.push(eq(matchResults.category, filters.category));
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
async function createMatchResult(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(matchResults).values(data);
  return result;
}
async function updateMatchResult(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(matchResults).set(data).where(eq(matchResults.id, id));
}
async function deleteMatchResult(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(matchResults).where(eq(matchResults.id, id));
}
async function createContact(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contacts).values(data);
  return result;
}
async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}
async function getAllBbsPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bbsPosts).orderBy(desc(bbsPosts.createdAt));
}
async function createBbsPost(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bbsPosts).values(data);
  return result;
}
async function deleteBbsPost(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bbsPosts).where(eq(bbsPosts.id, id));
}
async function getAllBbsComments(postId) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bbsComments).where(eq(bbsComments.postId, postId)).orderBy(desc(bbsComments.createdAt));
}
async function createBbsComment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bbsComments).values(data);
  return result;
}
async function deleteBbsComment(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(bbsComments).where(eq(bbsComments.id, id));
}
async function getAllSchedules(filters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.opponent) {
    conditions.push(like(schedules.opponent, `%${filters.opponent}%`));
  }
  if (filters?.eventType && filters.eventType !== "\u5168\u3066") {
    conditions.push(eq(schedules.eventType, filters.eventType));
  }
  if (filters?.grade && filters.grade !== "all") {
    conditions.push(like(schedules.grades, `%${filters.grade}%`));
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
async function createSchedule(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schedules).values(data);
  const insertId = Number(result[0].insertId);
  const created = await db.select().from(schedules).where(eq(schedules.id, insertId)).limit(1);
  return created[0];
}
async function updateSchedule(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(schedules).set(data).where(eq(schedules.id, id));
  const updated = await db.select().from(schedules).where(eq(schedules.id, id)).limit(1);
  return updated[0];
}
async function deleteSchedule(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(schedules).where(eq(schedules.id, id));
}
async function getAllPhotos(filters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.category && filters.category !== "\u5168\u3066") {
    conditions.push(eq(photos.category, filters.category));
  }
  if (filters?.year) {
    conditions.push(eq(photos.year, filters.year));
  }
  if (filters?.eventType && filters.eventType !== "\u5168\u3066") {
    conditions.push(eq(photos.eventType, filters.eventType));
  }
  if (conditions.length > 0) {
    return await db.select().from(photos).where(and(...conditions)).orderBy(desc(photos.createdAt));
  }
  return await db.select().from(photos).orderBy(desc(photos.createdAt));
}
async function getPhotoById(id) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(photos).where(eq(photos.id, id));
  return result[0] || null;
}
async function createPhoto(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(photos).values(data);
  return result;
}
async function deletePhoto(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(photos).where(eq(photos.id, id));
}
async function getMatchResultsStatistics() {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(matchResults);
  const statsByCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = {
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        totalMatches: 0
      };
    }
    const stats = acc[result.category];
    stats.totalMatches++;
    stats.goalsFor += result.ourScore;
    stats.goalsAgainst += result.opponentScore;
    if (result.ourScore > result.opponentScore) {
      stats.wins++;
    } else if (result.ourScore === result.opponentScore) {
      stats.draws++;
    } else {
      stats.losses++;
    }
    return acc;
  }, {});
  const overallStats = {
    totalMatches: results.length,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0
  };
  results.forEach((result) => {
    overallStats.goalsFor += result.ourScore;
    overallStats.goalsAgainst += result.opponentScore;
    if (result.ourScore > result.opponentScore) {
      overallStats.wins++;
    } else if (result.ourScore === result.opponentScore) {
      overallStats.draws++;
    } else {
      overallStats.losses++;
    }
  });
  return {
    byCategory: statsByCategory,
    overall: overallStats
  };
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // お知らせ記事
  news: router({
    list: publicProcedure.input(z2.object({ mainCategory: z2.string().optional(), subCategory: z2.string().optional() }).optional()).query(async ({ input }) => {
      return await getAllNews(input);
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getNewsById(input.id);
    }),
    create: publicProcedure.input(z2.object({
      title: z2.string().min(1),
      content: z2.string().min(1),
      mainCategory: z2.enum(["\u7DF4\u7FD2", "\u8A66\u5408", "\u9023\u7D61\u4E8B\u9805", "\u305D\u306E\u4ED6"]),
      subCategory: z2.enum(["U7", "U8", "U9", "U10", "U11", "U12", "\u5168\u4F53", "\u305D\u306E\u4ED6"])
    })).mutation(async ({ input, ctx }) => {
      await createNews({
        ...input,
        authorId: ctx.user?.id || null
        // 認証不要のため、authorIdはnullableに設定
      });
      return { success: true };
    }),
    update: publicProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().min(1).optional(),
      content: z2.string().min(1).optional(),
      mainCategory: z2.enum(["\u7DF4\u7FD2", "\u8A66\u5408", "\u9023\u7D61\u4E8B\u9805", "\u305D\u306E\u4ED6"]).optional(),
      subCategory: z2.enum(["U7", "U8", "U9", "U10", "U11", "U12", "\u5168\u4F53", "\u305D\u306E\u4ED6"]).optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateNews(id, data);
      return { success: true };
    }),
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteNews(input.id);
      return { success: true };
    })
  }),
  // 試合結果
  matchResults: router({
    list: publicProcedure.input(z2.object({
      matchTitle: z2.string().optional(),
      opponent: z2.string().optional(),
      category: z2.string().optional(),
      startDate: z2.string().optional(),
      endDate: z2.string().optional()
    }).optional()).query(async ({ input }) => {
      return await getAllMatchResults(input);
    }),
    create: publicProcedure.input(z2.object({
      matchTitle: z2.string().min(1).max(15),
      opponent: z2.string().min(1),
      ourScore: z2.number(),
      opponentScore: z2.number(),
      matchDate: z2.string().transform((str) => new Date(str)),
      category: z2.enum(["U7", "U8", "U9", "U10", "U11", "U12", "\u305D\u306E\u4ED6"]),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      await createMatchResult(input);
      return { success: true };
    }),
    update: publicProcedure.input(z2.object({
      id: z2.number(),
      matchTitle: z2.string().min(1).max(15).optional(),
      opponent: z2.string().min(1).optional(),
      ourScore: z2.number().optional(),
      opponentScore: z2.number().optional(),
      matchDate: z2.string().transform((str) => new Date(str)).optional(),
      category: z2.enum(["U7", "U8", "U9", "U10", "U11", "U12", "\u305D\u306E\u4ED6"]).optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateMatchResult(id, data);
      return { success: true };
    }),
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteMatchResult(input.id);
      return { success: true };
    })
  }),
  // お問い合わせ
  contact: router({
    submit: publicProcedure.input(z2.object({
      name: z2.string().min(1),
      email: z2.string().email(),
      message: z2.string().min(1)
    })).mutation(async ({ input }) => {
      await createContact(input);
      return { success: true };
    }),
    list: publicProcedure.query(async () => {
      return await getAllContacts();
    })
  }),
  // BBS掲示板
  bbs: router({
    list: publicProcedure.query(async () => {
      return await getAllBbsPosts();
    }),
    create: publicProcedure.input(z2.object({
      content: z2.string().min(1),
      authorName: z2.string().min(1).optional()
    })).mutation(async ({ input, ctx }) => {
      await createBbsPost({
        content: input.content,
        authorId: ctx.user?.id || null,
        authorName: input.authorName || ctx.user?.name || "\u540D\u7121\u3057"
      });
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      const post = await getAllBbsPosts().then((posts) => posts.find((p) => p.id === input.id));
      if (!post) {
        throw new TRPCError3({ code: "NOT_FOUND" });
      }
      if (ctx.user.role !== "admin" && post.authorId !== ctx.user.id) {
        throw new TRPCError3({ code: "FORBIDDEN" });
      }
      await deleteBbsPost(input.id);
      return { success: true };
    })
  }),
  // BBSコメント
  bbsComments: router({
    listByPost: publicProcedure.input(z2.object({ postId: z2.number() })).query(async ({ input }) => {
      return await getAllBbsComments(input.postId);
    }),
    create: publicProcedure.input(z2.object({
      postId: z2.number(),
      content: z2.string().min(1),
      authorName: z2.string().min(1).optional()
    })).mutation(async ({ input, ctx }) => {
      await createBbsComment({
        postId: input.postId,
        content: input.content,
        authorId: ctx.user?.id || null,
        authorName: input.authorName || ctx.user?.name || "\u540D\u7121\u3057"
      });
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
      const allPosts = await getAllBbsPosts();
      let targetComment = null;
      for (const post of allPosts) {
        const postComments = await getAllBbsComments(post.id);
        const comment = postComments.find((c) => c.id === input.id);
        if (comment) {
          targetComment = comment;
          break;
        }
      }
      if (!targetComment) {
        throw new TRPCError3({ code: "NOT_FOUND" });
      }
      if (ctx.user.role !== "admin" && targetComment.authorId !== ctx.user.id) {
        throw new TRPCError3({ code: "FORBIDDEN" });
      }
      await deleteBbsComment(input.id);
      return { success: true };
    })
  }),
  // スケジュール
  schedules: router({
    list: publicProcedure.input(z2.object({
      opponent: z2.string().optional(),
      eventType: z2.string().optional(),
      grade: z2.string().optional(),
      startDate: z2.string().optional(),
      endDate: z2.string().optional()
    }).optional()).query(async ({ input }) => {
      return await getAllSchedules(input);
    }),
    create: publicProcedure.input(z2.object({
      title: z2.string().min(1),
      eventType: z2.enum(["\u7DF4\u7FD2", "\u8A66\u5408", "\u5927\u4F1A", "\u305D\u306E\u4ED6"]),
      grades: z2.array(z2.enum(["U7", "U8", "U9", "U10", "U11", "U12", "\u5168\u4F53"])).min(1).max(5),
      opponent: z2.string().optional(),
      eventDate: z2.string().transform((str) => new Date(str)),
      meetingTime: z2.string().optional(),
      venue: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      const { grades, ...rest } = input;
      const created = await createSchedule({ ...rest, grades: grades.join(",") });
      return created;
    }),
    update: publicProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().min(1).optional(),
      eventType: z2.enum(["\u7DF4\u7FD2", "\u8A66\u5408", "\u5927\u4F1A", "\u305D\u306E\u4ED6"]).optional(),
      grades: z2.array(z2.enum(["U7", "U8", "U9", "U10", "U11", "U12", "\u5168\u4F53"])).min(1).max(5).optional(),
      opponent: z2.string().optional(),
      eventDate: z2.string().transform((str) => new Date(str)).optional(),
      meetingTime: z2.string().optional(),
      venue: z2.string().optional(),
      notes: z2.string().optional()
    })).mutation(async ({ input }) => {
      console.log("[DEBUG] schedules.update - input:", JSON.stringify(input, null, 2));
      const { id, grades, ...data } = input;
      const updateData = grades ? { ...data, grades: grades.join(",") } : data;
      console.log("[DEBUG] schedules.update - data to update:", JSON.stringify(updateData, null, 2));
      const updated = await updateSchedule(id, updateData);
      return updated;
    }),
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteSchedule(input.id);
      return { success: true };
    })
  }),
  // 写真ギャラリー
  photos: router({
    list: publicProcedure.input(z2.object({ category: z2.string().optional(), year: z2.number().optional(), eventType: z2.string().optional() }).optional()).query(async ({ input }) => {
      return await getAllPhotos(input);
    }),
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getPhotoById(input.id);
    }),
    upload: publicProcedure.input(z2.object({
      title: z2.string().optional(),
      caption: z2.string().optional(),
      imageUrl: z2.string().min(1),
      imageKey: z2.string().min(1),
      category: z2.enum(["\u7DF4\u7FD2\u98A8\u666F", "\u8A66\u5408", "\u30A4\u30D9\u30F3\u30C8", "\u305D\u306E\u4ED6"]),
      year: z2.number().optional(),
      eventType: z2.enum(["\u7DF4\u7FD2", "\u8A66\u5408", "\u5927\u4F1A", "\u4EA4\u6D41\u8A66\u5408", "\u30A4\u30D9\u30F3\u30C8", "\u305D\u306E\u4ED6"]).optional()
    })).mutation(async ({ input, ctx }) => {
      await createPhoto({
        ...input,
        uploadedBy: ctx.user?.id || null
      });
      return { success: true };
    }),
    delete: publicProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deletePhoto(input.id);
      return { success: true };
    })
  }),
  // 管理画面認証
  admin: router({
    verifyPassword: publicProcedure.input(z2.object({ password: z2.string() })).mutation(async ({ input }) => {
      const correctPassword = process.env.ADMIN_PASSWORD || "kyoto123";
      return { valid: input.password === correctPassword };
    }),
    changePassword: publicProcedure.input(z2.object({
      currentPassword: z2.string(),
      newPassword: z2.string().min(4)
    })).mutation(async ({ input }) => {
      const correctPassword = process.env.ADMIN_PASSWORD || "kyoto123";
      if (input.currentPassword !== correctPassword) {
        throw new TRPCError3({
          code: "UNAUTHORIZED",
          message: "\u73FE\u5728\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093"
        });
      }
      if (input.currentPassword === input.newPassword) {
        throw new TRPCError3({
          code: "BAD_REQUEST",
          message: "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9\u306F\u73FE\u5728\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3068\u7570\u306A\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059"
        });
      }
      return { success: true };
    })
  }),
  // 試合結果統計
  statistics: router({
    matchResults: publicProcedure.query(async () => {
      return await getMatchResultsStatistics();
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/storage.ts
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/uploadHandler.ts
async function handleUpload(req, res) {
  try {
    const { key, data, contentType } = req.body;
    if (!key || !data || !contentType) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const buffer = Buffer.from(data, "base64");
    const result = await storagePut(key, buffer, contentType);
    res.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}

// server/rss.ts
async function generateRSSFeed() {
  const news2 = await getAllNews();
  const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "https://www.higashimaizurufc.com";
  const rssItems = news2.slice(0, 20).map((item) => {
    const pubDate = new Date(item.createdAt).toUTCString();
    const link = `${baseUrl}/news/${item.id}`;
    return `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.content.substring(0, 200)}...]]></description>
      <category><![CDATA[${item.mainCategory}]]></category>
    </item>`;
  }).join("");
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>\u6771\u821E\u9DB4\u30D5\u30C3\u30C8\u30DC\u30FC\u30EB\u30AF\u30E9\u30D6 \u304A\u77E5\u3089\u305B</title>
    <link>${baseUrl}</link>
    <description>\u4EAC\u90FD\u5E9C\u821E\u9DB4\u5E02\u3092\u62E0\u70B9\u3068\u3059\u308B\u5C0F\u5B66\u751F\u3092\u4E2D\u5FC3\u3068\u3057\u305F\u30D5\u30C3\u30C8\u30DC\u30FC\u30EB\u30AF\u30E9\u30D6\u306E\u6700\u65B0\u60C5\u5831</description>
    <language>ja</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;
  return rss;
}
async function generateAtomFeed() {
  const news2 = await getAllNews();
  const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "https://www.higashimaizurufc.com";
  const atomEntries = news2.slice(0, 20).map((item) => {
    const updated = new Date(item.createdAt).toISOString();
    const link = `${baseUrl}/news/${item.id}`;
    return `
  <entry>
    <title><![CDATA[${item.title}]]></title>
    <link href="${link}" />
    <id>${link}</id>
    <updated>${updated}</updated>
    <summary><![CDATA[${item.content.substring(0, 200)}...]]></summary>
    <category term="${item.mainCategory}" />
  </entry>`;
  }).join("");
  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>\u6771\u821E\u9DB4\u30D5\u30C3\u30C8\u30DC\u30FC\u30EB\u30AF\u30E9\u30D6 \u304A\u77E5\u3089\u305B</title>
  <link href="${baseUrl}" />
  <link href="${baseUrl}/api/atom" rel="self" />
  <id>${baseUrl}/</id>
  <updated>${(/* @__PURE__ */ new Date()).toISOString()}</updated>
  <subtitle>\u4EAC\u90FD\u5E9C\u821E\u9DB4\u5E02\u3092\u62E0\u70B9\u3068\u3059\u308B\u5C0F\u5B66\u751F\u3092\u4E2D\u5FC3\u3068\u3057\u305F\u30D5\u30C3\u30C8\u30DC\u30FC\u30EB\u30AF\u30E9\u30D6\u306E\u6700\u65B0\u60C5\u5831</subtitle>
  ${atomEntries}
</feed>`;
  return atom;
}

// server/_core/vercel.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerOAuthRoutes(app);
app.post("/api/upload", handleUpload);
app.get("/api/rss", async (req, res) => {
  try {
    const rss = await generateRSSFeed();
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.send(rss);
  } catch (error) {
    console.error("RSS feed generation error:", error);
    res.status(500).send("Error generating RSS feed");
  }
});
app.get("/api/atom", async (req, res) => {
  try {
    const atom = await generateAtomFeed();
    res.setHeader("Content-Type", "application/atom+xml; charset=utf-8");
    res.send(atom);
  } catch (error) {
    console.error("Atom feed generation error:", error);
    res.status(500).send("Error generating Atom feed");
  }
});
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var vercel_default = app;
export {
  vercel_default as default
};
