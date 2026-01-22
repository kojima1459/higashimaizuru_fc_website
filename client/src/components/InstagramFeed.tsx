import { Instagram, ExternalLink } from "lucide-react";
import { InstagramEmbed } from "react-social-media-embed";

export function InstagramFeed() {
  // 最新の投稿URL（手動で更新が必要）
  // higashimaizurufcの最新投稿を表示
  const latestPostUrl = "https://www.instagram.com/p/DFBvVBjSIqS/";

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="w-8 h-8 text-pink-600" />
            <h2 className="text-3xl font-bold">Instagram</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            最新の活動状況をInstagramでチェック！
          </p>
          <a
            href="https://www.instagram.com/higashimaizurufc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            @higashimaizurufc
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Instagram投稿埋め込み */}
        <div className="flex justify-center">
          <div style={{ maxWidth: 550, width: "100%" }}>
            <InstagramEmbed
              url={latestPostUrl}
              width="100%"
              captioned
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/higashimaizurufc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            もっと見る
          </a>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ※練習風景や試合の様子を投稿しています
        </p>
      </div>
    </section>
  );
}
