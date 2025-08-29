import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ZoomIn, ZoomOut, RotateCcw, Move, Upload } from 'lucide-react';

interface DicomControlsProps {
  windowCenter: number;
  windowWidth: number;
  zoom: number;
  onWindowCenterChange: (value: number) => void;
  onWindowWidthChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  onReset: () => void;
  onFileSelect?: (file: File) => void;
  isLoading?: boolean;
}

export function DicomControls({
  windowCenter,
  windowWidth,
  zoom,
  onWindowCenterChange,
  onWindowWidthChange,
  onZoomChange,
  onReset,
  onFileSelect,
  isLoading = false
}: DicomControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom / 1.2, 0.1));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    event.target.value = '';
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move className="w-5 h-5" />
          Image Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zoom Controls */}
        <div>
          <label className="block mb-2">Zoom: {(zoom * 100).toFixed(0)}%</label>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomOut}
              className="p-2"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => onZoomChange(value)}
              min={0.1}
              max={5}
              step={0.1}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomIn}
              className="p-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Window/Level Controls */}
        <div>
          <label className="block mb-2">Window Center: {windowCenter}</label>
          <Slider
            value={[windowCenter]}
            onValueChange={([value]) => onWindowCenterChange(value)}
            min={-1000}
            max={1000}
            step={1}
          />
        </div>

        <div>
          <label className="block mb-2">Window Width: {windowWidth}</label>
          <Slider
            value={[windowWidth]}
            onValueChange={([value]) => onWindowWidthChange(value)}
            min={1}
            max={2000}
            step={1}
          />
        </div>

        <Separator />

        {/* Preset Window/Level Values */}
        <div>
          <label className="block mb-2">Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onWindowCenterChange(40);
                onWindowWidthChange(80);
              }}
            >
              Brain
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onWindowCenterChange(-600);
                onWindowWidthChange(1500);
              }}
            >
              Lung
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onWindowCenterChange(50);
                onWindowWidthChange(350);
              }}
            >
              Abdomen
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onWindowCenterChange(400);
                onWindowWidthChange(1000);
              }}
            >
              Bone
            </Button>
          </div>
        </div>

        <Separator />

        {/* File Upload Button */}
        {onFileSelect && (
          <>
            <Button 
              variant="default" 
              onClick={handleFileButtonClick}
              disabled={isLoading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? '로딩 중...' : '새 파일 열기'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".dcm,.dicom"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <Separator />
          </>
        )}

        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={onReset}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset View
        </Button>
      </CardContent>
    </Card>
  );
}