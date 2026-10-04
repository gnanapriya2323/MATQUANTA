import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavigationPage, UserRole, UserSession } from '../../types';

interface LayoutProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  pendingValidationCount: number;
  currentRole?: UserRole;
  currentUser?: UserSession | null;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onNavigate,
  pendingValidationCount,
  currentRole,
  currentUser,
  onLogout,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full max-w-full bg-[#F5F7FA] font-sans antialiased text-[#17202A] overflow-x-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        pendingValidationCount={pendingValidationCount}
        currentRole={currentRole}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full h-screen overflow-hidden">
        <Header 
          currentPage={currentPage}
          onNavigate={onNavigate}
          currentUser={currentUser}
          onLogout={onLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        {/* Spacious, professional content area with comfortable padding and maximum content width */}
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-8 overflow-y-auto overflow-x-hidden w-full">
          <div className="max-w-[1220px] w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
