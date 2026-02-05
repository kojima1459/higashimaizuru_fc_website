import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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

  const navItems = [
    { label: "ホーム", href: "/" },
    { label: "お知らせ", href: "/news" },
    { label: "スケジュール", href: "/schedule" },
    { label: "試合結果", href: "/results" },
    { label: "写真", href: "/gallery" },
    { label: "チーム情報", href: "/team" },
    { label: "掲示板", href: "/bbs" },
    { label: "お問い合わせ", href: "/contact" },
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
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleNavClick}>
                  <span
                    className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link href="/admin" onClick={handleNavClick}>
                  <span
                    className="text-sm font-medium text-primary-foreground hover:text-primary-foreground/80 transition-colors cursor-pointer font-semibold"
                  >
                    管理画面
                  </span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
