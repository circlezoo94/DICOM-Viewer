import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, FolderOpen, FileImage, ArrowLeft, User } from 'lucide-react';
import { WorklistItem } from '../utils/worklistData';

interface DicomHeaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  currentFileName?: string;
  selectedStudy?: WorklistItem | null;
  onBackToWorklist?: () => void;
}

export function DicomHeader({ onFileSelect, isLoading = false, currentFileName, selectedStudy, onBackToWorklist }: DicomHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {onBackToWorklist && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBackToWorklist}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <FileImage className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">DICOM Viewer</h1>
          </div>
          
          {selectedStudy && (
            <div className="flex items-center space-x-3 text-sm">
              <span>•</span>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{selectedStudy.patientName}</span>
                <Badge variant="outline">{selectedStudy.modality}</Badge>
                <span className="text-muted-foreground">{selectedStudy.studyDescription}</span>
              </div>
            </div>
          )}
          
          {currentFileName && !selectedStudy && (
            <div className="text-sm text-muted-foreground">
              <span>•</span>
              <span className="ml-2">{currentFileName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleButtonClick}
            disabled={isLoading}
            variant="outline"
            className="relative"
          >
            {isLoading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                로딩 중...
              </>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 mr-2" />
                새 파일 열기
              </>
            )}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".dcm,.dicom"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>
    </header>
  );
}