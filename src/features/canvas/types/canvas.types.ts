
export interface CanvasViewport {
  zoom: number;          // 0.5 to 5
  centerX: number;       // meters
  centerY: number;       // meters
  width: number;         // viewport width in meters
  height: number;        // viewport height in meters
}

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface CanvasGesture {
  isPanning: boolean;
  isZooming: boolean;
  lastPanPoint?: CanvasPoint;
  initialDistance?: number;
  initialZoom?: number;
}

export interface PatchCanvasProps {
  initialViewport?: Partial<CanvasViewport>;
  onViewportChange?: (viewport: CanvasViewport) => void;
  gridSize?: number; // meters per grid square, default 1
  minZoom?: number;  // default 0.5
  maxZoom?: number;  // default 5
}
