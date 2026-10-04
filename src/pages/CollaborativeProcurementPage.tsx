import React, { useState } from 'react';
import { 
  Handshake, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Building2, 
  Sparkles, 
  Package, 
  Search
} from 'lucide-react';
import type { NavigationPage, UserRole } from '../types';

interface CollaborativeProcurementProps {
  currentRole?: UserRole;
  onNavigate?: (page: NavigationPage) => void;
}

export type OpportunityStatus = 
  | 'Recommended'
  | 'Open for Interest'
  | 'Interest Received'
  | 'Aggregation Ready'
  | 'Closed';

export interface CpseDemandItem {
  cpse: string;
  quantity: number;
  uom: string;
  estimatedBudgetLakhs?: number;
}

export interface ProcurementOpportunity {
  id: string;
  cnmcCode: string;
  standardMaterial: string;
  category: string;
  technicalSpecification: string;
  detailedSpecs: Record<string, string>;
  participatingCpses: CpseDemandItem[];
  combinedDemand: number;
  uom: string;
  estimatedTotalValueLakhs: number;
  matchConfidence: number;
  status: OpportunityStatus;
  userExpressedInterest: boolean;
  reasons: string[];
  recommendationExplanation: string;
}

const INITIAL_OPPORTUNITIES: ProcurementOpportunity[] = [
  {
    id: 'opp-001',
    cnmcCode: 'CNMC-000003',
    standardMaterial: 'Seamless Carbon Steel Pipe – 150 mm (6 Inch), SCH 40',
    category: 'Pipes & Fittings',
    technicalSpecification: 'ASTM A106 Grade B, Seamless, 150 mm (6 Inch) NB, Schedule 40, Bevelled Ends',
    detailedSpecs: {
      'Material Grade': 'ASTM A106 Gr. B Carbon Steel',
      'Nominal Size': '150 mm NB (6 Inch)',
      'Wall Thickness': 'Schedule 40 (7.11 mm)',
      'End Finish': 'Bevelled Ends (ASME B16.25)',
      'Manufacturing': 'Hot Finished / Cold Drawn Seamless',
      'Standard': 'ASME B36.10M'
    },
    participatingCpses: [
      { cpse: 'ONGC', quantity: 2400, uom: 'MTR', estimatedBudgetLakhs: 40.8 },
      { cpse: 'CPCL', quantity: 1600, uom: 'MTR', estimatedBudgetLakhs: 27.2 },
      { cpse: 'GAIL', quantity: 1200, uom: 'MTR', estimatedBudgetLakhs: 20.4 }
    ],
    combinedDemand: 5200,
    uom: 'MTR',
    estimatedTotalValueLakhs: 88.4,
    matchConfidence: 98,
    status: 'Aggregation Ready',
    userExpressedInterest: true,
    reasons: [
      'Same CNMC: CNMC-000003 assigned across all 3 enterprises',
      'Same technical specification: ASTM A106 Gr.B, 150 mm SCH 40',
      '3 Major CPSEs have concurrent Q2/Q3 procurement schedules',
      'Demand aggregation yields estimated 14.5% volume cost discount'
    ],
    recommendationExplanation: 'ONGC, CPCL, and GAIL require identical seamless carbon steel line pipe specs. Combining order volume to 5,200 MTR enables mill-direct tender dispatch with substantial savings.'
  },
  {
    id: 'opp-002',
    cnmcCode: 'CNMC-000001',
    standardMaterial: 'Stainless Steel Ball Valve – 50 mm',
    category: 'Valves & Actuators',
    technicalSpecification: 'ASTM A351 CF8M, Full Bore, 50 mm (2 Inch) NB, Class 150 Raised Face Flanged Joint',
    detailedSpecs: {
      'Body Material': 'ASTM A351 Gr. CF8M (SS316)',
      'Nominal Size': '50 mm (2 Inch) Full Port',
      'Pressure Class': 'Class 150 (ASME B16.34)',
      'End Connection': 'Flanged RF (ASME B16.5)',
      'Seat / Seals': 'Reinforced PTFE (RPTFE)',
      'Fire Safe': 'API 607 / ISO 10497 Certified'
    },
    participatingCpses: [
      { cpse: 'BHEL', quantity: 120, uom: 'NOS', estimatedBudgetLakhs: 14.4 },
      { cpse: 'ONGC', quantity: 180, uom: 'NOS', estimatedBudgetLakhs: 21.6 },
      { cpse: 'SAIL', quantity: 100, uom: 'NOS', estimatedBudgetLakhs: 12.0 }
    ],
    combinedDemand: 400,
    uom: 'NOS',
    estimatedTotalValueLakhs: 48.0,
    matchConfidence: 97,
    status: 'Recommended',
    userExpressedInterest: false,
    reasons: [
      'Same CNMC: CNMC-000001 standard catalog mapping',
      'Same technical specification: ASTM A351 CF8M Class 150 RF',
      '3 CPSEs (BHEL, ONGC, SAIL) independently requested identical valves',
      'Demand aggregation pools 400 valves into a single unified lot'
    ],
    recommendationExplanation: 'BHEL, ONGC, and SAIL procure identical full-bore CF8M ball valves. Unified rate contract negotiation can harmonize vendor qualification and reduce procurement cycle time.'
  },
  {
    id: 'opp-003',
    cnmcCode: 'CNMC-000002',
    standardMaterial: 'Deep Groove Radial Ball Bearing 6205',
    category: 'Bearings & Seals',
    technicalSpecification: 'ISO 15 / DIN 625-1, 25mm Bore, 52mm Outer Diameter, 15mm Width, C3 Radial Internal Clearance',
    detailedSpecs: {
      'Standard': 'ISO 15 / DIN 625-1',
      'Bore Diameter': '25 mm',
      'Outer Diameter': '52 mm',
      'Width': '15 mm',
      'Clearance': 'C3 Internal Clearance',
      'Cage Type': 'Pressed Steel Cage, Open Type'
    },
    participatingCpses: [
      { cpse: 'BHEL', quantity: 450, uom: 'NOS', estimatedBudgetLakhs: 6.75 },
      { cpse: 'NTPC', quantity: 350, uom: 'NOS', estimatedBudgetLakhs: 5.25 },
      { cpse: 'SAIL', quantity: 200, uom: 'NOS', estimatedBudgetLakhs: 3.0 }
    ],
    combinedDemand: 1000,
    uom: 'NOS',
    estimatedTotalValueLakhs: 15.0,
    matchConfidence: 99,
    status: 'Open for Interest',
    userExpressedInterest: false,
    reasons: [
      'Same CNMC: CNMC-000002 standard specification',
      'Same technical specification: Standard metric 6205 C3 radial bearing',
      'Common usage across high-temperature auxiliary motor rotating equipment',
      'Demand can potentially be aggregated for 1,000 units bulk supply'
    ],
    recommendationExplanation: 'Standard electric motor spares across power generation and metallurgy plants. Centralized framework sourcing eliminates recurring individual enterprise RFQs.'
  },
  {
    id: 'opp-004',
    cnmcCode: 'CNMC-000004',
    standardMaterial: 'Spiral Wound Gasket 50 mm (2 Inch) Class 150',
    category: 'Gaskets & Sealing',
    technicalSpecification: 'ASME B16.20, SS316 Metallic Winding with Flexible Graphite Filler, Carbon Steel Outer Ring',
    detailedSpecs: {
      'Standard': 'ASME B16.20 for ASME B16.5 Flanges',
      'Size': '50 mm (2 Inch) NB',
      'Rating': 'Class 150 Raised Face',
      'Winding Wire': 'AISI 316 Stainless Steel',
      'Filler': 'Flexible Exfoliated Graphite',
      'Outer Ring': 'Carbon Steel with Corrosion Inhibitor'
    },
    participatingCpses: [
      { cpse: 'SAIL', quantity: 800, uom: 'NOS', estimatedBudgetLakhs: 3.28 },
      { cpse: 'IOCL', quantity: 650, uom: 'NOS', estimatedBudgetLakhs: 2.66 },
      { cpse: 'ONGC', quantity: 550, uom: 'NOS', estimatedBudgetLakhs: 2.26 }
    ],
    combinedDemand: 2000,
    uom: 'NOS',
    estimatedTotalValueLakhs: 8.2,
    matchConfidence: 95,
    status: 'Interest Received',
    userExpressedInterest: true,
    reasons: [
      'Same CNMC: CNMC-000004 standardized sealing master',
      'Same technical specification: SS316 / Graphite ASME B16.20',
      'Multiple continuous process plants have quarterly overhaul demands',
      'Aggregated volume guarantees batch metallurgical test certificates'
    ],
    recommendationExplanation: 'High-wear consumable sealing components. Demand pooling guarantees certified graphite purity and uniform hydrostatic joint reliability across refinery and steel plants.'
  }
];

