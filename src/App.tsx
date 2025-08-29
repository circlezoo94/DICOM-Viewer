import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { DicomViewer } from './components/DicomViewer';
import { Worklist } from './components/Worklist';
import { MedicalLayout } from './components/MedicalLayout';
import { WorklistItem } from './utils/worklistData';

export default function App() {
  const [currentView, setCurrentView] = useState<'worklist' | 'viewer'>('worklist');
  const [selectedStudy, setSelectedStudy] = useState<WorklistItem | null>(null);

  // 다크모드 적용
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleStudySelect = (study: WorklistItem) => {
    setSelectedStudy(study);
    setCurrentView('viewer');
  };

  const handleBackToWorklist = () => {
    setCurrentView('worklist');
    setSelectedStudy(null);
  };

  const handleViewChange = (view: 'worklist' | 'viewer') => {
    if (view === 'worklist') {
      handleBackToWorklist();
    }
    setCurrentView(view);
  };

  return (
    <>
      <MedicalLayout activeView={currentView} onViewChange={handleViewChange}>
        {currentView === 'worklist' ? (
          <Worklist onStudySelect={handleStudySelect} />
        ) : (
          <DicomViewer 
            selectedStudy={selectedStudy}
            onBackToWorklist={handleBackToWorklist}
          />
        )}
      </MedicalLayout>
      <Toaster />
    </>
  );
}