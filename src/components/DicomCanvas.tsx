import React, { useRef, useEffect, useCallback, useState } from 'react';
import { DicomImage } from '../utils/dicomParser';

interface DicomCanvasProps {
  dicomImage: DicomImage | null;
  windowCenter: number;
  windowWidth: number;
  zoom: number;
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
}

export function DicomCanvas({ 
  dicomImage, 
  windowCenter, 
  windowWidth, 
  zoom, 
  pan, 
  onPanChange 
}: DicomCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const applyWindowLevel = useCallback((pixelValue: number): number => {
    const min = windowCenter - windowWidth / 2;
    const max = windowCenter + windowWidth / 2;
    
    if (pixelValue <= min) return 0;
    if (pixelValue >= max) return 255;
    
    return Math.floor(((pixelValue - min) / windowWidth) * 255);
  }, [windowCenter, windowWidth]);

  const renderImage = useCallback(() => {
    if (!dicomImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, pixelData, rescaleSlope, rescaleIntercept, photometricInterpretation } = dicomImage;
    
    // Canvas 크기 설정
    canvas.width = width;
    canvas.height = height;

    // ImageData 생성
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < pixelData.length; i++) {
      let pixelValue = pixelData[i] * rescaleSlope + rescaleIntercept;
      let grayValue = applyWindowLevel(pixelValue);
      
      // Photometric Interpretation 적용
      if (photometricInterpretation === 'MONOCHROME1') {
        grayValue = 255 - grayValue;
      }

      const dataIndex = i * 4;
      data[dataIndex] = grayValue;     // R
      data[dataIndex + 1] = grayValue; // G
      data[dataIndex + 2] = grayValue; // B
      data[dataIndex + 3] = 255;       // A
    }

    ctx.putImageData(imageData, 0, 0);
  }, [dicomImage, applyWindowLevel]);

  useEffect(() => {
    renderImage();
  }, [renderImage]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    onPanChange({
      x: pan.x + deltaX,
      y: pan.y + deltaY
    });

    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePos, pan, onPanChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    // 휠 이벤트는 부모 컴포넌트에서 zoom 처리
  }, []);

  if (!dicomImage) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted border border-border rounded">
        <p className="text-muted-foreground">DICOM 파일을 선택하세요</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black border border-border rounded">
      <canvas
        ref={canvasRef}
        className="absolute cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'top left',
          imageRendering: 'pixelated'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
}