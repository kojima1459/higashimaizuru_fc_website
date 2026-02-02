import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";
import * as dbModule from "./db";

// モックコンテキスト（管理者権限）
const mockAdminContext: Context = {
  user: {
    openId: "test-admin-open-id",
    name: "Test Admin",
    email: "admin@test.com",
    avatar: null,
    role: "admin",
  },
};

// テスト用のcaller
const caller = appRouter.createCaller(mockAdminContext);

describe("Schedules - Multiple Grades Selection", () => {
  let createdScheduleId: number;

  afterAll(async () => {
    // テストデータをクリーンアップ
    if (createdScheduleId) {
      await dbModule.deleteSchedule(createdScheduleId);
    }
  });

  it("should create a schedule with multiple grades (U9, U10)", async () => {
    const result = await caller.schedules.create({
      title: "U9・U10合同練習",
      eventType: "練習",
      grades: ["U9", "U10"],
      eventDate: "2026-02-10",
      meetingTime: "09:00",
      venue: "朝来小学校グラウンド",
      notes: "合同練習のためU9とU10が一緒に活動します",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    expect(result.title).toBe("U9・U10合同練習");
    expect(result.grades).toBe("U9,U10");
    expect(result.eventType).toBe("練習");

    createdScheduleId = result.id;
  });

  it("should retrieve the schedule and verify grades are stored correctly", async () => {
    const schedulesList = await caller.schedules.list({});
    const createdSchedule = schedulesList.find((s) => s.id === createdScheduleId);

    expect(createdSchedule).toBeDefined();
    expect(createdSchedule?.grades).toBe("U9,U10");
    expect(createdSchedule?.title).toBe("U9・U10合同練習");
  });

  it("should update the schedule with different grades (U7, U8, U9)", async () => {
    const result = await caller.schedules.update({
      id: createdScheduleId,
      title: "U7・U8・U9合同練習",
      eventType: "練習",
      grades: ["U7", "U8", "U9"],
      eventDate: "2026-02-15",
      meetingTime: "10:00",
      venue: "朝来小学校グラウンド",
      notes: "3学年合同練習",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("U7,U8,U9");
    expect(result.title).toBe("U7・U8・U9合同練習");
  });

  it("should create a schedule with single grade (U12)", async () => {
    const result = await caller.schedules.create({
      title: "U12単独練習",
      eventType: "練習",
      grades: ["U12"],
      eventDate: "2026-02-20",
      meetingTime: "14:00",
      venue: "朝来小学校グラウンド",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("U12");
    expect(result.title).toBe("U12単独練習");

    // クリーンアップ
    await dbModule.deleteSchedule(result.id);
  });

  it("should create a schedule with maximum 5 grades", async () => {
    const result = await caller.schedules.create({
      title: "全学年合同イベント",
      eventType: "大会",
      grades: ["U7", "U8", "U9", "U10", "U11"],
      eventDate: "2026-03-01",
      meetingTime: "08:00",
      venue: "舞鶴市総合運動場",
      notes: "5学年合同の大会参加",
    });

    expect(result).toBeDefined();
    expect(result.grades).toBe("U7,U8,U9,U10,U11");
    expect(result.title).toBe("全学年合同イベント");

    // クリーンアップ
    await dbModule.deleteSchedule(result.id);
  });

  it("should filter schedules by grade", async () => {
    // U9を含むスケジュールを取得
    const schedulesList = await caller.schedules.list({});
    const u9Schedules = schedulesList.filter((s) => s.grades.includes("U9"));

    expect(u9Schedules.length).toBeGreaterThan(0);
    expect(u9Schedules.some((s) => s.id === createdScheduleId)).toBe(true);
  });
});
