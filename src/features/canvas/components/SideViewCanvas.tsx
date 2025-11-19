
import React, { useRef, useEffect, useState } from 'react';
import { usePlantPlacementStore } from '../stores/plantPlacementStore';
import { useBedStore } from '../stores/bedStore';
import { useTimelineStore } from '../stores/timelineStore';
import { useSideViewStore } from '../stores/sideViewStore';
import { useGrowthTimeline } from '../hooks/useGrowthTimeline';
import { useSideViewPlantConverter } from '../hooks/useSideViewPlantConverter';
import { renderSideView } from '../utils/sideViewRenderer';
import { SideViewTimelineControls } from './timeline/SideViewTimelineControls';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { canvasLogger } from '@/lib/logger';

const logger = canvasLogger.createChild('SideView');

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
  
  const { placements } = usePlantPlacementStore();
  const { beds } = useBedStore();
  const { isTimelineActive } = useTimelineStore();
  const { viewport } = useSideViewStore();
  const { convertToSideViewBed } = useSideViewPlantConverter();

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

  // Handle canvas resize
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
        logger.debug('Canvas resized', { width, height, dpr });
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

    const sideViewBed = convertToSideViewBed(bedId, timelineMonth);
    if (!sideViewBed) return;

    logger.debug('Render side view', {
      bedId,
      plantsCount: sideViewBed.plants.length,
      timelineActive: isTimelineActive,
      currentMonth: timelineMonth
    });

    renderSideView({
      ctx,
      canvas,
      bed: sideViewBed,
      viewport,
      currentMonth: isTimelineActive ? timelineMonth : 0
    });
  }, [beds, placements, timelineMonth, isTimelineActive, focusedBedId, viewport, convertToSideViewBed]);

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
