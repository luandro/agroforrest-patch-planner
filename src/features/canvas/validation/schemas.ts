/**
 * Zod validation schemas for canvas data types
 */
import { z } from 'zod';

// =============================================================================
// Plant Species Schemas
// =============================================================================

export const PlantCategorySchema = z.enum(['trees', 'shrubs', 'ground-cover', 'herbs']);

export const CompatibilityLevelSchema = z.enum(['high', 'medium', 'low']);

export const GrowthRateSchema = z.enum(['slow', 'medium', 'fast']);

export const SunRequirementSchema = z.enum(['full', 'partial', 'shade']);

export const WaterRequirementSchema = z.enum(['low', 'medium', 'high']);

export const PlantSpeciesSchema = z.object({
  id: z.string().min(1, 'Species ID is required'),
  commonName: z.string().min(1, 'Common name is required'),
  scientificName: z.string().min(1, 'Scientific name is required'),
  category: PlantCategorySchema,
  image: z.string().optional(),
  companionCompatibility: CompatibilityLevelSchema,
  matureSize: z.object({
    height: z.number().positive('Height must be positive'),
    width: z.number().positive('Width must be positive'),
  }),
  spacing: z.object({
    min: z.number().nonnegative('Minimum spacing cannot be negative'),
    max: z.number().positive('Maximum spacing must be positive'),
  }).refine(data => data.min <= data.max, {
    message: 'Minimum spacing cannot exceed maximum spacing',
  }),
  description: z.string().optional(),
  growthRate: GrowthRateSchema,
  sunRequirement: SunRequirementSchema,
  waterRequirement: WaterRequirementSchema,
  isEdible: z.boolean().optional(),
});

// =============================================================================
// Position Schemas
// =============================================================================

export const PositionSchema = z.object({
  x: z.number().finite('X coordinate must be a finite number'),
  y: z.number().finite('Y coordinate must be a finite number'),
});

// =============================================================================
// Patch Schemas
// =============================================================================

export const ViewportSchema = z.object({
  zoom: z.number().positive('Zoom must be positive').max(100, 'Zoom too large'),
  centerX: z.number().finite('Center X must be a finite number'),
  centerY: z.number().finite('Center Y must be a finite number'),
});

export const PatchSizeSchema = z.object({
  width: z.number()
    .positive('Width must be positive')
    .max(10000, 'Width cannot exceed 10000 meters'),
  height: z.number()
    .positive('Height must be positive')
    .max(10000, 'Height cannot exceed 10000 meters'),
});

export const PatchSchema = z.object({
  id: z.string().min(1, 'Patch ID is required'),
  name: z.string()
    .min(1, 'Patch name is required')
    .max(100, 'Patch name cannot exceed 100 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  size: PatchSizeSchema,
  location: z.string().max(200, 'Location cannot exceed 200 characters').optional(),
  createdAt: z.number().positive('Created timestamp must be positive'),
  updatedAt: z.number().positive('Updated timestamp must be positive'),
  lastViewport: ViewportSchema.optional(),
  isActive: z.boolean().optional(),
});

export const PatchCreationDataSchema = z.object({
  name: z.string()
    .min(1, 'Patch name is required')
    .max(100, 'Patch name cannot exceed 100 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  size: PatchSizeSchema,
  location: z.string().max(200, 'Location cannot exceed 200 characters').optional(),
  duplicateFrom: z.string().optional(),
});

// =============================================================================
// Bed Schemas
// =============================================================================

export const BedShapeSchema = z.enum(['rectangle', 'circle']);

export const BedDimensionsSchema = z.object({
  length: z.number().positive('Length must be positive').max(100, 'Length cannot exceed 100 meters').optional(),
  width: z.number().positive('Width must be positive').max(100, 'Width cannot exceed 100 meters').optional(),
  radius: z.number().positive('Radius must be positive').max(50, 'Radius cannot exceed 50 meters').optional(),
});

export const BedSchema = z.object({
  id: z.string().min(1, 'Bed ID is required'),
  patchId: z.string().optional(),
  shape: BedShapeSchema,
  position: PositionSchema,
  dimensions: BedDimensionsSchema,
  rotation: z.number().min(-360).max(360, 'Rotation must be between -360 and 360 degrees'),
  createdAt: z.number().positive('Created timestamp must be positive'),
  updatedAt: z.number().positive('Updated timestamp must be positive'),
}).refine(
  (data) => {
    // Rectangle must have length and width
    if (data.shape === 'rectangle') {
      return data.dimensions.length !== undefined && data.dimensions.width !== undefined;
    }
    // Circle must have radius
    if (data.shape === 'circle') {
      return data.dimensions.radius !== undefined;
    }
    return true;
  },
  {
    message: 'Rectangle beds require length and width; circle beds require radius',
  }
);

export const BedConfigSchema = z.object({
  shape: BedShapeSchema,
  length: z.number().positive('Length must be positive').max(100),
  width: z.number().positive('Width must be positive').max(100),
  spacing: z.number().nonnegative('Spacing cannot be negative').max(10),
  quantity: z.number().int().positive('Quantity must be a positive integer').max(100),
});

// =============================================================================
// Plant Placement Schemas
// =============================================================================

export const PlantPlacementSchema = z.object({
  id: z.string().min(1, 'Placement ID is required'),
  bedId: z.string().min(1, 'Bed ID is required'),
  patchId: z.string().optional(),
  species: PlantSpeciesSchema,
  position: PositionSchema,
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

// =============================================================================
// Array Schemas for Bulk Operations
// =============================================================================

export const PatchArraySchema = z.array(PatchSchema);
export const BedArraySchema = z.array(BedSchema);
export const PlantPlacementArraySchema = z.array(PlantPlacementSchema);

// =============================================================================
// Type Exports (for TypeScript inference)
// =============================================================================

export type ValidatedPatch = z.infer<typeof PatchSchema>;
export type ValidatedBed = z.infer<typeof BedSchema>;
export type ValidatedPlantPlacement = z.infer<typeof PlantPlacementSchema>;
export type ValidatedPlantSpecies = z.infer<typeof PlantSpeciesSchema>;

// =============================================================================
// Validation Helper Functions
// =============================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Validate patches array with detailed error messages
 */
export const validatePatches = (patches: unknown): ValidationResult<ValidatedPatch[]> => {
  const result = PatchArraySchema.safeParse(patches);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
};

/**
 * Validate beds array with detailed error messages
 */
export const validateBeds = (beds: unknown): ValidationResult<ValidatedBed[]> => {
  const result = BedArraySchema.safeParse(beds);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
};

/**
 * Validate placements array with detailed error messages
 */
export const validatePlacements = (placements: unknown): ValidationResult<ValidatedPlantPlacement[]> => {
  const result = PlantPlacementArraySchema.safeParse(placements);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
};

/**
 * Validate a single patch
 */
export const validatePatch = (patch: unknown): ValidationResult<ValidatedPatch> => {
  const result = PatchSchema.safeParse(patch);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
};

/**
 * Validate a single bed
 */
export const validateBed = (bed: unknown): ValidationResult<ValidatedBed> => {
  const result = BedSchema.safeParse(bed);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
};

/**
 * Validate a single placement
 */
export const validatePlacement = (placement: unknown): ValidationResult<ValidatedPlantPlacement> => {
  const result = PlantPlacementSchema.safeParse(placement);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
};
