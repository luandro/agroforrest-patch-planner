
import { useCallback, useState } from 'react';
import { useBedStore } from '../stores/bedStore';

export const useBedDragging = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const { selectedBedIds, beds, updateBed } = useBedStore();

  const startDragging = useCallback((worldX: number, worldY: number) => {
    setIsDragging(true);
    setDragStart({ x: worldX, y: worldY });
  }, []);

  const updateDragging = useCallback((worldX: number, worldY: number) => {
    if (isDragging && dragStart) {
      const deltaX = worldX - dragStart.x;
      const deltaY = worldY - dragStart.y;

      selectedBedIds.forEach(bedId => {
        const bed = beds.find(b => b.id === bedId);
        if (bed) {
          updateBed(bedId, {
            position: {
              x: bed.position.x + deltaX,
              y: bed.position.y + deltaY
            }
          });
        }
      });

      setDragStart({ x: worldX, y: worldY });
    }
  }, [isDragging, dragStart, selectedBedIds, beds, updateBed]);

  const finishDragging = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  return {
    isDragging,
    startDragging,
    updateDragging,
    finishDragging
  };
};
