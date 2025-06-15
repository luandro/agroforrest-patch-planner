
import React from 'react';

interface SaveStatusProps {
  isSaving: boolean;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ isSaving }) => {
  if (!isSaving) return null;

  return (
    <div className="fixed bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 z-40">
      <div className="flex items-center text-sm text-gray-600">
        <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full mr-2" />
        Salvando...
      </div>
    </div>
  );
};
