import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Trash2, MessageCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Bbs() {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  const { data: posts, isLoading } = trpc.bbs.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.bbs.create.useMutation({
    onSuccess: () => {
      toast.success("投稿しました");
      setContent("");
      setAuthorName("");
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

    createMutation.mutate({ content, authorName: authorName.trim() || undefined });
  };

  const handleDelete = (postId: number) => {
    if (confirm("この投稿を削除しますか？")) {
      deleteMutation.mutate({ id: postId });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="掲示板 - 東舞鶴F.C"
        description="東舞鶴F.Cの保護者・選手の交流掲示板です。"
        image="/logo.jpeg"
        type="website"
      />
      <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">掲示板</h1>

      {/* 投稿フォーム */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>新規投稿</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAuthenticated && (
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium mb-2">
                  名前（任意）
                </label>
                <input
                  id="authorName"
                  type="text"
                  placeholder="名前を入力（空欄の場合は「名無し」）"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
            )}
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

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <Card>
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
                  <p className="text-foreground whitespace-pre-wrap mb-4">{post.content}</p>
                  
                  {/* コメント表示・投稿ボタン */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                    className="mt-4"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    コメント
                  </Button>
                </CardContent>
              </Card>

              {/* コメント展開セクション */}
              {expandedPostId === post.id && (
                <div className="mt-2 ml-4 space-y-3">
                  <CommentSection postId={post.id} user={user} isAuthenticated={isAuthenticated} />
                </div>
              )}
            </div>
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
    </div>
  );
}

// コメントセクションコンポーネント
function CommentSection({ postId, user, isAuthenticated }: { postId: number; user: any; isAuthenticated: boolean }) {
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthorName, setCommentAuthorName] = useState("");
  const utils = trpc.useUtils();

  const { data: comments, isLoading: commentsLoading } = trpc.bbsComments.listByPost.useQuery({ postId });

  const createCommentMutation = trpc.bbsComments.create.useMutation({
    onSuccess: () => {
      toast.success("コメントしました");
      setCommentContent("");
      setCommentAuthorName("");
      utils.bbsComments.listByPost.invalidate({ postId });
    },
    onError: (error) => {
      toast.error("コメント投稿に失敗しました: " + error.message);
    },
  });

  const deleteCommentMutation = trpc.bbsComments.delete.useMutation({
    onSuccess: () => {
      toast.success("コメントを削除しました");
      utils.bbsComments.listByPost.invalidate({ postId });
    },
    onError: (error) => {
      toast.error("削除に失敗しました: " + error.message);
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      toast.error("コメント内容を入力してください");
      return;
    }

    createCommentMutation.mutate({
      postId,
      content: commentContent,
      authorName: commentAuthorName.trim() || undefined,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm("このコメントを削除しますか？")) {
      deleteCommentMutation.mutate({ id: commentId });
    }
  };

  return (
    <div className="space-y-3 p-4 bg-muted rounded-lg">
      {/* コメント投稿フォーム */}
      <div className="bg-background p-3 rounded border border-border">
        <form onSubmit={handleCommentSubmit} className="space-y-2">
          {!isAuthenticated && (
            <input
              type="text"
              placeholder="名前（任意）"
              value={commentAuthorName}
              onChange={(e) => setCommentAuthorName(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
            />
          )}
          <textarea
            placeholder="コメントを入力..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows={2}
            className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground resize-none"
          />
          <Button
            type="submit"
            size="sm"
            disabled={createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                投稿中...
              </>
            ) : (
              "コメントする"
            )}
          </Button>
        </form>
      </div>

      {/* コメント一覧 */}
      <div className="space-y-2">
        {commentsLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-background p-3 rounded border border-border text-sm">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="font-semibold text-foreground text-sm">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(comment.createdAt).toLocaleString("ja-JP")}
                  </span>
                </div>
                {(user?.role === "admin" || user?.id === comment.authorId) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deleteCommentMutation.isPending}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
              <p className="text-foreground text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm py-2">コメントはまだありません</p>
        )}
      </div>
    </div>
  );
}
