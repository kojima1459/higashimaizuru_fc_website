import { useEffect, useState } from 'react';

/**
 * ScrollProgressBar - ページスクロール進捗をページ上部に表示
 * ユーザーが現在ページのどこにいるかを視覚的に示す
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // スクロール可能な高さ = ドキュメント全体の高さ - ビューポート高さ
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight === 0) {
        setProgress(0);
        return;
      }

      // スクロール進捗率（0～100）
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 z-50 transition-all duration-300"
      style={{
        width: `${progress}%`,
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
