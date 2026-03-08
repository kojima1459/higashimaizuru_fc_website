import { useEffect, useRef } from "react";

export function useScrollColorChange() {
  const sectionRefs = useRef<Map<HTMLElement, string>>(new Map());

  useEffect(() => {
    // スクロール時にセクションの背景色を変更
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-scroll-color]");
      
      sections.forEach((section) => {
        const element = section as HTMLElement;
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // セクションがビューポート内に入ったかどうかを判定
        const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
        
        if (isInViewport) {
          // スクロール位置に基づいて背景色の透明度を計算
          const scrollProgress = 1 - (rect.top / viewportHeight);
          const opacity = Math.max(0, Math.min(1, scrollProgress));
          
          // 背景色を動的に変更
          const targetColor = element.getAttribute("data-scroll-color") || "#f0f0f0";
          element.style.backgroundColor = targetColor;
          element.style.opacity = opacity.toString();
          element.style.transition = "opacity 0.3s ease-out";
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return sectionRefs;
}
