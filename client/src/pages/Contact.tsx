import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("お問い合わせを送信しました");
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (error) => {
      toast.error("送信に失敗しました: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("すべての項目を入力してください");
      return;
    }

    submitMutation.mutate({ name, email, message });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="お問い合わせ - 東舞鶴F.C"
        description="東舞鶴F.Cへのお問い合わせはこちらから。入団に関するご質問もお気軽にどうぞ。"
        image="/logo.jpeg"
        type="website"
      />
      <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          <AnimatedTitle text="お問い合わせ" staggerDelay={60} />
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>入団・見学のお問い合わせ</CardTitle>
            <CardDescription>
              入団や見学をご希望の方は、下記のフォームよりお気軽にお問い合わせください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <Label htmlFor="message">お問い合わせ内容 *</Label>
                <Textarea
                  id="message"
                  placeholder="お問い合わせ内容をご記入ください"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
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

        <Card>
          <CardHeader>
            <CardTitle>練習見学について</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              練習見学は随時受け付けております。事前にご連絡いただければ、当日の練習内容などをお伝えいたします。
            </p>
            <div>
              <h3 className="text-foreground font-semibold mb-2">練習日時</h3>
              <p>毎週土曜・日曜 9時〜12時</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">練習場所</h3>
              <p>舞鶴市立朝来小学校</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
