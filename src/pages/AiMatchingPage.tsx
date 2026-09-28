import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { MatchCandidate, NavigationPage } from '../types';

interface AiMatchingPageProps {
  candidates: MatchCandidate[];
  onNavigate: (page: NavigationPage) => void;
  onTriggerRun: () => void;
  onSelectForValidation: (candidateId: string) => void;
}

export const AiMatchingPage: React.FC<AiMatchingPageProps> = ({
  candidates,
  onNavigate,
  onTriggerRun,
  onSelectForValidation
}) => {
  const [filterConfidence, setFilterConfidence] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [runMessage, setRunMessage] = useState<string | null>(null);

  const filteredCandidates = candidates.filter((c) => {
    if (filterConfidence === 'ALL') return true;
    return c.confidenceLevel === filterConfidence;
  });

  const handleTriggerEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      onTriggerRun();
      setIsEvaluating(false);
      setRunMessage('SBERT Semantic Pipeline executed: Cross-CPSE material vector similarities evaluated.');
      setTimeout(() => setRunMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top AI Engine Architecture Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h2 className="text-base font-bold text-slate-900">
                SBERT Cross-Enterprise Semantic Matching Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Calculates multidimensional similarity vectors between heterogeneous CPSE legacy catalogs by combining Sentence-BERT transformer text embeddings with technical parameter extraction (ASTM, ASME, DIN, ISO standards, size tolerances, material grades).
            </p>
          </div>

          <button
            disabled={isEvaluating}
            onClick={handleTriggerEvaluation}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0 self-start lg:self-auto"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing SBERT Vector Embeddings...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-blue-200" />
                <span>Run SBERT Matching Pipeline</span>
              </>
            )}
          </button>
        </div>

        {runMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{runMessage}</span>
          </div>
        )}

        {/* Engine Pipeline Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500">Embedding Architecture:</span>
            <span className="font-mono font-bold text-slate-800">Domain SBERT + FastText</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500">Active Candidates:</span>
            <span className="font-bold text-blue-700">{candidates.length} Candidate Pair(s)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500">Target Standard Taxonomy:</span>
            <span className="font-mono font-bold text-slate-800">UNSPSC v26 + MESC</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Confidence Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <button
            onClick={() => setFilterConfidence('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterConfidence === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setFilterConfidence('HIGH')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterConfidence === 'HIGH'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High Confidence &gt; 88% ({candidates.filter(c => c.confidenceLevel === 'HIGH').length})
          </button>
          <button
            onClick={() => setFilterConfidence('MEDIUM')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filterConfidence === 'MEDIUM'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medium Confidence ({candidates.filter(c => c.confidenceLevel === 'MEDIUM').length})
          </button>
        </div>

        <button
          onClick={() => onNavigate('validation')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Go to Expert Validation Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Candidate Pairs Grid */}
      <div className="space-y-6">
        {filteredCandidates.map((candidate) => {
          const scorePercent = Math.round(candidate.similarityScore * 100);
          const semanticPercent = Math.round(candidate.semanticScore * 100);
          const attrPercent = Math.round(candidate.attributeMatchScore * 100);

          return (
            <div
              key={candidate.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all"
            >
              {/* Card Header Bar */}
              <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    PAIR ID: {candidate.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    candidate.confidenceLevel === 'HIGH' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {candidate.confidenceLevel} Confidence
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Similarity Score:</span>
                    <span className="font-extrabold text-sm text-blue-700 font-mono">
                      {scorePercent}%
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectForValidation(candidate.id);
                      onNavigate('validation');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Validate in Queue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison Container */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Source Record */}
                  <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {candidate.sourceRecord.cpseName} Catalog
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 font-medium">
                        {candidate.sourceRecord.legacyCode}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Legacy Description</div>
                      <div className="font-semibold text-slate-800 text-xs mt-0.5 leading-snug">
                        {candidate.sourceRecord.description}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Key Specifications</div>
                      <div className="space-y-1">
                        {Object.entries(candidate.sourceRecord.specifications || {}).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">{k}:</span>
                            <span className="font-mono text-slate-800 font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Target Record */}
                  <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {candidate.targetRecord.cpseName} Catalog
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 font-medium">
                        {candidate.targetRecord.legacyCode}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Legacy Description</div>
                      <div className="font-semibold text-slate-800 text-xs mt-0.5 leading-snug">
                        {candidate.targetRecord.description}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Key Specifications</div>
                      <div className="space-y-1">
                        {Object.entries(candidate.targetRecord.specifications || {}).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">{k}:</span>
                            <span className="font-mono text-slate-800 font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Synthesis & AI Rationale Section */}
                <div className="mt-5 p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100/70">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">SBERT Embedding Cosine:</span>{' '}
                        <strong className="text-blue-700 font-mono">{semanticPercent}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Attribute Convergence:</span>{' '}
                        <strong className="text-blue-700 font-mono">{attrPercent}%</strong>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Evaluated: {new Date(candidate.evaluatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Attributes Analysis Badges */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        ✓ Converging Attributes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.matchingAttributes.map((attr, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                        ⚠ Noted Syntactic Variations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.differingAttributes.map((attr, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Proposed Standardized Result */}
                  <div className="p-3 bg-white rounded-lg border border-blue-200/70 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-blue-700">Proposed Standardized Master Title:</span>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">UNSPSC: {candidate.proposedUNSPSC}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-xs">
                      {candidate.proposedStandardizedName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      "{candidate.matchRationale}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
