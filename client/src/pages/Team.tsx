import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Team() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">チーム情報</h1>

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
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">月会費</h3>
              <p className="text-muted-foreground">詳細はお問い合わせください</p>
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
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">監督</h3>
              <p className="text-muted-foreground">詳細はお問い合わせください</p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">コーチ</h3>
              <p className="text-muted-foreground">詳細はお問い合わせください</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">スタッフ</h3>
              <p className="text-muted-foreground">詳細はお問い合わせください</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
