import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";

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
        title="お知らせ - 東舞鶴F.C"
        description="東舞鶴F.Cの練習や試合の最新情報、連絡事項をお知らせします。"
        image="/logo.jpeg"
        type="website"
      />
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          <AnimatedTitle text="お知らせ" staggerDelay={60} />
        </h1>

        {/* メインカテゴリフィルター */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-foreground">カテゴリ</h3>
          <div className="flex flex-wrap gap-2">
            {mainCategories.map((category) => (
              <Button
                key={category}
                variant={selectedMainCategory === category ? "default" : "outline"}
                onClick={() => setSelectedMainCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* サブカテゴリフィルター */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-3 text-foreground">学年</h3>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((category) => (
              <Button
                key={category}
                variant={selectedSubCategory === category ? "default" : "outline"}
                onClick={() => setSelectedSubCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* お知らせ一覧 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : newsList && newsList.length > 0 ? (
          <div className="grid gap-6">
            {newsList.map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <Card className="cursor-pointer hover:border-primary transition-colors">
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
