
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CanvasLayoutSharedProps } from '../types/layout.types';

interface CanvasLayoutProviderProps extends CanvasLayoutSharedProps {
  children: React.ReactNode;
}

export const CanvasLayoutProvider: React.FC<CanvasLayoutProviderProps> = ({
  children,
  ...props
}) => {
  const isMobile = useIsMobile();

  // Create enhanced props that include isMobile
  const enhancedProps = {
    ...props,
    isMobile
  };

  return (
    <div className="relative w-full h-full">
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, enhancedProps)
          : child
      )}
    </div>
  );
};