export const CollaborativeProcurementPage: React.FC<CollaborativeProcurementProps> = () => {
  const [opportunities, setOpportunities] = useState<ProcurementOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ProcurementOpportunity | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const toggleInterest = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setOpportunities(prev => prev.map(opp => {
      if (opp.id === id) {
        const nextState = !opp.userExpressedInterest;
        const newStatus: OpportunityStatus = nextState ? 'Interest Received' : 'Open for Interest';
        
        setNotification(
          nextState 
            ? `Interest recorded for ${opp.standardMaterial}. Added to My Procurement Interests.`
            : `Withdrew interest for ${opp.standardMaterial}.`
        );
        setTimeout(() => setNotification(null), 3500);

        return {
          ...opp,
          userExpressedInterest: nextState,
          status: opp.status === 'Aggregation Ready' ? 'Aggregation Ready' : newStatus
        };
      }
      return opp;
    }));

    if (selectedOpportunity && selectedOpportunity.id === id) {
      setSelectedOpportunity(prev => prev ? {
        ...prev,
        userExpressedInterest: !prev.userExpressedInterest
      } : null);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      opp.standardMaterial.toLowerCase().includes(q) ||
      opp.cnmcCode.toLowerCase().includes(q) ||
      opp.category.toLowerCase().includes(q) ||
      opp.participatingCpses.some(c => c.cpse.toLowerCase().includes(q))
    );

    if (activeFilter === 'my-interests') {
      return matchesSearch && opp.userExpressedInterest;
    }
    if (activeFilter !== 'all') {
      return matchesSearch && opp.status.toLowerCase() === activeFilter.toLowerCase();
    }
    return matchesSearch;
  });

  const myInterestsCount = opportunities.filter(o => o.userExpressedInterest).length;

  const renderStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case 'Aggregation Ready':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aggregation Ready
          </span>
        );
      case 'Interest Received':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-[#06B6D4] border border-cyan-200">
            Interest Received
          </span>
        );
      case 'Open for Interest':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Open for Interest
          </span>
        );
      case 'Closed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-[#64748B] border border-[#E2E8F0]">
            Closed
          </span>
        );
      case 'Recommended':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Recommended
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 font-sans text-[#17202A]">
      
      {/* 1. Header Recommendation Banner Card */}
      <div className="bg-gradient-to-r from-cyan-50/70 via-white to-cyan-50/40 p-6 sm:p-7 rounded-2xl border border-cyan-100/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-100/80 text-[#06B6D4] flex items-center justify-center border border-cyan-200 shrink-0">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17202A]">
                    Collaborative Procurement
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100/80 text-cyan-800 border border-cyan-200">
                    Demand Aggregation
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                  AI-driven cross-CPSE demand pooling and collective procurement opportunities
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto text-xs">
            <div className="p-3 bg-white rounded-xl border border-cyan-200 shadow-2xs">
              <span className="text-[11px] text-[#64748B] block font-medium">My Active Interests</span>
              <span className="text-base font-bold font-mono text-[#06B6D4]">{myInterestsCount} Opportunities</span>
            </div>
          </div>
        </div>

        {/* Clear Core Explanation */}
        <div className="pt-2 border-t border-cyan-100/60 flex items-start gap-2.5 text-xs text-cyan-950">
          <Sparkles className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            These CPSEs are requesting the same standardized material. MATQUANTA recommends combining demand to explore collaborative procurement, achieve volume discounts, and streamline national vendor contracting.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Procurement State Updated</span>
        </div>
      )}

      {/* 2. Filter & Search Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#17202A] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#64748B]'
              }`}
            >
              All Opportunities ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveFilter('recommended')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'recommended'
                  ? 'bg-[#17202A] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#64748B]'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setActiveFilter('open for interest')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'open for interest'
                  ? 'bg-[#17202A] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#64748B]'
              }`}
            >
              Open for Interest
            </button>
            <button
              onClick={() => setActiveFilter('aggregation ready')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'aggregation ready'
                  ? 'bg-[#17202A] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#64748B]'
              }`}
            >
              Aggregation Ready
            </button>
            <button
              onClick={() => setActiveFilter('my-interests')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === 'my-interests'
                  ? 'bg-[#06B6D4] text-white shadow-2xs'
                  : 'bg-cyan-50 hover:bg-cyan-100 text-[#06B6D4] border border-cyan-200'
              }`}
            >
              My Procurement Interests ({myInterestsCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search opportunity or CNMC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-[#17202A] placeholder-[#64748B] focus:outline-none focus:ring-1.5 focus:ring-[#06B6D4] font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Recommended Opportunities List (Highest Value First) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#17202A]">
              Recommended Opportunities
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ranked by combined CPSE volume, estimated contract value, and catalog match confidence
            </p>
          </div>
          <span className="text-xs text-[#64748B]">
            Showing <strong className="text-[#17202A]">{filteredOpportunities.length}</strong> opportunities
          </span>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] text-[#64748B]">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-[#17202A] text-sm">No collaborative opportunities found</p>
            <p className="text-xs text-[#64748B] mt-1">Adjust search query or filter selection.</p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all p-6 sm:p-7 space-y-5"
            >
              {/* Top Row: CNMC, Material Title, Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#17202A] bg-slate-100 px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                      {opp.cnmcCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-[#06B6D4] border border-cyan-200">
                      {opp.matchConfidence}% Match Confidence
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {opp.category}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#17202A] leading-snug">
                    {opp.standardMaterial}
                  </h3>
                  
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    <strong className="text-[#17202A]">Technical Spec:</strong> {opp.technicalSpecification}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {renderStatusBadge(opp.status)}
                </div>
              </div>

              {/* Middle Row: Demand Aggregation Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                
                {/* Individual CPSE Demand (8 cols) */}
                <div className="lg:col-span-8 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#17202A] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>Individual CPSE Demand Breakdown</span>
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {opp.participatingCpses.length} Contributing Enterprises
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {opp.participatingCpses.map((c) => (
                      <div key={c.cpse} className="p-3 bg-white rounded-lg border border-[#E2E8F0] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-[#17202A]">{c.cpse}</span>
                          <span className="text-[10px] text-[#64748B]">Enterprise Demand</span>
                        </div>
                        <div className="text-base font-bold font-mono text-[#17202A]">
                          {c.quantity.toLocaleString()} <span className="text-xs font-sans font-normal text-[#64748B]">{c.uom}</span>
                        </div>
                        {c.estimatedBudgetLakhs && (
                          <div className="text-[10px] text-[#64748B]">
                            Est. ₹{c.estimatedBudgetLakhs}L budget
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combined Demand Summary (4 cols) */}
                <div className="lg:col-span-4 p-4 bg-white rounded-xl border border-cyan-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#06B6D4] tracking-wider block">
                      Combined Aggregate Demand
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#17202A] mt-1">
                      {opp.combinedDemand.toLocaleString()} <span className="text-sm font-sans font-semibold text-[#64748B]">{opp.uom}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Est. Combined Value:</span>
                    <strong className="text-[#17202A] font-mono text-sm">₹{opp.estimatedTotalValueLakhs} Lakhs</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Why This Opportunity? + Action Buttons */}
              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Why This Opportunity? (Short Reasons) */}
                <div className="space-y-1.5 max-w-2xl text-xs">
                  <span className="font-bold text-[#17202A] text-[11px] uppercase tracking-wider block">
                    Why This Opportunity?
                  </span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#64748B] text-xs">
                    {opp.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                  <button
                    onClick={(e) => toggleInterest(opp.id, e)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                      opp.userExpressedInterest
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#06B6D4] hover:bg-cyan-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${opp.userExpressedInterest ? 'text-emerald-700' : 'text-white'}`} />
                    <span>{opp.userExpressedInterest ? 'Interest Expressed' : 'Express Interest'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedOpportunity(opp)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#17202A] rounded-xl text-xs font-semibold border border-[#E2E8F0] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>View Opportunity</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. DETAIL VIEW: Right-Side Opportunity Drawer (~40% Screen) */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
          {/* Subtle backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity" 
            onClick={() => setSelectedOpportunity(null)}
            aria-label="Close drawer"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#17202A] bg-white px-2.5 py-1 rounded border border-[#E2E8F0]">
                      {selectedOpportunity.cnmcCode}
                    </span>
                    {renderStatusBadge(selectedOpportunity.status)}
                  </div>
                  <h2 className="text-base font-bold text-[#17202A] leading-snug">
                    {selectedOpportunity.standardMaterial}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#17202A] hover:bg-slate-200/60 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                
                {/* 1. Demand Aggregation Summary Box */}
                <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold text-[#06B6D4] tracking-wider">
                      Collaborative Procurement Aggregation
                    </span>
                    <span className="font-mono font-bold text-xs text-[#06B6D4] bg-white px-2 py-0.5 rounded border border-cyan-200">
                      {selectedOpportunity.matchConfidence}% Confidence
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[11px] text-[#64748B] block">Total Combined Demand</span>
                      <span className="text-2xl font-bold font-mono text-[#17202A]">
                        {selectedOpportunity.combinedDemand.toLocaleString()} {selectedOpportunity.uom}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#64748B] block">Estimated Consolidated Value</span>
                      <span className="text-lg font-bold font-mono text-[#17202A]">
                        ₹{selectedOpportunity.estimatedTotalValueLakhs} Lakhs
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Participating CPSEs & Individual Quantities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#17202A]">
                      Participating CPSEs & Demand Breakdown
                    </h4>
                    <span className="text-[11px] text-[#64748B]">
                      {selectedOpportunity.participatingCpses.length} Public Enterprises
                    </span>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F8FAFC] text-[#17202A] font-semibold border-b border-[#E2E8F0]">
                        <tr>
                          <th className="py-2.5 px-4">CPSE Enterprise</th>
                          <th className="py-2.5 px-4 text-center">Requisition Quantity</th>
                          <th className="py-2.5 px-4 text-right">Est. Budget</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {selectedOpportunity.participatingCpses.map((item) => (
                          <tr key={item.cpse} className="hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-[#17202A] font-mono">
                              {item.cpse}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-[#17202A]">
                              {item.quantity.toLocaleString()} {item.uom}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-[#64748B]">
                              ₹{item.estimatedBudgetLakhs} Lakhs
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Detailed Technical Specifications */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#17202A]">
                    Standardized Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedOpportunity.detailedSpecs).map(([key, value]) => (
                      <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[10px] text-[#64748B] uppercase font-semibold block">{key}</span>
                        <span className="font-semibold text-[#17202A]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. AI Recommendation Explanation */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#17202A]">
                    AI Recommendation Rationale
                  </h4>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
                    {selectedOpportunity.recommendationExplanation}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-[#17202A] rounded-xl text-xs font-semibold border border-[#E2E8F0] transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={() => toggleInterest(selectedOpportunity.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                    selectedOpportunity.userExpressedInterest
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#06B6D4] hover:bg-cyan-600 text-white'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${selectedOpportunity.userExpressedInterest ? 'text-emerald-700' : 'text-white'}`} />
                  <span>{selectedOpportunity.userExpressedInterest ? 'Interest Expressed (Click to Withdraw)' : 'Express Procurement Interest'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
