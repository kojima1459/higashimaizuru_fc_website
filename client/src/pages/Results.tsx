import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Results() {
  const { data: results, isLoading } = trpc.matchResults.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">試合結果</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : results && results.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>試合結果一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日時</TableHead>
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
            <p className="text-muted-foreground">試合結果はまだありません</p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
