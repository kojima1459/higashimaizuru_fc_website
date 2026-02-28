import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Swords, MapPin, Users, Calendar } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Team() {
  const clubFees = [
    { grade: "6年生", monthlyFee: "3,500円", annualFee: "6,000円" },
    { grade: "5年生", monthlyFee: "2,500円", annualFee: "5,000円" },
    { grade: "4年生", monthlyFee: "2,000円", annualFee: "4,000円" },
    { grade: "3年生", monthlyFee: "2,000円", annualFee: "3,000円" },
    { grade: "2年生", monthlyFee: "1,500円", annualFee: "2,000円" },
    { grade: "1年生", monthlyFee: "1,500円", annualFee: "1,000円" },
  ];

  const coaches = [
    { position: "代表", name: "荒木　隆義", license: "" },
    { position: "顧問", name: "山田　英之", license: "" },
    { position: "監督兼事務局", name: "浜田 光二", license: "D級公認コーチ" },
    { position: "U12担当", name: "持田 怜", license: "C級公認コーチ" },
    { position: "U12担当", name: "永井 沖", license: "" },
    { position: "U11担当", name: "西村 康夫", license: "D級公認コーチ" },
    { position: "U11担当", name: "菅野 隆介", license: "" },
    { position: "U10担当", name: "中村 鷹之", license: "D級公認コーチ" },
    { position: "U10担当", name: "平田 知", license: "D級公認コーチ" },
    { position: "U9担当", name: "堀口 大晟", license: "C級公認コーチ" },
    { position: "U9担当", name: "鈴木 利明", license: "" },
    { position: "U6~U8担当", name: "梅田 裕久", license: "D級公認コーチ" },
    { position: "U6~U8担当", name: "上田 凌大", license: "" },
    { position: "フリーコーチ", name: "前 宏治", license: "D級公認コーチ" },
    { position: "フリーコーチ", name: "本田 朋之武", license: "D級公認コーチ" },
    { position: "ITスタッフ", name: "小島 正豪", license: "-" },
  ];

  const basicPolicyRef = useScrollAnimation();
  const clubFeesRef = useScrollAnimation();
  const coachesRef = useScrollAnimation();
  const matchRequestRef = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="チーム情報 - 東舞鶴FC | 舞鶴市・高浜・小浜の小学生サッカークラブ"
        description="東舞鶴フットボールクラブのチーム紹介・費用・指導者情報。舞鶴市・南舞鶴・高浜・小浜から通える小学生サッカークラブです。U6〜U12の各カテゴリーで活動中。"
        image="/logo.jpeg"
        type="website"
        keywords="舞鶴市 サッカー チーム情報,東舞鶴FC 費用,舞鶴 サッカー 小学生 入団,高浜 サッカークラブ,小浜 サッカー 小学生,南舞鶴 サッカー,少年サッカー 月謝"
      />
      
      {/* プレミアムページヘッダー */}
      <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(251, 191, 36, 0.1) 35px, rgba(251, 191, 36, 0.1) 70px)'
        }} />
        <div className="relative z-10 container">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            <AnimatedTitle text="チーム情報" staggerDelay={60} />
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" />
          <p className="text-lg text-amber-300 mt-4">東舞鶴フットボールクラブの詳細情報</p>
        </div>
      </div>

      <div className="container py-16">
        {/* 基本方針 */}
        <div ref={basicPolicyRef} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-foreground">基本方針</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" />
          </div>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardContent className="pt-6">
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  東舞鶴フットボールクラブは、京都府舞鶴市を拠点に、サッカーを通じて子供達の健全な心身の育成を目指しています。舞鶴市内はもちろん、南舞鶴・高浜・小浜エリアからも多くの小学生が在籍しています。
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>サッカーの技術向上だけでなく、礼儀やマナーを大切にします</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>チームワークと協調性を育みます</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>勝敗にこだわりすぎず、プレーを楽しむことを重視します</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <span>保護者の皆様と協力し、子どもたちの成長を見守ります</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* クラブ会費 */}
        <div ref={clubFeesRef} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-foreground">クラブ会費</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" />
          </div>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    月額クラブ費用（別途年会費）
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-amber-400/10 to-amber-300/10">
                        <TableRow>
                          <TableHead className="font-bold text-foreground">学年</TableHead>
                          <TableHead className="text-right font-bold text-foreground">月額費用</TableHead>
                          <TableHead className="text-right font-bold text-foreground">年会費</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clubFees.map((fee, index) => (
                          <TableRow key={index} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors">
                            <TableCell className="font-medium">{fee.grade}</TableCell>
                            <TableCell className="text-right">{fee.monthlyFee}</TableCell>
                            <TableCell className="text-right">{fee.annualFee}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                    <span className="w-1 h-1 bg-amber-400 rounded-full" />
                    年会費は、備品・登録・保険等に充当されます
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    その他費用
                  </h3>
                  <ul className="space-y-3 ml-4">
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-amber-300 rounded-full mt-2 flex-shrink-0" />
                      <span>ユニフォーム代（入団時）</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-amber-300 rounded-full mt-2 flex-shrink-0" />
                      <span>スポーツ保険料（年1回）</span>
                    </li>
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-amber-300 rounded-full mt-2 flex-shrink-0" />
                      <span>大会参加費（大会ごと）</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 指導者一覧 */}
        <div ref={coachesRef}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-foreground">指導者一覧</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" />
          </div>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <CardContent className="pt-6">
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-amber-400/10 to-amber-300/10">
                    <TableRow>
                      <TableHead className="font-bold text-foreground">役職</TableHead>
                      <TableHead className="font-bold text-foreground">氏名</TableHead>
                      <TableHead className="font-bold text-foreground">資格</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coaches.map((coach, index) => (
                      <TableRow key={index} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors">
                        <TableCell className="font-medium text-amber-600 dark:text-amber-400">{coach.position}</TableCell>
                        <TableCell className="font-medium">
                          {coach.name === "小島 正豪" ? (
                            <a 
                              href="https://masahidekojima.com/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {coach.name}
                            </a>
                          ) : (
                            coach.name
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {coach.license ? (
                            <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm">
                              {coach.license}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 対外チーム・指導者の方へ */}
        <div ref={matchRequestRef} className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-foreground">対外チーム・指導者の方へ</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-green-400 to-green-300 rounded-full" />
          </div>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 flex-shrink-0">
                  <Swords className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">練習試合の相手を募集しています</h3>
                  <p className="text-muted-foreground">
                    対戦していただけるチームを随時募集しています。お気軽にご連絡ください。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/70 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">対応カテゴリー</span>
                  </div>
                  <p className="text-sm text-muted-foreground">U7 / U8 / U9 / U10 / U11 / U12</p>
                </div>
                <div className="bg-white/70 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">ホームグラウンド</span>
                  </div>
                  <p className="text-sm text-muted-foreground">舞鶴市立朝来小学校（土グラウンド）</p>
                </div>
                <div className="bg-white/70 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-foreground">活動日</span>
                  </div>
                  <p className="text-sm text-muted-foreground">毎週土曜・日曜 9:00〜12:00</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    練習試合を申し込む
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/results">
                  <Button variant="outline" className="border-green-300 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/20">
                    過去の試合結果を見る
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
