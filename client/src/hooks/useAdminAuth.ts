import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分
const INACTIVITY_CHECK_INTERVAL = 1 * 60 * 1000; // 1分ごとにチェック

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const verifyPassword = trpc.admin.verifyPassword.useMutation();
  const hasChecked = useRef(false);
  const lastActivityRef = useRef<number>(Date.now());
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityCheckRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 既にチェック済みの場合はスキップ
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = async () => {
      const storedPassword = localStorage.getItem("adminPassword");
      const sessionStartTime = localStorage.getItem("adminSessionStart");
      
      if (!storedPassword) {
        // パスワードが保存されていない場合、ログインページにリダイレクト
        const currentPath = window.location.pathname;
        setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      // セッション有効期限をチェック
      if (sessionStartTime) {
        const elapsed = Date.now() - parseInt(sessionStartTime);
        if (elapsed > SESSION_TIMEOUT) {
          // セッション有効期限切れ
          localStorage.removeItem("adminPassword");
          localStorage.removeItem("adminSessionStart");
          const currentPath = window.location.pathname;
          setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
          return;
        }
      }

      // パスワードを検証
      try {
        const result = await verifyPassword.mutateAsync({ password: storedPassword });
        if (!result.valid) {
          // パスワードが無効な場合、ログインページにリダイレクト
          localStorage.removeItem("adminPassword");
          localStorage.removeItem("adminSessionStart");
          const currentPath = window.location.pathname;
          setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
        } else {
          // セッション開始時刻を記録（初回のみ）
          if (!sessionStartTime) {
            localStorage.setItem("adminSessionStart", Date.now().toString());
          }
          
          // 最後の操作時刻を更新
          lastActivityRef.current = Date.now();
          
          // セッションタイムアウトタイマーを設定
          if (sessionTimeoutRef.current) {
            clearTimeout(sessionTimeoutRef.current);
          }
          sessionTimeoutRef.current = setTimeout(() => {
            localStorage.removeItem("adminPassword");
            localStorage.removeItem("adminSessionStart");
            setLocation("/admin/login");
          }, SESSION_TIMEOUT);

          // 無操作タイムアウトチェックを開始
          if (!inactivityCheckRef.current) {
            inactivityCheckRef.current = setInterval(() => {
              const timeSinceLastActivity = Date.now() - lastActivityRef.current;
              if (timeSinceLastActivity > SESSION_TIMEOUT) {
                localStorage.removeItem("adminPassword");
                localStorage.removeItem("adminSessionStart");
                setLocation("/admin/login");
              }
            }, INACTIVITY_CHECK_INTERVAL);
          }
        }
      } catch (error) {
        console.error("Password verification failed:", error);
        localStorage.removeItem("adminPassword");
        localStorage.removeItem("adminSessionStart");
        const currentPath = window.location.pathname;
        setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
      }
    };

    checkAuth();

    // ユーザーの操作を監視してlastActivityを更新
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (inactivityCheckRef.current) {
        clearInterval(inactivityCheckRef.current);
      }
    };
  }, [setLocation]);
}
