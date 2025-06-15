
/**
 * Utilities for grid math and canvas coordinate transforms.
 */

export function getPixelsPerMeter(zoom: number) {
  return 50 * zoom;
}

export function getDisplayDimensions(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  return {
    width: canvas.width / dpr,
    height: canvas.height / dpr
  };
}

export function getOffsets(
  displayWidth: number,
  displayHeight: number,
  centerX: number,
  centerY: number,
  pixelsPerMeter: number
) {
  // For an agroforestry map, Y increases upwards
  return {
    offsetX: (displayWidth / 2) - (centerX * pixelsPerMeter),
    offsetY: (displayHeight / 2) + (centerY * pixelsPerMeter)
  };
}

