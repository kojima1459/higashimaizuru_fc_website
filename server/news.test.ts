import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("news router", () => {
  it("should allow admin to create news", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.news.create({
      title: "テストニュース",
      content: "これはテストです",
      mainCategory: "練習",
      subCategory: "U7",
    });

    expect(result).toEqual({ success: true });
  });

  it("should list news articles", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.news.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});
