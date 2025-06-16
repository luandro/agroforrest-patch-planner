
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Mountain } from 'lucide-react';
import { useSideViewStore } from '../stores/sideViewStore';
import { ViewMode } from '../types/sideView.types';
import { cn } from '@/lib/utils';

interface ViewModeToggleProps {
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ className }) => {
  const { viewMode, setViewMode } = useSideViewStore();

  const handleToggle = () => {
    const newMode: ViewMode = viewMode === 'top' ? 'side' : 'top';
    setViewMode(newMode);
  };

  return (
    <div className={cn(
      "flex items-center bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-md p-1",
      className
    )}>
      <Button
        variant={viewMode === 'top' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('top')}
        className={cn(
          "h-10 px-4 transition-all touch-manipulation",
          viewMode === 'top' 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <Eye className="w-4 h-4 mr-2" />
        Vista Superior
      </Button>
      <Button
        variant={viewMode === 'side' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('side')}
        className={cn(
          "h-10 px-4 transition-all touch-manipulation",
          viewMode === 'side' 
            ? "bg-green-600 text-white shadow-sm" 
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <Mountain className="w-4 h-4 mr-2" />
        Vista Lateral
      </Button>
    </div>
  );
};
