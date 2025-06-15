
import { useState, useEffect } from 'react';

interface UseTimelineAutoHideProps {
  isMinimal: boolean;
  isPlaying: boolean;
  inactivityTimeout?: number;
}

export const useTimelineAutoHide = ({ 
  isMinimal, 
  isPlaying, 
  inactivityTimeout = 10000 
}: UseTimelineAutoHideProps) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isInactive, setIsInactive] = useState(false);

  // Auto-hide after inactivity (only in minimal mode)
  useEffect(() => {
    if (!isMinimal) return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity > inactivityTimeout && !isPlaying) {
        setIsInactive(true);
      } else {
        setIsInactive(false);
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, isPlaying, isMinimal, inactivityTimeout]);

  // Reset activity timer on any interaction
  const handleActivity = () => {
    setLastActivity(Date.now());
    setIsInactive(false);
  };

  return {
    isInactive,
    handleActivity
  };
};
