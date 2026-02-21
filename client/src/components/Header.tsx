import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Menu, X, Home, Newspaper, Calendar, Trophy, Image, Users, MessageSquare, HelpCircle, Mail, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { usePageTransition } from "@/contexts/PageTransitionContext";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { triggerTransition } = usePageTransition();

  const handleNavClick = async () => {
    await triggerTransition();
    setMobileMenuOpen(false);
  };

  // メニューが開いているときにスクロールを無効化
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "ホーム", href: "/", icon: Home },
    { label: "お知らせ", href: "/news", icon: Newspaper },
    { label: "スケジュール", href: "/schedule", icon: Calendar },
    { label: "試合結果", href: "/results", icon: Trophy },
    { label: "写真", href: "/gallery", icon: Image },
    { label: "チーム情報", href: "/team", icon: Users },
    { label: "掲示板", href: "/bbs", icon: MessageSquare },
    { label: "FAQ", href: "/faq", icon: HelpCircle },
    { label: "お問い合わせ", href: "/contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ - プレミアム版 */}
          <Link href="/" onClick={handleNavClick}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <img src="/logo.jpeg" alt="東舞鶴フットボールクラブ" className="h-12 w-12 rounded-full object-cover group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all duration-300" />
              <span className="text-xl font-bold text-primary-foreground hidden sm:inline group-hover:text-amber-300 transition-colors duration-300">東舞鶴フットボールクラブ</span>
            </div>
          </Link>

          {/* デスクトップナビゲーション - プレミアム版 */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleNavClick}>
                  <span className="text-sm font-medium text-primary-foreground/85 hover:text-amber-300 transition-all duration-300 cursor-pointer relative group">
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link href="/admin" onClick={handleNavClick}>
                  <span className="text-sm font-medium text-primary-foreground/85 hover:text-amber-300 transition-all duration-300 cursor-pointer font-semibold relative group">
                    管理画面
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              )}
            </nav>
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-amber-400/50 to-transparent"></div>
            <div className="text-primary-foreground hover:text-amber-300 transition-colors duration-300">
              <ThemeToggle />
            </div>
          </div>

          {/* モバイルメニューボタンとテーマトグル */}
          <div className="md:hidden flex items-center gap-2">
            <div className="text-primary-foreground">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー - 改善版 */}
        {mobileMenuOpen && (
          <>
            {/* オーバーレイ */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              style={{ top: '64px' }}
            />
            {/* メニューパネル */}
            <div className="fixed left-0 right-0 z-50 md:hidden bg-slate-900/98 backdrop-blur-md border-t border-amber-400/20 shadow-2xl overflow-y-auto" style={{ top: '64px', maxHeight: 'calc(100vh - 64px)' }}>
              <nav className="py-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={handleNavClick}>
                      <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-amber-400/10 transition-colors cursor-pointer border-b border-white/5">
                        <Icon className="h-5 w-5 text-amber-400/70 flex-shrink-0" />
                        <span className="text-base font-medium text-primary-foreground/90">
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                {isAuthenticated && user?.role === "admin" && (
                  <Link href="/admin" onClick={handleNavClick}>
                    <div className="flex items-center gap-4 px-6 py-3.5 hover:bg-amber-400/10 transition-colors cursor-pointer border-b border-white/5">
                      <Settings className="h-5 w-5 text-amber-400/70 flex-shrink-0" />
                      <span className="text-base font-semibold text-amber-300">
                        管理画面
                      </span>
                    </div>
                  </Link>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
