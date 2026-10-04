import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  Download, 
  Layers, 
  BarChart3, 
  AlertTriangle, 
  ChevronRight, 
  Info
} from 'lucide-react';
import type { UnifiedMaterial, NavigationPage } from '../types';
import { materialStore } from '../services/materialStore';

interface ProcurementInsightsPageProps {
  onNavigate?: (page: NavigationPage) => void;
}

export const ProcurementInsightsPage: React.FC<ProcurementInsightsPageProps> = () => {
  const [unifiedRecords, setUnifiedRecords] = useState<UnifiedMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<UnifiedMaterial | null>(null);

  useEffect(() => {
    const update = () => {
      setUnifiedRecords(materialStore.getUnifiedMaster());
    };
    update();
    return materialStore.subscribe(update);
  }, []);

  const filtered = unifiedRecords.filter(item => {
    const matchesSearch = 
      item.cnmcCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.standardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unspscCode.includes(searchQuery);

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(unifiedRecords.map(r => r.category)));

  // Aggregation metrics
  const totalHarmonizedItems = unifiedRecords.length;
  const totalCombinedUnits = unifiedRecords.reduce((acc, curr) => acc + (curr.totalIdentifiedRequirement || 0), 0);
  const totalCrossCpseCollaborations = unifiedRecords.filter(r => r.demandAggregation && r.demandAggregation.length > 1).length;

  const handleExportInsights = () => {
    const headers = [
      'CNMC Code',
      'Standard Material Name',
      'Category',
      'UNSPSC',
      'Total Annual Demand',
      'Base UOM',
      'Participating CPSEs',
      'Demand Breakdown (CPSE: Units)'
    ];

    const rows = filtered.map(item => [
      `"${item.cnmcCode}"`,
      `"${item.standardName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.unspscCode}"`,
      item.totalIdentifiedRequirement || 0,
      `"${item.standardUom}"`,
      item.demandAggregation?.length || 0,
      `"${(item.demandAggregation || []).map(d => `${d.cpseName}: ${d.annualRequirement} ${d.unit}`).join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `matquanta-demand-aggregation-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Step 9 of SIH 26099 Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Representative Sample Data
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Cross-CPSE Procurement Insights & Demand Aggregation</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Consolidated requirement intelligence across public sector enterprises mapped by <strong>Common National Material Code (CNMC)</strong>.
            </p>
          </div>
          <button
            onClick={handleExportInsights}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            Export Demand Matrix (CSV)
          </button>
        </div>
      </div>

      {/* Strict Legal / Policy Disclaimer Banner */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 text-amber-950 text-sm flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold text-amber-950">Statutory Notice & Governance Guardrail: </span>
          MatQuanta surfaces cross-CPSE demand aggregation strictly for <strong>collaborative intelligence, bulk tendering planning, and rate benchmarking</strong>. MatQuanta is <strong>not</strong> an automated purchasing platform. All procurement actions, approvals, and contract awards must comply with General Financial Rules (GFR), CVC guidelines, and respective CPSE procurement policies.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Harmonized CNMC Items</div>
          <div className="text-2xl font-bold text-[#0B192C] mt-1">{totalHarmonizedItems}</div>
          <div className="text-xs text-slate-400 mt-1">Standardized specifications</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Aggregated Annual Demand</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{totalCombinedUnits.toLocaleString()} units</div>
          <div className="text-xs text-blue-500 mt-1">Combined multi-enterprise volume</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Joint Synergy Opportunities</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{totalCrossCpseCollaborations} items</div>
          <div className="text-xs text-emerald-500 mt-1">Shared by ≥ 2 CPSEs</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Est. Economies of Scale</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">12% - 18%</div>
          <div className="text-xs text-indigo-500 mt-1">Projected bulk price variance</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by CNMC, material name, or UNSPSC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          >
            <option value="all">All Material Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Demand Aggregation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const totalRequirement = item.totalIdentifiedRequirement || 0;
          const demandList = item.demandAggregation || [];

          return (
            <div 
              key={item.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200 mb-1.5">
                      {item.cnmcCode}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{item.standardName}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Category: <span className="font-medium text-slate-700">{item.category}</span> • UNSPSC: <span className="font-mono text-slate-700">{item.unspscCode}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Total Demand</div>
                    <div className="text-xl font-black text-blue-700">
                      {totalRequirement.toLocaleString()} <span className="text-xs font-normal text-slate-500">{item.standardUom}</span>
                    </div>
                  </div>
                </div>

                {/* CPSE Breakdown Progress Bars */}
                <div className="mt-4 space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      CPSE Share Breakdown
                    </span>
                    <span className="text-slate-400">{demandList.length} Participating CPSEs</span>
                  </div>

                  {demandList.map((d, i) => {
                    const percentage = totalRequirement > 0 ? Math.round((d.annualRequirement / totalRequirement) * 100) : 0;
                    const colorList = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600'];
                    const barColor = colorList[i % colorList.length];

                    return (
                      <div key={d.cpseCode} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-800">{d.cpseName}</span>
                          <span className="font-semibold text-slate-700">
                            {d.annualRequirement.toLocaleString()} {d.unit} <span className="text-slate-400 font-normal">({percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legacy CPSE Codes Mapped */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">Preserved CPSE Codes:</span>
                  {item.cpseMappings.map(m => (
                    <span key={m.legacyItemCode} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700">
                      {m.cpseCode}: {m.legacyItemCode}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  High Bulk Synergies
                </span>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  Inspect Full Specs & Mappings
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200 mb-1">
                  {selectedItem.cnmcCode}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{selectedItem.standardName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedItem.standardDescription}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Demand Breakdown Table */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Participating CPSE Annual Requirements
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <tr>
                      <th className="px-4 py-2.5">CPSE Enterprise</th>
                      <th className="px-4 py-2.5">Legacy Code</th>
                      <th className="px-4 py-2.5 text-right">Annual Demand</th>
                      <th className="px-4 py-2.5">UOM</th>
                      <th className="px-4 py-2.5 text-right">Last Procured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(selectedItem.demandAggregation || []).map((d) => {
                      const mapping = selectedItem.cpseMappings.find(m => m.cpseCode === d.cpseCode || m.cpseName === d.cpseName);
                      return (
                        <tr key={d.cpseCode}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{d.cpseName}</td>
                          <td className="px-4 py-2.5 font-mono text-slate-600">{mapping?.legacyItemCode || '-'}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-blue-700">{d.annualRequirement.toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-slate-500">{d.unit}</td>
                          <td className="px-4 py-2.5 text-right text-slate-500">{d.lastProcurementYear}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                    <tr>
                      <td colSpan={2} className="px-4 py-2.5">Aggregated Total</td>
                      <td className="px-4 py-2.5 text-right text-blue-800">
                        {selectedItem.totalIdentifiedRequirement?.toLocaleString()}
                      </td>
                      <td colSpan={2} className="px-4 py-2.5 text-slate-500">{selectedItem.standardUom}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Standard Engineering Parameters
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                {Object.entries(selectedItem.standardSpecs || {}).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-400 block capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Representative Sample Data for SIH 26099
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
