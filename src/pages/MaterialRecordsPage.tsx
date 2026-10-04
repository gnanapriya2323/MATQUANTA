import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Copy, 
  X, 
  Sparkles, 
  Clock, 
  XCircle,
  Edit3,
  Download,
  Boxes,
  ChevronRight,
  Cpu,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import type { MaterialRecord, NavigationPage, UserRole } from '../types';
import { SAMPLE_CPSES } from '../services/sampleData';
import { materialStore } from '../services/materialStore';

interface MaterialRecordsProps {
  records: MaterialRecord[];
  currentRole?: UserRole;
  onNavigate?: (page: NavigationPage) => void;
}

export const MaterialRecordsPage: React.FC<MaterialRecordsProps> = ({
  records,
  currentRole: _currentRole = 'expert',
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeRecord, setActiveRecord] = useState<MaterialRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveRecord(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = Array.from(new Set(records.map(r => r.category))).sort();

  // Unified canonical status mapping
  const getNormalizedStatus = (record: MaterialRecord): 'Harmonized' | 'Suggested' | 'Pending' | 'Modified' | 'Rejected' => {
    if (record.status === 'harmonized' || record.cnmcCode) {
      return 'Harmonized';
    }
    if (record.status === 'matched') {
      return 'Suggested';
    }
    if (record.status === 'under_review') {
      return 'Modified';
    }
    if (record.status === 'distinct') {
      return 'Rejected';
    }
    return 'Pending';
  };

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const q = searchQuery.toLowerCase().trim();
    const normalizedStatus = getNormalizedStatus(rec);

    const matchesSearch = !q || (
      rec.legacyCode.toLowerCase().includes(q) ||
      rec.description.toLowerCase().includes(q) ||
      (rec.standardizedDescription && rec.standardizedDescription.toLowerCase().includes(q)) ||
      rec.cpseName.toLowerCase().includes(q) ||
      rec.category.toLowerCase().includes(q) ||
      rec.unitOfMeasure.toLowerCase().includes(q) ||
      (rec.cnmcCode && rec.cnmcCode.toLowerCase().includes(q))
    );

    const matchesOrg = selectedOrg === 'all' || rec.cpseId === selectedOrg || rec.cpseName.toLowerCase().includes(selectedOrg.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || normalizedStatus.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesOrg && matchesCategory && matchesStatus;
  });

  const handleCopy = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Organization',
      'Material Code',
      'Material',
      'Category',
      'CNMC',
      'Status'
    ];

    const rows = filteredRecords.map(r => [
      `"${r.cpseName}"`,
      `"${r.legacyCode}"`,
      `"${r.description.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.cnmcCode || ''}"`,
      `"${getNormalizedStatus(r)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `matquanta_materials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (status: 'Harmonized' | 'Suggested' | 'Pending' | 'Modified' | 'Rejected') => {
    switch (status) {
      case 'Harmonized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Harmonized</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Pending</span>
          </span>
        );
      case 'Suggested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-[#06B6D4] border border-cyan-200 shrink-0">
            <Sparkles className="w-3 h-3 text-[#06B6D4] shrink-0" />
            <span>Suggested</span>
          </span>
        );
      case 'Modified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
            <Edit3 className="w-3 h-3 text-purple-600 shrink-0" />
            <span>Modified</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Helper to retrieve detailed cross-CPSE mappings for the active material
  const getCrossCpseMappings = (record: MaterialRecord) => {
    if (record.cnmcCode) {
      const masterList = materialStore.getUnifiedMaster();
      const master = masterList.find(m => m.cnmcCode === record.cnmcCode);
      if (master && master.cpseMappings && master.cpseMappings.length > 0) {
        return master.cpseMappings;
      }
    }

    const otherRecords = records.filter(r => 
      r.id !== record.id && 
      ((record.cnmcCode && r.cnmcCode === record.cnmcCode) ||
       (r.category === record.category && r.unitOfMeasure === record.unitOfMeasure))
    ).slice(0, 3);

    return otherRecords.map(r => ({
      cpseName: r.cpseName,
      cpseCode: r.cpseName,
      legacyItemCode: r.legacyCode,
      originalDescription: r.description,
      uom: r.unitOfMeasure,
      erpSystem: r.dataSource === 'SAP / ERP' ? 'SAP S/4HANA' : 'Enterprise ERP',
      mappedDate: '2026-03-28'
    }));
  };

  // Helper to retrieve AI match candidate info for the active material
  const getAiMatchDetails = (record: MaterialRecord) => {
    const matches = materialStore.getMatches();
    const candidate = matches.find(m => 
      m.sourceRecord.id === record.id || 
      m.targetRecord.id === record.id ||
      (record.cnmcCode && m.proposedCNMC === record.cnmcCode)
    );

    if (candidate) {
      return {
        matchType: candidate.matchType,
        confidenceLevel: candidate.confidenceLevel,
        similarityScore: Math.round(candidate.similarityScore * 100),
        semanticScore: Math.round(candidate.semanticScore * 100),
        attributeMatchScore: Math.round(candidate.attributeMatchScore * 100),
        matchingAttributes: candidate.matchingAttributes,
        aiExplanation: candidate.matchRationale || candidate.aiExplanation?.join(' ') || 'Semantic vector similarity calculated using Sentence-BERT embeddings. Normalized component geometry, nominal sizing and pressure ratings align across enterprises.'
      };
    }

    const isHarmonized = !!record.cnmcCode;
    return {
      matchType: isHarmonized ? 'Identical' : 'Duplicate',
      confidenceLevel: isHarmonized ? 'HIGH' : 'MEDIUM',
      similarityScore: isHarmonized ? 96 : 88,
      semanticScore: isHarmonized ? 97 : 89,
      attributeMatchScore: isHarmonized ? 95 : 86,
      matchingAttributes: Object.keys(record.specifications || {}),
      aiExplanation: 'NLP entity extraction normalized abbreviations, standardized dimensional units (inches to mm), and matched technical parameters against ISO/ASME catalog taxonomy.'
    };
  };

  // Helper to build concise secondary specs text
  const getSecondarySpecsText = (record: MaterialRecord) => {
    if (record.specifications && Object.keys(record.specifications).length > 0) {
      return Object.entries(record.specifications)
        .slice(0, 3)
        .map(([_, v]) => v)
        .join(' • ');
    }
    return record.standardizedDescription || 'Catalog Technical Master Spec';
  };

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      {/* 1. Spacious Search & Filter Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Catalog Exploration</span>
            <div className="text-sm sm:text-base font-bold text-[#17202A] mt-0.5">
              Filter and search across <span className="font-mono text-[#06B6D4]">{filteredRecords.length}</span> recorded materials
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#17202A] rounded-xl text-xs font-semibold border border-[#E2E8F0] transition-colors flex items-center gap-2 shadow-2xs"
              title="Export filtered records as CSV"
            >
              <Download className="w-4 h-4 text-[#06B6D4]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
          {/* Main Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by material description, original code, or CNMC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-[#17202A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:bg-white transition-all font-normal"
            />
          </div>

          {/* Filters Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0 lg:w-auto">
            {/* Organization Filter */}
            <div className="min-w-[140px]">
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#17202A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] font-medium"
              >
                <option value="all">All Organizations</option>
                {SAMPLE_CPSES.map((cpse) => (
                  <option key={cpse.id} value={cpse.code}>
                    {cpse.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="min-w-[150px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#17202A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] font-medium truncate"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="min-w-[130px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#17202A] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="Harmonized">Harmonized</option>
                <option value="Suggested">Suggested</option>
                <option value="Pending">Pending</option>
                <option value="Modified">Modified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          {(searchQuery || selectedOrg !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedOrg('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="text-xs text-[#06B6D4] hover:text-cyan-700 font-semibold px-2 py-1 underline shrink-0 self-center"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 2. DESKTOP & TABLET VIEW: Spacious, Clean Material Browsing Table (Exact 7 Columns with Primary/Secondary Hierarchy) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden w-full">
        <table className="w-full table-fixed text-left text-xs border-collapse">
          <thead className="bg-[#F8FAFC] text-[#17202A] font-semibold border-b border-[#E2E8F0]">
            <tr>
              <th className="py-4 px-5 w-[130px] text-left">Organization</th>
              <th className="py-4 px-5 w-[150px] text-left">Material Code</th>
              <th className="py-4 px-5 w-auto text-left">Material</th>
              <th className="py-4 px-5 w-[160px] text-left">Category</th>
              <th className="py-4 px-5 w-[140px] text-left">CNMC</th>
              <th className="py-4 px-5 w-[130px] text-left">Status</th>
              <th className="py-4 px-5 w-[110px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-[#64748B]">
                  <Boxes className="w-10 h-10 mx-auto mb-2.5 text-slate-300" />
                  <p className="font-semibold text-[#17202A] text-sm">No matching materials found</p>
                  <p className="text-xs text-[#64748B] mt-1">Try adjusting your search query or filters.</p>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const normalizedStatus = getNormalizedStatus(record);
                const isSelected = activeRecord?.id === record.id;
                const secondarySpecs = getSecondarySpecsText(record);

                return (
                  <tr
                    key={record.id}
                    onClick={() => setActiveRecord(record)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      isSelected ? 'bg-cyan-50/50' : ''
                    }`}
                  >
                    {/* 1. Organization: Primary Code + Secondary Org Name */}
                    <td className="py-4 px-5 align-middle">
                      <div className="font-bold text-[#17202A] text-sm">
                        {record.cpseName}
                      </div>
                      <div className="text-xs text-[#64748B] truncate mt-1">
                        {record.dataSource === 'SAP / ERP' ? 'Enterprise ERP' : 'Plant Master'}
                      </div>
                    </td>

                    {/* 2. Material Code: Primary Code + Secondary UOM */}
                    <td className="py-4 px-5 align-middle text-left">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[#17202A] font-bold text-xs">
                        <span className="truncate">{record.legacyCode}</span>
                        <button
                          onClick={(e) => handleCopy(record.legacyCode, e)}
                          className="text-[#64748B] hover:text-[#06B6D4] p-0.5 rounded transition-colors"
                          title="Copy original code"
                        >
                          {copiedCode === record.legacyCode ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-[#64748B] font-mono mt-1">
                        UOM: {record.unitOfMeasure}
                      </div>
                    </td>

                    {/* 3. Material: Primary Description + Secondary Technical Attributes */}
                    <td className="py-4 px-5 align-middle min-w-0">
                      <div 
                        className="font-semibold text-[#17202A] text-sm truncate leading-snug"
                        title={record.description}
                      >
                        {record.description}
                      </div>
                      <div 
                        className="text-xs text-[#64748B] truncate mt-1 leading-normal"
                        title={secondarySpecs}
                      >
                        {secondarySpecs}
                      </div>
                    </td>

                    {/* 4. Category: Primary Category + Secondary Subcategory */}
                    <td className="py-4 px-5 align-middle min-w-0">
                      <div className="font-semibold text-[#17202A] text-sm truncate" title={record.category}>
                        {record.category}
                      </div>
                      <div className="text-xs text-[#64748B] truncate mt-1 leading-normal" title={record.subCategory}>
                        {record.subCategory || 'General Spares'}
                      </div>
                    </td>

                    {/* 5. CNMC: Subtle neutral/outlined badge */}
                    <td className="py-4 px-5 align-middle text-left">
                      {record.cnmcCode ? (
                        <div>
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-medium text-[#17202A] bg-slate-100 border border-[#E2E8F0]">
                            {record.cnmcCode}
                          </span>
                          <span className="block text-[11px] text-[#64748B] mt-1">Unified Master</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[#64748B] text-xs italic">Unassigned</span>
                          <span className="block text-[11px] text-[#64748B] mt-1">Local Master</span>
                        </div>
                      )}
                    </td>

                    {/* 6. Status: Clear subtle status badge */}
                    <td className="py-4 px-5 align-middle text-left">
                      {renderStatusBadge(normalizedStatus)}
                    </td>

                    {/* 7. Action: View Details */}
                    <td className="py-4 px-5 align-middle text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRecord(record);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#06B6D4] hover:text-cyan-700 hover:underline px-2 py-1 rounded transition-colors"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. MOBILE VIEW: Clean Stacked Material Cards (Screens < 768px) */}
      <div className="md:hidden space-y-3 w-full">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#E2E8F0] text-[#64748B]">
            <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-[#17202A] text-xs">No matching materials found</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">Try clearing your search or filters.</p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const normalizedStatus = getNormalizedStatus(record);
            const secondarySpecs = getSecondarySpecsText(record);

            return (
              <div
                key={record.id}
                onClick={() => setActiveRecord(record)}
                className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2.5 active:bg-slate-50 transition-colors cursor-pointer"
              >
                {/* Top Row: Organization & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs font-mono text-[#17202A] bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {record.cpseName}
                    </span>
                    <span className="ml-2 font-mono text-[11px] text-[#64748B]">
                      {record.legacyCode}
                    </span>
                  </div>
                  {renderStatusBadge(normalizedStatus)}
                </div>

                {/* Material Primary & Secondary */}
                <div>
                  <div className="text-xs font-semibold text-[#17202A] leading-snug">
                    {record.description}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    {secondarySpecs}
                  </div>
                </div>

                {/* Category & CNMC */}
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#E2E8F0] text-[#64748B]">
                  <span>{record.category} • UOM: {record.unitOfMeasure}</span>
                  {record.cnmcCode ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium text-[#17202A] bg-slate-100 border border-[#E2E8F0]">
                      {record.cnmcCode}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#64748B] italic">Unassigned</span>
                  )}
                </div>

                {/* View Details Link */}
                <div className="pt-1 flex items-center justify-end text-[11px] text-[#06B6D4] font-semibold">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. RIGHT-SIDE DETAIL DRAWER (Opens on clicking any material row) */}
      {activeRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex justify-end z-50 animate-in fade-in duration-150">
          {/* Drawer Backdrop Click to Close */}
          <div 
            className="flex-1 hidden sm:block" 
            onClick={() => setActiveRecord(null)}
            aria-label="Close detail view"
          />

          {/* Drawer Body Panel */}
          <div className="w-full max-w-xl sm:max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E2E8F0] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F5F7FA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#17202A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  MQ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#17202A] text-sm">Material Specification Detail</h3>
                    <span className="font-mono text-xs font-bold text-[#17202A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {activeRecord.cpseName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-mono text-[#64748B]">Code: {activeRecord.legacyCode}</span>
                    <button
                      onClick={(e) => handleCopy(activeRecord.legacyCode, e)}
                      className="text-[#64748B] hover:text-[#06B6D4] p-0.5 rounded"
                      title="Copy code"
                    >
                      {copiedCode === activeRecord.legacyCode ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {renderStatusBadge(getNormalizedStatus(activeRecord))}
                <button
                  onClick={() => setActiveRecord(null)}
                  className="text-[#64748B] hover:text-[#17202A] p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Section 1: Descriptions */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Original Description
                  </span>
                  <div className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E2E8F0] text-[#17202A] font-semibold text-xs leading-relaxed">
                    "{activeRecord.description}"
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider block">
                    Standardized Description (AI Canonical)
                  </span>
                  <div className="p-3 bg-cyan-50/40 rounded-xl border border-cyan-200 text-[#17202A] font-medium text-xs leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                    <span>
                      {activeRecord.standardizedDescription || `${activeRecord.description} (Standardized)`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Technical Specifications & Attributes */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Technical Specifications & Normalized Attributes
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">UOM: <strong>{activeRecord.unitOfMeasure}</strong></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Category</span>
                    <span className="font-semibold text-[#17202A] text-xs truncate block">{activeRecord.category}</span>
                  </div>

                  <div className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">Subcategory</span>
                    <span className="font-semibold text-[#17202A] text-xs truncate block">{activeRecord.subCategory || 'General Spares'}</span>
                  </div>

                  <div className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] uppercase block">UOM</span>
                    <span className="font-mono font-bold text-[#17202A] text-xs">{activeRecord.unitOfMeasure}</span>
                  </div>

                  {activeRecord.specifications && Object.entries(activeRecord.specifications).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#64748B] uppercase block capitalize">{key}</span>
                      <span className="font-semibold text-[#17202A] text-xs truncate block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: CNMC & National Standardization Identity */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Common National Material Code (CNMC)
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    National Level Harmonization
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#06B6D4]" />
                    <div>
                      <div className="font-mono font-bold text-sm text-[#17202A]">
                        {activeRecord.cnmcCode || 'CNMC-PENDING'}
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        {activeRecord.cnmcCode ? 'Authoritative Master Key' : 'Awaiting Expert Validation in Harmonization Center'}
                      </div>
                    </div>
                  </div>

                  {activeRecord.cnmcCode && (
                    <button
                      onClick={(e) => handleCopy(activeRecord.cnmcCode!, e)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#06B6D4] hover:bg-cyan-50 rounded border border-cyan-200 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Section 4: AI Matching & Similarity Analysis */}
              {(() => {
                const ai = getAiMatchDetails(activeRecord);
                return (
                  <div className="space-y-3 p-4 bg-cyan-50/40 rounded-xl border border-cyan-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#17202A]">
                        <Cpu className="w-4 h-4 text-[#06B6D4]" />
                        <span>AI Matching & Similarity Analysis</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#06B6D4] bg-white px-2 py-0.5 rounded border border-cyan-200">
                        {ai.matchType} Match
                      </span>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 bg-white rounded-lg border border-cyan-100 text-center">
                        <span className="text-[10px] text-[#64748B] block">Semantic</span>
                        <span className="font-mono font-bold text-[#06B6D4] text-sm">{ai.semanticScore}%</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-cyan-100 text-center">
                        <span className="text-[10px] text-[#64748B] block">Attributes</span>
                        <span className="font-mono font-bold text-[#06B6D4] text-sm">{ai.attributeMatchScore}%</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-cyan-100 text-center">
                        <span className="text-[10px] text-[#64748B] block">Confidence</span>
                        <span className="font-mono font-bold text-emerald-700 text-sm">{ai.similarityScore}%</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#17202A] leading-relaxed bg-white/80 p-2.5 rounded-lg border border-cyan-100">
                      <strong>AI Rationale:</strong> {ai.aiExplanation}
                    </div>
                  </div>
                );
              })()}

              {/* Section 5: Cross-CPSE Mappings Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Associated CPSE Legacy Records
                  </span>
                  <span className="text-[11px] text-[#64748B]">Multi-enterprise traceability</span>
                </div>

                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase">
                        <th className="py-2 px-3">CPSE</th>
                        <th className="py-2 px-3">Legacy Code</th>
                        <th className="py-2 px-3">Original Description</th>
                        <th className="py-2 px-2 text-center">UOM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {getCrossCpseMappings(activeRecord).map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-[#17202A] whitespace-nowrap">
                            {m.cpseName}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#06B6D4] whitespace-nowrap">
                            {m.legacyItemCode}
                          </td>
                          <td className="py-2.5 px-3 text-[#64748B] text-[11px] max-w-[200px] truncate" title={m.originalDescription}>
                            {m.originalDescription}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-[11px] text-[#17202A]">
                            {m.uom}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#64748B]">
                Preserving CPSE legacy inventory history
              </span>
              <div className="flex items-center gap-2">
                {onNavigate && (
                  <button
                    onClick={() => {
                      setActiveRecord(null);
                      onNavigate('matching');
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#17202A] rounded-xl text-xs font-semibold border border-[#E2E8F0] transition-colors flex items-center gap-1.5"
                  >
                    <span>Harmonization Center</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#06B6D4]" />
                  </button>
                )}
                <button
                  onClick={() => setActiveRecord(null)}
                  className="px-4 py-2 bg-[#17202A] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
