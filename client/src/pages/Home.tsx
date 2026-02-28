import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar, Trophy, Users, MessageSquare, Target, Sparkles, Award, ArrowRight, Zap, Heart, Shield, Clock, MapPin, CheckCircle, Star, UserPlus, Swords, Newspaper } from "lucide-react";
import { InstagramFeed } from "@/components/InstagramFeed";
import ShareButtons from "@/components/ShareButtons";
import AccessMap from "@/components/AccessMap";
import SEOHead from "@/components/SEOHead";
import { useScrollAnimation, useParallax } from "@/hooks/useScrollAnimation";
import { useEffect } from "react";
import { OrganizationStructuredData, BreadcrumbStructuredData } from "@/components/StructuredData";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { trpc } from "@/lib/trpc";

export default function Home() {
  // スクロールトリガーアニメーション用のref
  const basicPolicyRef = useScrollAnimation();
  const soccerPowerRef = useScrollAnimation();
  const teamInfoRef = useScrollAnimation();
  const latestInfoRef = useScrollAnimation();
  const recruitmentRef = useScrollAnimation();
  const accessRef = useScrollAnimation();
  const instagramRef = useScrollAnimation();

  // パララックス効果用のref
  const heroParallaxRef = useParallax(0.5);
  const basicPolicyParallaxRef = useParallax(0.3);
  const soccerPowerParallaxRef = useParallax(0.4);
  const recruitmentParallaxRef = useParallax(0.3);

  // 最新データの取得
  const { data: latestNews } = trpc.news.list.useQuery({});
  const { data: upcomingSchedules } = trpc.schedules.list.useQuery({});
  const { data: recentResults } = trpc.matchResults.list.useQuery({});

  // プレミアムボタンのスタイル適用
  useEffect(() => {
    const contactButton = document.querySelector('.premium-button') as HTMLElement | null;
    if (contactButton) {
      contactButton.addEventListener('mouseenter', () => {
        (contactButton as HTMLElement).style.backgroundPosition = '0 0';
      });
    }
  }, []);

  // 最新3件を取得
  const topNews = latestNews?.slice(0, 3) ?? [];
  const topSchedules = upcomingSchedules?.slice(0, 3) ?? [];
  const topResults = recentResults?.slice(0, 3) ?? [];

  return (
    <div className="w-full">
      <SEOHead
        title="東舞鶴F.C - 舞鶴市のサッカー少年団 | 高浜・南舞鶴・小浜対応"
        description="舞鶴市のサッカー少年団『東舞鶴F.C』。U7からU12までの少年サッカー。高浜、南舞鶴、小浜、小浜市対応。体験練習・入団説明会開催中。"
        image="/logo.jpeg"
        type="website"
        keywords="東舞鶴F.C,東舞鶴FC,舞鶴市 サッカー,舞鶴 サッカー 小学生,高浜 サッカー,南舞鶴 サッカー,小浜 サッカー,小浜市 サッカー,スポーツ少年団,少年サッカー,ジュニアサッカー,サッカークラブ,京都府,U12,U10,U8,U7,体験練習,入団"
      />
      {/* 組織情報の構造化データ */}
      <OrganizationStructuredData />
      {/* パンくずリストの構造化データ */}
      <BreadcrumbStructuredData
        items={[
          { name: "ホーム", url: "https://www.higashimaizurufc.com/" }
        ]}
      />
      {/* 構造化データ (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            "name": "東舞鶴フットボールクラブ",
            "sport": "サッカー",
            "description": "京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブです。子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。",
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
      <section className="relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="hero-overlay absolute inset-0 z-10" />
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030693288/DYdLINerUUzJEMqr.jpg"
          alt="東舞鶴フットボールクラブチーム集合写真"
          className="absolute inset-0 w-full h-full object-cover parallax scale-105"
          loading="eager"
        />
        <div className="relative z-20 container text-center">
          <div className="animate-fade-in-up">
            <ResponsiveImage
              webpSrc="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030693288/LMuZubxGQaomZeQH.webp"
              fallbackSrc="/logo.jpeg"
              alt="東舞鶴フットボールクラブ"
              className="hero-logo h-24 w-24 md:h-32 md:w-32 mx-auto mb-4 md:mb-6 rounded-full object-cover border-4 border-white shadow-2xl"
              loading="eager"
            />
            <h1 className="hero-title text-4xl md:text-7xl font-bold text-white mb-4 neon-title">
              東舞鶴フットボールクラブ
            </h1>
            <div className="premium-divider mx-auto w-32 mb-4 md:mb-6" />
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8">
              <Link href="/contact">
                <Button size="lg" className="premium-button text-base md:text-lg px-6 md:px-8 font-semibold">
                  体験練習に申し込む
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/team">
                <Button size="lg" className="premium-button text-base md:text-lg px-6 md:px-8 font-semibold">
                  チーム情報
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            {/* SNSシェアボタン - プレミアム版 */}
            <div className="mt-6 md:mt-8 flex justify-center gap-6">
              <div className="share-icon">
                <a
                  href="https://www.instagram.com/higashimaizuru_fc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                  title="Instagramでフォロー"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <div className="share-icon">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('東舞鶴フットボールクラブ - 京都府舞鶴市の小学生フットボールクラブ')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                  title="Xでシェア"
                >
                  <span className="text-lg">X</span>
                </a>
              </div>
              <div className="share-icon">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                  title="Facebookでシェア"
                >
                  <span className="text-lg">f</span>
                </a>
              </div>
              <div className="share-icon">
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-full"
                  title="LINEでシェア"
                >
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
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 px-4 shadow-lg premium-section overflow-hidden">
            {/* 幾何学模様背景 */}
            <div className="absolute inset-0 opacity-20 geometric-pattern" />

            <div className="container max-w-4xl mx-auto text-center relative z-10">
              <div className="flex justify-center mb-6">
                <div className="bg-[#d4af37]/20 backdrop-blur-sm rounded-full p-6 border-2 border-[#d4af37]/50">
                  <Target className="h-16 w-16 text-[#d4af37]" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 drop-shadow-lg relative pb-4">
                Jrから大人まで、共に成長する
                {/* ゴールドディバイダー */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#d4af37] to-[#f0e68c] rounded-full shadow-lg" />
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-white">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all border border-white/10 hover:border-[#d4af37]/30">
                  <div className="bg-gradient-to-br from-[#d4af37] to-[#f0e68c] rounded-full p-3 w-fit mx-auto mb-4">
                    <Heart className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#f0e68c]">サッカーへの情熱</h3>
                  <p className="text-sm leading-relaxed text-white/90">ボールを追いかける喜び、ゴールを決める興奮。サッカーを心から愛する気持ちを育みます。</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all border border-white/10 hover:border-[#d4af37]/30">
                  <div className="bg-gradient-to-br from-[#d4af37] to-[#f0e68c] rounded-full p-3 w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#f0e68c]">仲間との絆</h3>
                  <p className="text-sm leading-relaxed text-white/90">チームメイトとの協力、相手への思いやり。サッカーを通じて人を大切にする心を学びます。</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all border border-white/10 hover:border-[#d4af37]/30">
                  <div className="bg-gradient-to-br from-[#d4af37] to-[#f0e68c] rounded-full p-3 w-fit mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-slate-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#f0e68c]">感謝の心</h3>
                  <p className="text-sm leading-relaxed text-white/90">支えてくれる家族、指導してくれるコーチ。周りへの感謝を忘れない人間性を育てます。</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider-animated" />

      {/* サッカーの価値 - 強調セクション */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-yellow-300 dark:via-yellow-200 dark:to-yellow-100 relative overflow-hidden geometric-pattern premium-section" ref={soccerPowerRef}>
        {/* 背景グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <div className="container relative z-10" ref={soccerPowerParallaxRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="text-black dark:text-white animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-blue-600 dark:text-yellow-300" />
                <h3 className="text-sm font-bold tracking-wider text-blue-600 dark:text-yellow-300">
                  サッカーの力
                </h3>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight relative pb-6 text-black dark:text-white">
                子供の創造性を<br />のばせるスポーツ
                <span className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-yellow-300 dark:to-yellow-400 rounded-full" />
              </h2>
              <p className="text-lg text-black dark:text-white leading-relaxed">
                無限の選択肢が秘めているボールにどんな命を吹き込むか、全てが子供の創造性次第です。子供たちは自分自身を表現することの楽しさと喜びを味わうことができます。
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-white/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 dark:bg-yellow-300 rounded-full p-2 mt-1">
                      <Shield className="h-5 w-5 text-white dark:text-blue-900" />
                    </div>
                    <div>
                      <p className="text-black dark:text-white font-semibold">創造性の発展</p>
                      <p className="text-black/70 dark:text-white/80 text-sm">自分らしい表現を学ぶ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 dark:bg-yellow-300 rounded-full p-2 mt-1">
                      <Heart className="h-5 w-5 text-white dark:text-blue-900" />
                    </div>
                    <div>
                      <p className="text-black dark:text-white font-semibold">チームワーク</p>
                      <p className="text-black/70 dark:text-white/80 text-sm">仲間との絆を深める</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 dark:bg-yellow-300 rounded-full p-2 mt-1">
                      <Trophy className="h-5 w-5 text-white dark:text-blue-900" />
                    </div>
                    <div>
                      <p className="text-black dark:text-white font-semibold">人間形成</p>
                      <p className="text-black/70 dark:text-white/80 text-sm">紳士的な人格を育成</p>
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
              東舞鶴フットボールクラブについて
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
            </h2>
            <p className="text-lg text-muted-foreground">
              京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブです。<br />
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

      {/* セクション区切り線 */}
      <div className="section-divider-animated" />

      {/* 最新情報ダッシュボード */}
      <section className="py-20 bg-gradient-to-b from-background to-slate-50/30 dark:to-slate-900/30 geometric-pattern premium-section" ref={latestInfoRef}>
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fade-in-up relative pb-6 inline-block w-full">
            最新情報
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {/* 最新お知らせ */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="h-5 w-5 text-blue-600" />
                  お知らせ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topNews.length > 0 ? (
                  <div className="space-y-3">
                    {topNews.map((news) => (
                      <Link key={news.id} href={`/news/${news.id}`}>
                        <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {news.mainCategory}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(news.createdAt).toLocaleDateString("ja-JP")}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground line-clamp-1">{news.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">お知らせはまだありません</p>
                )}
                <Link href="/news">
                  <Button variant="ghost" className="w-full mt-3 text-sm">
                    すべてのお知らせを見る <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 直近スケジュール */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  直近のスケジュール
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topSchedules.length > 0 ? (
                  <div className="space-y-3">
                    {topSchedules.map((schedule) => (
                      <div key={schedule.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded text-white ${
                            schedule.eventType === "練習" ? "bg-blue-500" :
                            schedule.eventType === "試合" ? "bg-green-500" :
                            schedule.eventType === "大会" ? "bg-purple-500" : "bg-gray-500"
                          }`}>
                            {schedule.eventType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(schedule.eventDate).toLocaleDateString("ja-JP", {
                              month: "short",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{schedule.title}</p>
                        {schedule.venue && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{schedule.venue}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">予定はまだありません</p>
                )}
                <Link href="/schedule">
                  <Button variant="ghost" className="w-full mt-3 text-sm">
                    すべてのスケジュールを見る <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 最近の試合結果 */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  最近の試合結果
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topResults.length > 0 ? (
                  <div className="space-y-3">
                    {topResults.map((result) => {
                      const isWin = result.ourScore > result.opponentScore;
                      const isDraw = result.ourScore === result.opponentScore;
                      return (
                        <div key={result.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.matchDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isWin ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                              isDraw ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" :
                              "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            }`}>
                              {isWin ? "勝利" : isDraw ? "引分" : "敗北"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            vs {result.opponent}
                          </p>
                          <p className={`text-lg font-bold ${
                            isWin ? "text-green-600" : isDraw ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {result.ourScore} - {result.opponentScore}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">試合結果はまだありません</p>
                )}
                <Link href="/results">
                  <Button variant="ghost" className="w-full mt-3 text-sm">
                    すべての試合結果を見る <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider-animated" />

      {/* 団員募集 - 改良版 */}
      <section className="py-20 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" ref={recruitmentRef}>
        <div className="container" ref={recruitmentParallaxRef}>
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg relative pb-6">
                新規団員募集中
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/40 rounded-full" />
              </h2>
              <p className="text-xl text-white/95 leading-relaxed drop-shadow-md">
                サッカーが好きな子どもたち、一緒にサッカーを楽しみませんか？
              </p>
            </div>

            {/* 特徴カード */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 text-center text-white border border-white/30">
                <UserPlus className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-1">初心者大歓迎</h3>
                <p className="text-sm text-white/90">サッカー未経験でもOK。基礎から丁寧に指導します</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 text-center text-white border border-white/30">
                <Star className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-1">体験練習無料</h3>
                <p className="text-sm text-white/90">まずは気軽に体験から。見学だけでもOKです</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 text-center text-white border border-white/30">
                <Clock className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-bold mb-1">年中いつでも入団OK</h3>
                <p className="text-sm text-white/90">学年の途中からでもいつでも入団できます</p>
              </div>
            </div>

            {/* 入団ステップ */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-10 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 text-center">入団までの3ステップ</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div className="text-white">
                    <p className="font-semibold">体験練習に参加</p>
                    <p className="text-sm text-white/80">土日の練習にお越しください</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div className="text-white">
                    <p className="font-semibold">入団申し込み</p>
                    <p className="text-sm text-white/80">申込書を提出</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div className="text-white">
                    <p className="font-semibold">活動開始</p>
                    <p className="text-sm text-white/80">仲間と一緒にサッカーを楽しもう</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-10 bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-xl">
                  体験練習に申し込む
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/team">
                <Button size="lg" variant="outline" className="text-lg px-10 border-2 border-white text-white hover:bg-white/10 font-bold">
                  チーム情報を見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* セクション区切り線 */}
      <div className="section-divider" />

      {/* 練習試合募集セクション */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 dark:from-green-800 dark:to-emerald-900 premium-section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Swords className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              練習試合の相手を募集しています
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              対戦していただけるチームを随時募集しています。<br />
              U7〜U12の各カテゴリーで対応可能です。お気軽にご連絡ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8 bg-white text-green-700 hover:bg-green-50 font-bold shadow-xl">
                  練習試合を申し込む
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
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
          <h2 className="text-3xl font-bold text-foreground mb-6">東舞鶴フットボールクラブについて</h2>
          <div className="space-y-4 text-foreground">
            <p>
              東舞鶴フットボールクラブは、京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブです。私たちは、子どもたちの健全な育成とサッカーを通じた仲間づくりを大切にしています。
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
