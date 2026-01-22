import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Trash2, Edit } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

export default function Admin() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">管理画面</h1>
        <div className="flex gap-2">
          <Button onClick={() => setLocation("/admin/photos")}>写真管理</Button>
          <Button onClick={() => setLocation("/admin/management")}>コンテンツ管理</Button>
        </div>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news">お知らせ管理</TabsTrigger>
          <TabsTrigger value="results">試合結果管理</TabsTrigger>
          <TabsTrigger value="contacts">お問い合わせ一覧</TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <NewsManagement />
        </TabsContent>

        <TabsContent value="results">
          <ResultsManagement />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsList />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

// お知らせ管理コンポーネント
function NewsManagement() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"練習" | "試合" | "連絡事項" | "その他">("練習");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: newsList, isLoading } = trpc.news.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => {
      toast.success("お知らせを作成しました");
      resetForm();
      utils.news.list.invalidate();
    },
    onError: (error) => {
      toast.error("作成に失敗しました: " + error.message);
    },
  });

  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => {
      toast.success("お知らせを更新しました");
      resetForm();
      utils.news.list.invalidate();
    },
    onError: (error) => {
      toast.error("更新に失敗しました: " + error.message);
    },
  });

  const deleteMutation = trpc.news.delete.useMutation({
    onSuccess: () => {
      toast.success("お知らせを削除しました");
      utils.news.list.invalidate();
    },
    onError: (error) => {
      toast.error("削除に失敗しました: " + error.message);
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("練習");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("すべての項目を入力してください");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, title, content, category });
    } else {
      createMutation.mutate({ title, content, category });
    }
  };

  const handleEdit = (news: any) => {
    setTitle(news.title);
    setContent(news.content);
    setCategory(news.category);
    setEditingId(news.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("このお知らせを削除しますか？")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "お知らせを編集" : "新規お知らせ作成"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="お知らせのタイトル"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="練習">練習</SelectItem>
                  <SelectItem value="試合">試合</SelectItem>
                  <SelectItem value="連絡事項">連絡事項</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="お知らせの内容"
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    処理中...
                  </>
                ) : editingId ? (
                  "更新する"
                ) : (
                  "作成する"
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  キャンセル
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>お知らせ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : newsList && newsList.length > 0 ? (
            <div className="space-y-4">
              {newsList.map((news) => (
                <div key={news.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground mr-2">
                        {news.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(news.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(news)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(news.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{news.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{news.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">お知らせはまだありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 試合結果管理コンポーネント
function ResultsManagement() {
  const [opponent, setOpponent] = useState("");
  const [ourScore, setOurScore] = useState("0");
  const [opponentScore, setOpponentScore] = useState("0");
  const [matchDate, setMatchDate] = useState<Date | undefined>(undefined);
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");

  const { data: results, isLoading } = trpc.matchResults.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.matchResults.create.useMutation({
    onSuccess: () => {
      toast.success("試合結果を登録しました");
      resetForm();
      utils.matchResults.list.invalidate();
    },
    onError: (error) => {
      toast.error("登録に失敗しました: " + error.message);
    },
  });

  const deleteMutation = trpc.matchResults.delete.useMutation({
    onSuccess: () => {
      toast.success("試合結果を削除しました");
      utils.matchResults.list.invalidate();
    },
    onError: (error) => {
      toast.error("削除に失敗しました: " + error.message);
    },
  });

  const resetForm = () => {
    setOpponent("");
    setOurScore("0");
    setOpponentScore("0");
    setMatchDate(undefined);
    setVenue("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submit - matchDate:", matchDate);
    console.log("Form submit - opponent:", opponent);
    console.log("Form submit - ourScore:", ourScore);
    console.log("Form submit - opponentScore:", opponentScore);

    // バリデーション：対戦相手と試合日は必須、スコアは0以上の数値
    const ourScoreNum = parseInt(ourScore, 10);
    const opponentScoreNum = parseInt(opponentScore, 10);
    
    if (!opponent.trim()) {
      toast.error("対戦相手を入力してください");
      return;
    }
    
    if (!matchDate) {
      toast.error("試合日を選択してください");
      return;
    }
    
    if (isNaN(ourScoreNum) || ourScoreNum < 0) {
      toast.error("自チームスコアは0以上の数値を入力してください");
      return;
    }
    
    if (isNaN(opponentScoreNum) || opponentScoreNum < 0) {
      toast.error("相手チームスコアは0以上の数値を入力してください");
      return;
    }

    console.log("ミューテーション実行:", {
      opponent,
      ourScore: parseInt(ourScore),
      opponentScore: parseInt(opponentScore),
      matchDate,
      venue: venue || undefined,
      notes: notes || undefined,
    });

    createMutation.mutate({
      opponent: opponent.trim(),
      ourScore: ourScoreNum,
      opponentScore: opponentScoreNum,
      matchDate: format(matchDate, "yyyy-MM-dd"),
      venue: venue || undefined,
      notes: notes || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("この試合結果を削除しますか？")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>試合結果を登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opponent">対戦相手</Label>
                <Input
                  id="opponent"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="対戦相手名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchDate">試合日</Label>
                <DatePicker
                  date={matchDate}
                  onDateChange={setMatchDate}
                  placeholder="試合日を選択"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ourScore">自チームスコア</Label>
                <Input
                  id="ourScore"
                  type="number"
                  min="0"
                  value={ourScore}
                  onChange={(e) => setOurScore(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opponentScore">相手チームスコア</Label>
                <Input
                  id="opponentScore"
                  type="number"
                  min="0"
                  value={opponentScore}
                  onChange={(e) => setOpponentScore(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="venue">会場（任意）</Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="会場名"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">備考（任意）</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="試合の詳細など"
                  rows={3}
                />
              </div>
            </div>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                "登録する"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>試合結果一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(result.matchDate).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(result.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground">東舞鶴F.C</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.ourScore} - {result.opponentScore}
                    </span>
                    <span className="font-semibold text-foreground">{result.opponent}</span>
                  </div>
                  {result.venue && (
                    <p className="text-sm text-muted-foreground mt-2">会場: {result.venue}</p>
                  )}
                  {result.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{result.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">試合結果はまだありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// お問い合わせ一覧コンポーネント
function ContactsList() {
  const { data: contacts, isLoading } = trpc.contact.list.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>お問い合わせ一覧</CardTitle>
        <CardDescription>
          受信したお問い合わせの一覧です
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : contacts && contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-foreground">{contact.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({contact.email})
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleString("ja-JP")}
                  </span>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{contact.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">お問い合わせはまだありません</p>
        )}
      </CardContent>
    </Card>
  );
}
