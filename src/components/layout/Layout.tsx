import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavigationPage } from '../../types';

interface LayoutProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onResetData: () => void;
  pendingValidationCount: number;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onNavigate,
  onResetData,
  pendingValidationCount,
  children
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        pendingValidationCount={pendingValidationCount}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentPage={currentPage} 
          onNavigate={onNavigate} 
          onResetData={onResetData}
        />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
