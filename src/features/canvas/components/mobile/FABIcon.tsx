
import React from 'react';
import { Settings } from 'lucide-react';
import { CanvasTool } from '../../types/bed.types';

interface FABIconProps {
  activeTool: CanvasTool;
  selectedCount: number;
}

export const FABIcon: React.FC<FABIconProps> = ({ activeTool, selectedCount }) => {
  if (activeTool === 'create-rectangle') {
    return <Settings className="w-6 h-6" />;
  }
  
  if (activeTool === 'select' && selectedCount > 0) {
    return <span className="text-lg">✏️</span>;
  }
  
  if (activeTool === 'select') {
    return <span className="text-lg">👆</span>;
  }
  
  return <span className="text-lg">⚡</span>; // Default for move tool
};
