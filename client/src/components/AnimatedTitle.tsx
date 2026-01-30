import { useCharacterAnimation } from '@/hooks/useCharacterAnimation';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  staggerDelay?: number;
  triggerThreshold?: number;
}

export default function AnimatedTitle({
  text,
  className = '',
  staggerDelay = 50,
  triggerThreshold = 0.5,
}: AnimatedTitleProps) {
  const { ref, animatedChars } = useCharacterAnimation(text, {
    staggerDelay,
    triggerThreshold,
  });

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-300 ${
            animatedChars[index]
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
