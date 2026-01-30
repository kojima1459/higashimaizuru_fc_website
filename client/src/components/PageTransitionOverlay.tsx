import { usePageTransition } from '@/contexts/PageTransitionContext';

export default function PageTransitionOverlay() {
  const { isTransitioning } = usePageTransition();

  return (
    <div
      className={`fixed inset-0 bg-background pointer-events-none z-50 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
}
