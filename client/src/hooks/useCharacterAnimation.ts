import { useEffect, useRef, useState } from 'react';

interface CharacterAnimationOptions {
  staggerDelay?: number; // 各文字間の遅延（ミリ秒）
  triggerThreshold?: number; // スクロール位置のしきい値（0-1）
}

export function useCharacterAnimation(
  text: string,
  options: CharacterAnimationOptions = {}
) {
  const { staggerDelay = 50, triggerThreshold = 0.5 } = options;
  const ref = useRef<HTMLElement>(null);
  const [animatedChars, setAnimatedChars] = useState<boolean[]>(
    Array(text.length).fill(false)
  );
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          // 各文字を順番にアニメーション
          text.split('').forEach((_, index) => {
            setTimeout(() => {
              setAnimatedChars((prev) => {
                const newChars = [...prev];
                newChars[index] = true;
                return newChars;
              });
            }, index * staggerDelay);
          });
        }
      },
      { threshold: triggerThreshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [text, staggerDelay, triggerThreshold, hasTriggered]);

  return { ref, animatedChars };
}
