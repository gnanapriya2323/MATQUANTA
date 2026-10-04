import React from 'react';
import { 
  LogOut,
  Menu
} from 'lucide-react';
import type { NavigationPage, UserSession } from '../../types';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate?: (page: NavigationPage) => void;
  currentUser?: UserSession | null;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Cross-CPSE material intelligence and catalog harmonization metrics'
  },
  records: {
    title: 'Material Explorer',
    subtitle: 'Multi-CPSE material catalog and harmonized material mapping'
  },
  matching: {
    title: 'Harmonization Center',
    subtitle: 'Review and validate AI-recommended material matches'
  },
  master: {
    title: 'Standard Catalog',
    subtitle: 'Approved Unified Material Master and Common National Material Codes (CNMC)'
  },
  onboarding: {
    title: 'Organizations',
    subtitle: 'Participating Central Public Sector Enterprises and catalog synchronization'
  },
  'collaborative-procurement': {
    title: 'Collaborative Procurement',
    subtitle: 'Cross-CPSE demand aggregation and collaborative procurement opportunities'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  currentUser,
  onLogout,
  onToggleMobileMenu
}) => {
  const currentInfo = pageTitles[currentPage] || {
    title: 'MATQUANTA Platform',
    subtitle: 'AI-powered Material Master Harmonization'
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'procurement':
        return 'Procurement User';
      case 'admin':
        return 'Admin';
      case 'expert':
      default:
        return 'Technical Expert';
    }
  };

  const getRoleInitials = (role?: string) => {
    switch (role) {
      case 'procurement':
        return 'PU';
      case 'admin':
        return 'AD';
      case 'expert':
      default:
        return 'TE';
    }
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shrink-0">
      <div className="px-5 sm:px-8 lg:px-10 py-4 flex flex-row items-center justify-between gap-4">
        {/* Page Header: Title & Subtitle */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-[#17202A] hover:bg-slate-100 border border-[#E2E8F0]"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17202A] tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* User Profile & Role Info (Subtle) */}
        {currentUser && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-[#06B6D4] border border-cyan-200 flex items-center justify-center font-bold text-xs">
                {getRoleInitials(currentUser.role)}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-[#17202A] block text-xs leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  {getRoleDisplayName(currentUser.role)}
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Log out of session"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-rose-600 hover:bg-rose-50 border border-[#E2E8F0] transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
