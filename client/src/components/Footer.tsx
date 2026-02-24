import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="w-full mt-auto relative overflow-hidden">
      {/* プレミアム背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      <div className="absolute inset-0 geometric-pattern" />

      {/* 上部区切り線 */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="relative z-10 container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          {/* チーム情報 */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              東舞鶴FC
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブ
            </p>
            {/* SNSリンク */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.instagram.com/higashimaizuru_fc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300 hover:bg-amber-400/20 hover:text-amber-200 transition-all"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://line.me/ti/p/sanky13"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300 hover:bg-amber-400/20 hover:text-amber-200 transition-all"
                title="LINE"
              >
                <span className="text-xs font-bold">LINE</span>
              </a>
            </div>
          </div>

          {/* 練習情報 */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              練習情報
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              毎週土曜・日曜（9時〜12時）<br />
              練習場所：舞鶴市立朝来小学校
            </p>
            <p className="text-sm text-slate-400 mt-3">
              体験練習・見学は随時受付中
            </p>
          </div>

          {/* サイトリンク */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              サイトマップ
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/news" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  お知らせ
                </a>
              </li>
              <li>
                <a href="/schedule" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  スケジュール
                </a>
              </li>
              <li>
                <a href="/results" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  試合結果
                </a>
              </li>
              <li>
                <a href="/team" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  チーム情報
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  写真ギャラリー
                </a>
              </li>
              <li>
                <a href="/faq" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  よくある質問
                </a>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              お問い合わせ
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/contact" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  入団・体験のお申し込み
                </a>
              </li>
              <li>
                <a href="/contact" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  練習試合のお申し込み
                </a>
              </li>
              <li>
                <a href="/bbs" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  掲示板
                </a>
              </li>
              <li>
                <a href="tel:090-9624-9395" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  電話：090-9624-9395
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mb-8" />

        {/* トップに戻るボタン */}
        <div className="flex justify-center mb-8">
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-6 py-3 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/50 rounded-full text-amber-300 hover:text-amber-200 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
            aria-label="トップに戻る"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="text-sm font-medium">トップに戻る</span>
          </button>
        </div>

        {/* コピーライト */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} 東舞鶴フットボールクラブ. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            作成者: <a href="https://masahidekojima.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Masahide Kojima</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
