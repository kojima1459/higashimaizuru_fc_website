import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus, Swords, HelpCircle, MapPin, Clock, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";

type InquiryType = "入団・体験" | "練習試合" | "その他";

export default function Contact() {
  const [inquiryType, setInquiryType] = useState<InquiryType>("入団・体験");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 入団・体験用
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  // 練習試合用
  const [teamName, setTeamName] = useState("");
  const [teamCategory, setTeamCategory] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchVenue, setMatchVenue] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setChildName("");
      setChildGrade("");
      setPreferredDate("");
      setTeamName("");
      setTeamCategory("");
      setMatchDate("");
      setMatchVenue("");
    },
    onError: (error) => {
      toast.error("送信に失敗しました: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error("必須項目を入力してください");
      return;
    }

    // Build message with type-specific fields
    let fullMessage = `【お問い合わせ種別】${inquiryType}\n\n`;

    if (inquiryType === "入団・体験") {
      if (childName) fullMessage += `【お子様のお名前】${childName}\n`;
      if (childGrade) fullMessage += `【学年】${childGrade}\n`;
      if (preferredDate) fullMessage += `【希望日】${preferredDate}\n`;
    } else if (inquiryType === "練習試合") {
      if (teamName) fullMessage += `【チーム名】${teamName}\n`;
      if (teamCategory) fullMessage += `【カテゴリー】${teamCategory}\n`;
      if (matchDate) fullMessage += `【希望日時】${matchDate}\n`;
      if (matchVenue) fullMessage += `【希望場所】${matchVenue}\n`;
    }

    if (phone) fullMessage += `【電話番号】${phone}\n`;
    fullMessage += `\n${message}`;

    submitMutation.mutate({ name, email, message: fullMessage });
  };

  const resetForm = () => {
    setSubmitted(false);
    setInquiryType("入団・体験");
  };

  // 送信完了画面
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="送信完了 - 東舞鶴F.C"
          description="お問い合わせありがとうございます。"
          image="/logo.jpeg"
          type="website"
        />
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-12 pb-8 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4 w-fit mx-auto mb-6">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  お問い合わせありがとうございます
                </h2>
                <p className="text-muted-foreground mb-2">
                  内容を確認の上、担当者より折り返しご連絡いたします。
                </p>
                <p className="text-muted-foreground mb-8">
                  通常2〜3日以内にご返信いたします。
                </p>

                {inquiryType === "入団・体験" && (
                  <Card className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-3">次回の練習情報</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="h-4 w-4" />
                        <span>毎週土曜・日曜 9時〜12時</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>舞鶴市立朝来小学校</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        持ち物：運動着、トレーニングシューズ、水筒、タオル
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetForm} variant="outline">
                    別のお問い合わせをする
                  </Button>
                  <a href="/">
                    <Button>トップページに戻る</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="お問い合わせ・体験申込 - 東舞鶴FC | 舞鶴市の小学生サッカークラブ"
        description="舞鶴市の小学生サッカークラブ「東舞鶴FC」へのお問い合わせ。入団・体験練習（無料）・練習試合の申し込みはこちら。舞鶴市・南舞鶴・高浜・小浜エリアからも歓迎。"
        image="/logo.jpeg"
        type="website"
        keywords="舞鶴市 サッカー 体験,舞鶴 サッカー 小学生 申し込み,高浜 サッカー 体験練習,小浜 サッカー 入団,南舞鶴 サッカークラブ,少年サッカー 体験 無料 舞鶴"
      />
      <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          <AnimatedTitle text="お問い合わせ" staggerDelay={60} />
        </h1>

        {/* お問い合わせ種別タブ */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <button
            type="button"
            onClick={() => setInquiryType("入団・体験")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              inquiryType === "入団・体験"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md"
                : "border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
            }`}
          >
            <UserPlus className={`h-6 w-6 ${inquiryType === "入団・体験" ? "text-blue-600" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${inquiryType === "入団・体験" ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>
              入団・体験
            </span>
          </button>
          <button
            type="button"
            onClick={() => setInquiryType("練習試合")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              inquiryType === "練習試合"
                ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-md"
                : "border-border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/10"
            }`}
          >
            <Swords className={`h-6 w-6 ${inquiryType === "練習試合" ? "text-green-600" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${inquiryType === "練習試合" ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}`}>
              練習試合
            </span>
          </button>
          <button
            type="button"
            onClick={() => setInquiryType("その他")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              inquiryType === "その他"
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-md"
                : "border-border hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/10"
            }`}
          >
            <HelpCircle className={`h-6 w-6 ${inquiryType === "その他" ? "text-amber-600" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${inquiryType === "その他" ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}>
              その他
            </span>
          </button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {inquiryType === "入団・体験" && "入団・体験練習のお申し込み"}
              {inquiryType === "練習試合" && "練習試合のお申し込み"}
              {inquiryType === "その他" && "お問い合わせ"}
            </CardTitle>
            <CardDescription>
              {inquiryType === "入団・体験" && "入団や体験練習をご希望の方は、下記フォームよりお気軽にお申し込みください。初心者大歓迎です。"}
              {inquiryType === "練習試合" && "練習試合をご希望のチーム関係者の方は、下記フォームよりお申し込みください。"}
              {inquiryType === "その他" && "ご質問やご要望がございましたら、お気軽にお問い合わせください。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 共通フィールド */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {inquiryType === "練習試合" ? "ご担当者名" : "保護者のお名前"} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={inquiryType === "練習試合" ? "山田 太郎" : "山田 太郎（保護者名）"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* 入団・体験用フィールド */}
              {inquiryType === "入団・体験" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="childName">お子様のお名前</Label>
                      <Input
                        id="childName"
                        type="text"
                        placeholder="山田 一郎"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childGrade">学年</Label>
                      <Select value={childGrade} onValueChange={setChildGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="学年を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="年長">年長</SelectItem>
                          <SelectItem value="小学1年生">小学1年生</SelectItem>
                          <SelectItem value="小学2年生">小学2年生</SelectItem>
                          <SelectItem value="小学3年生">小学3年生</SelectItem>
                          <SelectItem value="小学4年生">小学4年生</SelectItem>
                          <SelectItem value="小学5年生">小学5年生</SelectItem>
                          <SelectItem value="小学6年生">小学6年生</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">体験希望日（任意）</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      練習は毎週土曜・日曜 9時〜12時です
                    </p>
                  </div>
                </>
              )}

              {/* 練習試合用フィールド */}
              {inquiryType === "練習試合" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="teamName">チーム名 *</Label>
                    <Input
                      id="teamName"
                      type="text"
                      placeholder="例：〇〇サッカークラブ"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="teamCategory">カテゴリー</Label>
                      <Select value={teamCategory} onValueChange={setTeamCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリーを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="U7">U7</SelectItem>
                          <SelectItem value="U8">U8</SelectItem>
                          <SelectItem value="U9">U9</SelectItem>
                          <SelectItem value="U10">U10</SelectItem>
                          <SelectItem value="U11">U11</SelectItem>
                          <SelectItem value="U12">U12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matchDate">希望日時</Label>
                      <Input
                        id="matchDate"
                        type="date"
                        value={matchDate}
                        onChange={(e) => setMatchDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matchVenue">希望場所</Label>
                    <Select value={matchVenue} onValueChange={setMatchVenue}>
                      <SelectTrigger>
                        <SelectValue placeholder="会場を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="東舞鶴FC側（朝来小学校）">東舞鶴FC側（朝来小学校）</SelectItem>
                        <SelectItem value="そちらの会場">そちらの会場</SelectItem>
                        <SelectItem value="その他（備考欄に記載）">その他（備考欄に記載）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* 共通フィールド（続き） */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号（任意）</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="090-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {inquiryType === "入団・体験" && "ご質問・ご要望 *"}
                  {inquiryType === "練習試合" && "備考・ご要望 *"}
                  {inquiryType === "その他" && "お問い合わせ内容 *"}
                </Label>
                <Textarea
                  id="message"
                  placeholder={
                    inquiryType === "入団・体験"
                      ? "サッカー経験の有無、気になる点などをご自由にお書きください"
                      : inquiryType === "練習試合"
                      ? "試合形式（8人制等）、人数、その他ご希望をお書きください"
                      : "お問い合わせ内容をご記入ください"
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    送信中...
                  </>
                ) : (
                  "送信する"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 直接連絡 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>お急ぎの方はこちら</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="tel:090-9624-9395" className="block">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-all">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">電話で問い合わせ</p>
                    <p className="text-xs text-muted-foreground">090-9624-9395</p>
                  </div>
                </div>
              </a>
              <a href="https://line.me/ti/p/sanky13" target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/10 transition-all">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                    <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">LINEで問い合わせ</p>
                    <p className="text-xs text-muted-foreground">お気軽にどうぞ</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* 練習見学情報 */}
        <Card>
          <CardHeader>
            <CardTitle>練習見学について</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              練習見学は随時受け付けております。事前にご連絡いただければ、当日の練習内容などをお伝えいたします。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-foreground font-semibold mb-1">練習日時</h3>
                  <p>毎週土曜・日曜 9時〜12時</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-foreground font-semibold mb-1">練習場所</h3>
                  <p>舞鶴市立朝来小学校</p>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <h3 className="text-foreground font-semibold mb-2">体験練習の持ち物</h3>
              <ul className="text-sm space-y-1">
                <li>・ 運動できる服装</li>
                <li>・ トレーニングシューズ（スパイク不可）</li>
                <li>・ 水筒</li>
                <li>・ タオル</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
