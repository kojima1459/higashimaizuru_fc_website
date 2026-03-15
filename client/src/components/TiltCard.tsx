import { useRef, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  speed?: number;
  disabled?: boolean;
}

/**
 * マウスの動きに追従して3D傾きエフェクトを与えるカードコンポーネント
 * タッチデバイスでは無効化される
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.03,
  speed = 400,
  disabled = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const card = cardRef.current;
    if (!card) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    animFrameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      card.style.transition = `transform ${speed * 0.1}ms ease-out`;
    });
  }, [disabled, maxTilt, scale, speed]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    const card = cardRef.current;
    if (!card) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
  }, [disabled, speed]);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

export default TiltCard;
