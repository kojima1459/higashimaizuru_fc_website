import { useEffect, useState } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number; // ミリ秒単位（1文字あたり）
  delay?: number; // 開始遅延（ミリ秒）
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
}

export function TypewriterEffect({
  text,
  speed = 80,
  delay = 0,
  className = '',
  cursorClassName = '',
  showCursor = true,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        startTypewriter();
      }, delay);
      return () => clearTimeout(delayTimer);
    } else {
      startTypewriter();
    }

    function startTypewriter() {
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [text, speed, delay]);

  return (
    <div className={className}>
      <span style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{displayedText}</span>
      {showCursor && !isComplete && (
        <span
          className={`inline-block w-1 h-6 md:h-8 ml-1 bg-white animate-pulse ${cursorClassName}`}
          style={{
            animation: 'blink 1s infinite',
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
