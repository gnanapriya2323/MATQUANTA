import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Server, 
  Plus, 
  Send, 
  X, 
  ChevronRight,
  Building2,
  Database
} from 'lucide-react';
import type { NavigationPage, UserRole } from '../types';

interface CPSEOnboardingPageProps {
  currentRole?: UserRole;
  onNavigate?: (page: NavigationPage) => void;
}

interface CpseDetail {
  code: string;
  name: string;
  shortDescription?: string;
  sector: string;
  materialsCount: number;
  harmonizedMaterials: number;
  pendingMaterials: number;
  dataStatus: 'Active' | 'Verified' | 'Pending Ingest';
  // Detail section fields:
  materialMasterData: string;
  erpSystem: string;
  dataSource: string;
  uploadApiStatus: string;
  integrationStatus: string;
}

export const CPSEOnboardingPage: React.FC<CPSEOnboardingPageProps> = ({
  currentRole = 'expert'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<CpseDetail | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Representative CPSE data including BHEL, ONGC, NTPC, SAIL, CPCL
  const [organizations, setOrganizations] = useState<CpseDetail[]>([
    {
      code: 'BHEL',
      name: 'Bharat Heavy Electricals Limited',
      shortDescription: 'Premier heavy power generation equipment & industrial turbines manufacturer.',
      sector: 'Heavy Engineering & Power Equipment',
      materialsCount: 19,
      harmonizedMaterials: 10,
      pendingMaterials: 9,
      dataStatus: 'Active',
      materialMasterData: 'SAP Material Master (MARA/MAKT extraction)',
      erpSystem: 'SAP ECC 6.0 / S/4HANA',
      dataSource: 'REST RFC Connector & Secure CSV Pipeline',
      uploadApiStatus: 'Sync Complete • 19 Master Records Ingested',
      integrationStatus: 'Architecture Ready — Demonstration'
    },
    {
      code: 'ONGC',
      name: 'Oil & Natural Gas Corporation',
      shortDescription: 'Upstream exploration, drilling rigs and offshore crude extraction infrastructure.',
      sector: 'Hydrocarbons Exploration & Production',
      materialsCount: 17,
      harmonizedMaterials: 11,
      pendingMaterials: 6,
      dataStatus: 'Active',
      materialMasterData: 'SAP IS-Oil Upstream Master Catalog',
      erpSystem: 'SAP S/4HANA Enterprise',
      dataSource: 'OData API Services / Batch Extraction',
      uploadApiStatus: 'Sync Complete • 17 Master Records Ingested',
      integrationStatus: 'Architecture Ready — Demonstration'
    },
    {
      code: 'NTPC',
      name: 'National Thermal Power Corporation',
      shortDescription: 'Thermal boiler spares, turbine auxiliaries and renewable generation infrastructure.',
      sector: 'Thermal & Renewable Power Generation',
      materialsCount: 15,
      harmonizedMaterials: 4,
      pendingMaterials: 11,
      dataStatus: 'Active',
      materialMasterData: 'Enterprise Plant Maintenance & MM Catalog',
      erpSystem: 'SAP S/4HANA 2023',
      dataSource: 'Enterprise REST Endpoints',
      uploadApiStatus: 'Sync Complete • 15 Master Records Ingested',
      integrationStatus: 'Architecture Ready — Demonstration'
    },
    {
      code: 'SAIL',
      name: 'Steel Authority of India Limited',
      shortDescription: 'Integrated blast furnaces, metallurgy refractories and rolling mill spare parts.',
      sector: 'Iron, Steel & Metallurgy',
      materialsCount: 16,
      harmonizedMaterials: 7,
      pendingMaterials: 9,
      dataStatus: 'Active',
      materialMasterData: 'Oracle Material Master & Spares Inventory',
      erpSystem: 'Oracle ERP Cloud',
      dataSource: 'REST Integration Gateway & Excel Ingest',
      uploadApiStatus: 'Sync Complete • 16 Master Records Ingested',
      integrationStatus: 'Architecture Ready — Demonstration'
    },
    {
      code: 'CPCL',
      name: 'Chennai Petroleum Corporation Limited',
      shortDescription: 'Refining distillation units, piping loops, hydrocarbon valves and sealing gaskets.',
      sector: 'Refining & Petrochemical Processing',
      materialsCount: 11,
      harmonizedMaterials: 3,
      pendingMaterials: 8,
      dataStatus: 'Verified',
      materialMasterData: 'Refinery Spares & Consumables Catalog',
      erpSystem: 'SAP ERP Central Component',
      dataSource: 'Automated CSV / Excel Ingestion',
      uploadApiStatus: 'Sync Complete • 11 Master Records Ingested',
      integrationStatus: 'Architecture Ready — Demonstration'
    }
  ]);

  // Form State for Admin role registration
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newErp, setNewErp] = useState('SAP S/4HANA');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newOrg: CpseDetail = {
      code: newCode.toUpperCase(),
      name: newName,
      shortDescription: newSector ? `${newSector} public sector enterprise.` : 'Central Public Sector Enterprise.',
      sector: newSector || 'Central Public Sector Enterprise',
      materialsCount: 10,
      harmonizedMaterials: 0,
      pendingMaterials: 10,
      dataStatus: 'Verified',
      materialMasterData: 'Standard SAP/ERP MM Schema',
      erpSystem: newErp,
      dataSource: 'Secure Data Pipeline (Staged)',
      uploadApiStatus: 'Configured & Validated',
      integrationStatus: 'Architecture Ready — Demonstration'
    };

    setOrganizations(prev => [...prev, newOrg]);
    setNewCode('');
    setNewName('');
    setNewSector('');
    setShowRegisterModal(false);
  };

  const filteredOrgs = organizations.filter(o => {
    const q = searchQuery.toLowerCase().trim();
    return !q || o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q) || o.sector.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* 1. Page Header with Comfortable Spacing */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#17202A]">Participating Organizations</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-[#06B6D4] border border-cyan-200">
                CPSE Network
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Central Public Sector Enterprises onboarded to the National Material Harmonization network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'admin' && (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 bg-[#06B6D4] hover:bg-cyan-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard CPSE</span>
              </button>
            )}
          </div>
        </div>

        {/* Informational Sub-banner */}
        <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs text-[#17202A] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#06B6D4] shrink-0" />
            <span className="text-[11px] text-[#64748B]">
              Federated CPSE Network: BHEL, ONGC, NTPC, SAIL, CPCL. Enterprise ERP connectors active for cross-enterprise harmonization.
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-[#E2E8F0] self-start sm:self-auto">
            PROTOTYPE READY
          </span>
        </div>
      </div>

      {/* 2. Search Toolbar with Generous Height */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search organizations by name, code (e.g. BHEL, ONGC, NTPC, SAIL, CPCL), or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[#17202A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] font-medium text-xs transition-all"
          />
        </div>
      </div>

      {/* 3. Clean Organization Cards in 3 Columns on Desktop (As Requested by User) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrgs.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-[#E2E8F0] text-center text-xs text-[#64748B]">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-[#17202A]">No participating organizations match your query.</p>
          </div>
        ) : (
          filteredOrgs.map((org) => {
            const percent = Math.round((org.harmonizedMaterials / org.materialsCount) * 100);

            return (
              <div
                key={org.code}
                onClick={() => setSelectedOrg(org)}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-[#06B6D4] hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between cursor-pointer space-y-4 group"
              >
                {/* Top Section: Code & Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-[#17202A] border border-[#E2E8F0]">
                      {org.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{org.dataStatus}</span>
                    </span>
                  </div>

                  {/* Organization Name (Primary) & Short Description (Secondary) */}
                  <div className="pt-1">
                    <h3 className="font-bold text-sm text-[#17202A] leading-snug group-hover:text-[#06B6D4] transition-colors">
                      {org.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                      {org.shortDescription || org.sector}
                    </p>
                  </div>
                </div>

                {/* Middle Ingestion & Harmonization Stats Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0] space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#64748B] uppercase font-bold block">Material Count</span>
                      <span className="font-bold font-mono text-sm text-[#17202A]">{org.materialsCount}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-emerald-700 uppercase font-bold block">Mapped Materials</span>
                      <span className="font-bold font-mono text-sm text-emerald-700">{org.harmonizedMaterials}</span>
                    </div>
                  </div>

                  {/* Harmonization Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>Harmonization Rate</span>
                      <span className="font-mono font-bold text-[#17202A]">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#06B6D4] h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>

                {/* Footer: ERP System & View Details */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#64748B] truncate max-w-[170px]" title={org.erpSystem}>
                    {org.erpSystem}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrg(org);
                    }}
                    className="text-xs font-bold text-[#06B6D4] hover:text-cyan-700 flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Right-side Integration Details Drawer (Opens on clicking any organization card) */}
      {selectedOrg && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 transition-opacity"
            onClick={() => setSelectedOrg(null)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[42vw] xl:w-[40vw] bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col transform transition-transform duration-200 ease-in-out">
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-slate-50/90 border-b border-[#E2E8F0] flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#17202A] border border-[#E2E8F0]">
                    {selectedOrg.code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{selectedOrg.dataStatus}</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#17202A] leading-snug">
                  {selectedOrg.name}
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  {selectedOrg.sector}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Ingestion & Harmonization Stats */}
              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-2">
                  Catalog Ingestion Metrics
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Total Ingested</span>
                    <span className="font-bold text-[#17202A] font-mono text-base">{selectedOrg.materialsCount}</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                    <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Harmonized</span>
                    <span className="font-bold text-emerald-700 font-mono text-base">{selectedOrg.harmonizedMaterials}</span>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                    <span className="text-[10px] text-amber-700 uppercase font-semibold block">Pending</span>
                    <span className="font-bold text-amber-700 font-mono text-base">{selectedOrg.pendingMaterials}</span>
                  </div>
                </div>
              </div>

              {/* ERP & Technical Ingestion Specifications */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                  ERP & Pipeline Integration Specs
                </span>

                {/* 1. Material Master Data */}
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">Material Master Schema</span>
                  <div className="font-semibold text-[#17202A] text-xs">
                    {selectedOrg.materialMasterData}
                  </div>
                </div>

                {/* 2. ERP System */}
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">Core ERP / SAP Platform</span>
                  <div className="font-semibold text-[#17202A] text-xs font-mono">
                    {selectedOrg.erpSystem}
                  </div>
                </div>

                {/* 3. Data Source */}
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">Ingestion Data Source & Pipeline</span>
                  <div className="font-semibold text-[#17202A] text-xs">
                    {selectedOrg.dataSource}
                  </div>
                </div>

                {/* 4. Upload / API Status */}
                <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase block">Sync & API Status</span>
                  <div className="font-semibold text-emerald-800 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedOrg.uploadApiStatus}</span>
                  </div>
                </div>

                {/* 5. Integration Status */}
                <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-200 space-y-1">
                  <span className="text-[10px] font-bold text-[#06B6D4] uppercase block">Architecture Readiness</span>
                  <div className="font-bold text-cyan-950 text-xs flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{selectedOrg.integrationStatus}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] font-normal pt-1">
                    Connector schema validated against standard SAP BAPI/IDoc and REST MM endpoints. Demonstration prototype.
                  </p>
                </div>
              </div>

              {/* Data Compliance & Federation Note */}
              <div className="p-3 bg-slate-50 rounded-xl border border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#64748B]">
                <Database className="w-4 h-4 text-[#06B6D4] shrink-0" />
                <span>
                  Registered in federated catalog under National Public Sector Procurement Guidelines.
                </span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelectedOrg(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#17202A] rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Onboarding Modal for Admin */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-[#E2E8F0] overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="font-bold text-[#17202A] text-sm">Register Participating CPSE</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">CPSE Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GAIL, IOCL"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[#17202A] focus:ring-2 focus:ring-[#06B6D4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gas Authority of India Limited"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[#17202A] focus:ring-2 focus:ring-[#06B6D4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Natural Gas Transmission"
                  value={newSector}
                  onChange={e => setNewSector(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[#17202A] focus:ring-2 focus:ring-[#06B6D4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">ERP System</label>
                <select
                  value={newErp}
                  onChange={e => setNewErp(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[#17202A]"
                >
                  <option value="SAP S/4HANA">SAP S/4HANA</option>
                  <option value="SAP ECC 6.0">SAP ECC 6.0</option>
                  <option value="Oracle ERP Cloud">Oracle ERP Cloud</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-100 text-[#64748B] rounded-xl font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#06B6D4] hover:bg-cyan-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Register CPSE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
