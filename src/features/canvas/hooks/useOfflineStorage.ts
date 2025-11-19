/**
 * Main hook for offline storage functionality
 * This is the primary interface that components should use
 * Replaces the individual auto-save hooks with a unified solution
 */

import { useAutoSaveOrchestrator } from './useAutoSaveOrchestrator';
import { exportAllData, importAllData, clearAllStorage } from '../storage';

export const useOfflineStorage = () => {
  const orchestrator = useAutoSaveOrchestrator();

  // Export data for backup
  const exportData = async (): Promise<string> => {
    try {
      const data = await exportAllData();
      console.log('✅ Data exported successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to export data:', error);
      throw error;
    }
  };

  // Import data from backup
  const importData = async (jsonData: string): Promise<void> => {
    try {
      await importAllData(jsonData);
      // Reinitialize after import
      await orchestrator.reinitialize();
      console.log('✅ Data imported and reinitialized successfully');
    } catch (error) {
      console.error('❌ Failed to import data:', error);
      throw error;
    }
  };

  // Clear all data
  const clearData = async (): Promise<void> => {
    try {
      await clearAllStorage();
      // Reinitialize after clearing
      await orchestrator.reinitialize();
      console.log('✅ Data cleared and reinitialized successfully');
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      throw error;
    }
  };

  // Get storage statistics
  const getStorageStats = () => {
    return {
      isOnline: navigator.onLine,
      isInitialized: orchestrator.isInitialized,
      isLoading: orchestrator.isLoading,
      isSaving: orchestrator.isSaving,
      isDirty: orchestrator.isDirty,
      lastSaveTime: orchestrator.lastSaveTime,
      saveErrors: orchestrator.saveErrors,
      saveCounts: orchestrator.saveCounts,
      storageDetails: orchestrator.storageDetails
    };
  };

  return {
    // Initialization state
    isInitialized: orchestrator.isInitialized,
    isLoading: orchestrator.isLoading,
    initializationError: orchestrator.initializationError,
    
    // Save state
    isSaving: orchestrator.isSaving,
    isDirty: orchestrator.isDirty,
    lastSaveTime: orchestrator.lastSaveTime,
    saveErrors: orchestrator.saveErrors,
    
    // Individual dirty states
    patchesDirty: orchestrator.patchesDirty,
    bedsDirty: orchestrator.bedsDirty,
    plantsDirty: orchestrator.plantsDirty,
    
    // Actions
    saveAll: orchestrator.manualSaveAll,
    savePatches: orchestrator.savePatchesManually,
    saveBeds: orchestrator.saveBedsManually,
    savePlants: orchestrator.savePlantsManually,
    
    // Data management
    exportData,
    importData,
    clearData,
    
    // Utilities
    getStorageStats,
    reinitialize: orchestrator.reinitialize
  };
};

// Backward compatibility exports
export { useAutoSave } from './useAutoSave';
export { useAutoSavePlants } from './useAutoSavePlants';
export { useAutoSavePatches } from './useAutoSavePatches';
export { useStorageInitialization } from './useStorageInitialization';
export { useAutoSaveOrchestrator } from './useAutoSaveOrchestrator';
