import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Edit3,
  Boxes,
  ShieldCheck,
  CheckCircle,
  Copy,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { NavigationPage, MatchType, UserRole } from '../types';

interface AiMatchingPageProps {
  currentRole?: UserRole;
  onNavigate?: (page: NavigationPage) => void;
  onTriggerRun?: () => void;
}

interface MultiCpseCluster {
  id: string;
  category: string;
  matchType: MatchType;
  confidenceScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  semanticSimilarity: number;
  attributeMatchScore: number;
  status: 'Pending Expert Review' | 'Approved' | 'Rejected' | 'Modified';
  proposedCNMC: string;
  standardizedDescription: string;
  technicalAttributes: {
    material: string;
    type: string;
    size: string;
    connection: string;
    rating?: string;
  };
  aiExplanation: string;
  matchReasons: {
    label: string;
    value: string;
    evidence: string;
  }[];
  items: {
    cpse: string;
    code: string;
    description: string;
    spec: string;
    uom: string;
  }[];
}

export const AiMatchingPage: React.FC<AiMatchingPageProps> = ({
  currentRole = 'expert',
  onNavigate: _onNavigate
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modifiedName, setModifiedName] = useState<string>('');
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [clusters, setClusters] = useState<MultiCpseCluster[]>([
    {
      id: 'cluster-valves-01',
      category: 'Valves & Actuators',
      matchType: 'Duplicate',
      confidenceScore: 95,
      confidenceLevel: 'High',
      semanticSimilarity: 96,
      attributeMatchScore: 94,
      status: 'Pending Expert Review',
      proposedCNMC: 'CNMC-000001',
      standardizedDescription: 'Stainless Steel Ball Valve – 50 mm',
      technicalAttributes: {
        material: 'Stainless Steel (ASTM A351 CF8M / SS316)',
        type: 'Ball Valve (Full Bore)',
        size: '50 mm (2 Inch NB)',
        connection: 'Flanged ASME B16.5 Class 150 RF',
        rating: 'Class 150'
      },
      matchReasons: [
        { label: 'Material Grade', value: 'ASTM A351 CF8M', evidence: 'Directly equivalent to SS316 across BHEL, ONGC, and SAIL records' },
        { label: 'Component Type', value: 'Ball Valve (Full Bore)', evidence: 'Identical body architecture, port configuration, and valve seating standard' },
        { label: 'Nominal Sizing', value: '50 mm (2 Inch NB)', evidence: 'NLP unified imperial (2") and metric (50 mm) sizing nomenclature' },
        { label: 'Flange Connection', value: 'ASME B16.5 Class 150 RF', evidence: 'Standard raised-face Class 150 bolt circle geometry matched' }
      ],
      aiExplanation: 'NLP entity extraction normalized abbreviations (SS BV 2IN FLG → Stainless Steel Ball Valve 50mm). Dimensional unit alignment unified imperial 2-inch to 50 mm nominal bore. Metallurgy CF8M matches SS316 specification.',
      items: [
        {
          cpse: 'BHEL',
          code: 'MAT1001',
          description: 'SS BALL VALVE 2IN FLG',
          spec: 'CF8M, CL 150, FLG ENDS',
          uom: 'NOS'
        },
        {
          cpse: 'ONGC',
          code: '458721',
          description: '2 INCH STAINLESS STEEL BALL VALVE',
          spec: 'SS316, 150# RF, FULL BORE',
          uom: 'NOS'
        },
        {
          cpse: 'SAIL',
          code: 'PV2034',
          description: 'STAINLESS STEEL BALL VALVE 50MM',
          spec: 'ASTM A351 CF8M, FLANGED 150LB',
          uom: 'NOS'
        }
      ]
    },
    {
      id: 'cluster-bearing-02',
      category: 'Bearings & Bushings',
      matchType: 'Identical',
      confidenceScore: 98,
      confidenceLevel: 'High',
      semanticSimilarity: 99,
      attributeMatchScore: 97,
      status: 'Approved',
      proposedCNMC: 'CNMC-000002',
      standardizedDescription: 'Deep Groove Radial Ball Bearing 6205',
      technicalAttributes: {
        material: 'High-Carbon Chromium Bearing Steel (52100)',
        type: 'Deep Groove Ball Bearing',
        size: '25 mm ID x 52 mm OD x 15 mm W',
        connection: 'Cylindrical Bore Press Fit'
      },
      matchReasons: [
        { label: 'Designation Code', value: 'ISO 6205 Single Row', evidence: 'Exact standardized bearing designation verified across master catalogs' },
        { label: 'Bore Diameter', value: '25 mm ID', evidence: 'Direct bore dimensional match across BHEL and NTPC engineering masters' },
        { label: 'Envelope Sizing', value: '52 mm OD x 15 mm W', evidence: 'Boundary dimensions match standard ISO 15 envelope' },
        { label: 'Rotational Rating', value: 'Dynamic 14.8 kN / Static 7.8 kN', evidence: 'Catalog load capacities fully aligned for power station duty' }
      ],
      aiExplanation: 'Strict ISO designation matching. Radial deep groove single row ball bearing 6205 boundary dimensions (25x52x15mm) are identical. Full interchangeable substitution approved.',
      items: [
        {
          cpse: 'BHEL',
          code: 'BHE-B-6205',
          description: 'RADIAL BALL BEARING 6205',
          spec: '25X52X15MM, C3 CLEARANCE',
          uom: 'NOS'
        },
        {
          cpse: 'NTPC',
          code: 'NTP-BRG-6205',
          description: 'BEARING DEEP GROOVE 6205',
          spec: 'ISO 6205, OPEN TYPE, STEEL CAGE',
          uom: 'NOS'
        }
      ]
    },
    {
      id: 'cluster-pipe-03',
      category: 'Pipes & Tubes',
      matchType: 'Near-Duplicate',
      confidenceScore: 92,
      confidenceLevel: 'High',
      semanticSimilarity: 94,
      attributeMatchScore: 90,
      status: 'Pending Expert Review',
      proposedCNMC: 'CNMC-000003',
      standardizedDescription: 'Seamless Carbon Steel Pipe – 150 mm (6 Inch), SCH 40',
      technicalAttributes: {
        material: 'Carbon Steel (ASTM A106 Grade B)',
        type: 'Seamless Steel Line Pipe',
        size: '150 mm NB (6 Inch NB, 168.3 mm OD)',
        connection: 'Bevelled Ends (ASME B16.25)',
        rating: 'Schedule 40 (7.11 mm Wall)'
      },
      matchReasons: [
        { label: 'Standard Specification', value: 'ASTM A106 Grade B', evidence: 'High-temperature seamless carbon steel pipe standard matched' },
        { label: 'Nominal Sizing', value: '150 mm (6 Inch NB)', evidence: '6" NPS metricated to 150mm NB; outside diameter 168.3mm identical' },
        { label: 'Wall Thickness', value: 'Schedule 40 (7.11 mm)', evidence: 'Pressure containment envelope identical across hydrocarbon and refinery duty' },
        { label: 'End Preparation', value: 'Bevelled Ends (BE)', evidence: 'Buttweld edge preparation geometry matches ASME B16.25' }
      ],
      aiExplanation: 'ASTM A106 Grade B seamless carbon steel pipe. NPS 6-inch NB matches 150 mm NB. Wall thickness Schedule 40 (7.11 mm) is identical across ONGC and CPCL catalogs.',
      items: [
        {
          cpse: 'ONGC',
          code: 'ONG-P-6040',
          description: 'PIPE CS SMLS 6IN SCH40 BE',
          spec: 'ASTM A106 GR.B, BE, SMLS, 6" NB',
          uom: 'MTR'
        },
        {
          cpse: 'CPCL',
          code: 'CPC-PIPE-150',
          description: 'SEAMLESS CARBON STEEL PIPE 150MM SCH40',
          spec: 'A106-B, SCH 40, BEVELLED ENDS',
          uom: 'MTR'
        }
      ]
    },
    {
      id: 'cluster-gasket-04',
      category: 'Gaskets & Sealing',
      matchType: 'Functionally Equivalent',
      confidenceScore: 88,
      confidenceLevel: 'Medium',
      semanticSimilarity: 89,
      attributeMatchScore: 87,
      status: 'Pending Expert Review',
      proposedCNMC: 'CNMC-000004',
      standardizedDescription: 'Spiral Wound Gasket 50 mm (2 Inch) Class 150',
      technicalAttributes: {
        material: 'SS316 Winding with Flexible Graphite Filler',
        type: 'Spiral Wound Metallic Gasket with Outer Ring',
        size: '50 mm NB (2 Inch)',
        connection: 'ASME B16.20 for B16.5 Flanges',
        rating: 'Class 150 Raised Face'
      },
      matchReasons: [
        { label: 'Dimensional Standard', value: 'ASME B16.20', evidence: 'Standard dimensions for raised-face flanged joint sealing' },
        { label: 'Winding & Filler', value: 'SS316 / Graphite', evidence: 'Identical chemical resistance and thermal cycle endurance' },
        { label: 'Centering Ring', value: 'Carbon Steel Outer Ring', evidence: 'Centering ring design matches ASME Class 150 bolt pattern' }
      ],
      aiExplanation: 'Functionally equivalent metallic spiral wound gaskets. SS316 with flexible graphite filler. Slight description variance between SAIL and IOCL legacy ERP records.',
      items: [
        {
          cpse: 'SAIL',
          code: 'SAL-G-200',
          description: 'GASKET SPWD SS316 2IN 150#',
          spec: 'ASME B16.20, CS OUTER RING, FG FILLER',
          uom: 'NOS'
        },
        {
          cpse: 'IOCL',
          code: 'IOC-GSK-050',
          description: 'SPIRAL WOUND GASKET 50MM CL150 RF',
          spec: 'SS316/GRAPHITE, WITH CENTERING RING',
          uom: 'NOS'
        }
      ]
    },
    {
      id: 'cluster-distinct-05',
      category: 'Instrumentation',
      matchType: 'No Significant Match',
      confidenceScore: 32,
      confidenceLevel: 'Low',
      semanticSimilarity: 35,
      attributeMatchScore: 28,
      status: 'Rejected',
      proposedCNMC: 'CNMC-DISTINCT',
      standardizedDescription: 'Optical Flame Scanner UV-Pro (BHEL Boiler Specific)',
      technicalAttributes: {
        material: 'Custom UV Phototube Housing',
        type: 'Optical UV Flame Scanner Sensor',
        size: 'Proprietary Mount Flange',
        connection: 'BHEL Quick-Disconnect Cable'
      },
      matchReasons: [
        { label: 'Component OEM', value: 'BHEL Boiler MK-IV Specialized', evidence: 'Custom OEM utility part engineered for specific boiler series' },
        { label: 'Mounting Design', value: 'Non-Standard Flange Mount', evidence: 'No geometric or mechanical equivalent in ONGC, NTPC, or SAIL' },
        { label: 'Electrical Interface', value: 'Proprietary BHEL Quick Lock', evidence: 'Incompatible pinout with standard industrial optical sensors' }
      ],
      aiExplanation: 'Low attribute match. Proprietary thermal power equipment specific to single boiler OEM with non-standard electrical connector. Correctly retained as distinct item.',
      items: [
        {
          cpse: 'BHEL',
          code: 'BHE-SEN-9921',
          description: 'OPTICAL FLAME SCANNER UV-PRO',
          spec: 'BHEL BOILER MK-IV SPECIAL',
          uom: 'NOS'
        }
      ]
    }
  ]);

  // Handle Validation Actions
  const handleAction = (clusterId: string, newStatus: 'Approved' | 'Rejected' | 'Modified' | 'Pending Expert Review', customTitle?: string) => {
    setClusters(prev => prev.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          status: newStatus,
          standardizedDescription: customTitle || c.standardizedDescription
        };
      }
      return c;
    }));

    setIsEditing(false);
    setConfirmationMessage(`Match status updated to ${newStatus === 'Approved' ? 'Approved & Harmonized' : newStatus === 'Rejected' ? 'Rejected' : newStatus === 'Pending Expert Review' ? 'Reopened for Review' : 'Modified'} • Audit log recorded`);
    setTimeout(() => setConfirmationMessage(null), 3500);
  };

  const handleCopy = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter Match Groups
  const filteredClusters = clusters.filter(c => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return c.status === 'Pending Expert Review';
    if (selectedFilter === 'approved') return c.status === 'Approved';
    if (selectedFilter === 'rejected') return c.status === 'Rejected';
    if (selectedFilter === 'modified') return c.status === 'Modified';
    return true;
  });

  const activeCluster = clusters.find(c => c.id === selectedClusterId) || clusters[0];

  const handleOpenDrawer = (clusterId: string) => {
    setSelectedClusterId(clusterId);
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
  };

  const renderStatusBadge = (status: MultiCpseCluster['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            <X className="w-3 h-3 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'Modified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
            <Edit3 className="w-3 h-3 text-purple-600" />
            <span>Modified</span>
          </span>
        );
      case 'Pending Expert Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  const renderMatchTypeBadge = (type: MatchType) => {
    switch (type) {
      case 'Identical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">Identical</span>;
      case 'Duplicate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-[#06B6D4] border border-cyan-200 shrink-0">Duplicate</span>;
      case 'Near-Duplicate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">Near-Duplicate</span>;
      case 'Functionally Equivalent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">Equivalent</span>;
      case 'No Significant Match':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-[#64748B] border border-[#E2E8F0] shrink-0">Distinct</span>;
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* 1. Header and Filter Tabs */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#17202A]">Harmonization Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-[#06B6D4] border border-cyan-200">
                AI Match Engine
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Review and validate AI-recommended material matches across participating CPSE master catalogs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-[#64748B]">
              Total Match Groups: <strong className="text-[#17202A]">{clusters.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Matches', count: clusters.length },
              { id: 'pending', label: 'Pending Review', count: clusters.filter(c => c.status === 'Pending Expert Review').length },
              { id: 'approved', label: 'Approved', count: clusters.filter(c => c.status === 'Approved').length },
              { id: 'rejected', label: 'Rejected', count: clusters.filter(c => c.status === 'Rejected').length },
              { id: 'modified', label: 'Modified', count: clusters.filter(c => c.status === 'Modified').length }
            ].map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#17202A] text-white shadow-2xs'
                      : 'bg-slate-50 text-[#64748B] hover:text-[#17202A] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-slate-800 text-white' : 'bg-slate-200/80 text-[#64748B]'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[10px] bg-slate-100 px-2 py-1 rounded border border-[#E2E8F0] text-[#64748B]">
            AI recommends • Authorized experts validate
          </span>
        </div>
      </div>

      {/* Confirmation Feedback Banner if status updated */}
      {confirmationMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{confirmationMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Audit trail logged</span>
        </div>
      )}

      {/* 2. Larger Clean Match Cards (As Requested by User) */}
      <div className="space-y-4">
        {filteredClusters.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-[#E2E8F0] text-[#64748B]">
            <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-[#17202A] text-sm">No match groups found in this filter</p>
            <p className="text-xs text-[#64748B] mt-1">Switch filter tab to view all groups.</p>
          </div>
        ) : (
          filteredClusters.map((cluster) => {
            const firstItem = cluster.items[0];
            const otherItemsCount = cluster.items.length - 1;
            const keySpecs = Object.entries(cluster.technicalAttributes).slice(0, 3).map(([_, v]) => v).join(' • ');

            return (
              <div
                key={cluster.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs hover:border-slate-300 transition-all p-5 sm:p-6 space-y-4"
              >
                {/* 3-Column Match Layout: Left (CPSE), Center (AI Indicator), Right (CNMC) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* LEFT: Organization Material */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      <span>Contributing CPSE Material</span>
                      {otherItemsCount > 0 && (
                        <span className="font-mono text-[#06B6D4] bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                          +{otherItemsCount} more CPSE source{otherItemsCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-[#17202A] border border-[#E2E8F0]">
                        {firstItem.cpse}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#64748B]">
                        {firstItem.code}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-[#17202A] leading-snug">
                        {firstItem.description}
                      </div>
                      <div className="text-xs text-[#64748B] mt-1.5 bg-slate-50 p-2.5 rounded-lg border border-[#E2E8F0]">
                        <span className="font-semibold text-[#17202A]">Specification: </span>
                        {firstItem.spec} • UOM: <span className="font-mono">{firstItem.uom}</span>
                      </div>
                    </div>
                  </div>

                  {/* CENTER: AI Matching Indicator / Arrow */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center gap-2 py-2">
                    <span className="font-mono font-bold text-xs text-[#06B6D4] bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-full shadow-2xs">
                      {cluster.confidenceScore}% Match
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#06B6D4] flex items-center justify-center border border-[#E2E8F0]">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    {renderMatchTypeBadge(cluster.matchType)}
                  </div>

                  {/* RIGHT: Common National Material Code & Standard Material */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      <span>Common National Material Code</span>
                      {renderStatusBadge(cluster.status)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-cyan-50 text-[#06B6D4] border border-cyan-200">
                        {cluster.proposedCNMC}
                      </span>
                      <span className="text-[11px] text-[#64748B]">
                        {cluster.category}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-[#17202A] leading-snug">
                        {cluster.standardizedDescription}
                      </div>
                      <div className="text-xs text-[#64748B] mt-1.5 bg-cyan-50/40 p-2.5 rounded-lg border border-cyan-100">
                        <span className="font-semibold text-[#17202A]">Standard Spec: </span>
                        {keySpecs}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM: AI Matching Reason + Action Buttons */}
                <div className="border-t border-[#E2E8F0] pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 max-w-2xl text-[#64748B]">
                    <Sparkles className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      <strong className="text-[#17202A]">Why AI Matched:</strong> {cluster.aiExplanation}
                    </span>
                  </div>

                  {currentRole === 'procurement' ? (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <span className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 text-[#64748B] border border-[#E2E8F0]">
                        Read-Only • Expert Sign-off Required
                      </span>
                      <button
                        onClick={() => handleOpenDrawer(cluster.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#17202A] rounded-lg font-semibold border border-[#E2E8F0] transition-colors flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <button
                        onClick={() => handleAction(cluster.id, 'Approved')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Harmonize</span>
                      </button>

                      <button
                        onClick={() => handleAction(cluster.id, 'Rejected')}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/90 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      {currentRole === 'admin' && cluster.status !== 'Pending Expert Review' && (
                        <button
                          onClick={() => handleAction(cluster.id, 'Pending Expert Review')}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[#17202A] border border-[#E2E8F0] rounded-lg font-semibold transition-colors text-xs"
                          title="Admin: Reopen cluster mapping for review"
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenDrawer(cluster.id)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#17202A] rounded-lg font-semibold border border-[#E2E8F0] transition-colors flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. RIGHT-SIDE DETAIL DRAWER (Covering ~40% of screen on desktop, table visible behind) */}
      {isDrawerOpen && activeCluster && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
          {/* Subtle backdrop overlay: keeps cards visible underneath */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity" 
            onClick={handleCloseDrawer}
            aria-label="Close drawer"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Container: 40% width on desktop, full screen on mobile */}
            <div className="w-screen max-w-full sm:w-[500px] lg:w-[42vw] xl:w-[40vw] bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col animate-in slide-in-from-right duration-200">
              
              {/* DRAWER HEADER */}
              <div className="px-6 py-4 bg-[#F5F7FA] border-b border-[#E2E8F0] flex items-start justify-between gap-3 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#06B6D4] bg-white px-2.5 py-0.5 rounded border border-cyan-200">
                      {activeCluster.proposedCNMC}
                    </span>
                    <span className="text-[11px] text-[#64748B] font-medium">• {activeCluster.category}</span>
                  </div>

                  <h2 className="font-bold text-sm text-[#17202A] leading-snug">
                    {activeCluster.standardizedDescription}
                  </h2>

                  <div className="pt-0.5 flex items-center gap-2">
                    <span className="text-[11px] text-[#64748B] font-medium">Status:</span>
                    {renderStatusBadge(activeCluster.status)}
                  </div>
                </div>

                <button
                  onClick={handleCloseDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                  aria-label="Close drawer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DRAWER SCROLLABLE BODY */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                
                {/* 1. ORIGINAL MATERIALS COMPACT COMPARISON */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                      Original Materials ({activeCluster.items.length} CPSE Items)
                    </h3>
                    <span className="text-[11px] text-[#64748B]">Disparate Ingested Masters</span>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F5F7FA] text-[#17202A] font-semibold border-b border-[#E2E8F0]">
                        <tr>
                          <th className="py-2.5 px-3">CPSE</th>
                          <th className="py-2.5 px-3">Original Code</th>
                          <th className="py-2.5 px-3">Original Description</th>
                          <th className="py-2.5 px-3">Specification</th>
                          <th className="py-2.5 px-2 text-center">UOM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {activeCluster.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-[#17202A] whitespace-nowrap">
                              {item.cpse}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-[#06B6D4] whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <span>{item.code}</span>
                                <button 
                                  onClick={(e) => handleCopy(item.code, e)}
                                  className="text-slate-400 hover:text-[#06B6D4]"
                                  title="Copy code"
                                >
                                  {copiedCode === item.code ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-[#17202A] max-w-[140px] truncate" title={item.description}>
                              {item.description}
                            </td>
                            <td className="py-2.5 px-3 text-[#64748B] text-[11px] max-w-[150px] truncate" title={item.spec}>
                              {item.spec}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-[#17202A]">
                              {item.uom}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. STANDARDIZED MATERIAL */}
                <div className="p-4 bg-slate-50/80 rounded-xl border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                      Standardized Material Master
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#06B6D4] bg-white px-2 py-0.5 rounded border border-cyan-200">
                      {activeCluster.proposedCNMC}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Standard Description</span>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={modifiedName}
                          onChange={(e) => setModifiedName(e.target.value)}
                          className="w-full p-2 bg-white border border-[#06B6D4] rounded-lg text-xs font-semibold text-[#17202A] focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(activeCluster.id, 'Modified', modifiedName)}
                            className="px-3 py-1 bg-[#06B6D4] text-white rounded-lg text-xs font-bold"
                          >
                            Save Title
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 bg-slate-200 text-[#17202A] rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
                        <span className="font-bold text-xs text-[#17202A]">
                          {activeCluster.standardizedDescription}
                        </span>
                        {currentRole !== 'procurement' && (
                          <button
                            onClick={() => {
                              setModifiedName(activeCluster.standardizedDescription);
                              setIsEditing(true);
                            }}
                            className="text-[#06B6D4] hover:text-cyan-700 font-semibold text-[11px] flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Technical Attributes Grid */}
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1.5">
                      Extracted Technical Attributes
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(activeCluster.technicalAttributes).map(([key, val]) => (
                        <div key={key} className="p-2 bg-white rounded-lg border border-[#E2E8F0]">
                          <span className="text-[10px] text-[#64748B] uppercase font-semibold block capitalize">{key}</span>
                          <span className="font-semibold text-[#17202A]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. AI MATCH ANALYSIS */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                      AI Match Analysis
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-center">
                      <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Semantic Similarity</span>
                      <span className="text-base font-bold font-mono text-[#06B6D4]">{activeCluster.semanticSimilarity}%</span>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">Sentence-BERT</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-center">
                      <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Attribute Match</span>
                      <span className="text-base font-bold font-mono text-[#06B6D4]">{activeCluster.attributeMatchScore}%</span>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">NER Normalized</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] text-center">
                      <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Match Confidence</span>
                      <span className="text-base font-bold font-mono text-emerald-700">{activeCluster.confidenceScore}%</span>
                      <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">High Confidence</span>
                    </div>
                  </div>
                </div>

                {/* 4. WHY AI MATCHED (Concise Reasons) */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202A]">
                    Why AI Matched ({activeCluster.matchReasons.length} Evidence Points)
                  </h3>

                  <div className="bg-slate-50 rounded-xl p-3.5 border border-[#E2E8F0] space-y-2">
                    {activeCluster.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-[#17202A]">{reason.label}:</strong> {reason.value}
                          <span className="text-[#64748B] block text-[11px] mt-0.5">{reason.evidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. EXPERT VALIDATION OR PROCUREMENT VIEW */}
                {currentRole === 'procurement' ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17202A] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#64748B]" />
                        <span>Technical Validation Status</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                        Procurement Mode
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Procurement users have read-only visibility into AI recommendations and match rationale. Final CNMC mapping sign-off and specification modifications are strictly reserved for Technical Experts and Administrators.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17202A] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
                        <span>{currentRole === 'admin' ? 'Administrator Master Governance' : 'Domain Expert Validation'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#06B6D4] bg-white px-2 py-0.5 rounded border border-cyan-200">
                        {currentRole === 'admin' ? 'Admin Authority' : 'Authorized Sign-off'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748B]">
                      "AI recommends. Authorized experts validate." Approving this cluster commits the Common National Material Code (CNMC) into the Unified Master Catalog with zero risk to CPSE ERP systems.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => handleAction(activeCluster.id, 'Approved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Harmonize</span>
                      </button>

                      <button
                        onClick={() => handleAction(activeCluster.id, 'Rejected')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/90 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => {
                          setModifiedName(activeCluster.standardizedDescription);
                          setIsEditing(true);
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#17202A] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>Review / Modify</span>
                      </button>

                      {currentRole === 'admin' && activeCluster.status !== 'Pending Expert Review' && (
                        <button
                          onClick={() => handleAction(activeCluster.id, 'Pending Expert Review')}
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#17202A] border border-[#E2E8F0] rounded-xl text-xs font-semibold transition-colors"
                        >
                          Reopen Mapping
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DRAWER FOOTER */}
              <div className="p-4 bg-[#F5F7FA] border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
                <span className="text-[11px] text-[#64748B]">
                  National Procurement Harmonization Framework
                </span>
                <button
                  onClick={handleCloseDrawer}
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
