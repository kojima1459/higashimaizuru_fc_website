import { usePageTransition } from '@/contexts/PageTransitionContext';

export default function PageTransitionOverlay() {
  const { isTransitioning } = usePageTransition();

  return (
    <>
      {/* メインオーバーレイ - ゴールドグラデーションスライド */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999]"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #d4af37 100%)',
          transform: isTransitioning ? 'translateX(0%)' : 'translateX(-105%)',
          transition: isTransitioning
            ? 'transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)'
            : 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1) 0.05s',
        }}
      />
      {/* サブオーバーレイ - 少し遅れて動く */}
      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, #d4af37 0%, #0f172a 100%)',
          transform: isTransitioning ? 'translateX(0%)' : 'translateX(-105%)',
          transition: isTransitioning
            ? 'transform 0.35s cubic-bezier(0.76, 0, 0.24, 1) 0.04s'
            : 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
    </>
  );
}
