import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import SEOHead from "@/components/SEOHead";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const newsId = params?.id ? parseInt(params.id) : 0;

  const { data: news, isLoading } = trpc.news.getById.useQuery({ id: newsId });
  const { data: allNews } = trpc.news.list.useQuery({});

  // 前後のお知らせを取得
  const currentIndex = allNews?.findIndex(n => n.id === newsId) ?? -1;
  const prevNews = currentIndex > 0 ? allNews?.[currentIndex - 1] : null;
  const nextNews = currentIndex >= 0 && currentIndex < (allNews?.length ?? 0) - 1 ? allNews?.[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">お知らせが見つかりません</p>
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                お知らせ一覧に戻る
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${news.title} - 東舞鶴F.C`}
        description={news.content.substring(0, 150)}
        image="/logo.jpeg"
        type="article"
      />
      
      {/* プレミアムページヘッダー */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black py-12 overflow-hidden premium-section">
        <div className="absolute inset-0 opacity-30 geometric-pattern" />
        <div className="relative z-10 container">
          <Link href="/news">
            <Button variant="ghost" className="mb-4 text-white hover:text-amber-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              お知らせ一覧に戻る
            </Button>
          </Link>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-400 text-black font-medium">
              {news.mainCategory}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-700 text-white">
              {news.subCategory}
            </span>
            <span className="text-sm text-amber-300 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(news.createdAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {news.title}
          </h1>
          <div className="premium-divider w-24" />
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* メインコンテンツ */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-10">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed text-base md:text-lg">
                  {news.content}
                </p>
              </div>
              
              {/* SNSシェアボタン */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">この記事をシェア</h3>
                <ShareButtons title={news.title} description={news.content.substring(0, 100)} />
              </div>
            </CardContent>
          </Card>

          {/* 前後のお知らせナビゲーション */}
          {(prevNews || nextNews) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {prevNews ? (
                <Link href={`/news/${prevNews.id}`}>
                  <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ChevronLeft className="h-4 w-4" />
                        <span>前の記事</span>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-2">{prevNews.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(prevNews.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <div />
              )}
              
              {nextNews ? (
                <Link href={`/news/${nextNews.id}`}>
                  <Card className="cursor-pointer hover:border-primary transition-all hover:shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                        <span>次の記事</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-2 text-right">{nextNews.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2 text-right">
                        {new Date(nextNews.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}

          {/* お知らせ一覧に戻るボタン */}
          <div className="text-center">
            <Link href="/news">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                お知らせ一覧に戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
