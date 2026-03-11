import { describe, it, expect } from "vitest";
import { generateICalContent } from "./ical";

describe("iCal生成テスト", () => {
  const mockSchedules = [
    {
      id: 1,
      title: "U9練習",
      eventType: "練習",
      grades: "U9",
      eventDate: "2026-04-01",  // 文字列で指定しタイムゾーン問題を回避
      meetingTime: "09:00",
      venue: "朝来小学校グラウンド",
      opponent: null,
      notes: null,
    },
    {
      id: 2,
      title: "U10・U11合同試合",
      eventType: "試合",
      grades: "U10,U11",
      eventDate: "2026-04-15",
      meetingTime: "08:30",
      venue: "舞鶴市総合運動場",
      opponent: "舞鶴FC",
      notes: "雨天中止",
    },
    {
      id: 3,
      title: "全体大会",
      eventType: "大会",
      grades: "U7,U8,U9,U10,U11,U12,全体",
      eventDate: "2026-05-01",
      meetingTime: null,
      venue: null,
      opponent: null,
      notes: null,
    },
  ];

  it("should generate valid iCal content with VCALENDAR wrapper", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("BEGIN:VCALENDAR");
    expect(content).toContain("END:VCALENDAR");
    expect(content).toContain("VERSION:2.0");
    expect(content).toContain("CALSCALE:GREGORIAN");
  });

  it("should include all VEVENT blocks for each schedule", () => {
    const content = generateICalContent(mockSchedules);
    const veventCount = (content.match(/BEGIN:VEVENT/g) || []).length;
    expect(veventCount).toBe(3);
  });

  it("should include correct DTSTART for each event", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("DTSTART;VALUE=DATE:20260401");
    expect(content).toContain("DTSTART;VALUE=DATE:20260415");
    expect(content).toContain("DTSTART;VALUE=DATE:20260501");
  });

  it("should include DTEND as next day (exclusive)", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("DTEND;VALUE=DATE:20260402");
    expect(content).toContain("DTEND;VALUE=DATE:20260416");
    expect(content).toContain("DTEND;VALUE=DATE:20260502");
  });

  it("should include SUMMARY with correct title", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("SUMMARY:U9練習");
    expect(content).toContain("SUMMARY:U10・U11合同試合");
    expect(content).toContain("SUMMARY:全体大会");
  });

  it("should include LOCATION when venue is provided", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("LOCATION:朝来小学校グラウンド");
    expect(content).toContain("LOCATION:舞鶴市総合運動場");
  });

  it("should not include LOCATION when venue is null", () => {
    const singleSchedule = [mockSchedules[2]]; // 全体大会 - no venue
    const content = generateICalContent(singleSchedule);
    const veventStart = content.indexOf("BEGIN:VEVENT");
    const veventEnd = content.indexOf("END:VEVENT");
    const veventContent = content.substring(veventStart, veventEnd);
    expect(veventContent).not.toContain("LOCATION:");
  });

  it("should include DESCRIPTION with event details", () => {
    const content = generateICalContent([mockSchedules[1]]);
    expect(content).toContain("DESCRIPTION:");
    expect(content).toContain("試合");
    expect(content).toContain("舞鶴FC");
    expect(content).toContain("雨天中止");
  });

  it("should include correct UID for each event", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("UID:schedule-1@higashimaizurufc.com");
    expect(content).toContain("UID:schedule-2@higashimaizurufc.com");
    expect(content).toContain("UID:schedule-3@higashimaizurufc.com");
  });

  it("should use custom calendar name when provided", () => {
    const content = generateICalContent(mockSchedules, "テストカレンダー");
    expect(content).toContain("X-WR-CALNAME:テストカレンダー");
  });

  it("should use default calendar name when not provided", () => {
    const content = generateICalContent(mockSchedules);
    expect(content).toContain("X-WR-CALNAME:東舞鶴F.C スケジュール");
  });

  it("should handle empty schedule list", () => {
    const content = generateICalContent([]);
    expect(content).toContain("BEGIN:VCALENDAR");
    expect(content).toContain("END:VCALENDAR");
    expect(content).not.toContain("BEGIN:VEVENT");
  });

  it("should escape special characters in text fields", () => {
    const scheduleWithSpecialChars = [
      {
        id: 99,
        title: "テスト,イベント;特殊文字",
        eventType: "練習",
        grades: "U9",
        eventDate: new Date("2026-06-01"),
        meetingTime: null,
        venue: "会場\\テスト",
        opponent: null,
        notes: null,
      },
    ];
    const content = generateICalContent(scheduleWithSpecialChars);
    // Commas and semicolons should be escaped
    expect(content).toContain("SUMMARY:テスト\\,イベント\\;特殊文字");
    expect(content).toContain("LOCATION:会場\\\\テスト");
  });

  it("should use CRLF line endings (RFC 5545 compliance)", () => {
    const content = generateICalContent([mockSchedules[0]]);
    expect(content).toContain("\r\n");
  });
});
