import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// 管理者専用プロシージャ
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: '管理者権限が必要です' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // お知らせ記事
  news: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllNews(input?.category);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getNewsById(input.id);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        category: z.enum(["練習", "試合", "連絡事項", "その他"]),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createNews({
          ...input,
          authorId: ctx.user.id,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        category: z.enum(["練習", "試合", "連絡事項", "その他"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateNews(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNews(input.id);
        return { success: true };
      }),
  }),

  // 試合結果
  matchResults: router({
    list: publicProcedure
      .input(z.object({
        opponent: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllMatchResults(input);
      }),

    create: adminProcedure
      .input(z.object({
        opponent: z.string().min(1),
        ourScore: z.number(),
        opponentScore: z.number(),
        matchDate: z.string().transform(str => new Date(str)),
        venue: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createMatchResult(input as any);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        opponent: z.string().min(1).optional(),
        ourScore: z.number().optional(),
        opponentScore: z.number().optional(),
        matchDate: z.string().transform(str => new Date(str)).optional(),
        venue: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMatchResult(id, data as any);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMatchResult(input.id);
        return { success: true };
      }),
  }),

  // お問い合わせ
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        await db.createContact(input);
        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return await db.getAllContacts();
    }),
  }),

  // BBS掲示板
  bbs: router({
    list: publicProcedure.query(async () => {
      return await db.getAllBbsPosts();
    }),

    create: publicProcedure
      .input(z.object({
        content: z.string().min(1),
        authorName: z.string().min(1).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createBbsPost({
          content: input.content,
          authorId: ctx.user?.id || null,
          authorName: input.authorName || ctx.user?.name || "名無し",
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // 管理者または投稿者本人のみ削除可能
        const post = await db.getAllBbsPosts().then(posts => posts.find(p => p.id === input.id));
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        if (ctx.user.role !== 'admin' && post.authorId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await db.deleteBbsPost(input.id);
        return { success: true };
      }),
  }),

  // スケジュール
  schedules: router({
    list: publicProcedure
      .input(z.object({
        opponent: z.string().optional(),
        eventType: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllSchedules(input);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        eventType: z.enum(["練習", "試合", "大会", "その他"]),
        opponent: z.string().optional(),
        eventDate: z.string().transform(str => new Date(str)),
        venue: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createSchedule(input as any);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        eventType: z.enum(["練習", "試合", "大会", "その他"]).optional(),
        opponent: z.string().optional(),
        eventDate: z.string().transform(str => new Date(str)).optional(),
        venue: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateSchedule(id, data as any);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSchedule(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
