
export interface SideViewPlant {
  id: string;
  speciesId: string;
  position: {
    x: number; // Position along bed length
    height: number; // Height in meters
  };
  canopyRadius: number; // Horizontal canopy spread
  canopyLayer: 'emergent' | 'canopy' | 'understory' | 'ground';
  age: number; // In months
}

export interface SideViewBed {
  id: string;
  length: number; // Length of bed in meters
  plants: SideViewPlant[];
}

export type ViewMode = 'top' | 'side';

export interface SideViewport {
  zoom: number;
  pan: {
    x: number; // Horizontal pan
    y: number; // Vertical pan
  };
  bounds: {
    width: number; // Bed length
    height: number; // Max height (30m)
  };
}
