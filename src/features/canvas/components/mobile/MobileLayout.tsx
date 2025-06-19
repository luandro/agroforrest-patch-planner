
import React from 'react';
import { CanvasTool } from '../../types/bed.types';
import { MobileLayoutOrchestrator } from './MobileLayoutOrchestrator';

interface MobileLayoutProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  bedConfig: any;
  onBedConfigChange: any;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
  isSaving: boolean;
  showConfirmation: boolean;
  isInFocusMode: boolean;
  viewport: any;
  beds: any[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  onOpenPlantSelection?: () => void;
  focusedBedId?: string;
  isCreating: boolean;
  cancelCreation: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = (props) => {
  return <MobileLayoutOrchestrator {...props} />;
};
