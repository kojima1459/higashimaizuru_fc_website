/**
 * iCal (.ics) 形式のスケジュールデータ生成ユーティリティ
 * RFC 5545 準拠
 */

interface ScheduleEvent {
  id: number;
  title: string;
  eventType: string;
  grades: string;
  eventDate: Date | string;
  meetingTime?: string | null;
  venue?: string | null;
  opponent?: string | null;
  notes?: string | null;
}

/**
 * 文字列をiCal用にエスケープする
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

/**
 * Date を iCal の DATE 形式（YYYYMMDD）に変換
 * タイムゾーンの影響を受けないよう、ローカル日付を使用
 */
function formatICalDate(date: Date | string): string {
  // 文字列の場合は YYYY-MM-DD 形式として直接解析（タイムゾーン影響なし）
  if (typeof date === "string") {
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[1]}${match[2]}${match[3]}`;
  }
  const d = typeof date === "string" ? new Date(date) : date;
  // ローカル日付を使用してタイムゾーンズレを防ぐ
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * UID を生成（スケジュールID + ドメイン）
 */
function generateUID(id: number): string {
  return `schedule-${id}@higashimaizurufc.com`;
}

/**
 * 現在時刻をiCal形式（UTC）で返す
 */
function nowUTC(): string {
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * スケジュール1件をVEVENT形式に変換
 */
function scheduleToVEvent(schedule: ScheduleEvent): string {
  // 日付文字列をタイムゾーンの影響を受けずに解析
  let dateStr: string;
  if (typeof schedule.eventDate === "string") {
    const match = schedule.eventDate.match(/(\d{4})-(\d{2})-(\d{2})/);
    dateStr = match ? `${match[1]}-${match[2]}-${match[3]}` : schedule.eventDate.substring(0, 10);
  } else {
    const d = schedule.eventDate;
    dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // 習日の日付を計算（iCalのDTENDはexclusive）—タイムゾーン影響なし
  const [y, m, day] = dateStr.split("-").map(Number);
  const nextDayDate = new Date(y, m - 1, day + 1);
  const nextDayStr = `${nextDayDate.getFullYear()}-${String(nextDayDate.getMonth() + 1).padStart(2, "0")}-${String(nextDayDate.getDate()).padStart(2, "0")}`;

  // eventDate は文字列として扱う
  const eventDate = dateStr;

  const grades = schedule.grades
    ? schedule.grades.split(",").filter(Boolean).join("・")
    : "";

  // 概要（タイトル）
  const summary = escapeICalText(schedule.title);

  // 説明文の組み立て
  const descParts: string[] = [];
  if (schedule.eventType) descParts.push(`種別: ${schedule.eventType}`);
  if (grades) descParts.push(`学年: ${grades}`);
  if (schedule.meetingTime) descParts.push(`集合時間: ${schedule.meetingTime}`);
  if (schedule.opponent) descParts.push(`対戦相手: ${schedule.opponent}`);
  if (schedule.notes) descParts.push(`備考: ${schedule.notes}`);
  const description = escapeICalText(descParts.join("\\n"));

  // 場所
  const location = schedule.venue ? escapeICalText(schedule.venue) : "";

  const lines = [
    "BEGIN:VEVENT",
    `UID:${generateUID(schedule.id)}`,
    `DTSTAMP:${nowUTC()}`,
    `DTSTART;VALUE=DATE:${formatICalDate(eventDate)}`,
    `DTEND;VALUE=DATE:${formatICalDate(nextDayStr)}`,
    `SUMMARY:${summary}`,
  ];

  if (description) lines.push(`DESCRIPTION:${description}`);
  if (location) lines.push(`LOCATION:${location}`);

  lines.push("END:VEVENT");

  return lines.join("\r\n");
}

/**
 * スケジュール配列からiCalファイルの内容を生成
 */
export function generateICalContent(
  scheduleList: ScheduleEvent[],
  calendarName = "東舞鶴F.C スケジュール"
): string {
  const vEvents = scheduleList.map(scheduleToVEvent).join("\r\n");

  const calLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//東舞鶴フットボールクラブ//Schedule//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeICalText(calendarName)}`,
    "X-WR-TIMEZONE:Asia/Tokyo",
    vEvents,
    "END:VCALENDAR",
  ];

  return calLines.join("\r\n");
}
