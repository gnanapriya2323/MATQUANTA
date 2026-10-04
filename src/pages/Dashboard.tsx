import React from 'react';
import { 
  Building2, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  Wand2, 
  Layers, 
  Search, 
  ExternalLink,
  Cpu,
  Activity
} from 'lucide-react';
import type { DashboardStats, NavigationPage, UserRole } from '../types';

interface DashboardProps {
  stats?: DashboardStats;
  currentRole?: UserRole;
  onNavigate: (page: NavigationPage) => void;
  onTriggerMatching?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  currentRole = 'expert',
  onNavigate
}) => {
  const orgProgress = [
    { code: 'BHEL', name: 'Bharat Heavy Electricals Limited', sector: 'Heavy Engineering', harmonized: 10, total: 19, percent: 53, erp: 'SAP ECC 6.0' },
    { code: 'ONGC', name: 'Oil & Natural Gas Corporation', sector: 'Hydrocarbons', harmonized: 11, total: 17, percent: 65, erp: 'SAP S/4HANA' },
    { code: 'NTPC', name: 'National Thermal Power Corporation', sector: 'Power Generation', harmonized: 4, total: 15, percent: 27, erp: 'SAP S/4HANA' },
    { code: 'SAIL', name: 'Steel Authority of India Limited', sector: 'Metals & Metallurgy', harmonized: 7, total: 16, percent: 44, erp: 'Oracle ERP Cloud' },
    { code: 'CPCL', name: 'Chennai Petroleum Corporation Limited', sector: 'Refining', harmonized: 3, total: 11, percent: 27, erp: 'SAP ECC' },
    { code: 'GAIL', name: 'Gas Authority of India Limited', sector: 'Gas Transmission', harmonized: 4, total: 14, percent: 29, erp: 'SAP S/4HANA' },
    { code: 'IOCL', name: 'Indian Oil Corporation Limited', sector: 'Petrochemicals', harmonized: 3, total: 15, percent: 20, erp: 'SAP ECC 6.0' }
  ];

  const recentHarmonizationQueue = [
    { cnmc: 'CNMC-000001', name: 'Stainless Steel Ball Valve – 50 mm', category: 'Valves', cpses: ['BHEL', 'ONGC', 'SAIL'], type: 'Duplicate', confidence: 95, status: 'Pending Review' },
    { cnmc: 'CNMC-000002', name: 'Deep Groove Radial Ball Bearing 6205', category: 'Bearings', cpses: ['BHEL', 'NTPC'], type: 'Identical', confidence: 98, status: 'Approved' },
    { cnmc: 'CNMC-000003', name: 'Seamless Carbon Steel Pipe – 150 mm (6 Inch), SCH 40', category: 'Pipes', cpses: ['ONGC', 'CPCL'], type: 'Near-Duplicate', confidence: 92, status: 'Pending Review' },
    { cnmc: 'CNMC-000004', name: 'Spiral Wound Gasket 50 mm (2 Inch) Class 150', category: 'Gaskets', cpses: ['SAIL', 'IOCL'], type: 'Functionally Equivalent', confidence: 88, status: 'Pending Review' }
  ];

  const matchClassification = [
    { type: 'Identical', count: 8, percent: 16, color: 'bg-emerald-500' },
    { type: 'Duplicate', count: 10, percent: 20, color: 'bg-[#06B6D4]' },
    { type: 'Near-Duplicate', count: 16, percent: 32, color: 'bg-amber-500' },
    { type: 'Functionally Equivalent', count: 9, percent: 18, color: 'bg-purple-500' },
    { type: 'Distinct / Unique', count: 7, percent: 14, color: 'bg-slate-400' }
  ];

  // Derived counts
  const totalMaterials = stats?.totalMaterials || 108;
  const participatingOrgs = stats?.participatingCPSEs || 7;
  const pendingExpertReview = stats?.pendingValidation || 43;
  const cnmcCodes = stats?.commonNationalMaterialCodes || 33;

  // Overall Organization Progress metrics
  const totalHarmonized = orgProgress.reduce((acc, curr) => acc + curr.harmonized, 0);
  const totalItems = orgProgress.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercent = Math.round((totalHarmonized / totalItems) * 100);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. AI Harmonization Overview Card */}
      <div className="bg-gradient-to-r from-cyan-50/70 via-white to-cyan-50/40 p-6 sm:p-7 rounded-2xl border border-cyan-100/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/80 text-[#06B6D4] flex items-center justify-center border border-cyan-200/80 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17202A]">
                  AI Harmonization Overview
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100/80 text-cyan-800 border border-cyan-200">
                  Live Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                Cross-CPSE material deduplication, NLP standardization, and Common National Material Code (CNMC) metrics.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onNavigate('matching')}
            className="px-4 py-2.5 bg-[#06B6D4] hover:bg-cyan-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Harmonization Queue</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#17202A] ml-0.5">
              {pendingExpertReview}
            </span>
          </button>

          <button
            onClick={() => onNavigate('records')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#17202A] border border-[#E2E8F0] rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#64748B]" />
            <span>Material Explorer</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Key Material Statistics */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Catalog Records</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#17202A] flex items-center justify-center border border-[#E2E8F0]">
              <Package className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#17202A]">{totalMaterials}</div>
            <div className="text-xs text-[#64748B] mt-1.5 font-medium leading-relaxed">
              Total Ingested Material Items
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Active Categories: <strong className="text-[#17202A]">18</strong></span>
            <span>UOMs: <strong className="text-[#17202A]">9</strong></span>
          </div>
        </div>

        {/* Card 2: Harmonization Statistics */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Harmonization Rate</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700">31%</div>
            <div className="text-xs text-[#64748B] mt-1.5 font-medium leading-relaxed">
              {cnmcCodes} Common National Codes Assigned
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
            <span className="text-[#64748B]">Action Needed:</span>
            <span className="font-semibold text-amber-700 font-mono">{pendingExpertReview} Pending Review</span>
          </div>
        </div>

        {/* Card 3: CPSE Information */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Participating CPSEs</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#17202A] flex items-center justify-center border border-[#E2E8F0]">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#17202A]">{participatingOrgs}</div>
            <div className="text-xs text-[#64748B] mt-1.5 font-medium leading-relaxed">
              Connected Public Sector Enterprises
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="truncate max-w-[150px]">BHEL, ONGC, NTPC, SAIL...</span>
            <span className="text-emerald-700 font-semibold">Online</span>
          </div>
        </div>

        {/* Card 4: AI Engine Status */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">AI Engine Status</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-[#06B6D4] flex items-center justify-center border border-cyan-200">
              <Cpu className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-bold text-[#17202A]">
              <span>Active</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>
            <div className="text-xs text-[#64748B] mt-1.5 font-medium leading-relaxed">
              Sentence-BERT + NER Pipeline
            </div>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Mean Confidence:</span>
            <strong className="text-[#06B6D4] font-mono">95.4%</strong>
          </div>
        </div>
      </div>

      {/* 3. Match Classification Distribution Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4.5 h-4.5 text-[#06B6D4]" />
            <h2 className="text-sm sm:text-base font-bold text-[#17202A]">
              AI Matching Classification Breakdown
            </h2>
          </div>
          <span className="text-xs text-[#64748B]">50 Cross-CPSE Sample Clusters Evaluated</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
          {matchClassification.map((item) => (
            <div 
              key={item.type} 
              className={`h-full ${item.color} transition-all`} 
              style={{ width: `${item.percent}%` }}
              title={`${item.type}: ${item.count} items (${item.percent}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {matchClassification.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[#64748B] text-xs">{item.type}:</span>
              <strong className="text-[#17202A] font-mono text-xs">{item.count}</strong>
              <span className="text-[11px] text-slate-400">({item.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Main Dashboard Boxes: Aligned Review Queue and CPSE Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Box 1: Active Harmonization Review Queue */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 min-h-[84px] border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-bold text-[#17202A] text-sm sm:text-base">
                    Active Harmonization Review Queue
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Needs Action
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-1 leading-normal">
                  High-confidence multi-CPSE duplicate clusters awaiting expert sign-off
                </p>
              </div>
              <button
                onClick={() => onNavigate('matching')}
                className="text-xs text-[#06B6D4] hover:underline font-semibold flex items-center gap-1 shrink-0 ml-3"
              >
                <span>View Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8FAFC] text-[#17202A] font-semibold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3.5 px-5 w-32">CNMC</th>
                    <th className="py-3.5 px-4">Standard Material</th>
                    <th className="py-3.5 px-4 w-32">CPSEs</th>
                    <th className="py-3.5 px-5 w-28 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {recentHarmonizationQueue.map((item) => (
                    <tr 
                      key={item.cnmc}
                      onClick={() => onNavigate('matching')}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-5 align-middle">
                        <span className="font-mono font-semibold text-xs text-[#17202A] bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {item.cnmc}
                        </span>
                        <span className="block text-[10px] text-[#64748B] mt-1 font-sans">
                          {item.confidence}% Match
                        </span>
                      </td>
                      <td className="py-4 px-4 align-middle min-w-0">
                        <div className="font-semibold text-[#17202A] text-xs leading-snug truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate mt-1 leading-normal">
                          {item.category} • {item.type}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="font-medium text-[#17202A] text-xs">
                          {item.cpses.length} CPSEs
                        </div>
                        <div className="text-[10px] text-[#64748B] font-mono truncate mt-1">
                          {item.cpses.join(', ')}
                        </div>
                      </td>
                      <td className="py-4 px-5 align-middle text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span>{currentRole === 'expert' ? 'Authorized Expert sign-off enabled' : 'Inspection mode'}</span>
            <button
              onClick={() => onNavigate('matching')}
              className="text-xs text-[#06B6D4] font-semibold hover:underline flex items-center gap-1.5"
            >
              <span>Validate Matches</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Box 2: Participating CPSE Progress */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 min-h-[84px] border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#17202A] text-sm sm:text-base">
                  Participating CPSE Progress
                </h2>
                <p className="text-xs text-[#64748B] mt-1 leading-normal">
                  Ingested catalogs and cross-CPSE harmonization completion
                </p>
              </div>
              <button
                onClick={() => onNavigate('onboarding')}
                className="text-xs text-[#06B6D4] hover:underline font-semibold flex items-center gap-1 shrink-0 ml-3"
              >
                <span>View All ({participatingOrgs})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8FAFC] text-[#17202A] font-semibold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3.5 px-5">Enterprise</th>
                    <th className="py-3.5 px-4">ERP Platform</th>
                    <th className="py-3.5 px-4 text-center">Items</th>
                    <th className="py-3.5 px-5 text-right">Harmonized</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {orgProgress.slice(0, 4).map((org) => (
                    <tr 
                      key={org.code}
                      onClick={() => onNavigate('onboarding')}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-5 align-middle">
                        <div className="font-bold text-xs font-mono text-[#17202A]">{org.code}</div>
                        <div className="text-[11px] text-[#64748B] truncate max-w-[140px] mt-1 leading-normal">{org.sector}</div>
                      </td>
                      <td className="py-4 px-4 align-middle">
                        <div className="font-mono text-xs text-[#17202A]">{org.erp}</div>
                        <div className="text-[10px] text-[#64748B] mt-1">ERP Pipeline Sync</div>
                      </td>
                      <td className="py-4 px-4 text-center align-middle font-mono font-medium text-[#17202A]">
                        <div>{org.total}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{org.harmonized} done</div>
                      </td>
                      <td className="py-4 px-5 text-right align-middle">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                            <div className="bg-[#06B6D4] h-full rounded-full" style={{ width: `${org.percent}%` }} />
                          </div>
                          <span className="font-mono font-bold text-xs text-[#17202A]">{org.percent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Federated Sync Active across 7 CPSE ERP nodes</span>
            </span>
            <button
              onClick={() => onNavigate('onboarding')}
              className="text-xs text-[#06B6D4] font-semibold hover:underline flex items-center gap-1.5"
            >
              <span>Manage CPSEs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Overall Organization Progress Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#17202A]">
                Overall Organization Progress
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Multi-CPSE Ingestion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
              Consolidated material harmonization and deduplication progress across all connected enterprise catalogs.
            </p>
          </div>
          <div className="flex items-baseline gap-2 shrink-0 self-start sm:self-auto">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#17202A]">
              {overallPercent}%
            </span>
            <span className="text-xs text-[#64748B] font-medium">
              ({totalHarmonized} of {totalItems} items harmonized)
            </span>
          </div>
        </div>

        {/* Clean Horizontal Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div 
            className="h-full bg-[#06B6D4] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Micro-Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs border-t border-[#F1F5F9]">
          <div>
            <span className="text-[#64748B] block text-[11px] leading-normal">Connected Enterprises</span>
            <span className="font-bold text-[#17202A] text-sm font-mono mt-0.5 block">{orgProgress.length} CPSEs</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[11px] leading-normal">Ingested Materials</span>
            <span className="font-bold text-[#17202A] text-sm font-mono mt-0.5 block">{totalItems} Items</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[11px] leading-normal">Standardized & Assigned</span>
            <span className="font-bold text-emerald-700 text-sm font-mono mt-0.5 block">{totalHarmonized} Items</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[11px] leading-normal">Pending Review</span>
            <span className="font-bold text-amber-700 text-sm font-mono mt-0.5 block">{totalItems - totalHarmonized} Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};
