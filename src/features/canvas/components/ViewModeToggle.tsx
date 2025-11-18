
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Mountain } from 'lucide-react';
import { useSideViewStore } from '../stores/sideViewStore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ViewModeToggleProps {
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ className }) => {
  const { viewMode, setViewMode } = useSideViewStore();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex items-center bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-1",
      "z-[200]", // Higher z-index to appear above other elements
      className
    )}>
      <Button
        variant={viewMode === 'top' ? 'default' : 'ghost'}
        size={isMobile ? "sm" : "default"}
        onClick={() => setViewMode('top')}
        className={cn(
          "transition-all touch-manipulation",
          isMobile ? "h-10 px-3 text-sm" : "h-11 px-4",
          viewMode === 'top' 
            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <Eye className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
        {isMobile ? "Superior" : "Vista Superior"}
      </Button>
      <Button
        variant={viewMode === 'side' ? 'default' : 'ghost'}
        size={isMobile ? "sm" : "default"}
        onClick={() => setViewMode('side')}
        className={cn(
          "transition-all touch-manipulation",
          isMobile ? "h-10 px-3 text-sm" : "h-11 px-4",
          viewMode === 'side' 
            ? "bg-green-600 text-white shadow-sm hover:bg-green-700" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <Mountain className={cn("mr-2", isMobile ? "w-3 h-3" : "w-4 h-4")} />
        {isMobile ? "Lateral" : "Vista Lateral"}
      </Button>
    </div>
  );
};
