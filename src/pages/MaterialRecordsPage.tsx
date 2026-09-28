import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  X,
  Tag
} from 'lucide-react';
import type { MaterialRecord, NavigationPage } from '../types';
import { SAMPLE_CPSES } from '../services/sampleData';

interface MaterialRecordsProps {
  records: MaterialRecord[];
  onNavigate: (page: NavigationPage) => void;
}

export const MaterialRecordsPage: React.FC<MaterialRecordsProps> = ({
  records,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpse, setSelectedCpse] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeRecord, setActiveRecord] = useState<MaterialRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(records.map(r => r.category)));

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch = 
      rec.legacyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.cpseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCpse = selectedCpse === 'all' || rec.cpseId === selectedCpse;
    const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || rec.status === selectedStatus;

    return matchesSearch && matchesCpse && matchesCategory && matchesStatus;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: MaterialRecord['status']) => {
    switch (status) {
      case 'harmonized':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Harmonized
          </span>
        );
      case 'matched':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            AI Matched
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Under Review
          </span>
        );
      case 'distinct':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Distinct Unique
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
            Raw Ingested
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by legacy material code, description, specification keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto text-xs text-slate-500">
            <span>Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> records</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* CPSE Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Source CPSE</label>
            <select
              value={selectedCpse}
              onChange={(e) => setSelectedCpse(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All CPSE Entities</option>
              {SAMPLE_CPSES.map((cpse) => (
                <option key={cpse.id} value={cpse.id}>
                  {cpse.code} - {cpse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Commodity Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Harmonization Status Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Harmonization Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="harmonized">Harmonized (Master Cataloged)</option>
              <option value="matched">AI Matched (Candidate)</option>
              <option value="under_review">Under Review</option>
              <option value="raw">Raw Ingested</option>
              <option value="distinct">Distinct Unique</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Legacy Material Code</th>
                <th className="p-3.5">Source CPSE</th>
                <th className="p-3.5 min-w-[320px]">Material Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">UOM</th>
                <th className="p-3.5">Harmonization Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No material records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-slate-800 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{record.legacyCode}</span>
                        <button
                          onClick={() => handleCopy(record.legacyCode)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === record.legacyCode ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                        {record.cpseName}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-800 font-medium">
                      <div className="line-clamp-2 leading-relaxed">{record.description}</div>
                    </td>

                    <td className="p-3.5 text-slate-600 font-normal">
                      {record.category}
                    </td>

                    <td className="p-3.5 font-mono text-center font-semibold text-slate-700">
                      {record.unitOfMeasure}
                    </td>

                    <td className="p-3.5">
                      {getStatusBadge(record.status)}
                    </td>

                    <td className="p-3.5 text-right pr-5">
                      <button
                        onClick={() => setActiveRecord(record)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium shadow-2xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect Specs</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Specification Modal / Drawer */}
      {activeRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  MQ
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Material Specification Sheet</h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {activeRecord.id}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs">
              {/* Top Banner */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {activeRecord.legacyCode}
                  </span>
                  <span className="text-slate-500 font-medium">Source: <strong>{activeRecord.cpseName}</strong></span>
                </div>
                <div className="font-semibold text-slate-800 text-sm leading-snug">
                  {activeRecord.description}
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Category / Domain</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeRecord.category}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Standard Base UOM</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{activeRecord.unitOfMeasure}</p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Harmonization Status</span>
                  <div className="mt-1">{getStatusBadge(activeRecord.status)}</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ingestion Batch</span>
                  <p className="font-mono text-slate-700 mt-0.5">{activeRecord.batchId}</p>
                </div>
              </div>

              {/* Technical Specifications Sheet */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Technical & Engineering Specifications</span>
                </h4>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
                  {Object.entries(activeRecord.specifications || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-2.5 bg-white text-xs">
                      <span className="font-medium text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveRecord(null);
                  onNavigate('matching');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>Check AI Match Candidates</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveRecord(null)}
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
