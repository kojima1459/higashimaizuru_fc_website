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

describe("Schedules - Grade Filter", () => {
  let testScheduleIds: number[] = [];

  beforeAll(async () => {
    // テストデータを作成
    const schedule1 = await caller.schedules.create({
      title: "U9単独練習",
      eventType: "練習",
      grades: ["U9"],
      eventDate: "2026-03-01",
      meetingTime: "09:00",
      venue: "朝来小学校グラウンド",
    });
    testScheduleIds.push(schedule1.id);

    const schedule2 = await caller.schedules.create({
      title: "U9・U10合同練習",
      eventType: "練習",
      grades: ["U9", "U10"],
      eventDate: "2026-03-05",
      meetingTime: "10:00",
      venue: "朝来小学校グラウンド",
    });
    testScheduleIds.push(schedule2.id);

    const schedule3 = await caller.schedules.create({
      title: "U10単独試合",
      eventType: "試合",
      grades: ["U10"],
      eventDate: "2026-03-10",
      meetingTime: "13:00",
      venue: "舞鶴市総合運動場",
    });
    testScheduleIds.push(schedule3.id);

    const schedule4 = await caller.schedules.create({
      title: "U7・U8・U9合同大会",
      eventType: "大会",
      grades: ["U7", "U8", "U9"],
      eventDate: "2026-03-15",
      meetingTime: "08:00",
      venue: "舞鶴市総合運動場",
    });
    testScheduleIds.push(schedule4.id);
  });

  afterAll(async () => {
    // テストデータをクリーンアップ
    for (const id of testScheduleIds) {
      await dbModule.deleteSchedule(id);
    }
  });

  it("should filter schedules by grade U9 (should return 3 schedules)", async () => {
    const result = await caller.schedules.list({ grade: "U9" });

    // U9を含むスケジュールは3件（U9単独、U9・U10合同、U7・U8・U9合同）
    const u9Schedules = result.filter((s) => testScheduleIds.includes(s.id));
    expect(u9Schedules.length).toBe(3);
    expect(u9Schedules.some((s) => s.title === "U9単独練習")).toBe(true);
    expect(u9Schedules.some((s) => s.title === "U9・U10合同練習")).toBe(true);
    expect(u9Schedules.some((s) => s.title === "U7・U8・U9合同大会")).toBe(true);
  });

  it("should filter schedules by grade U10 (should return 2 schedules)", async () => {
    const result = await caller.schedules.list({ grade: "U10" });

    // U10を含むスケジュールは2件（U9・U10合同、U10単独）
    const u10Schedules = result.filter((s) => testScheduleIds.includes(s.id));
    expect(u10Schedules.length).toBe(2);
    expect(u10Schedules.some((s) => s.title === "U9・U10合同練習")).toBe(true);
    expect(u10Schedules.some((s) => s.title === "U10単独試合")).toBe(true);
  });

  it("should filter schedules by grade U7 (should return 1 schedule)", async () => {
    const result = await caller.schedules.list({ grade: "U7" });

    // U7を含むスケジュールは1件（U7・U8・U9合同）
    const u7Schedules = result.filter((s) => testScheduleIds.includes(s.id));
    expect(u7Schedules.length).toBe(1);
    expect(u7Schedules.some((s) => s.title === "U7・U8・U9合同大会")).toBe(true);
  });

  it("should return all schedules when grade filter is 'all'", async () => {
    const result = await caller.schedules.list({ grade: "all" });

    // 全てのテストスケジュールが返される
    const allTestSchedules = result.filter((s) => testScheduleIds.includes(s.id));
    expect(allTestSchedules.length).toBe(4);
  });

  it("should return all schedules when grade filter is not specified", async () => {
    const result = await caller.schedules.list({});

    // 全てのテストスケジュールが返される
    const allTestSchedules = result.filter((s) => testScheduleIds.includes(s.id));
    expect(allTestSchedules.length).toBe(4);
  });

  it("should combine grade filter with eventType filter", async () => {
    const result = await caller.schedules.list({ grade: "U9", eventType: "練習" });

    // U9を含む練習スケジュールは2件（U9単独、U9・U10合同）
    const filteredSchedules = result.filter((s) => testScheduleIds.includes(s.id));
    expect(filteredSchedules.length).toBe(2);
    expect(filteredSchedules.every((s) => s.eventType === "練習")).toBe(true);
  });
});
