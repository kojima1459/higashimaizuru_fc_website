import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Statistics() {
  const { data: statistics, isLoading } = trpc.statistics.matchResults.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="試合結果統計"
          description="東舞鶴F.Cの試合結果統計データ。学年別・カテゴリー別の勝敗数、得点数、失点数をグラフで可視化。"
          keywords="東舞鶴FC, 試合結果, 統計, データ分析, グラフ"
        />
        <div className="container py-12">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!statistics || !statistics.byCategory || Object.keys(statistics.byCategory).length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="試合結果統計"
          description="東舞鶴F.Cの試合結果統計データ。学年別・カテゴリー別の勝敗数、得点数、失点数をグラフで可視化。"
          keywords="東舞鶴FC, 試合結果, 統計, データ分析, グラフ"
        />
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            <AnimatedTitle text="試合結果統計" staggerDelay={60} />
          </h1>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">試合結果データがまだありません</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 全体統計の円グラフデータ
  const overallPieData = {
    labels: ["勝利", "引き分け", "敗北"],
    datasets: [
      {
        data: [
          statistics.overall.wins,
          statistics.overall.draws,
          statistics.overall.losses,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // green
          "rgba(234, 179, 8, 0.8)", // yellow
          "rgba(239, 68, 68, 0.8)", // red
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 学年別勝敗数の棒グラフデータ
  const categories = Object.keys(statistics.byCategory);
  const categoryBarData = {
    labels: categories,
    datasets: [
      {
        label: "勝利",
        data: categories.map((cat) => statistics.byCategory[cat].wins),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
      {
        label: "引き分け",
        data: categories.map((cat) => statistics.byCategory[cat].draws),
        backgroundColor: "rgba(234, 179, 8, 0.8)",
      },
      {
        label: "敗北",
        data: categories.map((cat) => statistics.byCategory[cat].losses),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ],
  };

  // 学年別得点・失点の棒グラフデータ
  const goalsBarData = {
    labels: categories,
    datasets: [
      {
        label: "得点",
        data: categories.map((cat) => statistics.byCategory[cat].goalsFor),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
      {
        label: "失点",
        data: categories.map((cat) => statistics.byCategory[cat].goalsAgainst),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="試合結果統計"
        description="東舞鶴F.Cの試合結果統計データ。学年別・カテゴリー別の勝敗数、得点数、失点数をグラフで可視化。"
        keywords="東舞鶴FC, 試合結果, 統計, データ分析, グラフ"
      />
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">試合結果統計</h1>

        {/* 全体統計サマリー */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>全体統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{statistics.overall.totalMatches}</p>
                <p className="text-sm text-muted-foreground">試合数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{statistics.overall.wins}</p>
                <p className="text-sm text-muted-foreground">勝利</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">{statistics.overall.draws}</p>
                <p className="text-sm text-muted-foreground">引き分け</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{statistics.overall.losses}</p>
                <p className="text-sm text-muted-foreground">敗北</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {statistics.overall.totalMatches > 0
                    ? ((statistics.overall.wins / statistics.overall.totalMatches) * 100).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-sm text-muted-foreground">勝率</p>
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <Pie data={overallPieData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* 学年別勝敗数 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>学年別勝敗数</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={categoryBarData} options={chartOptions} />
          </CardContent>
        </Card>

        {/* 学年別得点・失点 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>学年別得点・失点</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={goalsBarData} options={chartOptions} />
          </CardContent>
        </Card>

        {/* 学年別詳細統計 */}
        <Card>
          <CardHeader>
            <CardTitle>学年別詳細統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">学年</th>
                    <th className="text-center py-2 px-4">試合数</th>
                    <th className="text-center py-2 px-4">勝利</th>
                    <th className="text-center py-2 px-4">引き分け</th>
                    <th className="text-center py-2 px-4">敗北</th>
                    <th className="text-center py-2 px-4">勝率</th>
                    <th className="text-center py-2 px-4">得点</th>
                    <th className="text-center py-2 px-4">失点</th>
                    <th className="text-center py-2 px-4">得失点差</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const stats = statistics.byCategory[category];
                    const winRate = stats.totalMatches > 0
                      ? ((stats.wins / stats.totalMatches) * 100).toFixed(1)
                      : 0;
                    const goalDifference = stats.goalsFor - stats.goalsAgainst;

                    return (
                      <tr key={category} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{category}</td>
                        <td className="text-center py-2 px-4">{stats.totalMatches}</td>
                        <td className="text-center py-2 px-4 text-green-500">{stats.wins}</td>
                        <td className="text-center py-2 px-4 text-yellow-500">{stats.draws}</td>
                        <td className="text-center py-2 px-4 text-red-500">{stats.losses}</td>
                        <td className="text-center py-2 px-4">{winRate}%</td>
                        <td className="text-center py-2 px-4">{stats.goalsFor}</td>
                        <td className="text-center py-2 px-4">{stats.goalsAgainst}</td>
                        <td className={`text-center py-2 px-4 font-medium ${goalDifference > 0 ? "text-green-500" : goalDifference < 0 ? "text-red-500" : ""}`}>
                          {goalDifference > 0 ? "+" : ""}{goalDifference}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
