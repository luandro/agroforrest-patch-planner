/**
 * Centralized color constants for the canvas feature
 */

// =============================================================================
// SYSTEM COLORS
// =============================================================================

export const COLORS = {
  // Primary selection/action color
  SELECTION_BLUE: '#0EA5E9',
  SELECTION_BLUE_DARK: '#1D4ED8',
  SELECTION_BLUE_LIGHT: '#3B82F6',
  SELECTION_BLUE_FILL: 'rgba(14, 165, 233, 0.15)',

  // Success/confirmation (green)
  SUCCESS_GREEN: '#10B981',
  SUCCESS_GREEN_DARK: '#15803D',
  SUCCESS_GREEN_FILL: 'rgba(16, 185, 129, 0.4)',

  // Error/warning
  ERROR_RED: '#EF4444',

  // Preview (indigo)
  PREVIEW_INDIGO: '#4F46E5',
  PREVIEW_INDIGO_FILL: 'rgba(79, 70, 229, 0.3)',

  // Debug
  DEBUG_RED: 'red',
} as const;

// =============================================================================
// GRID COLORS
// =============================================================================

export const GRID_COLORS = {
  // Main grid
  MAIN: 'rgb(229, 231, 235)', // Gray-200
  MARKER: 'rgb(156, 163, 175)', // Gray-400

  // Planting grid (green)
  PLANTING: 'rgb(21, 128, 61)', // Green-700
} as const;

// =============================================================================
// BED COLORS
// =============================================================================

export const BED_COLORS = {
  // Placed bed
  FILL: '#FEF3C7', // Light yellow-brown
  STROKE: '#92400E', // Dark brown

  // Preview/placement
  PREVIEW: '#10B981', // Green

  // Shadow
  SHADOW_TRANSPARENT: 'transparent',
} as const;

// =============================================================================
// PLANT COLORS
// =============================================================================

export const PLANT_COLORS = {
  // By category
  TREES: '#2D5B3D',
  SHRUBS: '#4A7C59',
  HERBS_GROUNDCOVER: '#6B8E5A',

  // States
  SELECTED: '#3B82F6', // Blue
  SELECTED_STROKE: '#1D4ED8', // Darker blue
  HOVERED_STROKE: '#374151', // Gray-700
  NORMAL_STROKE: 'rgba(0, 0, 0, 0.4)',

  // Growth rings
  TRUNK: '#8B4513', // Saddle brown
  RINGS: 'rgb(139, 69, 19)', // Saddle brown (for rgba)

  // Development labels
  DEV_LABEL_TEXT: '#000',
  DEV_LABEL_STROKE: '#fff',
} as const;

// =============================================================================
// SPACING COLORS
// =============================================================================

export const SPACING_COLORS = {
  PREVIEW: '#6B7280', // Gray-500
  PLACED: '#F3F4F6', // Gray-100
} as const;

// =============================================================================
// TEXT COLORS
// =============================================================================

export const TEXT_COLORS = {
  PRIMARY: 'white',
  SECONDARY: 'black',
  BACKGROUND: 'rgba(0, 0, 0, 0.7)',
  BACKGROUND_LIGHT: 'rgba(0, 0, 0, 0.6)',
  STROKE: 'rgba(255, 255, 255, 0.8)',
  TEXT_LIGHT: 'rgba(255, 255, 255, 0.9)',
} as const;

// =============================================================================
// RESIZE HANDLE COLORS
// =============================================================================

export const HANDLE_COLORS = {
  FILL: '#FFFFFF',
  STROKE: '#0EA5E9', // Selection blue
} as const;

// =============================================================================
// HEIGHT CHART COLORS (for growth visualization)
// =============================================================================

export const HEIGHT_CHART_COLORS = {
  IMMATURE: '#BEF264', // Lime-300
  YOUNG: '#84CC16', // Lime-500
  MATURING: '#65A30D', // Lime-600
  MATURE: '#3F6212', // Lime-800
} as const;
