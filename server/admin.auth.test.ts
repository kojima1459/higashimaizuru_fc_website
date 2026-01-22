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


describe("管理画面パスワード変更テスト", () => {
  it("正しい現在のパスワードで新しいパスワードに変更できる", async () => {
    const caller = appRouter.createCaller({ user: null });
    
    // 現在のパスワードで変更
    const result = await caller.admin.changePassword({ 
      currentPassword: "kyoto123",
      newPassword: "newpass456"
    });
    
    expect(result.success).toBe(true);
  });

  it("間違った現在のパスワードで変更失敗する", async () => {
    const caller = appRouter.createCaller({ user: null });
    
    try {
      await caller.admin.changePassword({ 
        currentPassword: "wrongpassword",
        newPassword: "newpass456"
      });
      expect(true).toBe(false); // ここに到達してはいけない
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("同じパスワードへの変更は失敗する", async () => {
    const caller = appRouter.createCaller({ user: null });
    
    try {
      await caller.admin.changePassword({ 
        currentPassword: "kyoto123",
        newPassword: "kyoto123"
      });
      expect(true).toBe(false); // ここに到達してはいけない
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});
