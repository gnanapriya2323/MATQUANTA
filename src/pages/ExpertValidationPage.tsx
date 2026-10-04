import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Award
} from 'lucide-react';
import type { MatchCandidate, MatchType, NavigationPage, UnifiedMaterial } from '../types';

interface ExpertValidationProps {
  candidates: MatchCandidate[];
  selectedCandidateId: string | null;
  onAcceptMatch: (candidateId: string, reviewer: string, remarks: string, customName?: string, customCNMC?: string) => UnifiedMaterial | null;
  onRejectMatch: (candidateId: string, reviewer: string, remarks: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const ExpertValidationPage: React.FC<ExpertValidationProps> = ({
  candidates,
  selectedCandidateId,
  onAcceptMatch,
  onRejectMatch,
  onNavigate
}) => {
  const pendingCandidates = candidates.filter(c => c.status === 'pending');
  const [activeId, setActiveId] = useState<string>(
    selectedCandidateId && pendingCandidates.some(c => c.id === selectedCandidateId)
      ? selectedCandidateId
      : (pendingCandidates[0]?.id || '')
  );

  const activeCandidate = pendingCandidates.find(c => c.id === activeId) || pendingCandidates[0];

  // Form states
  const [reviewerName, setReviewerName] = useState('Dr. V. Raman');
  const [reviewerRole, setReviewerRole] = useState('Lead Domain Expert (Mechanical & Materials)');
  const [standardName, setStandardName] = useState('');
  const [cnmcCode, setCnmcCode] = useState('CNMC-000001');
  const [unspscCode, setUnspscCode] = useState('');
  const [standardUom, setStandardUom] = useState('NOS');
  const [remarks, setRemarks] = useState('');
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (activeCandidate) {
      setStandardName(activeCandidate.proposedStandardizedName);
      setCnmcCode(activeCandidate.proposedCNMC || `CNMC-${Math.floor(100000 + Math.random() * 900000)}`);
      setUnspscCode(activeCandidate.proposedUNSPSC);
      setStandardUom(activeCandidate.sourceRecord.unitOfMeasure);
      setRemarks(`Validated technical equivalence between ${activeCandidate.sourceRecord.cpseName} (${activeCandidate.sourceRecord.legacyCode}) and ${activeCandidate.targetRecord.cpseName} (${activeCandidate.targetRecord.legacyCode}). Confirmed matching engineering tolerances, ASME/ISO design codes, and metallurgical grade.`);
    }
  }, [activeCandidate?.id]);

  const handleApprove = () => {
    if (!activeCandidate) return;
    const result = onAcceptMatch(
      activeCandidate.id,
      `${reviewerName} (${reviewerRole})`,
      remarks,
      standardName,
      cnmcCode
    );
    if (result) {
      setValidationSuccess(`Harmonization Approved! CPSE codes mapped to Common National Material Code: ${result.cnmcCode}`);
      const nextPending = pendingCandidates.filter(c => c.id !== activeCandidate.id);
      if (nextPending.length > 0) {
        setActiveId(nextPending[0].id);
      }
    }
  };

  const handleReject = () => {
    if (!activeCandidate) return;
    onRejectMatch(
      activeCandidate.id,
      `${reviewerName} (${reviewerRole})`,
      remarks || 'Domain review rejected duplicate proposition. Marked items as distinct materials.'
    );
    setValidationSuccess(`Match candidate rejected. Materials categorized as distinct unique items.`);
    const nextPending = pendingCandidates.filter(c => c.id !== activeCandidate.id);
    if (nextPending.length > 0) {
      setActiveId(nextPending[0].id);
    }
  };

  const getMatchTypeBadge = (type: MatchType) => {
    switch (type) {
      case 'Identical':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Identical</span>;
      case 'Duplicate':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">Duplicate</span>;
      case 'Near-Duplicate':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">Near-Duplicate</span>;
      case 'Functionally Equivalent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Functionally Equivalent</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">Distinct</span>;
    }
  };

