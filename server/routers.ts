import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// 管理者専用プロシージャは削除（認証不要のため）

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
      .input(z.object({ mainCategory: z.string().optional(), subCategory: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllNews(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getNewsById(input.id);
      }),

    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        mainCategory: z.enum(["練習", "試合", "連絡事項", "その他"]),
        subCategory: z.enum(["U7", "U8", "U9", "U10", "U11", "U12", "全体", "その他"]),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createNews({
          ...input,
          authorId: ctx.user?.id || null, // 認証不要のため、authorIdはnullableに設定
        });
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        mainCategory: z.enum(["練習", "試合", "連絡事項", "その他"]).optional(),
        subCategory: z.enum(["U7", "U8", "U9", "U10", "U11", "U12", "全体", "その他"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateNews(id, data);
        return { success: true };
      }),

    delete: publicProcedure
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
        matchTitle: z.string().optional(),
        opponent: z.string().optional(),
        category: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllMatchResults(input);
      }),

    create: publicProcedure
      .input(z.object({
        matchTitle: z.string().min(1).max(15),
        opponent: z.string().min(1),
        ourScore: z.number(),
        opponentScore: z.number(),
        matchDate: z.string().transform(str => new Date(str)),
        category: z.enum(["U7", "U8", "U9", "U10", "U11", "U12", "その他"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createMatchResult(input as any);
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        matchTitle: z.string().min(1).max(15).optional(),
        opponent: z.string().min(1).optional(),
        ourScore: z.number().optional(),
        opponentScore: z.number().optional(),
        matchDate: z.string().transform(str => new Date(str)).optional(),
        category: z.enum(["U7", "U8", "U9", "U10", "U11", "U12", "その他"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMatchResult(id, data as any);
        return { success: true };
      }),

    delete: publicProcedure
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

    list: publicProcedure.query(async () => {
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

  // BBSコメント
  bbsComments: router({
    listByPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAllBbsComments(input.postId);
      }),

    create: publicProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
        authorName: z.string().min(1).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createBbsComment({
          postId: input.postId,
          content: input.content,
          authorId: ctx.user?.id || null,
          authorName: input.authorName || ctx.user?.name || "名無し",
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // 管理者またはコメント投稿者本人のみ削除可能
        const allPosts = await db.getAllBbsPosts();
        let targetComment = null;
        for (const post of allPosts) {
          const postComments = await db.getAllBbsComments(post.id);
          const comment = postComments.find(c => c.id === input.id);
          if (comment) {
            targetComment = comment;
            break;
          }
        }
        
        if (!targetComment) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        if (ctx.user.role !== 'admin' && targetComment.authorId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await db.deleteBbsComment(input.id);
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

    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        eventType: z.enum(["練習", "試合", "大会", "その他"]),
        opponent: z.string().optional(),
        eventDate: z.string().transform(str => new Date(str)),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createSchedule(input as any);
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        eventType: z.enum(["練習", "試合", "大会", "その他"]).optional(),
        grade: z.enum(["U7", "U8", "U9", "U10", "U11", "U12", "全体"]).optional(),
        opponent: z.string().optional(),
        eventDate: z.string().transform(str => new Date(str)).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateSchedule(id, data as any);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSchedule(input.id);
        return { success: true };
      }),
  }),

  // 写真ギャラリー
  photos: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllPhotos(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPhotoById(input.id);
      }),

    upload: publicProcedure
      .input(z.object({
        title: z.string().optional(),
        caption: z.string().optional(),
        imageUrl: z.string().min(1),
        imageKey: z.string().min(1),
        category: z.enum(["練習風景", "試合", "イベント", "その他"]),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createPhoto({
          ...input,
          uploadedBy: ctx.user?.id || null,
        });
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // 写真情報を取得してS3からも削除する必要がある場合はここで処理
        await db.deletePhoto(input.id);
        return { success: true };
      }),
  }),

  // 管理画面認証
  admin: router({
    verifyPassword: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        const correctPassword = process.env.ADMIN_PASSWORD || "kyoto123";
        return { valid: input.password === correctPassword };
      }),

    changePassword: publicProcedure
      .input(z.object({ 
        currentPassword: z.string(),
        newPassword: z.string().min(4),
      }))
      .mutation(async ({ input }) => {
        const correctPassword = process.env.ADMIN_PASSWORD || "kyoto123";
        
        if (input.currentPassword !== correctPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "現在のパスワードが正しくありません",
          });
        }

        if (input.currentPassword === input.newPassword) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "新しいパスワードは現在のパスワードと異なる必要があります",
          });
        }

        return { success: true };
      }),
  }),

  // 試合結果統計
  statistics: router({
    matchResults: publicProcedure.query(async () => {
      return await db.getMatchResultsStatistics();
    }),
  }),
});

export type AppRouter = typeof appRouter;
