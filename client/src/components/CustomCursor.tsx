import { useEffect, useState } from 'react';

/**
 * CustomCursor - サッカーボールをモチーフにしたカスタムカーソル
 * PCのみで動作し、マウス位置に追従する
 */
export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    // モバイルデバイスの場合は何もしない
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClickable(true);
    };

    const handleMouseUp = () => {
      setIsClickable(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // デフォルトカーソルを非表示
    document.documentElement.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* メインカーソル - サッカーボール */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-transform duration-75 ${
          isClickable ? 'scale-90' : 'scale-100'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        {/* サッカーボール風のカーソル */}
        <div className="relative w-6 h-6">
          {/* 外側の円 */}
          <div className="absolute inset-0 rounded-full bg-white border-2 border-blue-600 shadow-lg" />
          
          {/* 五角形パターン（サッカーボール） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>

      {/* トレイル効果 - 小さな円 */}
      <div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-blue-400 opacity-40 blur-sm" />
      </div>
    </>
  );
}
