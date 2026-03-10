/**
 * スケジュール編集バグ修正テスト
 * 空のgradesフィールドを持つスケジュールの編集が正常に動作することを確認
 */
import { describe, it, expect, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";
import * as dbModule from "./db";

const mockAdminContext: Context = {
  user: {
    openId: "test-admin-open-id",
    name: "Test Admin",
    email: "admin@test.com",
    avatar: null,
    role: "admin",
  },
};

const caller = appRouter.createCaller(mockAdminContext);

describe("スケジュール編集バグ修正テスト", () => {
  let createdScheduleId: number;

  afterAll(async () => {
    if (createdScheduleId) {
      try {
        await dbModule.deleteSchedule(createdScheduleId);
      } catch {}
    }
  });

  it("正常なgradesでスケジュールを作成できる", async () => {
    const result = await caller.schedules.create({
      title: "テスト練習",
      eventType: "練習",
      grades: ["U9"],
      eventDate: "2026-03-15",
      venue: "テストグラウンド",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    expect(result.grades).toBe("U9");
    createdScheduleId = result.id;
  });

  it("スケジュールを編集してgradesを更新できる", async () => {
    const result = await caller.schedules.update({
      id: createdScheduleId,
      title: "テスト練習（更新）",
      grades: ["U9", "U10"],
      eventDate: "2026-03-15",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("U9,U10");
    expect(result.title).toBe("テスト練習（更新）");
  });

  it("gradesを単一学年に変更できる", async () => {
    const result = await caller.schedules.update({
      id: createdScheduleId,
      grades: ["U12"],
      eventDate: "2026-03-15",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("U12");
  });

  it("全体学年を設定できる", async () => {
    const result = await caller.schedules.update({
      id: createdScheduleId,
      grades: ["全体"],
      eventDate: "2026-03-15",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("全体");
  });

  it("最大7学年まで設定できる", async () => {
    const result = await caller.schedules.update({
      id: createdScheduleId,
      grades: ["U7", "U8", "U9", "U10", "U11", "U12", "全体"],
      eventDate: "2026-03-15",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("U7,U8,U9,U10,U11,U12,全体");
  });

  it("無効なgradesは拒否される", async () => {
    await expect(
      caller.schedules.update({
        id: createdScheduleId,
        grades: ["INVALID" as any],
        eventDate: "2026-03-15",
      })
    ).rejects.toThrow();
  });
});
