import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const verifyPassword = trpc.admin.verifyPassword.useMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const storedPassword = localStorage.getItem("adminPassword");
      
      if (!storedPassword) {
        // パスワードが保存されていない場合、ログインページにリダイレクト
        const currentPath = window.location.pathname;
        setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      // パスワードを検証
      try {
        const result = await verifyPassword.mutateAsync({ password: storedPassword });
        if (!result.valid) {
          // パスワードが無効な場合、ログインページにリダイレクト
          localStorage.removeItem("adminPassword");
          const currentPath = window.location.pathname;
          setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        console.error("Password verification failed:", error);
        localStorage.removeItem("adminPassword");
        const currentPath = window.location.pathname;
        setLocation(`/admin/login?returnUrl=${encodeURIComponent(currentPath)}`);
      }
    };

    checkAuth();
  }, [setLocation, verifyPassword]);
}
