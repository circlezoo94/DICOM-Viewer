import React, { useState, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { DicomCanvas } from './DicomCanvas';
import { DicomControls } from './DicomControls';
import { DicomInfo } from './DicomInfo';
import { DicomHeader } from './DicomHeader';
import { FileUpload } from './FileUpload';
import { parseDicomFile, DicomImage } from '../utils/dicomParser';
import { WorklistItem } from '../utils/worklistData';

interface DicomViewerProps {
  selectedStudy?: WorklistItem | null;
  onBackToWorklist?: () => void;
}

export function DicomViewer({ selectedStudy, onBackToWorklist }: DicomViewerProps) {
  const [dicomImage, setDicomImage] = useState<DicomImage | null>(null);
  const [windowCenter, setWindowCenter] = useState(128);
  const [windowWidth, setWindowWidth] = useState(256);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const parsed = parseDicomFile(arrayBuffer);
      
      setDicomImage(parsed);
      setWindowCenter(parsed.windowCenter);
      setWindowWidth(parsed.windowWidth);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setCurrentFileName(file.name);
      
      toast.success(`DICOM 파일이 성공적으로 로드되었습니다: ${file.name}`);
    } catch (error) {
      console.error('DICOM 파일 로딩 오류:', error);
      toast.error('DICOM 파일을 로드하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (dicomImage) {
      setWindowCenter(dicomImage.windowCenter);
      setWindowWidth(dicomImage.windowWidth);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [dicomImage]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prevZoom => Math.min(Math.max(prevZoom * delta, 0.1), 5));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <DicomHeader 
        onFileSelect={handleFileSelect}
        isLoading={isLoading}
        currentFileName={currentFileName}
        selectedStudy={selectedStudy}
        onBackToWorklist={onBackToWorklist}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 p-4 border-r border-border bg-card overflow-y-auto">
          <div className="space-y-4">
            <DicomControls
              windowCenter={windowCenter}
              windowWidth={windowWidth}
              zoom={zoom}
              onWindowCenterChange={setWindowCenter}
              onWindowWidthChange={setWindowWidth}
              onZoomChange={setZoom}
              onReset={handleReset}
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Center Panel - Image Viewer */}
        <div className="flex-1 p-4">
          {!dicomImage ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <FileUpload 
                  onFileSelect={handleFileSelect} 
                  isLoading={isLoading}
                />
              </div>
            </div>
          ) : (
            <div 
              className="h-full"
              onWheel={handleWheel}
            >
              <DicomCanvas
                dicomImage={dicomImage}
                windowCenter={windowCenter}
                windowWidth={windowWidth}
                zoom={zoom}
                pan={pan}
                onPanChange={setPan}
              />
            </div>
          )}
        </div>

        {/* Right Panel - Information */}
        <div className="w-80 p-4 border-l border-border bg-card overflow-y-auto">
          <DicomInfo dicomImage={dicomImage} />
        </div>
      </div>
    </div>
  );
}