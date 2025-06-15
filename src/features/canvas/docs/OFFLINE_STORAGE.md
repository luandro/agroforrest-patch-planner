# Offline Storage System

This document describes the comprehensive offline storage system implemented for the Agroforest Patch Planner application.

## Overview

The offline storage system ensures that all user data (patches, beds, and plant placements) is automatically saved locally and persists across browser sessions. The system works fully offline and provides robust data management capabilities.

## Architecture

### Core Components

1. **Storage Manager** (`utils/storageManager.ts`)
   - Unified IndexedDB operations with localStorage fallback
   - Database schema management and migrations
   - Data export/import functionality

2. **Auto-Save Orchestrator** (`hooks/useAutoSaveOrchestrator.ts`)
   - Coordinates all auto-save operations
   - Prevents race conditions
   - Manages save order (patches → beds → plants)

3. **Storage Initialization** (`hooks/useStorageInitialization.ts`)
   - Ensures proper loading order
   - Handles data migration and recovery
   - Coordinates store initialization

4. **Unified Interface** (`hooks/useOfflineStorage.ts`)
   - Main hook for components to use
   - Provides simple API for all storage operations
   - Backward compatibility with existing hooks

### Data Flow

```
Application Start
       ↓
Storage Initialization
       ↓
Load Patches → Load Beds → Load Plants
       ↓
Auto-Save Orchestrator Active
       ↓
Automatic Saving on Changes
```

## Features

### ✅ Fully Offline Operation
- Works without internet connection
- All data stored locally in browser
- No server dependencies for core functionality

### ✅ Robust Data Persistence
- **Primary**: IndexedDB for structured data storage
- **Fallback**: localStorage for compatibility
- **Automatic**: Switches between storage methods seamlessly

### ✅ Intelligent Auto-Save
- **Debounced**: Prevents excessive saves during rapid changes
- **Ordered**: Saves patches first, then beds, then plants
- **Coordinated**: Prevents race conditions between different data types

### ✅ Data Integrity
- **Patch Association**: All beds and plants are properly linked to patches
- **Migration**: Automatic data migration when schema changes
- **Validation**: Data consistency checks on load

### ✅ Error Recovery
- **Graceful Fallbacks**: Continues working if one storage method fails
- **Error Reporting**: Clear error messages for debugging
- **Data Recovery**: Attempts to recover from corrupted data

### ✅ Data Management
- **Export**: Full data backup in JSON format
- **Import**: Restore from backup files
- **Clear**: Complete data reset functionality

## Usage

### Basic Usage

```typescript
import { useOfflineStorage } from '@/features/canvas/hooks/useOfflineStorage';

function MyComponent() {
  const storage = useOfflineStorage();
  
  // Check if storage is ready
  if (!storage.isInitialized) {
    return <div>Loading...</div>;
  }
  
  // Manual save all data
  const handleSave = () => {
    storage.saveAll();
  };
  
  // Export data
  const handleExport = async () => {
    const data = await storage.exportData();
    // Save to file or send to server
  };
  
  return (
    <div>
      <p>Storage Status: {storage.isDirty ? 'Unsaved changes' : 'All saved'}</p>
      <button onClick={handleSave}>Save All</button>
      <button onClick={handleExport}>Export Data</button>
    </div>
  );
}
```

### Advanced Usage

```typescript
// Individual save operations
storage.savePatches();
storage.saveBeds();
storage.savePlants();

// Check specific dirty states
if (storage.patchesDirty) {
  // Handle unsaved patches
}

// Get detailed storage statistics
const stats = storage.getStorageStats();
console.log('Storage stats:', stats);
```

## Storage Schema

### IndexedDB Structure

**Database**: `AgroForestDB` (version 4)

**Object Stores**:
- `patches`: Patch data with `createdAt` index
- `beds`: Bed data with `patchId` index
- `placements`: Plant placement data with `patchId` and `bedId` indexes

### Data Relationships

```
Patch (1) → Beds (many) → Plant Placements (many)
```

Each bed belongs to one patch, and each plant placement belongs to one bed and one patch (for direct association).

## Configuration

### Auto-Save Timing

- **Patches**: 2 seconds debounce
- **Beds**: 3 seconds debounce
- **Plants**: 5 seconds debounce
- **Periodic Save**: Every 30 seconds if dirty

### Storage Keys (localStorage fallback)

- `agroforest_patches`: Patch data
- `agroforest_beds`: Bed data
- `agroforest_placements`: Plant placement data
- `agroforest_current_patch_id`: Current active patch

## Migration Guide

### From Old System

The new system is backward compatible. Existing data will be automatically migrated:

1. **Plant Placements**: `patchId` field added based on bed association
2. **Storage Keys**: Updated to use consistent naming
3. **Schema Version**: Upgraded to version 4

### Breaking Changes

- `useAutoSavePatches()` → `useOfflineStorage()`
- `useAutoSave()` → `useOfflineStorage()` (for beds)
- `useAutoSavePlants()` → `useOfflineStorage()`

Old hooks are still available for backward compatibility but deprecated.

## Troubleshooting

### Common Issues

1. **Storage Not Initializing**
   - Check browser IndexedDB support
   - Verify localStorage is available
   - Check for storage quota limits

2. **Data Not Saving**
   - Verify `isDirty` state is true
   - Check for JavaScript errors in console
   - Ensure proper patch selection

3. **Performance Issues**
   - Reduce auto-save frequency if needed
   - Check for excessive re-renders
   - Monitor storage quota usage

### Debug Information

Enable debug logging by checking the browser console for messages prefixed with:
- 🔧 (Initialization)
- 💾 (Saving)
- 📂 (Loading)
- ✅ (Success)
- ❌ (Errors)
- ⚠️ (Warnings)

## Best Practices

1. **Always check `isInitialized`** before using storage features
2. **Handle loading states** gracefully in UI
3. **Provide manual save options** for user control
4. **Show save status** to users (saving, saved, errors)
5. **Implement data export** for user backups
6. **Test offline scenarios** thoroughly

## Future Enhancements

- [ ] Cloud sync capabilities
- [ ] Conflict resolution for multi-device usage
- [ ] Compressed storage for large datasets
- [ ] Real-time collaboration features
- [ ] Advanced data analytics and insights
