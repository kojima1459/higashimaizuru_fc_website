import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, X, Calendar } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Schedule() {
  const [opponent, setOpponent] = useState("");
  const [eventType, setEventType] = useState("全て");
  const [grade, setGrade] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{
    opponent?: string;
    eventType?: string;
    grade?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: schedules, isLoading } = trpc.schedules.list.useQuery(appliedFilters);

  const handleSearch = () => {
    setAppliedFilters({
      opponent: opponent || undefined,
      eventType: eventType !== "全て" ? eventType : undefined,
      grade: grade === "all" ? undefined : grade || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setOpponent("");
    setEventType("全て");
    setGrade("all");
    setStartDate("");
    setEndDate("");
    setAppliedFilters({});
  };

  const hasActiveFilters = appliedFilters.opponent || (appliedFilters.eventType && appliedFilters.eventType !== "全て") || appliedFilters.grade || appliedFilters.startDate || appliedFilters.endDate;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "練習": return "bg-blue-500";
      case "試合": return "bg-green-500";
      case "大会": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "U7": return "bg-red-500";
      case "U8": return "bg-orange-500";
      case "U9": return "bg-yellow-500";
      case "U10": return "bg-green-500";
      case "U11": return "bg-blue-500";
      case "U12": return "bg-purple-500";
      case "全体": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="スケジュール - 東舞鶴F.C"
        description="東舞鶴F.Cの練習・試合予定をご確認いただけます。"
        image="/logo.jpeg"
        type="website"
      />
      <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">スケジュール</h1>

      {/* 検索・フィルターUI */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">検索・フィルター</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                イベント種別
              </label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="イベント種別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全て">全て</SelectItem>
                  <SelectItem value="練習">練習</SelectItem>
                  <SelectItem value="試合">試合</SelectItem>
                  <SelectItem value="大会">大会</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                学年
              </label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="U7">U7</SelectItem>
                  <SelectItem value="U8">U8</SelectItem>
                  <SelectItem value="U9">U9</SelectItem>
                  <SelectItem value="U10">U10</SelectItem>
                  <SelectItem value="U11">U11</SelectItem>
                  <SelectItem value="U12">U12</SelectItem>
                  <SelectItem value="全体">全体</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                対戦相手
              </label>
              <Input
                placeholder="例：〇〇中学校"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                開始日
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                終了日
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              検索
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                リセット
              </Button>
            )}
          </div>
          {hasActiveFilters && (
            <div className="mt-4 text-sm text-muted-foreground">
              {appliedFilters.eventType && appliedFilters.eventType !== "全て" && <span className="mr-4">種別: {appliedFilters.eventType}</span>}
              {appliedFilters.grade && <span className="mr-4">学年: {appliedFilters.grade}</span>}
              {appliedFilters.opponent && <span className="mr-4">対戦相手: {appliedFilters.opponent}</span>}
              {appliedFilters.startDate && <span className="mr-4">開始日: {new Date(appliedFilters.startDate).toLocaleDateString("ja-JP")}</span>}
              {appliedFilters.endDate && <span>終了日: {new Date(appliedFilters.endDate).toLocaleDateString("ja-JP")}</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : schedules && schedules.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            {schedules.length}件のスケジュール
          </div>
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded text-white ${getEventTypeColor(schedule.eventType)}`}>
                        {schedule.eventType}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded text-white ${getGradeColor(schedule.grade)}`}>
                        {schedule.grade}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(schedule.eventDate).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{schedule.title}</h3>
                    {schedule.opponent && (
                      <p className="text-sm text-foreground mb-1">
                        <span className="font-medium">対戦相手:</span> {schedule.opponent}
                      </p>
                    )}
                    {schedule.meetingTime && (
                      <p className="text-sm text-foreground mb-1">
                        <span className="font-medium">集合時間:</span> {schedule.meetingTime}
                      </p>
                    )}
                    {schedule.venue && (
                      <p className="text-sm text-foreground mb-1">
                        <span className="font-medium">場所:</span> {schedule.venue}
                      </p>
                    )}
                    {schedule.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{schedule.notes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {hasActiveFilters ? "検索条件に一致するスケジュールが見つかりませんでした" : "スケジュールはまだありません"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Googleカレンダー埋め込み */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Googleカレンダー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=higashimaidurufc%40gmail.com&ctz=Asia%2FTokyo"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
              frameBorder="0"
              scrolling="no"
              title="東舞鶴F.C スケジュール"
            />
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
