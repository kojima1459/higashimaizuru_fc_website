import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import { SportsEventStructuredData } from "@/components/StructuredData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Results() {
  const [matchTitle, setMatchTitle] = useState("");
  const [opponent, setOpponent] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{
    matchTitle?: string;
    opponent?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: results, isLoading } = trpc.matchResults.list.useQuery(appliedFilters);

  const handleSearch = () => {
    setAppliedFilters({
      matchTitle: matchTitle || undefined,
      opponent: opponent || undefined,
      category: category === "all" ? undefined : category || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setMatchTitle("");
    setOpponent("");
    setCategory("all");
    setStartDate("");
    setEndDate("");
    setAppliedFilters({});
  };

  const hasActiveFilters = appliedFilters.matchTitle || appliedFilters.opponent || appliedFilters.category || appliedFilters.startDate || appliedFilters.endDate;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="試合結果 - 東舞鶴F.C"
        description="東舞鶴F.Cの過去の試合結果一覧です。"
        image="/logo.jpeg"
        type="website"
      />
      {/* 構造化データ: 各試合結果にSportsEventスキーマを追加 */}
      {results && results.length > 0 && results.map((result) => (
        <SportsEventStructuredData
          key={result.id}
          name={result.matchTitle || `${result.category} vs ${result.opponent}`}
          startDate={new Date(result.matchDate).toISOString()}
          location="舞鶴市"
          description={result.notes || undefined}
          homeTeam="東舞鶴F.C"
          awayTeam={result.opponent}
          score={{ home: result.ourScore, away: result.opponentScore }}
        />
      ))}
      <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        <AnimatedTitle text="試合結果" staggerDelay={60} />
      </h1>

      {/* 検索・フィルターUI - モバイル折りたたみ対応 */}
      <Card className="mb-6">
        <CardHeader
          className="cursor-pointer md:cursor-default"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <span>検索・フィルター</span>
            <span className="md:hidden">
              {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                試合タイトル
              </label>
              <Input
                placeholder="例：京都府大会予選"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
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
                カテゴリー
              </label>
              <Select value={category} onValueChange={setCategory}>
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
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
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
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button onClick={handleSearch} className="flex items-center justify-center gap-2 min-h-10 md:min-h-12 text-sm md:text-base w-full sm:w-auto">
              <Search className="h-4 w-4" />
              検索
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleReset} variant="outline" className="flex items-center justify-center gap-2 min-h-10 md:min-h-12 text-sm md:text-base w-full sm:w-auto">
                <X className="h-4 w-4" />
                リセット
              </Button>
            )}
          </div>
          {hasActiveFilters && (
            <div className="mt-4 text-sm text-muted-foreground">
              {appliedFilters.opponent && <span className="mr-4">対戦相手: {appliedFilters.opponent}</span>}
              {appliedFilters.category && <span className="mr-4">カテゴリー: {appliedFilters.category}</span>}
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
      ) : results && results.length > 0 ? (
        <>
          {/* デスクトップ：テーブル表示 */}
          <Card className="premium-section hidden md:block">
            <CardHeader>
              <CardTitle>試合結果一覧（{results.length}件）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>試合タイトル</TableHead>
                      <TableHead>日時</TableHead>
                      <TableHead>カテゴリー</TableHead>
                      <TableHead>対戦相手</TableHead>
                      <TableHead className="text-center">スコア</TableHead>
                      <TableHead>備考</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => {
                      const isWin = result.ourScore > result.opponentScore;
                      const isDraw = result.ourScore === result.opponentScore;
                      const resultColor = isWin ? "text-green-500" : isDraw ? "text-yellow-500" : "text-red-500";

                      return (
                        <TableRow key={result.id}>
                          <TableCell>{result.matchTitle}</TableCell>
                          <TableCell>
                            {new Date(result.matchDate).toLocaleDateString("ja-JP")}
                          </TableCell>
                          <TableCell className="font-medium">{result.category}</TableCell>
                          <TableCell className="font-medium">{result.opponent}</TableCell>
                          <TableCell className={`text-center font-bold ${resultColor}`}>
                            {result.ourScore} - {result.opponentScore}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {result.notes || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* モバイル：カード表示 */}
          <div className="md:hidden space-y-3">
            <p className="font-semibold text-foreground mb-2">試合結果一覧（{results.length}件）</p>
            {results.map((result) => {
              const isWin = result.ourScore > result.opponentScore;
              const isDraw = result.ourScore === result.opponentScore;
              return (
                <Card key={result.id} className="border-l-4" style={{
                  borderLeftColor: isWin ? '#22c55e' : isDraw ? '#eab308' : '#ef4444'
                }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.matchDate).toLocaleDateString("ja-JP")}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isWin ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                        isDraw ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" :
                        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                        {isWin ? "勝利" : isDraw ? "引分" : "敗北"}
                      </span>
                    </div>
                    {result.matchTitle && (
                      <p className="text-xs text-muted-foreground mb-1">{result.matchTitle}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">vs {result.opponent}</p>
                        <span className="text-xs text-muted-foreground">{result.category}</span>
                      </div>
                      <p className={`text-2xl font-bold ${
                        isWin ? "text-green-600" : isDraw ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {result.ourScore} - {result.opponentScore}
                      </p>
                    </div>
                    {result.notes && (
                      <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">{result.notes}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {hasActiveFilters ? "検索条件に一致する試合結果が見つかりませんでした" : "試合結果はまだありません"}
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
