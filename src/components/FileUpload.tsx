import React, { useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Upload, FileImage } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <FileImage className="w-8 h-8 text-gray-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">
                DICOM 파일 업로드
              </h3>
              <p className="text-gray-600 mb-4">
                .dcm 파일을 드래그하여 놓거나 클릭하여 선택하세요
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                disabled={isLoading}
                className="relative"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? '로딩 중...' : '파일 선택'}
                <input
                  type="file"
                  accept=".dcm,.dicom"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>지원 형식: .dcm, .dicom</p>
              <p>최대 파일 크기: 100MB</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}