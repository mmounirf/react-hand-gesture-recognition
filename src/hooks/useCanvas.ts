import { DrawingUtils } from '@mediapipe/tasks-vision';
import { useRef, useState } from 'react';
import { useEffectOnce } from './useEffectOnce';

export default function useCanvas() {
  const [drawingUtils, setDrawingUtils] = useState<DrawingUtils>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initializeDrawingUtils = async () => {
    if (!canvasRef.current || drawingUtils) return;
    const canvasContext = canvasRef.current.getContext('2d');

    if (!canvasContext) {
      throw new Error('Canvas context not found.');
    }
    setDrawingUtils(new DrawingUtils(canvasContext));
  };

  useEffectOnce(initializeDrawingUtils);

  return { drawingUtils, canvasRef };
}
