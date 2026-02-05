import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Plus, Upload } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Admin() {
  useAdminAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">管理画面</h1>
        
      </div>

      <Tabs defaultValue="news" className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full">
            <TabsTrigger value="news" className="text-xs sm:text-sm whitespace-nowrap">お知らせ</TabsTrigger>
            <TabsTrigger value="results" className="text-xs sm:text-sm whitespace-nowrap">試合結果</TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs sm:text-sm whitespace-nowrap">お問い合わせ</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm whitespace-nowrap">スケジュール</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs sm:text-sm whitespace-nowrap">写真</TabsTrigger>
            <TabsTrigger value="bbs" className="text-xs sm:text-sm whitespace-nowrap">掲示板</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm whitespace-nowrap">設定・統計</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="news">
          <NewsManagement />
        </TabsContent>

        <TabsContent value="results">
          <ResultsManagement />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsList />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleManagement />
        </TabsContent>

        <TabsContent value="photos">
          <PhotosManagement />
        </TabsContent>

        <TabsContent value="bbs">
          <BbsManagement />
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
  const [mainCategory, setMainCategory] = useState<"練習" | "試合" | "連絡事項" | "その他">("練習");
  const [subCategory, setSubCategory] = useState<"U7" | "U8" | "U9" | "U10" | "U11" | "U12" | "全体" | "その他">("U7");
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
    setMainCategory("練習");
    setSubCategory("U7");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("すべての項目を入力してください");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, title, content, mainCategory, subCategory });
    } else {
      createMutation.mutate({ title, content, mainCategory, subCategory });
    }
  };

  const handleEdit = (news: any) => {
    setTitle(news.title);
    setContent(news.content);
    setMainCategory(news.mainCategory);
    setSubCategory(news.subCategory);
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
                placeholder="例: 2月の練習スケジュールについて"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">わかりやすいタイトルを入力してください</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainCategory">メインカテゴリ</Label>
                <Select value={mainCategory} onValueChange={(value: any) => setMainCategory(value)}>
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
                <Label htmlFor="subCategory">学年</Label>
                <Select value={subCategory} onValueChange={(value: any) => setSubCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="U7">U7</SelectItem>
                    <SelectItem value="U8">U8</SelectItem>
                    <SelectItem value="U9">U9</SelectItem>
                    <SelectItem value="U10">U10</SelectItem>
                    <SelectItem value="U11">U11</SelectItem>
                    <SelectItem value="U12">U12</SelectItem>
                    <SelectItem value="全体">全体</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                        {news.mainCategory}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground mr-2">
                        {news.subCategory}
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
  const [matchTitle, setMatchTitle] = useState("");
  const [opponent, setOpponent] = useState("");
  const [ourScore, setOurScore] = useState("0");
  const [opponentScore, setOpponentScore] = useState("0");
  const [matchDate, setMatchDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const updateMutation = trpc.matchResults.update.useMutation({
    onSuccess: () => {
      toast.success("試合結果を更新しました");
      resetForm();
      utils.matchResults.list.invalidate();
    },
    onError: (error) => {
      toast.error("更新に失敗しました: " + error.message);
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
    setMatchTitle("");
    setOpponent("");
    setOurScore("0");
    setOpponentScore("0");
    setMatchDate(undefined);
    setCategory("");
    setNotes("");
    setEditingId(null);
  };

  const handleEdit = (result: any) => {
    setEditingId(result.id);
    setMatchTitle(result.matchTitle);
    setOpponent(result.opponent);
    setOurScore(String(result.ourScore));
    setOpponentScore(String(result.opponentScore));
    setMatchDate(new Date(result.matchDate));
    setCategory(result.category);
    setNotes(result.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション：対戦相手、試合日、カテゴリーは必須、スコアは0以上の数値
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
    
    if (!category) {
      toast.error("カテゴリーを選択してください");
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

    if (!matchTitle.trim()) {
      toast.error("試合タイトルを入力してください");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        matchTitle: matchTitle.trim(),
        opponent: opponent.trim(),
        ourScore: ourScoreNum,
        opponentScore: opponentScoreNum,
        matchDate: format(matchDate, "yyyy-MM-dd"),
        category: category as any,
        notes: notes || undefined,
      });
    } else {
      createMutation.mutate({
        matchTitle: matchTitle.trim(),
        opponent: opponent.trim(),
        ourScore: ourScoreNum,
        opponentScore: opponentScoreNum,
        matchDate: format(matchDate, "yyyy-MM-dd"),
        category: category as any,
        notes: notes || undefined,
      });
    }
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
                <Label htmlFor="matchTitle">試合タイトル（大会名） *</Label>
                <Input
                  id="matchTitle"
                  value={matchTitle}
                  onChange={(e) => setMatchTitle(e.target.value.slice(0, 15))}
                  placeholder="例: 京都府大会予選"
                  maxLength={15}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">最大15文字です</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opponent">対戦相手</Label>
                <Input
                  id="opponent"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="例: 綾部FC"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">対戦相手のチーム名を入力してください</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchDate">試合日 *</Label>
                <input
                  id="matchDate"
                  type="date"
                  value={matchDate ? format(matchDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setMatchDate(new Date(e.target.value));
                    } else {
                      setMatchDate(undefined);
                    }
                  }}
                  className="w-full px-3 py-2 border border-input rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">カテゴリー *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="U7">U7</SelectItem>
                    <SelectItem value="U8">U8</SelectItem>
                    <SelectItem value="U9">U9</SelectItem>
                    <SelectItem value="U10">U10</SelectItem>
                    <SelectItem value="U11">U11</SelectItem>
                    <SelectItem value="U12">U12</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? "更新中..." : "登録中..."}
                  </>
                ) : (
                  editingId ? "更新する" : "登録する"
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
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(result)}
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(result.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{result.matchTitle}</div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground">東舞鶴F.C</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.ourScore} - {result.opponentScore}
                    </span>
                    <span className="font-semibold text-foreground">{result.opponent}</span>
                  </div>
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


// 管理画面設定コンポーネント
function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const changePasswordMutation = trpc.admin.changePassword.useMutation({
    onSuccess: () => {
      toast.success("パスワードを変更しました");
      // 新しいパスワードをlocalStorageに保存
      localStorage.setItem("adminPassword", newPassword);
      resetForm();
    },
    onError: (error) => {
      toast.error("パスワード変更に失敗しました: " + error.message);
    },
  });

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!currentPassword) {
      toast.error("現在のパスワードを入力してください");
      return;
    }

    if (!newPassword) {
      toast.error("新しいパスワードを入力してください");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("新しいパスワードは4文字以上である必要があります");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("新しいパスワードが一致しません");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("新しいパスワードは現在のパスワードと異なる必要があります");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
          <CardDescription>
            管理画面へのアクセスに使用するパスワードを変更できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">現在のパスワード</Label>
              <Input
                id="currentPassword"
                type={showPasswords ? "text" : "password"}
                placeholder="現在のパスワードを入力"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">新しいパスワード</Label>
              <Input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                placeholder="新しいパスワードを入力"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">新しいパスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                placeholder="新しいパスワードを再度入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPasswords"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="showPasswords" className="font-normal cursor-pointer">
                パスワードを表示
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    変更中...
                  </>
                ) : (
                  "パスワードを変更"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                リセット
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>サイト情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">サイト名</p>
            <p className="font-semibold">東舞鶴F.C ウェブサイト</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">管理画面URL</p>
            <p className="font-semibold text-sm break-all">{window.location.origin}/admin</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>試合結果統計</CardTitle>
          <CardDescription>
            試合結果の統計データを表示
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatisticsView />
        </CardContent>
      </Card>
    </div>
  );
}

// 統計情報表示コンポーネント
function StatisticsView() {
  const { data: statistics, isLoading } = trpc.statistics.matchResults.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!statistics || !statistics.byCategory || Object.keys(statistics.byCategory).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">試合結果データがまだありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">総試合数</p>
              <p className="text-3xl font-bold text-primary">
                {statistics.overall.wins + statistics.overall.draws + statistics.overall.losses}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">勝率</p>
              <p className="text-3xl font-bold text-green-600">
                {(
                  (statistics.overall.wins /
                    (statistics.overall.wins +
                      statistics.overall.draws +
                      statistics.overall.losses)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">総得点</p>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.overall.goalsFor}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">学年別成績</h3>
        <div className="space-y-2">
          {Object.entries(statistics.byCategory).map(([category, stats]: [string, any]) => (
            <div key={category} className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{category}</span>
                <span className="text-sm text-muted-foreground">
                  勝: {stats.wins} | 分: {stats.draws} | 敗: {stats.losses}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(
                      (stats.wins / (stats.wins + stats.draws + stats.losses)) *
                      100
                    ).toFixed(0)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 写真管理コンポーネント
function PhotosManagement() {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    category: "練習風景" as "練習風景" | "試合" | "イベント" | "その他",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{current: number, total: number} | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("全て");

  const { data: photos, refetch } = trpc.photos.list.useQuery({ 
    category: categoryFilter === "全て" ? undefined : categoryFilter 
  });
  
  const uploadMutation = trpc.photos.upload.useMutation({
    onSuccess: () => {
      toast.success("写真をアップロードしました");
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
      setIsUploading(false);
    },
  });

  const deleteMutation = trpc.photos.delete.useMutation({
    onSuccess: () => {
      toast.success("写真を削除しました");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      caption: "",
      category: "練習風景",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(f => f.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length}件のファイルが10MBを超えています`);
      return;
    }

    const invalidTypes = files.filter(f => !f.type.startsWith("image/"));
    if (invalidTypes.length > 0) {
      toast.error(`${invalidTypes.length}件のファイルが画像ではありません`);
      return;
    }

    setSelectedFiles(files);
    toast.success(`${files.length}件のファイルを選択しました`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("ファイルサイズは10MB以下にしてください");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("画像ファイルを選択してください");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("写真を選択してください");
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    try {
      const { storagePut } = await import("@/lib/storage");
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress({ current: i + 1, total: selectedFiles.length });

        const fileExtension = file.name.split('.').pop();
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `photos/${Date.now()}-${randomSuffix}.${fileExtension}`;
        
        const { url, key } = await storagePut(fileKey, file, file.type);

        await uploadMutation.mutateAsync({
          title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
          caption: formData.caption || undefined,
          imageUrl: url,
          imageKey: key,
          category: formData.category,
        });
      }

      toast.success(`${selectedFiles.length}件の写真をアップロードしました`);
      setSelectedFiles([]);
      setUploadProgress(null);
      refetch();
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("一括アップロードに失敗しました");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("写真を選択してください");
      return;
    }
    setIsUploading(true);
    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileKey = `photos/${Date.now()}-${randomSuffix}.${fileExtension}`;
      const { storagePut } = await import("@/lib/storage");
      const { url, key } = await storagePut(fileKey, selectedFile, selectedFile.type);
      await uploadMutation.mutateAsync({
        title: formData.title || undefined,
        caption: formData.caption || undefined,
        imageUrl: url,
        imageKey: key,
        category: formData.category,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("アップロードに失敗しました");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 一括アップロード */}
      <Card className="border-2 border-amber-400/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-amber-500" />
            一括アップロード（複数ファイル）
          </CardTitle>
          <CardDescription>複数の写真を一度にアップロードできます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-files">写真ファイル（複数選択可）</Label>
              <Input
                id="bulk-files"
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFilesChange}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground mt-1">
                ファイルサイズ: 各10MB以下 • 複数選択可能
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">
                  選択中: {selectedFiles.length}件のファイル
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <p key={index} className="text-xs text-muted-foreground truncate">
                      {index + 1}. {file.name}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>カテゴリー</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="練習風景">練習風景</SelectItem>
                  <SelectItem value="試合">試合</SelectItem>
                  <SelectItem value="イベント">イベント</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {uploadProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>アップロード中...</span>
                  <span>{uploadProgress.current} / {uploadProgress.total}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleBulkUpload} 
                disabled={isUploading || selectedFiles.length === 0}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? `アップロード中 (${uploadProgress?.current}/${uploadProgress?.total})` : `${selectedFiles.length}件をアップロード`}
              </Button>
              {selectedFiles.length > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedFiles([])} 
                  disabled={isUploading}
                >
                  クリア
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>写真をアップロード</CardTitle>
          <CardDescription>練習風景や試合の写真を追加できます</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">写真ファイル *</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">ファイルサイズ: 10MB以下</p>
            </div>
            {previewUrl && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">プレビュー:</p>
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto max-h-64 rounded-lg object-contain" />
              </div>
            )}
            <div>
              <Label htmlFor="category">カテゴリー *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })} disabled={isUploading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="練習風景">練習風景</SelectItem>
                  <SelectItem value="試合">試合</SelectItem>
                  <SelectItem value="イベント">イベント</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">タイトル（任意）</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="例: 2024年春季大会" disabled={isUploading} />
            </div>
            <div>
              <Label htmlFor="caption">キャプション（任意）</Label>
              <Textarea id="caption" value={formData.caption} onChange={(e) => setFormData({ ...formData, caption: e.target.value })} placeholder="写真の説明を入力してください" rows={3} disabled={isUploading} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isUploading || !selectedFile}>{isUploading ? "アップロード中..." : "アップロード"}</Button>
              {(selectedFile || formData.title || formData.caption) && (<Button type="button" variant="outline" onClick={resetForm} disabled={isUploading}>キャンセル</Button>)}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="mb-4">
        <Label>カテゴリーで絞り込み</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="全て">全て</SelectItem>
            <SelectItem value="練習風景">練習風景</SelectItem>
            <SelectItem value="試合">試合</SelectItem>
            <SelectItem value="イベント">イベント</SelectItem>
            <SelectItem value="その他">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {photos?.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img src={photo.imageUrl} alt={photo.title || "写真"} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-base">{photo.title || "無題"}</CardTitle>
                  <CardDescription>{photo.category} • {new Date(photo.createdAt).toLocaleDateString("ja-JP")}</CardDescription>
                </div>
                <Button variant="destructive" size="sm" onClick={() => { if (confirm("この写真を削除しますか？")) { deleteMutation.mutate({ id: photo.id }); } }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            {photo.caption && (<CardContent><p className="text-sm text-muted-foreground">{photo.caption}</p></CardContent>)}
          </Card>
        ))}
        {!photos || photos.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">写真がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

// スケジュール管理コンポーネント
function ScheduleManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    eventType: "練習" as "練習" | "試合" | "大会" | "その他",
    grades: [] as Array<"U7" | "U8" | "U9" | "U10" | "U11" | "U12" | "全体">,
    opponent: "",
    eventDate: "",
    meetingTime: "",
    venue: "",
    notes: "",
  });

  const { data: schedules, refetch } = trpc.schedules.list.useQuery();
  const createMutation = trpc.schedules.create.useMutation({
    onSuccess: () => {
      toast.success("作成しました");
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateMutation = trpc.schedules.update.useMutation({
    onSuccess: () => {
      toast.success("更新しました");
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteMutation = trpc.schedules.delete.useMutation({
    onSuccess: () => {
      toast.success("削除しました");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      eventType: "練習",
      grades: [],
      opponent: "",
      eventDate: "",
      meetingTime: "",
      venue: "",
      notes: "",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.grades.length === 0) {
      toast.error("学年を1つ以上選択してください");
      return;
    }
    if (formData.grades.length > 5) {
      toast.error("学年は最大5つまで選択できます");
      return;
    }
    console.log("[DEBUG] handleSubmit - formData:", formData);
    console.log("[DEBUG] handleSubmit - meetingTime:", formData.meetingTime);
    if (editingId) {
      console.log("[DEBUG] Updating schedule with ID:", editingId);
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      console.log("[DEBUG] Creating new schedule");
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (schedule: any) => {
    setFormData({
      title: schedule.title,
      eventType: schedule.eventType,
      grades: schedule.grades.split(",") as Array<"U7" | "U8" | "U9" | "U10" | "U11" | "U12" | "全体">,
      opponent: schedule.opponent || "",
      eventDate: new Date(schedule.eventDate).toISOString().split("T")[0],
      meetingTime: schedule.meetingTime || "",
      venue: schedule.venue || "",
      notes: schedule.notes || "",
    });
    setEditingId(schedule.id);
    setIsCreating(true);
  };

  const handleGradeToggle = (grade: "U7" | "U8" | "U9" | "U10" | "U11" | "U12" | "全体") => {
    setFormData(prev => {
      const isSelected = prev.grades.includes(grade);
      if (isSelected) {
        return { ...prev, grades: prev.grades.filter(g => g !== grade) };
      } else {
        if (prev.grades.length >= 5) {
          toast.error("学年は最大5つまで選択できます");
          return prev;
        }
        return { ...prev, grades: [...prev.grades, grade] };
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">スケジュール一覧</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "キャンセル" : "新規作成"}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "スケジュール編集" : "新規スケジュール作成"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">例: U10練習試合 vs 綾部FC</p>
              </div>
              <div>
                <Label htmlFor="eventType">種別 *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value: any) => setFormData({ ...formData, eventType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="練習">練習</SelectItem>
                    <SelectItem value="試合">試合</SelectItem>
                    <SelectItem value="大会">大会</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>学年 * (最大5つまで選択可能)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mt-2">
                  {(["U7", "U8", "U9", "U10", "U11", "U12", "全体"] as const).map((grade) => (
                    <div key={grade} className="flex items-center space-x-2">
                      <Checkbox
                        id={`grade-${grade}`}
                        checked={formData.grades.includes(grade)}
                        onCheckedChange={() => handleGradeToggle(grade)}
                      />
                      <label
                        htmlFor={`grade-${grade}`}
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {grade}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.grades.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    選択中: {formData.grades.join(", ")} ({formData.grades.length}/5)
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="opponent">対戦相手</Label>
                <Input
                  id="opponent"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-1">試合の場合は対戦相手を入力してください</p>
              </div>
              <div>
                <Label htmlFor="eventDate">日時 *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="meetingTime">集合時間</Label>
                <Input
                  id="meetingTime"
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => {
                    console.log("[DEBUG] meetingTime onChange - value:", e.target.value);
                    setFormData({ ...formData, meetingTime: e.target.value });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="venue">場所</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">備考</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? "更新" : "作成"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {schedules?.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{schedule.title}</CardTitle>
                  <CardDescription>
                    {schedule.eventType} | {schedule.grades} | {new Date(schedule.eventDate).toLocaleDateString("ja-JP")}
                    {schedule.opponent && ` | 対戦相手: ${schedule.opponent}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("このスケジュールを削除しますか？")) {
                        deleteMutation.mutate({ id: schedule.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(schedule.venue || schedule.meetingTime || schedule.notes) && (
              <CardContent>
                {schedule.venue && <p>場所: {schedule.venue}</p>}
                {schedule.meetingTime ? (
                  <p>集合時間　{schedule.meetingTime}</p>
                ) : (
                  <p className="text-muted-foreground">集合時間未定</p>
                )}
                {schedule.notes && <p className="text-muted-foreground">{schedule.notes}</p>}
              </CardContent>
            )}
          </Card>
        ))}
        {!schedules || schedules.length === 0 && (
          <p className="text-muted-foreground text-center py-8">スケジュールがありません</p>
        )}
      </div>
    </div>
  );
}

// 掲示板管理コンポーネント
function BbsManagement() {
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const { data: posts, isLoading } = trpc.bbs.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.bbs.delete.useMutation({
    onSuccess: () => {
      toast.success("投稿を削除しました");
      utils.bbs.list.invalidate();
    },
    onError: (error) => {
      toast.error("削除に失敗しました: " + error.message);
    },
  });

  const handleDelete = (postId: number) => {
    if (confirm("この投稿を削除しますか？")) {
      deleteMutation.mutate({ id: postId });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>掲示板投稿一覧</CardTitle>
          <CardDescription>ユーザーが投稿した掲示板の内容を管理できます</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <span className="font-semibold text-foreground text-sm sm:text-base">
                            {post.authorName}
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground ml-2 block sm:inline mt-1 sm:mt-0">
                            {new Date(post.createdAt).toLocaleString("ja-JP")}
                          </span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          disabled={deleteMutation.isPending}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          削除
                        </Button>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                      
                      {/* コメント表示ボタン */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                        className="mt-4"
                      >
                        コメント管理
                      </Button>
                    </CardContent>
                  </Card>

                  {/* コメント管理セクション */}
                  {expandedPostId === post.id && (
                    <div className="mt-2 ml-4 p-4 bg-muted rounded-lg border border-border">
                      <BbsCommentManagement postId={post.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">投稿はまだありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


// コメント管理コンポーネント
function BbsCommentManagement({ postId }: { postId: number }) {
  const { data: comments, isLoading: commentsLoading } = trpc.bbsComments.listByPost.useQuery({ postId });
  const utils = trpc.useUtils();

  const deleteCommentMutation = trpc.bbsComments.delete.useMutation({
    onSuccess: () => {
      toast.success("コメントを削除しました");
      utils.bbsComments.listByPost.invalidate({ postId });
    },
    onError: (error) => {
      toast.error("削除に失敗しました: " + error.message);
    },
  });

  const handleDeleteComment = (commentId: number) => {
    if (confirm("このコメントを削除しますか？")) {
      deleteCommentMutation.mutate({ id: commentId });
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-foreground text-sm">コメント一覧</h4>
      {commentsLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-background p-3 rounded border border-border text-sm">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="font-semibold text-foreground text-xs">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(comment.createdAt).toLocaleString("ja-JP")}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={deleteCommentMutation.isPending}
                  className="h-6 px-2"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-foreground text-xs whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-xs py-2">コメントはまだありません</p>
      )}
    </div>
  );
}
