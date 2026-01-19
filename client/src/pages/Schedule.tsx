import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Schedule() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">スケジュール</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>練習・試合スケジュール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">練習日時</h3>
              <p className="text-muted-foreground">毎週土曜・日曜（9時〜12時）</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">練習場所</h3>
              <p className="text-muted-foreground">舞鶴市立朝来小学校</p>
            </div>
          </div>

          {/* Googleカレンダー埋め込み */}
          <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-center px-4">
              Googleカレンダーを埋め込む場合は、<br />
              GoogleカレンダーのURLを管理者にお知らせください
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>カレンダーの埋め込み方法</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Googleカレンダーで共有設定を「公開」にする</li>
            <li>「設定と共有」から「カレンダーの統合」を選択</li>
            <li>「埋め込みコード」をコピー</li>
            <li>管理者に埋め込みコードを提供</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
