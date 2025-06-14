
import { useState, useCallback } from 'react';
import { Bed } from '../types/bed.types';

interface PreviewState {
  isCreating: boolean;
  previewBeds: Bed[];
  cursorPosition: { x: number; y: number } | null;
  hasCollision: boolean;
}

/**
 * Manages preview state including creation status, beds, cursor position, and collision status
 */
export const usePreviewState = () => {
  const [state, setState] = useState<PreviewState>({
    isCreating: false,
    previewBeds: [],
    cursorPosition: null,
    hasCollision: false
  });

  const updateState = useCallback((updates: Partial<PreviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setIsCreating = useCallback((isCreating: boolean) => {
    updateState({ isCreating });
  }, [updateState]);

  const setPreviewBeds = useCallback((previewBeds: Bed[]) => {
    updateState({ previewBeds });
  }, [updateState]);

  const setCursorPosition = useCallback((cursorPosition: { x: number; y: number } | null) => {
    updateState({ cursorPosition });
  }, [updateState]);

  const setHasCollision = useCallback((hasCollision: boolean) => {
    updateState({ hasCollision });
  }, [updateState]);

  const clearAll = useCallback(() => {
    setState({
      isCreating: false,
      previewBeds: [],
      cursorPosition: null,
      hasCollision: false
    });
  }, []);

  return {
    ...state,
    setIsCreating,
    setPreviewBeds,
    setCursorPosition,
    setHasCollision,
    clearAll
  };
};
