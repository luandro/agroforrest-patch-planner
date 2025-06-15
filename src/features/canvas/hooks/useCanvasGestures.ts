import { useRef, useCallback, useEffect } from 'react';
import { CanvasGesture, CanvasPoint } from '../types/canvas.types';

interface UseCanvasGesturesProps {
  onPan: (deltaX: number, deltaY: number) => void;
  onZoom: (zoom: number, centerX?: number, centerY?: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentZoom: number;
  enabled?: boolean;
}

export const useCanvasGestures = ({
  onPan,
  onZoom,
  canvasRef,
  currentZoom,
  enabled = true
}: UseCanvasGesturesProps) => {
  const gestureRef = useRef<CanvasGesture>({
    isPanning: false,
    isZooming: false
  });
  const zoomRef = useRef(currentZoom);

  useEffect(() => {
    zoomRef.current = currentZoom;
  }, [currentZoom]);

  const getDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getCanvasPoint = useCallback((clientX: number, clientY: number): CanvasPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, [canvasRef]);

  // Touch event handlers with improved stability
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      gestureRef.current = {
        isPanning: true,
        isZooming: false,
        lastPanPoint: point
      };
    } else if (e.touches.length === 2) {
      const distance = getDistance(e.touches);
      gestureRef.current = {
        isPanning: false,
        isZooming: true,
        initialDistance: distance,
        initialZoom: zoomRef.current,
      };
    }
  }, [getCanvasPoint, getDistance, enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && e.touches.length === 1 && gesture.lastPanPoint) {
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    } else if (gesture.isZooming && e.touches.length === 2 && gesture.initialDistance && gesture.initialZoom) {
      const distance = getDistance(e.touches);
      const scale = distance / gesture.initialDistance;
      const newZoom = Math.max(0.1, Math.min(10, gesture.initialZoom * scale));
      
      onZoom(newZoom);
    }
  }, [getCanvasPoint, getDistance, onPan, onZoom, enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    
    if (e.touches.length === 0) {
      gestureRef.current = {
        isPanning: false,
        isZooming: false
      };
    }
  }, [enabled]);

  // Mouse handlers remain the same
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled || e.button !== 0) return;
    
    const point = getCanvasPoint(e.clientX, e.clientY);
    gestureRef.current = {
      isPanning: true,
      isZooming: false,
      lastPanPoint: point
    };
  }, [getCanvasPoint, enabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && gesture.lastPanPoint) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    }
  }, [getCanvasPoint, onPan, enabled]);

  const handleMouseUp = useCallback(() => {
    if (!enabled) return;
    
    gestureRef.current = {
      isPanning: false,
      isZooming: false
    };
  }, [enabled]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, zoomRef.current * zoomFactor));
    
    onZoom(newZoom);
  }, [onZoom, enabled]);

  // Set up event listeners with passive: false for touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    // Touch events - passive: false to allow preventDefault
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Wheel event
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, enabled]);

  return gestureRef.current;
};
