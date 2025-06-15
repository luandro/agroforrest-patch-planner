
export interface Patch {
  id: string;
  name: string;
  description?: string;
  size: { width: number; height: number }; // in meters
  location?: string;
  createdAt: number;
  updatedAt: number;
  lastViewport?: {
    zoom: number;
    centerX: number;
    centerY: number;
  };
  isActive?: boolean;
}

export interface PatchWithData extends Patch {
  bedsCount: number;
  plantsCount: number;
  totalArea: number;
}

export interface PatchCreationData {
  name: string;
  description?: string;
  size: { width: number; height: number };
  location?: string;
  duplicateFrom?: string; // ID of patch to duplicate
}
