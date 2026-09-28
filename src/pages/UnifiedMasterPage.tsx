import React, { useState } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  FileCode, 
  Eye, 
  GitBranch, 
  CheckCircle2, 
  Tag, 
  X,
  UserCheck
} from 'lucide-react';
import type { UnifiedMaterial, NavigationPage } from '../types';
import { apiClient } from '../services/api';

interface UnifiedMasterPageProps {
  masterRecords: UnifiedMaterial[];
  onNavigate: (page: NavigationPage) => void;
}

export const UnifiedMasterPage: React.FC<UnifiedMasterPageProps> = ({
  masterRecords
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeItem, setActiveItem] = useState<UnifiedMaterial | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const categories = Array.from(new Set(masterRecords.map(m => m.category)));

  const filteredMaster = masterRecords.filter((item) => {
    const matchesSearch = 
      item.unifiedCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.standardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unspscCode.includes(searchQuery) ||
      item.standardDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleExport = (format: 'csv' | 'json') => {
    const dataStr = apiClient.exportCatalog(format);
    const mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MATQUANTA_Unified_Master_${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Exported Master Catalog as ${format.toUpperCase()}`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const totalMapped = masterRecords.reduce((acc, curr) => acc + (curr.mappedLegacyRecords?.length || curr.duplicationCount || 1), 0);

  return (
    <div className="space-y-6">
      {/* Top Metric & Export Toolbar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-base font-bold text-slate-900">
                Unified Material Master Repository (Golden Records)
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Standardized single-source-of-truth material definitions harmonized across all enrolled CPSE enterprises with full traceability to legacy catalog codes.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
            <button
              onClick={() => handleExport('csv')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Master (CSV)</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4 text-blue-600" />
              <span>Export API Schema (JSON)</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Aggregate Harmonization Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Golden Master Items</span>
            <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
              {masterRecords.length} Records
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Mapped Legacy Items</span>
            <span className="text-base font-extrabold text-blue-700 font-mono mt-0.5 block">
              {totalMapped} Unified
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Average Duplication Ratio</span>
            <span className="text-base font-extrabold text-emerald-700 font-mono mt-0.5 block">
              {(totalMapped / (masterRecords.length || 1)).toFixed(1)}x Consolidate
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Standard Classification</span>
            <span className="text-base font-extrabold text-slate-800 font-mono mt-0.5 block">
              UNSPSC Standard
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search master catalog by unified code, standard title, UNSPSC code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Commodity Groups</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Unified Master Code</th>
                <th className="p-3.5 min-w-[300px]">Standardized Material Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">UNSPSC</th>
                <th className="p-3.5">UOM</th>
                <th className="p-3.5">Participating CPSEs</th>
                <th className="p-3.5 text-center">Legacy Mappings</th>
                <th className="p-3.5 text-right pr-5">Lineage & Specs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaster.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No master materials found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredMaster.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-bold text-blue-700">
                      {item.unifiedCode}
                    </td>

                    <td className="p-3.5 text-slate-900 font-semibold">
                      <div className="line-clamp-2 leading-relaxed">{item.standardName}</div>
                      <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                        {item.standardDescription}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium">
                      {item.category}
                    </td>

                    <td className="p-3.5 font-mono text-slate-700 font-medium">
                      {item.unspscCode}
                    </td>

                    <td className="p-3.5 font-mono text-slate-700 font-bold">
                      {item.standardUom}
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {item.participatingCPSEs.map((cpse, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold"
                          >
                            {cpse}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        <GitBranch className="w-3 h-3" />
                        {item.mappedLegacyRecords?.length || item.duplicationCount} Items
                      </span>
                    </td>

                    <td className="p-3.5 text-right pr-5">
                      <button
                        onClick={() => setActiveItem(item)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium shadow-2xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect Master</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Inspection Modal */}
      {activeItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  UNIF
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Unified Master Record</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Code: {activeItem.unifiedCode}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Standard Item Title Card */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {activeItem.unifiedCode}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Harmonized on: {activeItem.harmonizationDate}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm leading-snug">
                  {activeItem.standardName}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {activeItem.standardDescription}
                </p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Approved by: <strong>{activeItem.harmonizedBy}</strong></span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Harmonized Engineering Specifications</span>
                </h4>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-white">
                  {Object.entries(activeItem.standardSpecs || {}).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between p-2.5 text-xs">
                      <span className="text-slate-500 font-medium">{k}</span>
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legacy Lineage Tree */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mapped CPSE Legacy Records Lineage</span>
                </h4>
                <div className="space-y-2">
                  {activeItem.mappedLegacyRecords.map((legRec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                            {legRec.cpseName}
                          </span>
                          <span className="font-mono text-slate-800 font-bold text-[11px]">
                            {legRec.legacyCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{legRec.description}</p>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 font-medium shrink-0">
                        UOM: {legRec.unitOfMeasure}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
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
