export default function Footer() {
  return (
    <footer className="w-full mt-auto relative overflow-hidden">
      {/* プレミアム背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
      <div className="absolute inset-0 geometric-pattern" />
      
      {/* 上部区切り線 */}
      <div className="relative z-10 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      
      <div className="relative z-10 container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* チーム情報 */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              東舞鶴フットボールクラブ
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              京都府舞鶴市を拠点とする小学生を中心としたフットボールクラブ
            </p>
          </div>

          {/* 練習情報 */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              練習情報
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              毎週土曜・日曜（9時～12時）<br />
              練習場所：舞鶴市立朝来小学校
            </p>
          </div>

          {/* リンク */}
          <div className="group">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              リンク
              <span className="w-8 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-12 transition-all duration-300" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/contact" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="/bbs" className="text-slate-300 hover:text-amber-300 transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  掲示板
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent mb-8" />

        {/* コピーライト */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} 東舞鶴フットボールクラブ. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            作成者: Manus AI
          </p>
        </div>
      </div>
    </footer>
  );
}
