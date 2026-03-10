import { Instagram, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";

export function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="container">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">最新のInstagram投稿</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          最新の活動状況をInstagramでチェック！
        </p>

        {/* Instagram iFrame — レスポンシブラッパー */}
        <div
          ref={containerRef}
          className="mb-6 flex justify-center"
        >
          {/* max-w-[400px] で PC は 400px 固定、モバイルは画面幅いっぱいに広がる */}
          <div className="w-full max-w-[400px]">
            <iframe
              src="https://www.instagram.com/higashimaizurufc/embed/"
              /* width="100%" にして親コンテナに追従させる */
              width="100%"
              height="480"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              className="rounded-lg block"
              style={{ minWidth: 0 }}
            />
          </div>
        </div>

        {/* フォローボタン */}
        <div className="flex justify-center">
          <a
            href="https://www.instagram.com/higashimaizurufc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Instagram className="h-5 w-5" />
            Instagramでフォロー
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
