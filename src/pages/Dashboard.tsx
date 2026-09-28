import React from 'react';
import { 
  Boxes, 
  Copy, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  UploadCloud, 
  ShieldCheck, 
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { DashboardStats, NavigationPage } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  onNavigate: (page: NavigationPage) => void;
  onTriggerMatching: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Materials */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Materials</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalMaterials.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4 CPSE catalogs active</span>
            </div>
          </div>
        </div>

        {/* Potential Duplicates */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Potential Duplicates</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.potentialDuplicates.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 font-medium">
              <span>SBERT Semantic Clusters</span>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.pendingReviews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <span>Awaiting Expert Signoff</span>
            </div>
          </div>
        </div>

        {/* Unified Materials */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unified Materials</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.unifiedMaterials.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <span>Golden Master Records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Orchestration Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl p-6 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-medium border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>AI Material Harmonization Engine</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Cross-CPSE Duplicate Identification Pipeline</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Leverage Sentence-BERT embeddings and technical specification matching to detect identical materials cataloged under conflicting legacy codes across enterprises.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('matching')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <span>View Duplicate Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New CPSE Dump</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: CPSE Progress & Category Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* CPSE Enrolled Organizations Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">CPSE Ingestion & Harmonization Status</h3>
                <p className="text-xs text-slate-500 mt-0.5">Coverage and deduplication progress across enrolled enterprises</p>
              </div>
              <button
                onClick={() => onNavigate('records')}
                className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
              >
                <span>Browse Records</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {stats.cpseContributions.map((cpse) => {
                const percentHarmonized = Math.round((cpse.harmonized / cpse.total) * 100);
                return (
                  <div key={cpse.cpseId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                        {cpse.cpseName}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {cpse.cpseName === 'CPSE-A' ? 'CPSE-A (Heavy Engineering)' :
                           cpse.cpseName === 'CPSE-B' ? 'CPSE-B (Thermal & Hydro Energy)' :
                           cpse.cpseName === 'CPSE-C' ? 'CPSE-C (National Steel & Mining)' :
                           'CPSE-D (Rail Transit & Infra)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cpse.total.toLocaleString()} catalog items ingested
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="flex-1">
                        <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                          <span>Harmonized</span>
                          <span className="font-semibold text-slate-800">{percentHarmonized}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${percentHarmonized}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">
                        {cpse.harmonized.toLocaleString()} / {cpse.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Material Category Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Material Category Distribution</h3>
                <p className="text-xs text-slate-500 mt-0.5">Standardization coverage across primary industrial domains</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {stats.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-xs font-semibold text-slate-800">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500">{cat.count.toLocaleString()} items</span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
                      {cat.duplicates} duplicates flagged
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Actions & Recent Validation Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Enterprise Workflows</h3>
            
            <button
              onClick={() => onNavigate('validation')}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Review Validation Queue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Approve or reject proposed duplicate matches</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('master')}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Unified Material Master</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Explore standard taxonomy & lineage</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Upload Catalog Dump</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Ingest new CSV or Excel material data</p>
              </div>
            </button>
          </div>

          {/* Recent Harmonization Audit Trail */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Recent Audit Log</h3>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Verified</span>
            </div>

            <div className="mt-3 space-y-3">
              {stats.recentActivity.map((act) => (
                <div key={act.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{act.title}</span>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{act.subtitle}</p>
                  <div className="text-[10px] text-blue-600 font-medium pt-1">
                    Reviewer: {act.user}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
