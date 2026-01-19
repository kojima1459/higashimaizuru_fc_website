import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Car, Train } from "lucide-react";

export default function AccessMap() {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          アクセス・練習場所
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 練習場所情報 */}
          <div>
            <h3 className="font-semibold text-lg mb-2">舞鶴市立朝来小学校</h3>
            <p className="text-muted-foreground text-sm">
              〒625-0036 京都府舞鶴市字浜1番地
            </p>
          </div>

          {/* Google Maps埋め込み */}
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8!2d135.3!3d35.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDI0JzAwLjAiTiAxMzXCsDE4JzAwLjAiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="舞鶴市立朝来小学校の地図"
            />
          </div>

          {/* アクセス情報 */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* 車でのアクセス */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Car className="w-5 h-5 text-primary mt-1" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">車でお越しの方</h4>
                <p className="text-sm text-muted-foreground">
                  舞鶴若狭自動車道「舞鶴西IC」より約10分<br />
                  駐車場：校庭横に駐車スペースあり
                </p>
              </div>
            </div>

            {/* 公共交通機関でのアクセス */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Train className="w-5 h-5 text-primary mt-1" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">公共交通機関</h4>
                <p className="text-sm text-muted-foreground">
                  JR舞鶴線「東舞鶴駅」より徒歩15分<br />
                  京都交通バス「朝来小学校前」下車すぐ
                </p>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>※ご注意：</strong> 練習日は天候により変更になる場合があります。事前にお知らせページをご確認ください。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
