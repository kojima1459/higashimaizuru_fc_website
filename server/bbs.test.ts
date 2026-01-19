import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("BBS機能テスト", () => {
  it("認証なしで投稿を作成できる", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bbs.create({
      content: "テスト投稿",
      authorName: "テストユーザー",
    });

    expect(result.success).toBe(true);
  });

  it("名前を指定しない場合は「名無し」になる", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.bbs.create({
      content: "テスト投稿2",
    });

    expect(result.success).toBe(true);
  });

  it("投稿一覧を取得できる", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const posts = await caller.bbs.list();
    expect(Array.isArray(posts)).toBe(true);
  });
});
