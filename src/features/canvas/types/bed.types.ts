
export interface BedDimensions {
  length?: number;    // for rectangles
  width?: number;     // for rectangles  
  radius?: number;    // for circles
}

export interface BedConfig {
  shape: 'rectangle' | 'circle';
  length: number;      // default: 5 meters
  width: number;       // default: 1 meter
  spacing: number;     // default: 0.4 meters
  quantity: number;    // default: 1
}

export interface Bed {
  id: string;
  patchId: string;
  shape: 'rectangle' | 'circle';
  position: { x: number; y: number }; // center point in meters
  dimensions: BedDimensions;
  rotation: number;   // degrees
  createdAt: number;
  updatedAt: number;
}

export interface BedAction {
  type: 'ADD_BED' | 'REMOVE_BED' | 'UPDATE_BED' | 'BATCH_OPERATION';
  beds: Bed[];
  timestamp: number;
}

export type CanvasTool = 'pan' | 'create-rectangle' | 'create-circle' | 'select';

export interface SelectionArea {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
