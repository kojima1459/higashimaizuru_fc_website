import { useRef, useEffect, useCallback } from 'react';

interface TiltOptions {
  scale?: number;
  speed?: number;
  max?: number;
}

export const useTilt = (options: TiltOptions = {}) => {
  const {
    scale = 1.05,
    speed = 500,
    max = 25,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;
    let hasPendingUpdate = false;

    const onMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = rect.left + width / 2;
      const centerY = rect.top + height / 2;

      const x = event.clientX - centerX;
      const y = event.clientY - centerY;

      pendingX = (y / height) * max;
      pendingY = -(x / width) * max;
      hasPendingUpdate = true;

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          if (hasPendingUpdate && element) {
            element.style.transform = `
              perspective(1000px)
              rotateX(${pendingX}deg)
              rotateY(${pendingY}deg)
              scale(${scale})
            `;
            element.style.transition = 'none';
            hasPendingUpdate = false;
          }
          animationFrameId = null;
        });
      }
    };

    const onMouseLeave = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      element.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `;
      element.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.320, 1)`;
    };

    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scale, speed, max]);

  return ref;
};
