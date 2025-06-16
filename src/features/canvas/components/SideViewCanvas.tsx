import React, { useRef, useEffect } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { useTimelineStore } from '../stores/timelineStore';
import { useSideViewStore } from '../stores/sideViewStore';
import { renderSideView } from '../utils/sideViewRenderer';
import { getSpeciesHeightProfile, calculateHeightAtMonth } from '../data/heightGrowthData';
import { SideViewBed, SideViewPlant } from '../types/sideView.types';
import { getSpeciesById } from '../data/mockSpecies';

interface SideViewCanvasProps {
  focusedBedId?: string;
  className?: string;
}

export const SideViewCanvas: React.FC<SideViewCanvasProps> = ({ 
  focusedBedId, 
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { placements, getPlacementsForBed } = usePlantPlacementStore();
  const { beds } = useBedStore();
  const { currentMonth, isTimelineActive } = useTimelineStore();
  const { viewport } = useSideViewStore();

  // Convert placements to side view data
  const convertToSideViewBed = (bedId: string): SideViewBed | null => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return null;

    const bedPlacements = getPlacementsForBed(bedId);
    const bedLength = bed.shape === 'rectangle' ? bed.dimensions.length || 10 : bed.dimensions.radius ? bed.dimensions.radius * 2 : 10;

    const sideViewPlants: SideViewPlant[] = bedPlacements.map(placement => {
      // Extract species ID - handle both string and object cases
      const speciesId = typeof placement.species === 'string' ? placement.species : placement.species.id;
      
      const species = getSpeciesById(speciesId);
      const heightProfile = getSpeciesHeightProfile(speciesId);
      
      let currentHeight = 1; // Default height
      let canopyRadius = 0.5; // Default canopy
      let canopyLayer: any = 'understory';

      if (heightProfile && isTimelineActive) {
        currentHeight = calculateHeightAtMonth(heightProfile, currentMonth);
        canopyRadius = currentHeight * 0.3; // Canopy radius proportional to height
        canopyLayer = heightProfile.canopyLayer;
      } else if (species) {
        // Use species mature height if no timeline active
        currentHeight = species.matureSize?.height || 2;
        canopyRadius = species.matureSize?.width ? species.matureSize.width / 2 : 0.5;
        canopyLayer = species.category === 'trees' ? 'canopy' : 
                      species.category === 'shrubs' ? 'understory' : 'ground';
      }

      return {
        id: placement.id,
        speciesId: speciesId,
        position: {
          x: (placement.position.x / 100) * bedLength, // Convert percentage to meters
          height: currentHeight
        },
        canopyRadius,
        canopyLayer,
        age: currentMonth
      };
    });

    return {
      id: bedId,
      length: bedLength,
      plants: sideViewPlants
    };
  };

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Render side view
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bedId = focusedBedId || beds[0]?.id;
    if (!bedId) return;

    const sideViewBed = convertToSideViewBed(bedId);
    if (!sideViewBed) return;

    renderSideView({
      ctx,
      canvas,
      bed: sideViewBed,
      viewport,
      currentMonth: isTimelineActive ? currentMonth : 0
    });
  }, [beds, placements, currentMonth, isTimelineActive, focusedBedId, viewport]);

  return (
    <div ref={containerRef} className={`w-full h-full bg-gray-50 ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
