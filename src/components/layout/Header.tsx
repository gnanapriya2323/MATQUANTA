import React from 'react';
import { 
  AlertCircle, 
  RotateCcw, 
  ChevronRight
} from 'lucide-react';
import type { NavigationPage } from '../../types';
import { DISCLAIMER_TEXT } from '../../services/sampleData';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onResetData: () => void;
}

const pageTitles: Record<NavigationPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Harmonization Dashboard',
    subtitle: 'Cross-CPSE material standardization metrics and deduplication summary'
  },
  upload: {
    title: 'CPSE Material Upload',
    subtitle: 'Ingest enterprise catalog dumps (CSV/Excel) and map attributes'
  },
  records: {
    title: 'Material Records Explorer',
    subtitle: 'Unified searchable directory of raw and harmonized CPSE materials'
  },
  matching: {
    title: 'AI Material Matching & Duplicate Clustering',
    subtitle: 'Semantic similarity matching, attribute convergence & duplicate candidate pairs'
  },
  validation: {
    title: 'Expert Domain Validation Queue',
    subtitle: 'Human-in-the-loop review to accept, reject or modify proposed unifications'
  },
  master: {
    title: 'Unified Material Master (Golden Records)',
    subtitle: 'Standardized enterprise taxonomy, harmonized catalog, and legacy lineage'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onResetData
}) => {
  const currentInfo = pageTitles[currentPage];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Sample Data Disclaimer Banner - Required */}
      <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-1.5 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-blue-800">Notice:</span>
          <span className="text-blue-700">{DISCLAIMER_TEXT}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onResetData}
            title="Reset to default sample dataset"
            className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-900 font-medium underline underline-offset-2 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Sample State
          </button>
        </div>
      </div>

      {/* Main Topbar */}
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>MATQUANTA</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-[11px]">
              {currentPage}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {currentInfo.title}
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>

        {/* Right Actions & Domain Expert Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
              VR
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Dr. V. Raman</span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Domain Expert (Mech/Materials)</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
