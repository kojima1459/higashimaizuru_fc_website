import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Trophy, Users, MessageSquare, Target, Sparkles, Award, ArrowRight, Zap, Heart, Shield } from "lucide-react";
import { InstagramFeed } from "@/components/InstagramFeed";
import ShareButtons from "@/components/ShareButtons";
import AccessMap from "@/components/AccessMap";
import SEOHead from "@/components/SEOHead";
import { useScrollAnimation, useParallax } from "@/hooks/useScrollAnimation";
import { useEffect } from "react";

export default function Home() {
  // スクロールトリガーアニメーション用のref
  const basicPolicyRef = useScrollAnimation();
  const soccerPowerRef = useScrollAnimation();
  const teamInfoRef = useScrollAnimation();
  const functionsRef = useScrollAnimation();
  const recruitmentRef = useScrollAnimation();
  const accessRef = useScrollAnimation();
  const instagramRef = useScrollAnimation();

  // パララックス効果用のref
  const heroParallaxRef = useParallax(0.5);
  const basicPolicyParallaxRef = useParallax(0.3);
  const soccerPowerParallaxRef = useParallax(0.4);
  const recruitmentParallaxRef = useParallax(0.3);

  // プレミアムボタンのスタイル適用
  useEffect(() => {
    const contactButton = document.querySelector('.premium-button') as HTMLElement | null;
    if (contactButton) {
      contactButton.addEventListener('mouseenter', () => {
        (contactButton as HTMLElement).style.backgroundPosition = '0 0';
      });
    }
  }, []);

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
      {/* ヒーローセクション - プレミアム版 */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="hero-overlay absolute inset-0 z-10" />
        <img
          src="/team-photo.jpg"
          alt="東舞鶴F.Cチーム集合写真"
          className="absolute inset-0 w-full h-full object-cover parallax scale-105"
        />
        <div className="relative z-20 container text-center">
          <div className="animate-fade-in-up">
            <img src="/logo.jpeg" alt="東舞鶴F.C" className="hero-logo h-32 w-32 mx-auto mb-6 rounded-full object-cover border-4 border-white shadow-2xl" />
            <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-4 neon-title">
              東舞鶴F.C
            </h1>
            <div className="premium-divider mx-auto w-32 mb-6" />
            <p className="hero-subtitle text-2xl md:text-3xl text-white/95 mb-8 font-medium">
              スポーツ少年団
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="premium-button text-lg px-8 font-semibold">
                  入団のお問い合わせ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/team">
                <Button size="lg" className="premium-button text-lg px-8 font-semibold">
                  チーム情報
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            {/* SNSシェアボタン - プレミアム版 */}
            <div className="mt-8 flex justify-center gap-6">
              <div className="share-icon">
                <a href="https://twitter.com/intent/tweet?url=" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                  <span className="text-lg">X</span>
                </a>
              </div>
              <div className="share-icon">
                <a href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                  <span className="text-lg">f</span>
                </a>
              </div>
              <div className="share-icon">
                <a href="https://line.me/R/msg/text/?" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                  <span className="text-lg">LINE</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 基本方針 */}
      <section className="py-0 geometric-pattern" ref={basicPolicyRef}>
        <div className="w-full" ref={basicPolicyParallaxRef}>
          {/* セクション1: クラブ運営の目標 */}
          <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 py-16 px-4 shadow-lg premium-section">
            <div className="container max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Target className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 drop-shadow-lg relative pb-4">
                Jrから大人までの一体型クラブ運営を目指しています
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full" />
              </h2>
              <div className="space-y-4 text-lg text-white/95">
                <p className="font-medium">・サッカーを大好きになってほしい</p>
                <p className="font-medium">・サッカーを通して仲間の大切さに気づき、人を思いやる心を育んでほしい</p>
                <p className="font-medium">・いつも感謝の心を大切にしてほしい</p>
              </div>
            </div>
          </div>
          {/* セクション2: サッカーの教育的価値 */}
          <div className="bg-gradient-to-br from-rose-400 via-red-400 to-rose-500 py-16 px-4 shadow-lg">
            <div className="container max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 drop-shadow-lg relative pb-4">
                サッカーは子供の創造性をのばせるスポーツです。
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full" />
              </h2>
              <div className="space-y-4 text-lg text-white/95">
                <p className="font-medium">・無限の選択肢が秘めているボールにどんな命を吹き込むか、全てが子供の創造性次第です</p>
                <p className="font-medium">・子供たちは自分自身を表現することの楽しさを味わうことができるでしょう。</p>
              </div>
            </div>
          </div>
          {/* セクション3: サッカーの人間形成 */}
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 py-16 px-4 shadow-lg">
            <div className="container max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                  <Award className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg relative pb-4">
                サッカーは子どもを大人にし、大人を紳士にする。
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full" />
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider-animated" />

      {/* サッカーの価値 - 強調セクション */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden geometric-pattern premium-section" ref={soccerPowerRef}>
        {/* 背景グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <div className="container relative z-10" ref={soccerPowerParallaxRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="text-white animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-yellow-300" />
                <h3 className="text-sm font-bold tracking-wider text-yellow-300">
                  サッカーの力
                </h3>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight relative pb-6">
                子供の創造性を<br />のばせるスポーツ
                <span className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full" />
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                無限の選択肢が秘めているボールにどんな命を吹き込むか、全てが子供の創造性次第です。子供たちは自分自身を表現することの楽しさを味わうことができます。
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-300 rounded-full p-2 mt-1">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">創造性の発展</p>
                      <p className="text-white/70 text-sm">自分らしい表現を学ぶ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-300 rounded-full p-2 mt-1">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">チームワーク</p>
                      <p className="text-white/70 text-sm">仲間との絆を深める</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-300 rounded-full p-2 mt-1">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">人間形成</p>
                      <p className="text-white/70 text-sm">紳士的な人格を育成</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider" />

      {/* チーム紹介 */}
      <section className="py-20 bg-background geometric-pattern premium-section" ref={teamInfoRef}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 relative pb-4">
              東舞鶶F.Cについて
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
            </h2>
            <p className="text-lg text-muted-foreground">
              京都府舞鶶市を拠点とするサッカースポーツ少年団です。<br />
              子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-fade-in-up">
            <Card className="border-0 shadow-lg info-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  練習日時
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground mb-2">
                  毎週土曜・日曜
                </p>
                <p className="text-muted-foreground">
                  9時〜12時
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg info-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  練習場所
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-foreground">
                  舞鶴市立朝来小学校
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 機能紹介 - 改良版 */}
      <section className="py-20 bg-gradient-to-b from-background to-slate-50/30 geometric-pattern premium-section" ref={functionsRef}>
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fade-in-up relative pb-6 inline-block w-full">
            サイト機能
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            <Link href="/news">
              <Card className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full card-hover-gradient feature-card-blue">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-200 rounded-full p-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">お知らせ</CardTitle>
                  <CardDescription className="text-center">
                    練習や試合の最新情報
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/schedule">
              <Card className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full card-hover-gradient feature-card-green">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-200 rounded-full p-3">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">スケジュール</CardTitle>
                  <CardDescription className="text-center">
                    練習・試合予定の確認
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/results">
              <Card className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full card-hover-gradient feature-card-orange">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-200 rounded-full p-3">
                      <Trophy className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">試合結果</CardTitle>
                  <CardDescription className="text-center">
                    過去の試合結果一覧
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/bbs">
              <Card className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full card-hover-gradient feature-card-purple">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-200 rounded-full p-3">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">掲示板</CardTitle>
                  <CardDescription className="text-center">
                    保護者・選手の交流
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider-animated" />

      {/* 団元募集 - 改良版 */}
      <section className="py-20 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" ref={recruitmentRef}>
        <div className="container" ref={recruitmentParallaxRef}>
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg relative pb-6">
              🎯 団元募集中
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/40 rounded-full" />
            </h2>
            <p className="text-xl text-white/95 mb-10 leading-relaxed drop-shadow-md">
              サッカーが好きな子どもたち、一緒にサッカーを楽しみませんか？<br />
              初心者も大歓迎です。まずはお気軽にお問い合わせください。
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-10 bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-xl">
                お問い合わせはこちら
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider" />

      {/* アクセス・地図 */}
      <section className="py-16 bg-muted/30 animate-fade-in-up" ref={accessRef}>
        <div className="container">
          <AccessMap />
        </div>
      </section>

      {/* Instagramフィード */}
      <section className="py-16 bg-background animate-fade-in-up" ref={instagramRef}>
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
