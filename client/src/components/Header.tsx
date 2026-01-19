import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "ホーム", href: "/" },
    { label: "お知らせ", href: "/news" },
    { label: "スケジュール", href: "/schedule" },
    { label: "試合結果", href: "/results" },
    { label: "チーム情報", href: "/team" },
    { label: "掲示板", href: "/bbs" },
    { label: "お問い合わせ", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/logo.jpeg" alt="東舞鶴F.C" className="h-12 w-12 rounded-full object-cover" />
              <span className="text-xl font-bold text-foreground hidden sm:inline">東舞鶴F.C</span>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {item.label}
                </span>
              </Link>
            ))}
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                  管理画面
                </span>
              </Link>
            )}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link href="/admin">
                  <span
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
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
