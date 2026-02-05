import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useState } from "react";

const mainCategories = ["全ての記事", "練習", "試合", "連絡事項", "その他"];
const subCategories = ["全て", "U7", "U8", "U9", "U10", "U11", "U12", "全体", "その他"];

export default function News() {
  const [selectedMainCategory, setSelectedMainCategory] = useState("全ての記事");
  const [selectedSubCategory, setSelectedSubCategory] = useState("全て");
  
  const { data: newsList, isLoading } = trpc.news.list.useQuery({
    mainCategory: selectedMainCategory === "全ての記事" ? undefined : selectedMainCategory,
    subCategory: selectedSubCategory === "全て" ? undefined : selectedSubCategory,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="お知らせ - 東舞鶴フットボールクラブ"
        description="東舞鶴フットボールクラブの練習や試合の最新情報、連絡事項をお知らせします。"
        image="/logo.jpeg"
        type="website"
      />
      {/* プレミアムページヘッダー */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16 overflow-hidden premium-section">
        <div className="absolute inset-0 opacity-30 geometric-pattern" />
        <div className="relative z-10 container">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg hero-title">
            <AnimatedTitle text="お知らせ" staggerDelay={60} />
          </h1>
          <div className="premium-divider w-32" />
          <p className="text-lg text-amber-300 mt-4">東舞鶴フットボールクラブの最新情報</p>
        </div>
      </div>

      <div className="container py-12">

        {/* メインカテゴリフィルター */}
        <div className="mb-6 mt-8">
          <h3 className="text-sm md:text-base font-semibold mb-3 text-foreground">カテゴリ</h3>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {mainCategories.map((category) => (
              <Button
                key={category}
                variant={selectedMainCategory === category ? "default" : "outline"}
                onClick={() => setSelectedMainCategory(category)}
                className={`text-xs md:text-sm px-2 md:px-4 py-2 min-h-10 md:min-h-12 ${selectedMainCategory === category ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black" : ""}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* サブカテゴリフィルター */}
        <div className="mb-8">
          <h3 className="text-sm md:text-base font-semibold mb-3 text-foreground">学年</h3>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {subCategories.map((category) => (
              <Button
                key={category}
                variant={selectedSubCategory === category ? "default" : "outline"}
                onClick={() => setSelectedSubCategory(category)}
                className={`text-xs md:text-sm px-2 md:px-4 py-2 min-h-10 md:min-h-12 ${selectedSubCategory === category ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black" : ""}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* セクションセパレーター */}
        <div className="section-separator" />

        {/* お知らせ一覧 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : newsList && newsList.length > 0 ? (
          <div className="grid gap-6 premium-section">
            {newsList.map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:shadow-amber-400/20 dark:hover:shadow-amber-400/10">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">
                        {news.mainCategory}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                        {news.subCategory}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(news.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <CardTitle>{news.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {news.content}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">お知らせはまだありません</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
