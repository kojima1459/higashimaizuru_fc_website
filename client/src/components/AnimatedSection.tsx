import React from 'react';
import { useRevealAnimation } from '@/hooks/useScrollAnimation';

type AnimationType = 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scaleUp';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  as?: React.ElementType;
}

const animationStyles: Record<AnimationType, { hidden: React.CSSProperties; visible: React.CSSProperties }> = {
  fadeUp: {
    hidden: { opacity: 0, transform: 'translateY(40px)' },
    visible: { opacity: 1, transform: 'translateY(0)' },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, transform: 'translateX(-40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  fadeRight: {
    hidden: { opacity: 0, transform: 'translateX(40px)' },
    visible: { opacity: 1, transform: 'translateX(0)' },
  },
  scaleUp: {
    hidden: { opacity: 0, transform: 'scale(0.92)' },
    visible: { opacity: 1, transform: 'scale(1)' },
  },
};

/**
 * スクロールトリガーアニメーションを適用するセクションコンポーネント
 * 画面に入ったときに指定したアニメーションで表示される
 */
export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  as: Tag = 'div',
}: AnimatedSectionProps) {
  const { ref, isVisible } = useRevealAnimation({ threshold });
  const styles = animationStyles[animation];

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? styles.visible : styles.hidden),
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

export default AnimatedSection;
