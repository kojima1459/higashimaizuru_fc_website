export default function Footer() {
  return (
    <footer className="w-full border-t border-primary/20 bg-primary mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* チーム情報 */}
          <div>
            <h3 className="text-lg font-bold text-primary-foreground mb-4">東舞鶴F.C</h3>
            <p className="text-sm text-primary-foreground/80">
              京都府舞鶴市を拠点とするサッカースポーツ少年団
            </p>
          </div>

          {/* 練習情報 */}
          <div>
            <h3 className="text-lg font-bold text-primary-foreground mb-4">練習情報</h3>
            <p className="text-sm text-primary-foreground/80">
              毎週土曜・日曜（9時〜12時）<br />
              練習場所：舞鶴市立朝来小学校
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="text-lg font-bold text-primary-foreground mb-4">リンク</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="/contact" className="hover:text-primary-foreground transition-colors">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="/bbs" className="hover:text-primary-foreground transition-colors">
                  掲示板
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/80">
          © {new Date().getFullYear()} 東舞鶴F.C スポーツ少年団. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
