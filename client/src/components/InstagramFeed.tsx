import { Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstagramFeed() {
  const instagramUrl = "https://www.instagram.com/higashimaizurufc/";
  const accountName = "@higashimaizurufc";

  // プレースホルダー画像（実際の投稿がない場合のダミー）
  const placeholderPosts = [
    { id: 1, gradient: "from-blue-400 to-blue-600" },
    { id: 2, gradient: "from-green-400 to-green-600" },
    { id: 3, gradient: "from-yellow-400 to-orange-500" },
    { id: 4, gradient: "from-purple-400 to-purple-600" },
    { id: 5, gradient: "from-pink-400 to-pink-600" },
    { id: 6, gradient: "from-cyan-400 to-cyan-600" },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          {/* ヘッダー */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instagram</h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            最新の活動状況をInstagramでチェック！
          </p>

          {/* 投稿グリッド（プレースホルダー） */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {placeholderPosts.map((post) => (
              <a
                key={post.id}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-lg overflow-hidden group relative"
              >
                <div className={`w-full h-full bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                  <Instagram className="w-8 h-8 text-white/50 group-hover:text-white/80 transition-colors" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>

          {/* アカウントリンクカード */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* プロフィール画像風 */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">東舞鶴F.C</h3>
                <p className="text-gray-500 dark:text-gray-400">{accountName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  練習風景や試合の様子を投稿しています
                </p>
              </div>
              
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 text-white font-semibold"
              >
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4 mr-2" />
                  フォローする
                </a>
              </Button>
            </div>
          </div>

          {/* 補足テキスト */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            ※上のグリッドをクリックするとInstagramページに移動します
          </p>
        </div>
      </div>
    </section>
  );
}
