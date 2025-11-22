/**
 * Canvas configuration module
 *
 * Centralizes all magic numbers, colors, and default values
 * for the canvas feature.
 *
 * @example
 * import { CANVAS, PLANT, COLORS, DEFAULT_VIEWPORT } from '../config';
 */

// Constants (all magic numbers)
export {
  CANVAS,
  GRID,
  BED,
  PLANT,
  GROWTH,
  TIMELINE,
  SELECTION,
  MINIMAP,
  SIDE_VIEW,
  ANIMATION,
  SPACING,
} from './constants';

// Colors
export {
  COLORS,
  GRID_COLORS,
  BED_COLORS,
  PLANT_COLORS,
  SPACING_COLORS,
  TEXT_COLORS,
  HANDLE_COLORS,
  HEIGHT_CHART_COLORS,
} from './colors';

// Defaults
export {
  DEFAULT_VIEWPORT,
  DEFAULT_BED_DIMENSIONS,
  DEFAULT_TIMELINE_STATE,
  DEFAULT_ENVIRONMENTAL_FACTORS,
  DEFAULT_VIEWPORT_PROPS,
} from './defaults';
