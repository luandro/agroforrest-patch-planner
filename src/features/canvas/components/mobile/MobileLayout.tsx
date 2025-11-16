
import React from 'react';
import { Bed, BedConfig, CanvasTool } from '../../types/bed.types';
import { CanvasViewport } from '../../types/canvas.types';
import { BedConfigUpdate } from '../../types/layout.types';
import { MobileLayoutOrchestrator } from './MobileLayoutOrchestrator';

interface MobileLayoutProps {
  activeTool: CanvasTool;
  onToolChange: (tool: CanvasTool) => void;
  bedConfig: BedConfig;
  onBedConfigChange: BedConfigUpdate;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeleteSelected: () => void;
  selectedCount: number;
  isSaving: boolean;
  showConfirmation: boolean;
  isInFocusMode: boolean;
  viewport: CanvasViewport;
  beds: Bed[];
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
