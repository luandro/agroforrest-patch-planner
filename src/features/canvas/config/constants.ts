/**
 * Centralized constants for the canvas feature
 * All magic numbers and configuration values are defined here
 */

// =============================================================================
// CANVAS & VIEWPORT
// =============================================================================

export const CANVAS = {
  /** Base pixels per meter conversion factor */
  PIXELS_PER_METER: 50,

  // Zoom limits
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 5,
  DEFAULT_ZOOM: 1,

  // Default viewport
  DEFAULT_CENTER_X: 10,
  DEFAULT_CENTER_Y: 10,
  DEFAULT_WIDTH: 20,
  DEFAULT_HEIGHT: 20,

  // Pan boundaries
  PAN_MIN: -50,
  PAN_MAX: 50,

  // Mobile pan sensitivity
  MOBILE_PAN_SENSITIVITY: 1.2,
} as const;

// =============================================================================
// GRID
// =============================================================================

export const GRID = {
  // Main grid
  LINE_WIDTH: 1,
  MARKER_SIZE: 2,
  ZOOM_THRESHOLD_MARKERS: 1.5,

  // Fine planting grid (10cm)
  FINE_GRID_SIZE: 0.1,
  FINE_OPACITY_MIN: 0.6,
  FINE_OPACITY_MAX: 1.0,

  // Opacity calculation
  OPACITY_MULTIPLIER: 0.3,
  OPACITY_BASE: 0.1,
  OPACITY_MAX: 0.8,
} as const;

// =============================================================================
// BED
// =============================================================================

export const BED = {
  // Default dimensions
  DEFAULT_RADIUS: 0.5,
  DEFAULT_LENGTH: 1,
  DEFAULT_WIDTH: 1,

  // Dimension limits (for validation)
  MIN_DIMENSION: 0.1,
  MAX_DIMENSION: 100,

  // Rendering
  LINE_WIDTH_NORMAL: 2,
  LINE_WIDTH_SELECTED: 3,
  LINE_WIDTH_PLACEMENT: 3,

  OPACITY_PREVIEW: 0.4,
  OPACITY_PLACEMENT: 0.4,

  SHADOW_BLUR_PREVIEW: 8,
  SHADOW_BLUR_PLACEMENT: 12,

  DASH_PATTERN: [5, 5],

  // Resize handles
  HANDLE_SIZE: 8,

  // Focus mode
  FOCUS_PADDING: 0.15, // 15% padding around bed
  FOCUS_ANIMATION_DURATION: 600, // ms
  FOCUS_MIN_ZOOM: 3,
  FOCUS_MAX_ZOOM: 8,
  FOCUS_BASE_VIEWPORT: 10,

  // Text
  TEXT_FONT_SIZE: 14,
  TEXT_COORD_FONT_SIZE: 12,
  TEXT_PADDING: 4,
  TEXT_Y_OFFSET: 25,
  TEXT_BG_HEIGHT: 20,
  COORD_Y_OFFSET: 18,
} as const;

// =============================================================================
// PLANT
// =============================================================================

export const PLANT = {
  // Base radius by category (px)
  BASE_RADIUS: {
    trees: 4,
    shrubs: 3,
    'ground-cover': 2.5,
    herbs: 3,
    default: 3,
  } as const,

  // Max radius by category (px)
  MAX_RADIUS: {
    trees: 45,
    shrubs: 28,
    'ground-cover': 15,
    herbs: 20,
    default: 25,
  } as const,

  // Minimum visible radius
  MIN_VISIBLE_RADIUS: 4,

  // Default radius when no species
  DEFAULT_BASE_RADIUS: 5,
  DEFAULT_MAX_RADIUS: 20,

  // Rendering
  LINE_WIDTH_NORMAL: 1.5,
  LINE_WIDTH_SELECTED: 3,
  LINE_WIDTH_HOVERED: 2,

  // Hit testing tolerance
  HIT_TOLERANCE: 0.2, // meters

  // Growth features
  GROWTH_RINGS_START_MONTH: 24,
  GROWTH_RINGS_MAX_COUNT: 5,
  TRUNK_START_MONTH: 18,
  TRUNK_RADIUS_RATIO: 0.12,
  MIN_TRUNK_RADIUS: 2,
  MIN_RADIUS_FOR_TRUNK: 10,
  MIN_RADIUS_FOR_RINGS: 12,

  // Environmental stress
  MIN_STRESS_MULTIPLIER: 0.5,
  STRESS_REDUCTION_FACTOR: 0.3,

  // Preview
  PREVIEW_LINE_WIDTH: 2,
  PREVIEW_DASH_PATTERN: [4, 4],
} as const;

