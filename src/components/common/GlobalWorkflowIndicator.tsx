import React, { useState } from 'react';
import { 
  Building2, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Copy, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { NavigationPage } from '../../types';

interface GlobalWorkflowIndicatorProps {
  currentPage?: NavigationPage;
  onNavigate?: (page: NavigationPage) => void;
}

export const GlobalWorkflowIndicator: React.FC<GlobalWorkflowIndicatorProps> = ({
  currentPage,
  onNavigate
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const steps: {
    id: number;
    title: string;
    sub: string;
    page: NavigationPage;
    icon: React.ElementType;
  }[] = [
    { id: 1, title: 'CPSE Onboarding', sub: 'Org verification', page: 'onboarding', icon: Building2 },
    { id: 2, title: 'Data Ingestion', sub: 'SAP/ERP/CSV/API', page: 'records', icon: UploadCloud },
    { id: 3, title: 'Standardization', sub: 'NLP normalizer', page: 'standardization', icon: FileText },
    { id: 4, title: 'AI + NLP Matching', sub: 'SBERT embedding', page: 'matching', icon: Sparkles },
    { id: 5, title: 'Duplicate Detection', sub: 'Equivalent pairs', page: 'matching', icon: Copy },
    { id: 6, title: 'Technical Validation', sub: 'Domain review', page: 'validation', icon: ShieldCheck },
    { id: 7, title: 'CNMC Recommender', sub: 'National code', page: 'validation', icon: Award },
    { id: 8, title: 'Expert Approval', sub: 'Signoff & audit', page: 'validation', icon: CheckCircle2 },
    { id: 9, title: 'Unified Master', sub: 'Golden records', page: 'master', icon: Layers },
    { id: 10, title: 'Legacy & Insights', sub: 'Demand grouping', page: 'procurement-insights', icon: TrendingUp },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3 bg-slate-50/90 border-b border-[#E2E8F0] flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#06B6D4] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            SIH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17202A] tracking-tight">
                MATQUANTA National Material Harmonization Workflow
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-[#06B6D4] border border-cyan-200">
                Problem Statement 26099
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              End-to-End Governance: From CPSE Data Connection → AI Semantic Matching → Common National Material Code (CNMC) → Unified Master
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] font-medium hidden sm:inline text-[#64748B]">
            {isExpanded ? 'Collapse Workflow' : 'Expand 10-Step Workflow'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </div>

      {/* Expanded Step Pipeline */}
      {isExpanded && (
        <div className="p-4 bg-white overflow-x-auto">
          <div className="flex items-center min-w-[980px] justify-between relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = currentPage === step.page;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => onNavigate && onNavigate(step.page)}
                    className={`flex flex-col items-center text-center p-2 rounded-lg transition-all group max-w-[95px] flex-1 ${
                      isCurrent 
                        ? 'bg-cyan-50 border border-cyan-300 shadow-2xs' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105 ${
                      isCurrent
                        ? 'bg-[#06B6D4] text-white shadow-xs'
                        : 'bg-slate-100 text-[#17202A] border border-[#E2E8F0] group-hover:bg-cyan-50 group-hover:text-[#06B6D4]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-[#64748B] mt-1">Step {step.id}</span>
                    <span className="text-[11px] font-bold text-[#17202A] leading-tight mt-0.5 group-hover:text-[#06B6D4]">
                      {step.title}
                    </span>
                    <span className="text-[9px] text-[#64748B] font-medium leading-tight truncate w-full mt-0.5">
                      {step.sub}
                    </span>
                  </button>

                  {idx < steps.length - 1 && (
                    <div className="shrink-0 text-slate-300 flex items-center -mx-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
