import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type Tab = "bbs" | "schedules" | "results";

export default function AdminManagement() {
  useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>("bbs");


  return (
    <div className="container py-8">
      <SEOHead
        title="管理画面 - 東舞鶴F.C"
        description="東舞鶴F.Cの管理画面"
      />
      <h1 className="text-3xl font-bold mb-8">コンテンツ管理</h1>

      {/* タブナビゲーション */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === "bbs" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("bbs")}
        >
          掲示板管理
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "schedules" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("schedules")}
        >
          スケジュール管理
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === "results" ? "border-b-2 border-primary font-semibold" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("results")}
        >
          試合結果管理
        </button>
      </div>

      {/* コンテンツエリア */}
      {activeTab === "bbs" && <BbsManagement />}
      {activeTab === "schedules" && <ScheduleManagement />}
      {activeTab === "results" && <ResultsManagement />}
    </div>
  );
}

// 掲示板管理コンポーネント
function BbsManagement() {
  const { data: posts, refetch } = trpc.bbs.list.useQuery();
  const deleteMutation = trpc.bbs.delete.useMutation({
    onSuccess: () => {
      toast.success("削除しました");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">掲示板投稿一覧</h2>
      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{post.authorName}</CardTitle>
                  <CardDescription>{new Date(post.createdAt).toLocaleString("ja-JP")}</CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm("この投稿を削除しますか？")) {
                      deleteMutation.mutate({ id: post.id });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
          </Card>
        ))}
        {!posts || posts.length === 0 && (
          <p className="text-muted-foreground text-center py-8">投稿がありません</p>
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
    grade: "U7" as "U7" | "U8" | "U9" | "U10" | "U11" | "U12" | "全体",
    opponent: "",
    eventDate: "",
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
      grade: "U7",
      opponent: "",
      eventDate: "",
      venue: "",
      notes: "",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (schedule: any) => {
    setFormData({
      title: schedule.title,
      eventType: schedule.eventType,
      grade: schedule.grade,
      opponent: schedule.opponent || "",
      eventDate: new Date(schedule.eventDate).toISOString().split("T")[0],
      venue: schedule.venue || "",
      notes: schedule.notes || "",
    });
    setEditingId(schedule.id);
    setIsCreating(true);
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
                <Label htmlFor="grade">学年 *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value: any) => setFormData({ ...formData, grade: value })}
                >
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="opponent">対戦相手</Label>
                <Input
                  id="opponent"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                />
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
                    {schedule.eventType} | {schedule.grade} | {new Date(schedule.eventDate).toLocaleDateString("ja-JP")}
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
            {(schedule.venue || schedule.notes) && (
              <CardContent>
                {schedule.venue && <p>場所: {schedule.venue}</p>}
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

// 試合結果管理コンポーネント
function ResultsManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    opponent: "",
    ourScore: 0,
    opponentScore: 0,
    matchDate: "",
    category: "",
    venue: "",
    notes: "",
  });

  const { data: results, refetch } = trpc.matchResults.list.useQuery();
  const createMutation = trpc.matchResults.create.useMutation({
    onSuccess: () => {
      toast.success("作成しました");
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateMutation = trpc.matchResults.update.useMutation({
    onSuccess: () => {
      toast.success("更新しました");
      refetch();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deleteMutation = trpc.matchResults.delete.useMutation({
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
      opponent: "",
      ourScore: 0,
      opponentScore: 0,
      matchDate: "",
      category: "",
      venue: "",
      notes: "",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, opponent: formData.opponent, ourScore: formData.ourScore, opponentScore: formData.opponentScore, matchDate: formData.matchDate, category: formData.category as any, venue: formData.venue, notes: formData.notes });
    } else {
      createMutation.mutate({ opponent: formData.opponent, ourScore: formData.ourScore, opponentScore: formData.opponentScore, matchDate: formData.matchDate, category: formData.category as any, venue: formData.venue, notes: formData.notes });
    }
  };

  const handleEdit = (result: any) => {
    setFormData({
      opponent: result.opponent,
      ourScore: result.ourScore,
      opponentScore: result.opponentScore,
      matchDate: new Date(result.matchDate).toISOString().split("T")[0],
      category: result.category || "",
      venue: result.venue || "",
      notes: result.notes || "",
    });
    setEditingId(result.id);
    setIsCreating(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">試合結果一覧</h2>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "キャンセル" : "新規作成"}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "試合結果編集" : "新規試合結果作成"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="opponent">対戦相手 *</Label>
                <Input
                  id="opponent"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ourScore">自チームスコア *</Label>
                  <Input
                    id="ourScore"
                    type="number"
                    min="0"
                    value={formData.ourScore}
                    onChange={(e) => setFormData({ ...formData, ourScore: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="opponentScore">相手チームスコア *</Label>
                  <Input
                    id="opponentScore"
                    type="number"
                    min="0"
                    value={formData.opponentScore}
                    onChange={(e) => setFormData({ ...formData, opponentScore: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="matchDate">試合日 *</Label>
                <Input
                  id="matchDate"
                  type="date"
                  value={formData.matchDate}
                  onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                  required
                />
              <div>
                <Label htmlFor="category">カテゴリー *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as any })}>
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
              </div>
              <div>
                <Label htmlFor="venue">会場</Label>
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
        {results?.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    東舞鶴F.C {result.ourScore} - {result.opponentScore} {result.opponent}
                  </CardTitle>
                  <CardDescription>
                    {new Date(result.matchDate).toLocaleDateString("ja-JP")}
                    {result.venue && ` | 会場: ${result.venue}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(result)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("この試合結果を削除しますか？")) {
                        deleteMutation.mutate({ id: result.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {result.notes && (
              <CardContent>
                <p className="text-muted-foreground">{result.notes}</p>
              </CardContent>
            )}
          </Card>
        ))}
        {!results || results.length === 0 && (
          <p className="text-muted-foreground text-center py-8">試合結果がありません</p>
        )}
      </div>
    </div>
  );
}