// =============================================================================
// GROWTH & TIMELINE
// =============================================================================

export const GROWTH = {
  // Maturity months by category
  MATURITY_MONTHS: {
    trees: 180,
    shrubs: 96,
    'ground-cover': 24,
    herbs: 36,
    default: 96,
  } as const,

  // Growth rate multipliers
  RATE_MULTIPLIERS: {
    fast: 0.7,
    medium: 1.0,
    slow: 1.3,
    default: 1.0,
  } as const,

  // Sigmoid curve parameters
  SIGMOID_STEEPNESS: 6,
  SIGMOID_OFFSET: 0.25,
  MIN_GROWTH_FACTOR: 0.05,

  // Environmental factors
  COMPETITION_STRESS_MAX: 0.3, // 30% max stress per plant
  ENVIRONMENTAL_STRESS_FACTOR: 0.2,
  GROWTH_REDUCTION_MAX: 0.5, // 50% max reduction
  LIGHT_PENETRATION_STRESS_FACTOR: 10,
} as const;

export const TIMELINE = {
  // Range
  MIN_MONTHS: 0,
  MAX_MONTHS: 240, // 20 years
  DEFAULT_MONTH: 0,

  // Playback
  DEFAULT_SPEED: 1,
  UPDATE_INTERVAL: 100, // ms
  PLAYBACK_INCREMENT: 0.5,

  // Speed options
  SPEED_OPTIONS: [0.5, 1, 2, 4] as const,

  // Growth stages (months)
  STAGE_ESTABLISHMENT: 12,
  STAGE_ACTIVE_GROWTH: 60,

  // Preset timeline points
  TIMELINE_STAGES: [0, 6, 12, 24, 36, 60, 120, 240] as const,
} as const;

// =============================================================================
// SELECTION
// =============================================================================

export const SELECTION = {
  // Selection rectangle
  LINE_WIDTH: 2,
  DASH_PATTERN: [8, 4],
  CORNER_SIZE: 8,
} as const;

// =============================================================================
// MINIMAP
// =============================================================================

export const MINIMAP = {
  SIZE: 150, // px
  AREA: 100, // meters
} as const;

// =============================================================================
// SIDE VIEW
// =============================================================================

export const SIDE_VIEW = {
  // Canvas padding
  PADDING_LEFT: 80,
  PADDING_RIGHT: 40,
  PADDING_TOP: 40,
  PADDING_BOTTOM: 80,

  // Rendering
  GRID_LINE_WIDTH: 1,
  PLANT_LINE_WIDTH: 1.5,
  MAX_PLANT_LINE_WIDTH: 8,
} as const;

// =============================================================================
// ANIMATION
// =============================================================================

export const ANIMATION = {
  // Duration in ms
  BED_FOCUS: 600,
  VIEWPORT_TRANSITION: 300,
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const SPACING = {
  // Dot pattern
  DOT_SIZE: 0.05, // 5cm
  DOT_SPACING: 0.2, // 20cm
  MIN_DOT_SIZE_PX: 2,

  // Opacity
  PREVIEW_OPACITY: 0.3,
  PLACED_OPACITY: 1,
} as const;
