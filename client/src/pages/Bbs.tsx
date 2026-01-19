import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function Bbs() {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");

  const { data: posts, isLoading } = trpc.bbs.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.bbs.create.useMutation({
    onSuccess: () => {
      toast.success("投稿しました");
      setContent("");
      utils.bbs.list.invalidate();
    },
    onError: (error) => {
      toast.error("投稿に失敗しました: " + error.message);
    },
  });

  const deleteMutation = trpc.bbs.delete.useMutation({
    onSuccess: () => {
      toast.success("投稿を削除しました");
      utils.bbs.list.invalidate();
    },
    onError: (error) => {
      toast.error("削除に失敗しました: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("投稿内容を入力してください");
      return;
    }

    createMutation.mutate({ content });
  };

  const handleDelete = (postId: number) => {
    if (confirm("この投稿を削除しますか？")) {
      deleteMutation.mutate({ id: postId });
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">掲示板</h1>

      {/* 投稿フォーム */}
      {isAuthenticated ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>新規投稿</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="投稿内容を入力してください"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    投稿中...
                  </>
                ) : (
                  "投稿する"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              投稿するにはログインが必要です
            </p>
            <Button asChild>
              <a href={getLoginUrl()}>ログイン</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-foreground">
                      {post.authorName}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(post.createdAt).toLocaleString("ja-JP")}
                    </span>
                  </div>
                  {(user?.role === "admin" || user?.id === post.authorId) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">投稿はまだありません</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
