
import React from 'react';
import { Info } from 'lucide-react';

interface PlantToolInstructionsProps {
  hasSelection: boolean;
}

export const PlantToolInstructions: React.FC<PlantToolInstructionsProps> = ({
  hasSelection
}) => {
  return (
    <div className="text-xs text-gray-500 space-y-1">
      <div className="flex items-start gap-2">
        <Info className="w-3 h-3 mt-0.5 text-blue-500" />
        <div>
          {hasSelection ? (
            <>
              <p>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">F2</kbd> para editar</p>
              <p>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">Del</kbd> para deletar</p>
              <p>• <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> para desselecionar</p>
              <p>• Ctrl+Click para seleção múltipla</p>
              <p>• Arrastar para seleção em área</p>
            </>
          ) : (
            <>
              <p>• Selecione uma espécie e clique no canteiro para plantar</p>
              <p>• Clique nas plantas para selecioná-las</p>
              <p>• Duplo-clique para edição rápida</p>
              <p>• Botão direito para menu de contexto</p>
              <p>• As plantas se encaixam numa grade de 10cm</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
