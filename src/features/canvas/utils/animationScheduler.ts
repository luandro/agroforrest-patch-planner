
/**
 * Animation frame scheduling utilities
 */

import { useRef, useCallback } from 'react';

export const useAnimationScheduler = () => {
  const animationFrameRef = useRef<number>();

  const scheduleRender = useCallback((renderFunction: () => void) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(renderFunction);
  }, []);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return {
    scheduleRender,
    cleanup
  };
};
