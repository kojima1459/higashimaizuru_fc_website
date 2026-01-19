import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

const categories = ["全ての記事", "練習", "試合", "連絡事項", "その他"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("全ての記事");
  
  const { data: newsList, isLoading } = trpc.news.list.useQuery({
    category: selectedCategory === "全ての記事" ? undefined : selectedCategory,
  });

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">お知らせ</h1>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">
                      {news.category}
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
  );
}
