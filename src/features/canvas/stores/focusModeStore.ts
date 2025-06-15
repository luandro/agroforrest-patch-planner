
import { create } from 'zustand';
import { FocusMode, FocusModeActions } from './types';
import { useBedState } from './bedState';

interface FocusModeStore extends FocusModeActions {
  focusMode: FocusMode;
}

export const useFocusModeStore = create<FocusModeStore>((set, get) => ({
  focusMode: {
    isActive: false,
    bedId: null,
    targetViewport: null
  },

  enterFocusMode: (bedId) => {
    const bedState = useBedState.getState();
    const bed = bedState.beds.find(b => b.id === bedId);
    if (!bed) return;

    // Calculate target viewport to show bed filling 80% of view
    const padding = 0.2; // 20% total padding (10% each side)
    let bedWidth, bedHeight;
    
    if (bed.shape === 'rectangle') {
      bedWidth = bed.dimensions.length || 1;
      bedHeight = bed.dimensions.width || 1;
    } else {
      const radius = bed.dimensions.radius || 0.5;
      bedWidth = bedHeight = radius * 2;
    }
    
    // Add some extra padding for the fine grid visibility
    const targetWidth = bedWidth / (1 - padding);
    const targetHeight = bedHeight / (1 - padding);
    
    // Calculate zoom to fit bed in viewport (assuming 20m base viewport)
    const zoomX = 20 / targetWidth;
    const zoomY = 20 / targetHeight;
    const targetZoom = Math.min(zoomX, zoomY) * 0.9; // 90% to ensure some padding
    
    set({
      focusMode: {
        isActive: true,
        bedId,
        targetViewport: {
          zoom: Math.max(2, Math.min(8, targetZoom)), // Clamp between 2x and 8x
          centerX: bed.position.x,
          centerY: bed.position.y
        }
      }
    });

    // Update bed state
    bedState.selectBeds([bedId]);
    bedState.setTool('select');
  },

  exitFocusMode: () => {
    set({
      focusMode: {
        isActive: false,
        bedId: null,
        targetViewport: null
      }
    });
  }
}));
