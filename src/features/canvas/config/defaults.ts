/**
 * Default values for canvas components and stores
 */

import { CANVAS, TIMELINE, BED } from './constants';
import { CanvasViewport } from '../types/canvas.types';

// =============================================================================
// VIEWPORT DEFAULTS
// =============================================================================

export const DEFAULT_VIEWPORT: CanvasViewport = {
  zoom: CANVAS.DEFAULT_ZOOM,
  centerX: CANVAS.DEFAULT_CENTER_X,
  centerY: CANVAS.DEFAULT_CENTER_Y,
  width: CANVAS.DEFAULT_WIDTH,
  height: CANVAS.DEFAULT_HEIGHT,
};

// =============================================================================
// BED DEFAULTS
// =============================================================================

export const DEFAULT_BED_DIMENSIONS = {
  rectangle: {
    length: BED.DEFAULT_LENGTH,
    width: BED.DEFAULT_WIDTH,
  },
  circle: {
    radius: BED.DEFAULT_RADIUS,
  },
} as const;

// =============================================================================
// TIMELINE DEFAULTS
// =============================================================================

export const DEFAULT_TIMELINE_STATE = {
  isTimelineActive: false,
  currentMonth: TIMELINE.DEFAULT_MONTH,
  isPlaying: false,
  playbackSpeed: TIMELINE.DEFAULT_SPEED,
} as const;

// =============================================================================
// GROWTH DEFAULTS
// =============================================================================

export const DEFAULT_ENVIRONMENTAL_FACTORS = {
  soilQuality: 1.0,
  waterAvailability: 1.0,
} as const;

// =============================================================================
// HOOK DEFAULTS
// =============================================================================

export const DEFAULT_VIEWPORT_PROPS = {
  minZoom: CANVAS.MIN_ZOOM,
  maxZoom: CANVAS.MAX_ZOOM,
} as const;
