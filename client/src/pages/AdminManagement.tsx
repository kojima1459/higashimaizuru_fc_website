import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(["U7", "U8", "U9", "U10", "U11", "U12", "全体"] as const).map((grade) => (
                    <div key={grade} className="flex items-center space-x-2">
                      <Checkbox
                        id={`grade-${grade}`}
                        checked={formData.grades.includes(grade)}
                        onCheckedChange={() => handleGradeToggle(grade)}
                      />
                      <label
                        htmlFor={`grade-${grade}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                  onChange={(e) => setFormData({ ...formData, meetingTime: e.target.value })}
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
            {(schedule.meetingTime || schedule.venue || schedule.notes) && (
              <CardContent>
                {schedule.meetingTime && <p>集合時間: {schedule.meetingTime}</p>}
                {schedule.venue && <p>場所: {schedule.venue}</p>}
                {schedule.notes && <p className="text-muted-foreground">{schedule.notes}</p>}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// 試合結果管理コンポーネント
function ResultsManagement() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    matchTitle: "",
    opponent: "",
    ourScore: "",
    opponentScore: "",
    matchDate: "",
    category: "U7" as "U7" | "U8" | "U9" | "U10" | "U11" | "U12" | "その他",
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
      matchTitle: "",
      opponent: "",
      ourScore: "",
      opponentScore: "",
      matchDate: "",
      category: "U7",
      notes: "",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      ourScore: parseInt(formData.ourScore),
      opponentScore: parseInt(formData.opponentScore),
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (result: any) => {
    setFormData({
      matchTitle: result.matchTitle,
      opponent: result.opponent,
      ourScore: result.ourScore.toString(),
      opponentScore: result.opponentScore.toString(),
      matchDate: new Date(result.matchDate).toISOString().split("T")[0],
      category: result.category,
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
                <Label htmlFor="matchTitle">試合名 *</Label>
                <Input
                  id="matchTitle"
                  value={formData.matchTitle}
                  onChange={(e) => setFormData({ ...formData, matchTitle: e.target.value })}
                  required
                />
              </div>
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
                    onChange={(e) => setFormData({ ...formData, ourScore: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, opponentScore: e.target.value })}
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
              </div>
              <div>
                <Label htmlFor="category">カテゴリー *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
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
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
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
                  <CardTitle className="text-lg">{result.matchTitle}</CardTitle>
                  <CardDescription>
                    {result.category} | {new Date(result.matchDate).toLocaleDateString("ja-JP")}
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
            <CardContent>
              <p className="text-lg font-semibold">
                東舞鶴F.C {result.ourScore} - {result.opponentScore} {result.opponent}
              </p>
              {result.notes && <p className="text-muted-foreground mt-2">{result.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
