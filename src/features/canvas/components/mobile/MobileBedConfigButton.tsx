
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBedConfigButtonProps {
  onOpenConfig: () => void;
  bedConfig: any;
  className?: string;
}

export const MobileBedConfigButton: React.FC<MobileBedConfigButtonProps> = ({
  onOpenConfig,
  bedConfig,
  className
}) => {
  return (
    <div className={cn(
      "fixed bottom-32 right-4 z-30",
      className
    )}>
      <Button
        variant="outline"
        size="sm"
        onClick={onOpenConfig}
        className="w-12 h-12 p-0 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-blue-50 hover:border-blue-300 active:scale-95 rounded-full"
        aria-label="Configurar canteiro"
        title="Configurar canteiro"
      >
        <Settings className="w-5 h-5 text-blue-600" />
      </Button>
      
      {/* Configuration Summary Badge */}
      <div className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full font-mono shadow-sm">
        {bedConfig.length}×{bedConfig.width}
      </div>
    </div>
  );
};