  if (!activeCandidate) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Validation Queue Clear!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All AI candidate duplicate proposals have been verified by authorized domain specialists.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('master')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>View Unified Material Master</span>
          </button>
          <button
            onClick={() => onNavigate('matching')}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Run Another Matching Pass</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: SIH Rule */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0" />
          <div>
            <div className="text-xs font-bold tracking-tight">
              Human-in-the-Loop Governance Protocol
            </div>
            <div className="text-[11px] text-blue-200">
              <strong>“AI recommends. Authorized experts validate.”</strong> Original CPSE material codes are mapped, never deleted.
            </div>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs font-mono font-bold border border-blue-400/30 shrink-0">
          {pendingCandidates.length} Items Pending Review
        </span>
      </div>

      {/* Success Alert */}
      {validationSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{validationSuccess}</span>
          </div>
          <button
            onClick={() => setValidationSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Split Queue Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Pending Candidates Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Validation Queue</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                {pendingCandidates.length} Pending
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {pendingCandidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeCandidate.id === c.id
                      ? 'bg-blue-50/90 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-800">{c.id}</span>
                    <span className="font-mono text-blue-700 font-bold">
                      {Math.round(c.similarityScore * 100)}% Match
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {c.sourceRecord.description}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100">
                    <span className="font-medium">{c.sourceRecord.cpseName} ⟷ {c.targetRecord.cpseName}</span>
                    {getMatchTypeBadge(c.matchType)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Candidate Verification & Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Comparison Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Material Equivalence Verification</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI Similarity: <strong className="text-blue-700 font-mono">{Math.round(activeCandidate.similarityScore * 100)}%</strong> • Match Type: {getMatchTypeBadge(activeCandidate.matchType)}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                {activeCandidate.id}
              </span>
            </div>

            {/* Side-by-side Technical Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Material A */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                    {activeCandidate.sourceRecord.cpseName}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    Code: {activeCandidate.sourceRecord.legacyCode}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  "{activeCandidate.sourceRecord.description}"
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  {Object.entries(activeCandidate.sourceRecord.specifications || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px]">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-mono font-medium text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material B */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                    {activeCandidate.targetRecord.cpseName}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    Code: {activeCandidate.targetRecord.legacyCode}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  "{activeCandidate.targetRecord.description}"
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  {Object.entries(activeCandidate.targetRecord.specifications || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px]">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-mono font-medium text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Explanation Summary */}
            <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-800 text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Recommendation Rationale:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {activeCandidate.matchRationale}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px]">
                {activeCandidate.aiExplanation.map((exp, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expert Signoff & CNMC Definition Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Common National Material Code (CNMC) Assignment</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                National Standard
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Standardized Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Canonical Standard Material Name (National Master Title) *
                </label>
                <input
                  type="text"
                  value={standardName}
                  onChange={(e) => setStandardName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs"
                />
              </div>

              {/* CNMC Code & UNSPSC Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Common National Material Code (CNMC) *
                  </label>
                  <input
                    type="text"
                    value={cnmcCode}
                    onChange={(e) => setCnmcCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-emerald-800 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    UNSPSC Taxonomy Code
                  </label>
                  <input
                    type="text"
                    value={unspscCode}
                    onChange={(e) => setUnspscCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Standard Unit of Measurement (UOM)
                  </label>
                  <select
                    value={standardUom}
                    onChange={(e) => setStandardUom(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                  >
                    <option value="NOS">NOS (Numbers)</option>
                    <option value="EA">EA (Each)</option>
                    <option value="MTR">MTR (Meters)</option>
                    <option value="SET">SET (Assembly Set)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="LTR">LTR (Liters)</option>
                  </select>
                </div>
              </div>

              {/* Reviewer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Authorized Technical Expert *
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Domain Role / Designation
                  </label>
                  <input
                    type="text"
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Validation Remarks */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Technical Validation Rationale & Audit Remarks *
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white leading-relaxed"
                ></textarea>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleReject}
                className="px-4 py-2 border border-rose-300 hover:bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Reject Match (Mark as Distinct)</span>
              </button>

              <button
                onClick={handleApprove}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Map to {cnmcCode}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
