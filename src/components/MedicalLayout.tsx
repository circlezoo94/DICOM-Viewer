import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  FileImage, 
  History, 
  Search, 
  FolderOpen, 
  Download,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MedicalLayoutProps {
  children: React.ReactNode;
  activeView: 'worklist' | 'viewer';
  onViewChange: (view: 'worklist' | 'viewer') => void;
}

export function MedicalLayout({ children, activeView, onViewChange }: MedicalLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <FileImage className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-medium text-sidebar-foreground">Lunit INSIGHT View</h1>
              <Badge variant="secondary" className="text-xs mt-1">Demo</Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <Button
                variant={activeView === 'worklist' ? 'default' : 'ghost'}
                className="w-full justify-start text-sm h-9"
                onClick={() => onViewChange('worklist')}
              >
                <FileImage className="w-4 h-4 mr-2" />
                Worklist
              </Button>
              
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 text-muted-foreground"
                >
                  <ChevronRight className="w-3 h-3 mr-2" />
                  CXR
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 text-muted-foreground bg-sidebar-accent"
                >
                  <ChevronRight className="w-3 h-3 mr-2" />
                  MMG
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Menu Section */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground mb-2">Menu</p>
              
              <Button
                variant="ghost"
                className="w-full justify-between text-sm h-9"
              >
                <div className="flex items-center">
                  <History className="w-4 h-4 mr-2" />
                  History
                </div>
                <ChevronDown className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-sm h-9"
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Search Result
                </div>
                <ChevronDown className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-sm h-9"
              >
                <div className="flex items-center">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Local Exams
                </div>
                <ChevronDown className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between text-sm h-9"
              >
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Imported
                </div>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
        </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm h-9"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}