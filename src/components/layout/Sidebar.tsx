import React from 'react';
import { 
  LayoutGrid, 
  Search, 
  GitBranch, 
  BookOpen, 
  Building2, 
  Share2, 
  X,
  Handshake
} from 'lucide-react';
import type { NavigationPage, UserRole } from '../../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  pendingValidationCount: number;
  currentRole?: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  pendingValidationCount = 43,
  currentRole,
  isOpen = false,
  onClose
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationPage,
      label: 'Dashboard',
      icon: LayoutGrid
    },
    {
      id: 'records' as NavigationPage,
      label: 'Material Explorer',
      icon: Search
    },
    {
      id: 'matching' as NavigationPage,
      label: 'Harmonization Center',
      icon: GitBranch,
      badge: pendingValidationCount > 0 ? pendingValidationCount : 43
    },
    {
      id: 'master' as NavigationPage,
      label: 'Standard Catalog',
      icon: BookOpen
    },
    {
      id: 'onboarding' as NavigationPage,
      label: 'Organizations',
      icon: Building2
    },
    ...(currentRole === 'procurement' ? [
      {
        id: 'collaborative-procurement' as NavigationPage,
        label: 'Collaborative Procurement',
        icon: Handshake
      }
    ] : [])
  ];

  const handleItemClick = (id: NavigationPage) => {
    onNavigate(id);
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#17202A] text-white select-none">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#06B6D4] flex items-center justify-center text-[#17202A] shadow-md shadow-cyan-500/20">
            <Share2 className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-white text-sm tracking-tight leading-none">
              MATQUANTA
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              National Material Harmonization
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            currentPage === item.id || 
            (item.id === 'matching' && (currentPage === 'matching' || currentPage === 'validation')) ||
            (item.id === 'records' && (currentPage === 'records' || currentPage === 'standardization')) ||
            (item.id === 'master' && currentPage === 'master') ||
            (item.id === 'onboarding' && currentPage === 'onboarding') ||
            (item.id === 'collaborative-procurement' && currentPage === 'collaborative-procurement');

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-slate-800/90 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {/* Cyan indicator line for active state */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#06B6D4] rounded-r-full" />
              )}

              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-[#06B6D4]' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              <span className="truncate">{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive 
                    ? 'bg-[#06B6D4] text-[#17202A]' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-[#121921] space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Catalog Governance</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          CNMC Standard v2.4 • SIH 26099
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 border-r border-slate-800 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-64 h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
