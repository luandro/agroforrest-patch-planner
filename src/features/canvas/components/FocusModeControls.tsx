
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusModeControlsProps {
  isActive: boolean;
  focusedBedId: string | null;
  onExitFocus: () => void;
  className?: string;
}

export const FocusModeControls: React.FC<FocusModeControlsProps> = ({
  isActive,
  focusedBedId,
  onExitFocus,
  className
}) => {
  if (!isActive || !focusedBedId) return null;

  return (
    <div className={cn(
      "fixed top-20 left-1/2 transform -translate-x-1/2 z-50",
      "bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200",
      "flex items-center gap-3",
      className
    )}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Maximize2 className="w-4 h-4 text-green-600" />
        <span className="font-medium">Modo Foco Ativo</span>
        <span className="text-gray-400">•</span>
        <span>Grade fina (10cm) para plantio preciso</span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onExitFocus}
        className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Sair do Foco
      </Button>
    </div>
  );
};
