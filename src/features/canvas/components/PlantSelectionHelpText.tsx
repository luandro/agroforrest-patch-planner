
import React from 'react';

export const PlantSelectionHelpText: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-600">
        💡 <strong>Dica:</strong> Clique em qualquer espécie para começar a plantar. 
        Pressione ESC ou clique em área vazia para cancelar.
      </p>
    </div>
  );
};
