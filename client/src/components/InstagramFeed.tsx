import { Instagram, ExternalLink, Heart, MessageCircle, Camera } from "lucide-react";

export function InstagramFeed() {
  const instagramUrl = "https://www.instagram.com/higashimaizurufc/";

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Instagram</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            練習風景や試合の様子を毎日更新中！
          </p>
        </div>

        {/* メインカード */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            {/* グラデーションバナー */}
            <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${40 + i * 20}px`,
                      height: `${40 + i * 20}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${i * 18}%`,
                      opacity: 0.3,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-white opacity-30" />
              </div>
            </div>

            {/* プロフィール情報 */}
            <div className="px-6 pb-6">
              {/* アバター */}
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-card bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Instagram className="w-10 h-10 text-white" />
                </div>
                <div className="mb-2 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white text-sm font-semibold group-hover:shadow-lg transition-all duration-300">
                  <ExternalLink className="w-4 h-4" />
                  フォローする
                </div>
              </div>

              {/* ユーザー名 */}
              <div className="mb-3">
                <h3 className="text-xl font-bold">東舞鶴フットボールクラブ</h3>
                <p className="text-muted-foreground text-sm">@higashimaizurufc</p>
              </div>

              {/* 説明文 */}
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                東舞鶴フットボールクラブの公式Instagramアカウントです。
                練習風景・試合の様子・チームの日常を発信しています。
              </p>

              {/* 統計風デザイン */}
              <div className="flex gap-6 py-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Camera className="w-4 h-4 text-pink-500" />
                  <span>最新投稿をチェック</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>いいね！で応援</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span>コメントで交流</span>
                </div>
              </div>
            </div>
          </div>
        </a>

        {/* CTAボタン */}
        <div className="text-center mt-8">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
          >
            <Instagram className="w-6 h-6" />
            Instagramで見る
          </a>
        </div>
      </div>
    </section>
  );
}
