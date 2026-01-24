import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";
import SEOHead from "@/components/SEOHead";
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
  const [opponent, setOpponent] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{
    opponent?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const { data: results, isLoading } = trpc.matchResults.list.useQuery(appliedFilters);

  const handleSearch = () => {
    setAppliedFilters({
      opponent: opponent || undefined,
      category: category === "all" ? undefined : category || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setOpponent("");
    setCategory("all");
    setStartDate("");
    setEndDate("");
    setAppliedFilters({});
  };

  const hasActiveFilters = appliedFilters.opponent || appliedFilters.category || appliedFilters.startDate || appliedFilters.endDate;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="試合結果 - 東舞鶴F.C"
        description="東舞鶴F.Cの過去の試合結果一覧です。"
        image="/logo.jpeg"
        type="website"
      />
      <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">試合結果</h1>

      {/* 検索・フィルターUI */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">検索・フィルター</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
        <Card>
          <CardHeader>
            <CardTitle>試合結果一覧（{results.length}件）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日時</TableHead>
                    <TableHead>カテゴリー</TableHead>
                    <TableHead>対戦相手</TableHead>
                    <TableHead className="text-center">スコア</TableHead>
                    <TableHead>会場</TableHead>
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
                        <TableCell>
                          {new Date(result.matchDate).toLocaleDateString("ja-JP")}
                        </TableCell>
                        <TableCell className="font-medium">{result.category}</TableCell>
                        <TableCell className="font-medium">{result.opponent}</TableCell>
                        <TableCell className={`text-center font-bold ${resultColor}`}>
                          {result.ourScore} - {result.opponentScore}
                        </TableCell>
                        <TableCell>{result.venue || "-"}</TableCell>
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
