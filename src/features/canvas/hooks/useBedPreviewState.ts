
import { useState, useCallback } from 'react';
import { Bed } from '../types/bed.types';

export const useBedPreviewState = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [previewBeds, setPreviewBeds] = useState<Bed[]>([]);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [hasCollision, setHasCollision] = useState(false);

  const clearPreview = useCallback(() => {
    setIsCreating(false);
    setPreviewBeds([]);
    setCursorPosition(null);
    setHasCollision(false);
  }, []);

  return {
    isCreating,
    setIsCreating,
    previewBeds,
    setPreviewBeds,
    cursorPosition,
    setCursorPosition,
    hasCollision,
    setHasCollision,
    clearPreview
  };
};
