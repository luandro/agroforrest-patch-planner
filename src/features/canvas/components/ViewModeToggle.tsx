
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Mountain } from 'lucide-react';
import { useSideViewStore } from '../stores/sideViewStore';
import { ViewMode } from '../types/sideView.types';

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
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Visualização:</span>
      <Button
        variant={viewMode === 'top' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('top')}
        className="h-8"
      >
        <Eye className="w-4 h-4 mr-1" />
        Vista Superior
      </Button>
      <Button
        variant={viewMode === 'side' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('side')}
        className="h-8"
      >
        <Mountain className="w-4 h-4 mr-1" />
        Vista Lateral
      </Button>
    </div>
  );
};
