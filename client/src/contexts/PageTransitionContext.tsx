import React, { createContext, useContext, useState, useCallback } from 'react';

interface PageTransitionContextType {
  isTransitioning: boolean;
  triggerTransition: () => Promise<void>;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback(async () => {
    setIsTransitioning(true);
    // アニメーション時間に合わせて待機
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsTransitioning(false);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }
  return context;
}
