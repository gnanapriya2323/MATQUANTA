import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Layers, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import type { MatchCandidate, NavigationPage, UnifiedMaterial } from '../types';

interface ExpertValidationProps {
  candidates: MatchCandidate[];
  selectedCandidateId: string | null;
  onAcceptMatch: (candidateId: string, reviewer: string, remarks: string, customName?: string, customCode?: string) => UnifiedMaterial | null;
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

  // Form states
  const activeCandidate = pendingCandidates.find(c => c.id === activeId) || pendingCandidates[0];
  const [reviewerName, setReviewerName] = useState('Dr. V. Raman');
  const [reviewerRole, setReviewerRole] = useState('Lead Domain Expert (Mechanical)');
  const [standardName, setStandardName] = useState('');
  const [unifiedCode, setUnifiedCode] = useState('');
  const [unspscCode, setUnspscCode] = useState('');
  const [standardUom, setStandardUom] = useState('NOS');
  const [remarks, setRemarks] = useState('');
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (activeCandidate) {
      setStandardName(activeCandidate.proposedStandardizedName);
      setUnifiedCode(`MQ-STD-${Math.floor(1000 + Math.random() * 9000)}`);
      setUnspscCode(activeCandidate.proposedUNSPSC);
      setStandardUom(activeCandidate.sourceRecord.unitOfMeasure);
      setRemarks(`Validated semantic and technical equivalence between ${activeCandidate.sourceRecord.legacyCode} (${activeCandidate.sourceRecord.cpseName}) and ${activeCandidate.targetRecord.legacyCode} (${activeCandidate.targetRecord.cpseName}). Confirmed identical physical tolerances and material specification.`);
    }
  }, [activeCandidate?.id]);

  const handleApprove = () => {
    if (!activeCandidate) return;
    const result = onAcceptMatch(
      activeCandidate.id,
      `${reviewerName} (${reviewerRole})`,
      remarks,
      standardName,
      unifiedCode
    );
    if (result) {
      setValidationSuccess(`Harmonization Approved! Unified Master Record created: ${result.unifiedCode}`);
      // switch to next candidate
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
    setValidationSuccess(`Match candidate rejected. Items categorized as distinct unique materials.`);
    const nextPending = pendingCandidates.filter(c => c.id !== activeCandidate.id);
    if (nextPending.length > 0) {
      setActiveId(nextPending[0].id);
    }
  };

  if (!activeCandidate) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Validation Queue Clear!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All AI candidate duplicate proposals have been verified by domain specialists.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('master')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>View Unified Master Catalog</span>
          </button>
          <button
            onClick={() => onNavigate('matching')}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Run Another Matching Pass</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
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

      {/* Main Validation Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Queue Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Pending Review Queue</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold">
                {pendingCandidates.length} Items
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {pendingCandidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    activeCandidate.id === c.id
                      ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-700">{c.id}</span>
                    <span className="font-mono text-blue-700 font-bold">
                      {Math.round(c.similarityScore * 100)}% Match
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {c.sourceRecord.description}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span>{c.sourceRecord.cpseName}</span>
                    <span>⟷</span>
                    <span>{c.targetRecord.cpseName}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Expert Guidelines Helper Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Standardization Protocol</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When approving a merge, verify that ASME/ISO dimensions, pressure ratings, and metallurgical standards are strictly equivalent to prevent field procurement hazards.
            </p>
          </div>
        </div>

        {/* Right Col: Active Candidate Verification & Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Comparison Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Material Equivalence Comparison</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI Similarity Score: <strong className="text-blue-700 font-mono">{Math.round(activeCandidate.similarityScore * 100)}%</strong>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                {activeCandidate.id}
              </span>
            </div>

            {/* Side-by-side Technical Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Source Item */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                    {activeCandidate.sourceRecord.cpseName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-600 font-semibold">
                    {activeCandidate.sourceRecord.legacyCode}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  {activeCandidate.sourceRecord.description}
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

              {/* Target Item */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                    {activeCandidate.targetRecord.cpseName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-600 font-semibold">
                    {activeCandidate.targetRecord.legacyCode}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 leading-snug">
                  {activeCandidate.targetRecord.description}
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

            {/* AI SBERT Rationale */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-800 text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI SBERT Rationale:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {activeCandidate.matchRationale}
              </p>
            </div>
          </div>

          {/* Expert Signoff & Standardized Record Creation Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Standardization Definition & Signoff</h3>

            <div className="space-y-4 text-xs">
              {/* Standardized Master Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Standardized Unified Material Name (Golden Record)
                </label>
                <input
                  type="text"
                  value={standardName}
                  onChange={(e) => setStandardName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs"
                />
              </div>

              {/* Code & UNSPSC Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Unified Material Code
                  </label>
                  <input
                    type="text"
                    value={unifiedCode}
                    onChange={(e) => setUnifiedCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    UNSPSC Code
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
                    Standard Base UOM
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
                  </select>
                </div>
              </div>

              {/* Reviewer Identity & Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Reviewer Name
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

              {/* Expert Audit Remarks */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Technical Validation Remarks & Justification
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Enter domain engineering rationale for this harmonization decision..."
                ></textarea>
              </div>
            </div>

            {/* Validation Actions Bar */}
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Accept & Create Golden Master Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
