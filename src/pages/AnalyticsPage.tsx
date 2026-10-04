import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Layers, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2,
  GitMerge
} from 'lucide-react';
import type { DashboardStats } from '../types';
import { materialStore } from '../services/materialStore';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(materialStore.getStats());
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarter');

  useEffect(() => {
    const update = () => {
      setStats(materialStore.getStats());
    };
    update();
    return materialStore.subscribe(update);
  }, []);

  const totalCataloged = stats.totalMaterials;
  const duplicateRate = ((stats.duplicateMaterials + stats.nearDuplicates) / (stats.totalMaterials || 1)) * 100;
  const legacyMappedRate = ((stats.legacyCodesMapped) / (stats.legacyCodesTotal || 1)) * 100;

  const handleExportAnalytics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      reportType: 'SIH-26099-Analytics-Summary',
      overallKPIs: {
        totalMaterials: stats.totalMaterials,
        duplicateMaterials: stats.duplicateMaterials,
        nearDuplicates: stats.nearDuplicates,
        commonNationalMaterialCodes: stats.commonNationalMaterialCodes,
        legacyMigrationRate: `${legacyMappedRate.toFixed(1)}%`
      },
      cpseContributions: stats.cpseContributions,
      categoryBreakdown: stats.categoryBreakdown,
      validationSummary: stats.validationStatusSummary
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matquanta-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Step 10 of SIH 26099 Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Representative Sample Data
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Harmonization & Governance Analytics</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Cross-enterprise performance indicators, duplication velocity, and National Material Master adoption metrics across CPSE pilot datasets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="month">Current Month</option>
              <option value="quarter">Current Quarter (Q3 FY26)</option>
              <option value="annual">FY 2025-26 Cumulative</option>
            </select>
            <button
              onClick={handleExportAnalytics}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              Export JSON Report
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Catalogs Processed</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCataloged.toLocaleString()}</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Across 3 pilot CPSEs
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Redundancy / Duplicate Ratio</span>
            <GitMerge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{duplicateRate.toFixed(1)}%</div>
          <div className="text-xs text-slate-400 mt-1">Identified across catalog boundaries</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">CNMC Consolidation Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {stats.commonNationalMaterialCodes.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Active standardized codes</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Legacy Code Migration</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{legacyMappedRate.toFixed(1)}%</div>
          <div className="text-xs text-indigo-500 mt-1">{stats.legacyCodesMapped} of {stats.legacyCodesTotal} mapped</div>
        </div>
      </div>

      {/* Row 2: CPSE Progress & Match Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPSE Ingestion & Harmonization Progress */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                CPSE Harmonization Progress
              </h2>
              <p className="text-xs text-slate-500">Ingested vs Harmonized materials per enterprise</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Live Pilot Data</span>
          </div>

          <div className="space-y-5">
            {stats.cpseContributions.map((cpse) => {
              const harmonizedPercent = Math.round((cpse.harmonized / (cpse.total || 1)) * 100);

              return (
                <div key={cpse.cpseId} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{cpse.cpseCode}</span>
                      <span className="text-slate-500 ml-1.5">({cpse.cpseName})</span>
                    </div>
                    <div className="font-semibold text-slate-700">
                      {cpse.harmonized.toLocaleString()} / {cpse.total.toLocaleString()} ({harmonizedPercent}%)
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-600 h-full rounded-l-full transition-all duration-500" 
                      style={{ width: `${harmonizedPercent}%` }}
                      title={`Harmonized: ${harmonizedPercent}%`}
                    />
                    <div 
                      className="bg-amber-400 h-full transition-all duration-500" 
                      style={{ width: `${Math.round((cpse.pending / (cpse.total || 1)) * 100)}%` }}
                      title="Pending Validation"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>ERP Source: <strong className="text-slate-600">{cpse.erpSystem}</strong></span>
                    <span>Pending: <strong className="text-amber-600">{cpse.pending}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Match Types Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                AI Match Type Distribution
              </h2>
              <p className="text-xs text-slate-500">NLP classification of detected similarities</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { type: 'Identical (100% Match)', count: 48, color: 'bg-emerald-500', bar: 'w-[26%]' },
              { type: 'Duplicate (Semantic & Spec Equivalence)', count: 68, color: 'bg-blue-500', bar: 'w-[37%]' },
              { type: 'Near-Duplicate (Minor Standard Variance)', count: 42, color: 'bg-indigo-500', bar: 'w-[23%]' },
              { type: 'Functionally Equivalent (Cross-industry fit)', count: 26, color: 'bg-amber-500', bar: 'w-[14%]' }
            ].map(m => (
              <div key={m.type} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>{m.type}</span>
                  <span className="font-bold text-slate-900">{m.count} candidates</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} ${m.bar} rounded-full`} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
            <strong>Transformer Benchmark: </strong>
            Sentence-BERT cosine similarity threshold set at <strong>0.85</strong>. Cross-attribute precision exceeds <strong>94.2%</strong> across pilot engineering categories.
          </div>
        </div>
      </div>

      {/* Row 3: Material Category Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Category Level Redundancy & Harmonization
            </h2>
            <p className="text-xs text-slate-500">Duplication ratios across critical engineering categories</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Cataloged Materials</th>
                <th className="px-4 py-3 text-right">Duplicates Detected</th>
                <th className="px-4 py-3 text-right">Redundancy %</th>
                <th className="px-4 py-3 text-right">Standard CNMC Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.categoryBreakdown.map((cat) => {
                const redRate = ((cat.duplicates / (cat.count || 1)) * 100).toFixed(1);
                return (
                  <tr key={cat.category} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-800">{cat.category}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{cat.count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-amber-600">{cat.duplicates}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                        {redRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">{cat.cnmcCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
