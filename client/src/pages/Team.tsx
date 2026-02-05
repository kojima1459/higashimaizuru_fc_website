import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="チーム情報 - 東舞鶴フットボールクラブ"
        description="東舞鶴フットボールクラブのチーム紹介、活動内容、入団案内などの情報をご覧いただけます。"
        image="/logo.jpeg"
        type="website"
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
                  東舞鶴フットボールクラブは、サッカーを通じて子供達の健全な心身の育成を目指しています。
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
                              className="text-blue-600 dark:text-blue-400 hover:underline"
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
      </div>
    </div>
  );
}
