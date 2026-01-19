import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Trophy, Users, MessageSquare } from "lucide-react";
import InstagramFeed from "@/components/InstagramFeed";
import ShareButtons from "@/components/ShareButtons";
import AccessMap from "@/components/AccessMap";
import SEOHead from "@/components/SEOHead";

export default function Home() {
  return (
    <div className="w-full">
      <SEOHead
        title="東舞鶴F.C ウェブサイト - 京都府舞鶴市のサッカースポーツ少年団"
        description="京都府舞鶴市を拠点とするサッカースポーツ少年団です。子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。"
        image="/logo.jpeg"
        type="website"
      />
      {/* ヒーローセクション */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background z-10" />
        <img
          src="/field-photo.jpeg"
          alt="サッカーフィールド"
          className="absolute inset-0 w-full h-full object-cover parallax"
        />
        <div className="relative z-20 container text-center">
          <img src="/logo.jpeg" alt="東舞鶴F.C" className="h-32 w-32 mx-auto mb-6 rounded-full object-cover border-4 border-primary glow-effect" />
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            東舞鶴F.C
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            スポーツ少年団
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8">
                入団のお問い合わせ
              </Button>
            </Link>
            <Link href="/team">
              <Button size="lg" variant="outline" className="text-lg px-8">
                チーム情報
              </Button>
            </Link>
          </div>
          {/* SNSシェアボタン */}
          <div className="mt-8 flex justify-center">
            <ShareButtons />
          </div>
        </div>
      </section>

      {/* チーム紹介 */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              東舞鶴F.Cについて
            </h2>
            <p className="text-lg text-muted-foreground">
              京都府舞鶴市を拠点とするサッカースポーツ少年団です。<br />
              子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  練習日時
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  毎週土曜・日曜<br />
                  9時〜12時
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  練習場所
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  舞鶴市立朝来小学校
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 animate-fade-in-up">
            サイト機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/news">
              <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    お知らせ
                  </CardTitle>
                  <CardDescription>
                    練習や試合の最新情報
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/schedule">
              <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    スケジュール
                  </CardTitle>
                  <CardDescription>
                    練習・試合予定の確認
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/results">
              <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    試合結果
                  </CardTitle>
                  <CardDescription>
                    過去の試合結果一覧
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/bbs">
              <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    掲示板
                  </CardTitle>
                  <CardDescription>
                    保護者・選手の交流
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* 団員募集 */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              団員募集中
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              サッカーが好きな子どもたち、一緒にサッカーを楽しみませんか？<br />
              初心者も大歓迎です。まずはお気軽にお問い合わせください。
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8">
                お問い合わせはこちら
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* アクセス・地図 */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <AccessMap />
        </div>
      </section>

      {/* Instagramフィード */}
      <section className="py-16 bg-background">
        <div className="container">
          <InstagramFeed />
        </div>
      </section>
    </div>
  );
}
