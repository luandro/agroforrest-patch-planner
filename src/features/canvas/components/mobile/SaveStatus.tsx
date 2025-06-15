
import React from 'react';
import { cn } from '@/lib/utils';

interface SaveStatusProps {
  isSaving?: boolean;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ isSaving = false }) => {
  if (!isSaving) {
    return null;
  }

  return (
    <div className={cn(
      "bg-blue-500/90 text-white text-sm px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm",
      "flex items-center gap-2",
      "animate-pulse"
    )}>
      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Salvando...</span>
    </div>
  );
};
