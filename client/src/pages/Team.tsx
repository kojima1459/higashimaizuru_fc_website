import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SEOHead from "@/components/SEOHead";
import AnimatedTitle from "@/components/AnimatedTitle";

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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="チーム情報 - 東舞鶴F.C"
        description="東舞鶴F.Cのチーム紹介、活動内容、入団案内などの情報をご覧いただけます。"
        image="/logo.jpeg"
        type="website"
      />
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          <AnimatedTitle text="チーム情報" staggerDelay={60} />
        </h1>

        {/* 基本方針 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>基本方針</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <p>
                東舞鶴F.Cは、サッカーを通じて子どもたちの健全な心身の育成を目指しています。
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>サッカーの技術向上だけでなく、礼儀やマナーを大切にします</li>
                <li>チームワークと協調性を育みます</li>
                <li>勝敗にこだわりすぎず、プレーを楽しむことを重視します</li>
                <li>保護者の皆様と協力し、子どもたちの成長を見守ります</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* クラブ会費 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>クラブ会費</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">月額クラブ費用（別途年会費）</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>学年</TableHead>
                        <TableHead className="text-right">月額費用</TableHead>
                        <TableHead className="text-right">年会費</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clubFees.map((fee, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{fee.grade}</TableCell>
                          <TableCell className="text-right">{fee.monthlyFee}</TableCell>
                          <TableCell className="text-right">{fee.annualFee}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  ※年会費は、備品・登録・保険等に充当されます
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">その他費用</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>ユニフォーム代（入団時）</li>
                  <li>スポーツ保険料（年1回）</li>
                  <li>大会参加費（大会ごと）</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 指導者一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>指導者一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>役職</TableHead>
                    <TableHead>氏名</TableHead>
                    <TableHead>資格</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.map((coach, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{coach.position}</TableCell>
                      <TableCell>{coach.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {coach.license || "-"}
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
  );
}
