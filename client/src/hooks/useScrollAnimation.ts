import { useEffect, useRef, useState } from 'react';

/**
 * スクロール位置に基づいてアニメーションをトリガーするカスタムフック
 * Intersection Observer APIを使用して、要素がビューポートに入ったときにアニメーションを開始
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 要素がビューポートに入ったときにアニメーションクラスを追加
            entry.target.classList.add('animate-scroll-in');
            // 一度アニメーションしたら監視を解除
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // 要素の10%がビューポートに入ったときにトリガー
        rootMargin: '0px 0px -100px 0px', // ビューポートの下から100px手前でトリガー
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return ref;
}

/**
 * パララックス効果を実装するカスタムフック
 * スクロール位置に基づいて要素を移動させる
 * モバイルデバイスでは効果を無効化してパフォーマンスを最適化
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // モバイルデバイスの判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // スクロールイベントリスナー
  useEffect(() => {
    // モバイルではパララックス効果を無効化してパフォーマンスを最適化
    if (isMobile) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const offset = (scrollY - elementTop) * speed;

      ref.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, isMobile]);

  return ref;
}
