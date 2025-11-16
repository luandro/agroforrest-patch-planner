
import React, { useRef, useEffect, useState } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { useTimelineStore } from '../stores/timelineStore';
import { useSideViewStore } from '../stores/sideViewStore';
import { useGrowthTimeline } from '../hooks/useGrowthTimeline';
import { renderSideView } from '../utils/sideViewRenderer';
import { getSpeciesHeightProfile, calculateHeightAtMonth } from '../data/heightGrowthData';
import { SideViewBed, SideViewPlant } from '../types/sideView.types';
import { getSpeciesById } from '../data/mockSpecies';
import { SideViewTimelineControls } from './timeline/SideViewTimelineControls';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showTimeline, setShowTimeline] = useState(true);
  const isMobile = useIsMobile();
  
  const { placements, getPlacementsForBed } = usePlantPlacementStore();
  const { beds } = useBedStore();
  const { currentMonth, isTimelineActive } = useTimelineStore();
  const { viewport } = useSideViewStore();

  // Timeline controls
  const {
    currentMonth: timelineMonth,
    setCurrentMonth,
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    startPlayback,
    stopPlayback,
    resetTimeline,
    maxMonths
  } = useGrowthTimeline();

  // Convert placements to side view data with improved plant distribution
  const convertToSideViewBed = (bedId: string): SideViewBed | null => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return null;

    const bedPlacements = getPlacementsForBed(bedId);
    const bedLength = bed.shape === 'rectangle' ? bed.dimensions.length || 10 : bed.dimensions.radius ? bed.dimensions.radius * 2 : 10;

    // Sort plants by X position to maintain order
    const sortedPlacements = [...bedPlacements].sort((a, b) => a.position.x - b.position.x);

    const sideViewPlants: SideViewPlant[] = sortedPlacements.map((placement, index) => {
      // Extract species ID - handle both string and object cases
      const speciesId = typeof placement.species === 'string' ? placement.species : placement.species.id;
      
      const species = getSpeciesById(speciesId);
      const heightProfile = getSpeciesHeightProfile(speciesId);
      
      let currentHeight = 0.3; // Start with seedling height
      let canopyRadius = 0.2; // Start with seedling canopy
      let canopyLayer: SideViewPlant['canopyLayer'] = 'understory';

      // Use timeline month for proper growth calculation
      const effectiveMonth = isTimelineActive ? timelineMonth : 0;

      if (heightProfile && effectiveMonth >= 0) {
        currentHeight = calculateHeightAtMonth(heightProfile, effectiveMonth);
        canopyRadius = Math.max(0.2, currentHeight * 0.25); // Proportional canopy
        canopyLayer = heightProfile.canopyLayer;
        
        console.log('[Side View Plant]', {
          species: species?.commonName,
          month: effectiveMonth,
          height: currentHeight,
          canopyRadius
        });
      } else if (species && !isTimelineActive) {
        // Use species mature height only if timeline is not active
        currentHeight = species.matureSize?.height || 2;
        canopyRadius = species.matureSize?.width ? species.matureSize.width / 2 : 0.5;
        canopyLayer = species.category === 'trees' ? 'canopy' : 
                      species.category === 'shrubs' ? 'understory' : 'ground';
      }

      // Improved position calculation with better distribution
      let xPosition: number;
      
      if (bedPlacements.length > 1) {
        // Calculate spread across bed length
        const minX = Math.min(...bedPlacements.map(p => p.position.x));
        const maxX = Math.max(...bedPlacements.map(p => p.position.x));
        const range = maxX - minX;
        
        if (range < 0.2) {
          // Plants are clustered, distribute evenly
          xPosition = (index / Math.max(1, bedPlacements.length - 1)) * bedLength;
        } else {
          // Use actual positions but scale to bed length
          const normalizedX = (placement.position.x - minX) / range;
          xPosition = normalizedX * bedLength;
        }
      } else {
        // Single plant, place in center
        xPosition = bedLength / 2;
      }

      return {
        id: placement.id,
        speciesId: speciesId,
        position: {
          x: xPosition,
          height: Math.max(0.2, currentHeight) // Ensure minimum height
        },
        canopyRadius: Math.max(0.1, canopyRadius), // Ensure minimum canopy
        canopyLayer,
        age: effectiveMonth
      };
    });

    return {
      id: bedId,
      length: bedLength,
      plants: sideViewPlants
    };
  };

  // Handle canvas resize with improved scaling
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Ensure minimum canvas size for mobile
      const minWidth = isMobile ? 320 : 600;
      const minHeight = isMobile ? 200 : 400;
      
      const width = Math.max(minWidth, rect.width);
      const height = Math.max(minHeight, rect.height);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        console.log('[Side View] Canvas resized:', { width, height, dpr });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isMobile]);

  // Enhanced render side view with proper timeline integration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bedId = focusedBedId || beds[0]?.id;
    if (!bedId) return;

    const sideViewBed = convertToSideViewBed(bedId);
    if (!sideViewBed) return;

    console.log('[Side View Render]', {
      bedId,
      plantsCount: sideViewBed.plants.length,
      timelineActive: isTimelineActive,
      currentMonth: timelineMonth,
      plants: sideViewBed.plants.map(p => ({ 
        id: p.id, 
        height: p.position.height.toFixed(2),
        canopy: p.canopyRadius.toFixed(2)
      }))
    });

    renderSideView({
      ctx,
      canvas,
      bed: sideViewBed,
      viewport,
      currentMonth: isTimelineActive ? timelineMonth : 0
    });
  }, [beds, placements, timelineMonth, isTimelineActive, focusedBedId, viewport, isMobile]);

  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-gradient-to-b from-blue-50 to-green-50 ${className} overflow-hidden`}>
      {/* Timeline Toggle Button - Enhanced positioning */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={toggleTimeline}
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="bg-white/95 backdrop-blur-sm shadow-lg border-gray-300 hover:bg-white min-h-[44px] min-w-[44px]"
        >
          {showTimeline ? <X className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
          {!isMobile && (showTimeline ? 'Fechar' : 'Linha do Tempo')}
        </Button>
      </div>

      {/* Canvas - Enhanced styling and scaling */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ 
          touchAction: 'none',
          maxWidth: '100vw',
          maxHeight: '100vh',
          minHeight: isMobile ? '200px' : '400px'
        }}
      />

      {/* Timeline Controls - Enhanced positioning and mobile optimization */}
      {showTimeline && (
        <div className="absolute inset-0 pointer-events-none z-[100]">
          <div className="pointer-events-auto">
            <SideViewTimelineControls
              currentMonth={timelineMonth}
              setCurrentMonth={setCurrentMonth}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              setPlaybackSpeed={setPlaybackSpeed}
              startPlayback={startPlayback}
              stopPlayback={stopPlayback}
              resetTimeline={resetTimeline}
              maxMonths={maxMonths}
              onClose={() => setShowTimeline(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
