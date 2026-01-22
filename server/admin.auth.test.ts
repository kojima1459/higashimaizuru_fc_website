import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("管理画面パスワード認証テスト", () => {
  it("正しいパスワードで認証できる", async () => {
    const caller = appRouter.createCaller({ user: null });
    
    const result = await caller.admin.verifyPassword({ password: "kyoto123" });
    
    expect(result.valid).toBe(true);
  });

  it("間違ったパスワードで認証失敗する", async () => {
    const caller = appRouter.createCaller({ user: null });
    
    const result = await caller.admin.verifyPassword({ password: "wrongpassword" });
    
    expect(result.valid).toBe(false);
  });

  it("空のパスワードで認証失敗する", async () => {
    const caller = appRouter.createCaller({ user: null });
    
    const result = await caller.admin.verifyPassword({ password: "" });
    
    expect(result.valid).toBe(false);
  });
});
