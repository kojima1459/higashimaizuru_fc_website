import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Menu, X, Home, Newspaper, Calendar, Trophy, Image, Users, MessageSquare, HelpCircle, Mail, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { usePageTransition } from "@/contexts/PageTransitionContext";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { triggerTransition } = usePageTransition();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleNavClick = async () => {
    await triggerTransition();
    setMobileMenuOpen(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileMenuOpen(prev => !prev);
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
    <>
      <header className="sticky top-0 w-full" style={{ zIndex: 100 }}>
        <div
          className="w-full"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          <div className="container">
            <div className="flex h-16 items-center justify-between">
              {/* ロゴ - プレミアム版 */}
              <Link href="/" onClick={handleNavClick}>
                <div className="flex items-center gap-3 cursor-pointer group">
                  <img src="/logo.jpeg" alt="東舞鶴フットボールクラブ" className="h-12 w-12 rounded-full object-cover group-hover:shadow-lg group-hover:shadow-amber-500/50 transition-all duration-300" />
                  <span className="text-xl font-bold text-white hidden sm:inline group-hover:text-amber-300 transition-colors duration-300">東舞鶴フットボールクラブ</span>
                </div>
              </Link>

              {/* デスクトップナビゲーション - プレミアム版 */}
              <div className="hidden md:flex items-center gap-8">
                <nav className="flex items-center gap-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={handleNavClick}>
                      <span className="text-sm font-medium text-white/85 hover:text-amber-300 transition-all duration-300 cursor-pointer relative group">
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  ))}
                  {isAuthenticated && user?.role === "admin" && (
                    <Link href="/admin" onClick={handleNavClick}>
                      <span className="text-sm font-medium text-white/85 hover:text-amber-300 transition-all duration-300 cursor-pointer font-semibold relative group">
                        管理画面
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  )}
                </nav>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-amber-400/50 to-transparent"></div>
                <div className="text-white hover:text-amber-300 transition-colors duration-300">
                  <ThemeToggle />
                </div>
              </div>

              {/* モバイルメニューボタンとテーマトグル */}
              <div className="md:hidden flex items-center gap-2">
                <div className="text-white">
                  <ThemeToggle />
                </div>
                <button
                  ref={menuButtonRef}
                  onClick={toggleMenu}
                  aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
                  aria-expanded={mobileMenuOpen}
                  className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                  style={{ zIndex: 110 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-white" />
                  ) : (
                    <Menu className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* モバイルメニュー - headerの外に配置、固定位置 */}
      {mobileMenuOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 bg-black/60 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            style={{ zIndex: 95, top: 0 }}
          />
          {/* メニューパネル */}
          <div
            className="fixed left-0 right-0 md:hidden overflow-y-auto"
            style={{
              top: '64px',
              maxHeight: 'calc(100dvh - 64px)',
              zIndex: 99,
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <nav className="py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-amber-400/10 active:bg-amber-400/20 transition-colors cursor-pointer border-b border-white/5 touch-manipulation">
                      <Icon className="h-5 w-5 text-amber-400/70 flex-shrink-0" />
                      <span className="text-base font-medium text-white/90">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
              {isAuthenticated && user?.role === "admin" && (
                <Link href="/admin" onClick={handleNavClick}>
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-amber-400/10 active:bg-amber-400/20 transition-colors cursor-pointer border-b border-white/5 touch-manipulation">
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
    </>
  );
}
