import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const newsId = params?.id ? parseInt(params.id) : 0;

  const { data: news, isLoading } = trpc.news.getById.useQuery({ id: newsId });

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
      <div className="container py-12">
      <Link href="/news">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          お知らせ一覧に戻る
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground">
              {news.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(news.createdAt).toLocaleDateString("ja-JP")}
            </span>
          </div>
          <CardTitle className="text-3xl">{news.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{news.content}</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
