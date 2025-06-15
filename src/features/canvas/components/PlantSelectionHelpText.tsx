
import React from 'react';
import { Lightbulb, Mouse, Keyboard } from 'lucide-react';

export const PlantSelectionHelpText: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-green-50 space-y-3">
      <div className="flex items-center gap-2 text-blue-700">
        <Lightbulb className="w-4 h-4" />
        <span className="text-sm font-medium">Dicas de Uso</span>
      </div>
      
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Mouse className="w-3 h-3 text-green-600" />
          <span><strong>Clique</strong> em qualquer espécie para plantar</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Keyboard className="w-3 h-3 text-blue-600" />
          <span><strong>ESC</strong> ou área vazia para cancelar</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Grade de <strong>10cm</strong> para precisão</span>
        </div>
      </div>
    </div>
  );
};
