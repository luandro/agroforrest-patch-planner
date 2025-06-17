
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { BedConfigPanel } from '../BedConfigPanel';
import { CanvasTool } from '../../types/bed.types';

interface MobileBedConfigSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tool: CanvasTool;
  bedConfig: any;
  onConfigChange: any;
}

export const MobileBedConfigSheet: React.FC<MobileBedConfigSheetProps> = ({
  isOpen,
  onClose,
  tool,
  bedConfig,
  onConfigChange
}) => {
  if (tool !== 'create-rectangle') {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[70vh]">
        <DrawerHeader className="flex flex-row items-center justify-between pb-2">
          <DrawerTitle className="text-lg font-semibold">Configurar Canteiro</DrawerTitle>
          <DrawerClose asChild>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 pb-6 overflow-y-auto">
          <BedConfigPanel
            config={bedConfig}
            onConfigChange={onConfigChange}
            onClose={onClose}
            isMobile={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
