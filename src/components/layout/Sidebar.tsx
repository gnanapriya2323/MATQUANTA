import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Database, 
  GitMerge, 
  ShieldCheck, 
  Layers, 
  Server
} from 'lucide-react';
import type { NavigationPage } from '../../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  pendingValidationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  pendingValidationCount,
}) => {
  const navItems: { id: NavigationPage; label: string; icon: React.ElementType; badge?: number; description: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Platform overview & metrics'
    },
    {
      id: 'upload',
      label: 'CPSE Material Upload',
      icon: UploadCloud,
      description: 'Ingest catalog CSV/Excel'
    },
    {
      id: 'records',
      label: 'Material Records',
      icon: Database,
      description: 'Enterprise catalog browser'
    },
    {
      id: 'matching',
      label: 'AI Material Matching',
      icon: GitMerge,
      description: 'Semantic duplicate clustering'
    },
    {
      id: 'validation',
      label: 'Expert Validation',
      icon: ShieldCheck,
      badge: pendingValidationCount > 0 ? pendingValidationCount : undefined,
      description: 'Review & approve unifications'
    },
    {
      id: 'master',
      label: 'Unified Material Master',
      icon: Layers,
      description: 'Standardized golden records'
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 font-bold text-lg tracking-wider">
            MQ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">MATQUANTA</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Material Intelligence Platform</p>
          </div>
        </div>
      </div>

      {/* CPSE Context Pill */}
      <div className="px-4 pt-4 pb-2">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Scope: All CPSEs
            </span>
            <span className="text-[11px] text-slate-500">4 Enrolled</span>
          </div>
          <p className="text-[11px] text-slate-500">Standardizing across Heavy Eng, Energy, Steel & Rail</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Platform Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50/80 text-blue-700 font-semibold border border-blue-200/70 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-2 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Backend Integration Ready Info Card */}
      <div className="p-4 border-t border-slate-200">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span>Architecture Status</span>
          </div>
          <div className="text-[11px] space-y-1 text-slate-500">
            <div className="flex items-center justify-between">
              <span>FastAPI Backend:</span>
              <span className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1 py-0.5 rounded">Ready to Hook</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Embedding Engine:</span>
              <span className="font-mono text-[10px] text-blue-600 font-medium">SBERT Pipeline</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>MATQUANTA v1.0</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Operational
          </span>
        </div>
      </div>
    </aside>
  );
};
