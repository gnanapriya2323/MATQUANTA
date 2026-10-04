import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  Package,
  Building2,
  FileCheck
} from 'lucide-react';
import type { NavigationPage, UserRole } from '../types';

interface UnifiedMasterPageProps {
  currentRole?: UserRole;
  onNavigate?: (page: NavigationPage) => void;
}

interface CnmcRecord {
  cnmcCode: string;
  standardDescription: string;
  shortDescription?: string;
  category: string;
  subCategory: string;
  uom: string;
  technicalAttributes: Record<string, string>;
  cpseMappings: {
    cpse: string;
    code: string;
    originalDescription: string;
  }[];
  legacyCodes: string[];
  approvalStatus: 'Approved' | 'Pending Expert Approval' | 'Under Review';
  lastUpdated: string;
  approvedBy: string;
}

export const UnifiedMasterPage: React.FC<UnifiedMasterPageProps> = ({ currentRole = 'expert' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCnmc, setSelectedCnmc] = useState<CnmcRecord | null>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCnmc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cnmcCatalog: CnmcRecord[] = [
    {
      cnmcCode: 'CNMC-000001',
      standardDescription: 'Stainless Steel Ball Valve – 50 mm',
      shortDescription: 'Industrial full bore flanged ball valve, ASTM CF8M metallurgy',
      category: 'Valves & Actuators',
      subCategory: 'Ball Valves',
      uom: 'NOS',
      technicalAttributes: {
        'Material Grade': 'ASTM A351 CF8M (SS316)',
        'Nominal Size': '50 mm (2 Inch NB)',
        'Pressure Class': 'ASME Class 150',
        'End Connection': 'Flanged RF (ASME B16.5)',
        'Bore Type': 'Full Bore',
        'Seat / Seal': 'PTFE / RPTFE'
      },
      cpseMappings: [
        { cpse: 'BHEL', code: 'MAT1001', originalDescription: 'SS BALL VALVE 2IN FLG' },
        { cpse: 'ONGC', code: '458721', originalDescription: '2 INCH STAINLESS STEEL BALL VALVE' },
        { cpse: 'SAIL', code: 'PV2034', originalDescription: 'STAINLESS STEEL BALL VALVE 50MM' }
      ],
      legacyCodes: ['MAT1001', '458721', 'PV2034'],
      approvalStatus: 'Approved',
      lastUpdated: '2026-03-28',
      approvedBy: 'Dr. V. Raman (Lead Domain Expert)'
    },
    {
      cnmcCode: 'CNMC-000002',
      standardDescription: 'Deep Groove Radial Ball Bearing 6205',
      shortDescription: 'Deep groove ball bearing, single row, metric series ISO 6205',
      category: 'Bearings & Bushings',
      subCategory: 'Ball Bearings',
      uom: 'NOS',
      technicalAttributes: {
        'Designation': 'ISO 6205 Single Row',
        'Bore Diameter': '25 mm ID',
        'Outer Diameter': '52 mm OD',
        'Width': '15 mm W',
        'Material': 'High-Carbon Chromium Bearing Steel'
      },
      cpseMappings: [
        { cpse: 'BHEL', code: 'BHE-B-6205', originalDescription: 'RADIAL BALL BEARING 6205' },
        { cpse: 'NTPC', code: 'NTP-BRG-6205', originalDescription: 'BEARING DEEP GROOVE 6205' }
      ],
      legacyCodes: ['BHE-B-6205', 'NTP-BRG-6205'],
      approvalStatus: 'Approved',
      lastUpdated: '2026-03-29',
      approvedBy: 'Dr. V. Raman (Lead Domain Expert)'
    },
    {
      cnmcCode: 'CNMC-000003',
      standardDescription: 'Seamless Carbon Steel Pipe – 150 mm (6 Inch)',
      shortDescription: 'Seamless carbon steel line pipe, Schedule 40 wall, bevelled ends',
      category: 'Pipes & Tubes',
      subCategory: 'Seamless Steel Pipes',
      uom: 'MTR',
      technicalAttributes: {
        'Standard': 'ASTM A106 Grade B',
        'Nominal Size': '150 mm NB (6 Inch)',
        'Schedule': 'SCH 40 (7.11 mm wall)',
        'End Preparation': 'Bevelled Ends (ASME B16.25)'
      },
      cpseMappings: [
        { cpse: 'ONGC', code: 'ONG-P-6040', originalDescription: 'PIPE CS SMLS 6IN SCH40 BE' },
        { cpse: 'CPCL', code: 'CPC-PIPE-150', originalDescription: 'SEAMLESS CARBON STEEL PIPE 150MM SCH40' }
      ],
      legacyCodes: ['ONG-P-6040', 'CPC-PIPE-150'],
      approvalStatus: 'Approved',
      lastUpdated: '2026-03-30',
      approvedBy: 'Technical Harmonization Board'
    },
    {
      cnmcCode: 'CNMC-000004',
      standardDescription: 'Spiral Wound Gasket 50 mm (2 Inch) Class 150',
      shortDescription: 'Spiral wound metallic gasket with carbon steel centering ring',
      category: 'Gaskets & Sealing',
      subCategory: 'Metallic Gaskets',
      uom: 'NOS',
      technicalAttributes: {
        'Standard': 'ASME B16.20',
        'Flange Rating': 'Class 150 RF',
        'Winding Material': 'SS316 with Flexible Graphite',
        'Centering Ring': 'Carbon Steel'
      },
      cpseMappings: [
        { cpse: 'SAIL', code: 'SAL-G-200', originalDescription: 'GASKET SPWD SS316 2IN 150#' },
        { cpse: 'IOCL', code: 'IOC-GSK-050', originalDescription: 'SPIRAL WOUND GASKET 50MM CL150 RF' }
      ],
      legacyCodes: ['SAL-G-200', 'IOC-GSK-050'],
      approvalStatus: 'Approved',
      lastUpdated: '2026-03-31',
      approvedBy: 'Dr. V. Raman (Lead Domain Expert)'
    }
  ];

  const categories = Array.from(new Set(cnmcCatalog.map(c => c.category)));
  const totalLegacyCodes = cnmcCatalog.reduce((acc, c) => acc + c.legacyCodes.length, 0);

  const filtered = cnmcCatalog.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      item.cnmcCode.toLowerCase().includes(q) ||
      item.standardDescription.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.legacyCodes.some(c => c.toLowerCase().includes(q))
    );
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-5">
      {/* 1. Header Area with Comfortable Spacing */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17202A]">Standard Catalog</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-[#06B6D4] border border-cyan-200">
              Unified Material Master
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Authoritative Common National Material Codes (CNMC) consolidating multi-CPSE master records.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-[#17202A] shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
          <span>{cnmcCatalog.length} Authoritative Codes</span>
        </div>
      </div>

      {/* 2. Key Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Standard Items</span>
            <Package className="w-3.5 h-3.5 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#17202A]">{cnmcCatalog.length}</div>
          <div className="text-[11px] text-[#64748B]">CNMC Golden Records</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Categories</span>
            <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#17202A]">{categories.length}</div>
          <div className="text-[11px] text-[#64748B]">Domain Taxonomies</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Mapped CPSE Codes</span>
            <Building2 className="w-3.5 h-3.5 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#17202A]">{totalLegacyCodes}</div>
          <div className="text-[11px] text-[#64748B]">Preserved Legacy IDs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-semibold">Master Status</span>
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700">100%</div>
          <div className="text-[11px] text-emerald-700">Expert Validated</div>
        </div>
      </div>

      {/* 3. Search Bar with Comfortable Height & Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by CNMC Code (e.g. CNMC-000001), description, or legacy CPSE code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[#17202A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] font-medium text-xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-[#17202A] font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Clean 3-Column Card Layout on Desktop (As Requested by User) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-[#17202A]">No standard catalog materials match your search criteria.</p>
            <p className="text-[11px] text-[#64748B] mt-1">Try resetting the search or category filter.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const specSummary = Object.entries(item.technicalAttributes)
              .slice(0, 2)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' • ');

            return (
              <div
                key={item.cnmcCode}
                onClick={() => setSelectedCnmc(item)}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-[#06B6D4] hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer space-y-4 group"
              >
                {/* Card Top: CNMC & Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-[#17202A] border border-[#E2E8F0]">
                      {item.cnmcCode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{item.approvalStatus}</span>
                    </span>
                  </div>

                  {/* Standard Material Name (Primary) & Short Gray Description (Secondary) */}
                  <div className="pt-1">
                    <h3 className="font-bold text-sm text-[#17202A] leading-snug group-hover:text-[#06B6D4] transition-colors">
                      {item.standardDescription}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                      {item.shortDescription || `${item.category} • Standard national master inventory reference`}
                    </p>
                  </div>
                </div>

                {/* Specification Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Specification
                  </span>
                  <p className="text-xs font-semibold text-[#17202A] leading-relaxed">
                    {specSummary}
                  </p>
                </div>

                {/* Card Footer: UOM, Category, and View Details */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div className="space-y-0.5 text-[11px] text-[#64748B]">
                    <div>UOM: <strong className="text-[#17202A] font-mono">{item.uom}</strong></div>
                    <div>Category: <span className="text-[#17202A] font-medium">{item.category}</span></div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCnmc(item);
                    }}
                    className="text-xs font-bold text-[#06B6D4] hover:text-cyan-700 flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Right-side Detail Drawer (Opens on clicking any card) */}
      {selectedCnmc && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 transition-opacity"
            onClick={() => setSelectedCnmc(null)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] lg:w-[42vw] xl:w-[40vw] bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col transform transition-transform duration-200 ease-in-out">
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-50/90 border-b border-[#E2E8F0] flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#17202A] border border-[#E2E8F0]">
                    {selectedCnmc.cnmcCode}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{selectedCnmc.approvalStatus}</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#17202A] leading-snug">
                  {selectedCnmc.standardDescription}
                </h3>
              </div>

              <button
                onClick={() => setSelectedCnmc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Classification Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Category</span>
                  <span className="font-bold text-[#17202A] text-xs">{selectedCnmc.category}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Subcategory</span>
                  <span className="font-bold text-[#17202A] text-xs">{selectedCnmc.subCategory}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold block">UOM</span>
                  <span className="font-bold text-[#17202A] font-mono text-xs">{selectedCnmc.uom}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Last Updated</span>
                  <span className="font-medium text-[#17202A] text-xs">{selectedCnmc.lastUpdated}</span>
                </div>
              </div>

              {/* Standardized Technical Attributes */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#17202A]">
                  <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Standardized Technical Specifications</span>
                </div>
                <div className="bg-slate-50 rounded-xl border border-[#E2E8F0] p-3 space-y-2">
                  {Object.entries(selectedCnmc.technicalAttributes).map(([k, v]) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#E2E8F0] last:border-0 gap-1">
                      <span className="text-[11px] font-semibold text-[#64748B]">{k}</span>
                      <span className="text-xs font-bold text-[#17202A] sm:text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contributing CPSE Mappings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17202A]">
                    Mapped CPSE Items (Enterprise Traceability)
                  </span>
                  <span className="text-[10px] font-bold text-[#06B6D4] bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {selectedCnmc.cpseMappings.length} CPSE Sources
                  </span>
                </div>

                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase">
                        <th className="py-2 px-3">CPSE</th>
                        <th className="py-2 px-3">Code</th>
                        <th className="py-2 px-3">Original Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {selectedCnmc.cpseMappings.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-[#17202A] whitespace-nowrap">
                            {m.cpse}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#06B6D4] whitespace-nowrap">
                            {m.code}
                          </td>
                          <td className="py-2.5 px-3 text-[#64748B] text-[11px]">
                            {m.originalDescription}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Approval Authority & Metadata */}
              <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Approved Authority:</span>
                  <span className="font-bold text-[#17202A]">{selectedCnmc.approvedBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Legacy Ingestion Codes:</span>
                  <span className="font-mono font-semibold text-[#17202A]">{selectedCnmc.legacyCodes.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Repository Integrity:</span>
                  <span className="text-emerald-700 font-semibold">Immutable Master Record Verified</span>
                </div>
              </div>

              {/* Admin Governance Section */}
              {currentRole === 'admin' && (
                <div className="p-3.5 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17202A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
                      <span>Admin Catalog Governance</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#06B6D4] bg-white px-2 py-0.5 rounded border border-cyan-200">
                      Superuser
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Administrators can reassign contributing legacy codes, manage CNMC category rules, or reopen approved mappings.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => alert(`Mapping for ${selectedCnmc.cnmcCode} reopened for admin review.`)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#17202A] border border-[#E2E8F0] rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reopen / Reassign CNMC
                    </button>
                    <button
                      onClick={() => alert(`Audit log verified for ${selectedCnmc.cnmcCode}.`)}
                      className="px-3 py-1.5 bg-[#06B6D4] hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Audit Trail
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedCnmc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#17202A] rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
