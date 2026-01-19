import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Trophy, Users, MessageSquare, Target, Sparkles, Award } from "lucide-react";
import { InstagramFeed } from "@/components/InstagramFeed";
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
        keywords="東舞鶴F.C,東舞鶴FC,舞鶴,サッカー,スポーツ少年団,京都,少年サッカー,ジュニアサッカー,サッカークラブ,サッカーチーム"
      />
      {/* 構造化データ (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            "name": "東舞鶴F.C",
            "sport": "サッカー",
            "description": "京都府舞鶴市を拠点とするサッカースポーツ少年団です。子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "舞鶴市",
              "addressRegion": "京都府",
              "addressCountry": "JP"
            },
            "logo": `${window.location.origin}/logo.jpeg`,
            "image": `${window.location.origin}/logo.jpeg`,
            "url": window.location.href,
          }),
        }}
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

      {/* 基本方針 */}
      <section className="py-0">
        <div className="w-full">
          {/* セクション1: クラブ運営の目標 */}
          <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 py-16 px-4">
            <div className="container max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Target className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Jrから大人までの一体型クラブ運営を目指しています
              </h2>
              <div className="space-y-4 text-lg text-white/95">
                <p className="font-medium">・サッカーを大好きになってほしい</p>
                <p className="font-medium">・サッカーを通して仲間の大切さに気づき、人を思いやる心を育んでほしい</p>
                <p className="font-medium">・いつも感謝の心を大切にしてほしい</p>
              </div>
            </div>
          </div>

          {/* セクション2: サッカーの教育的価値 */}
          <div className="bg-gradient-to-br from-rose-400 via-red-400 to-rose-500 py-16 px-4">
            <div className="container max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                サッカーは、子供の創造性をのばすことのできるスポーツです。
              </h2>
              <div className="space-y-4 text-lg text-white/95">
                <p className="font-medium">・無限の選択肢が秘めているボールにどんな命を吹き込むか、すべてがその子供の創造性にゆだねられています</p>
                <p className="font-medium">・子供たちは自分自身を表現することの楽しさを味わうことができるでしょう。</p>
              </div>
            </div>
          </div>

          {/* セクション3: サッカーの人間形成 */}
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 py-16 px-4">
            <div className="container max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Award className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                サッカーは子どもを大人にし、<br />大人を紳士にする。
              </h2>
            </div>
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

      {/* SEO用テキストコンテンツ */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">東舞鶴F.Cについて</h2>
          <div className="space-y-4 text-foreground">
            <p>
              東舞鶴F.C（東舞鶴フットボールクラブ）は、京都府舞鶴市を拠点とするサッカースポーツ少年団です。私たちは、子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。
            </p>
            <p>
              少年サッカー、ジュニアサッカーを通じて、子どもたちの体力向上、技術向上、そしてチームワークの大切さを学ぶ機会を提供しています。練習や試合を通じて、サッカーの楽しさを体験し、仲間との絆を深めていくことを目指しています。
            </p>
            <p>
              舞鶴地域のサッカークラブとして、地域社会とのつながりを大切にし、地域の子どもたちの成長をサポートしています。初心者から経験者まで、どなたでも歓迎します。一緒にサッカーを楽しみましょう！
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
