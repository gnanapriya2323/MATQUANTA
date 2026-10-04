import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { materialStore } from '../services/materialStore';

export const AdministrationPage: React.FC = () => {
  const [similarityThreshold, setSimilarityThreshold] = useState(0.85);
  const [autoFlagNearDupes, setAutoFlagNearDupes] = useState(true);
  const [enforceMfa, setEnforceMfa] = useState(true);
  const [requireDualSignoff, setRequireDualSignoff] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const [apiKeyGenerated, setApiKeyGenerated] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleGenerateApiKey = () => {
    const key = `mq_live_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    setApiKeyGenerated(key);
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset all representative sample datasets and onboarding requests back to default SIH 26099 baseline?')) {
      materialStore.resetToDefaultSample();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B192C] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">System configuration parameters saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Governance & Policy Controls
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                SIH Problem Statement 26099
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">System Administration & Governance</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Configure AI matching thresholds, role-based signoff rules, national taxonomy hierarchies, and CPSE access credentials.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* NLP & AI Matching Parameters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            AI & NLP Matching Engine Thresholds
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Configure Sentence-BERT semantic cosine distance boundaries and automated classification rules.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-700 uppercase">
                  Semantic Cosine Similarity Cutoff
                </label>
                <span className="text-xs font-bold text-blue-600 font-mono">
                  {similarityThreshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.70"
                max="0.98"
                step="0.01"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Scores &ge; {similarityThreshold.toFixed(2)} are routed to the <strong>Expert Validation Queue</strong> as potential duplicates.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFlagNearDupes}
                  onChange={(e) => setAutoFlagNearDupes(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Auto-detect Near Duplicates</span>
                  <span className="text-[11px] text-slate-500 block">
                    Flag catalog items differing only by punctuation, abbreviation order, or unit representation.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceMfa}
                  onChange={(e) => setEnforceMfa(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Enforce Multi-Factor Authentication (MFA)</span>
                  <span className="text-[11px] text-slate-500 block">
                    Require OTP / Smart Token verification for domain expert validation actions.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireDualSignoff}
                  onChange={(e) => setRequireDualSignoff(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Mandate Dual-Expert Signoff for High-Value Materials</span>
                  <span className="text-[11px] text-slate-500 block">
                    Require approval from both CPSE nodal authority and central standardization specialist.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Security & Access Management */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            CPSE API Credential Management
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Generate and manage access tokens for enterprise SAP / ERP integration gateways.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Generate Ingestion Gateway Token</span>
                <span className="text-[11px] text-slate-500 block">
                  Creates an authorized OAuth2 bearer secret for programmatic catalog ingestion.
                </span>
              </div>
              <button
                type="button"
                onClick={handleGenerateApiKey}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                Generate Key
              </button>
            </div>

            {apiKeyGenerated && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-[11px] font-bold text-emerald-800 uppercase mb-1">New Gateway Token Active:</div>
                <div className="font-mono text-xs font-bold text-emerald-950 bg-white p-2 rounded border border-emerald-300 select-all">
                  {apiKeyGenerated}
                </div>
                <p className="text-[10px] text-emerald-700 mt-1">Store securely. This token has write access to CPSE staging queues.</p>
              </div>
            )}
          </div>
        </div>

        {/* Governance & Policy Alignment */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            SIH Problem Statement 26099 Compliance Baseline
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Statutory principles verified across the MATQUANTA harmonization runtime
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Preservation of CPSE Legacy Codes</strong>
                <span className="text-slate-500">Original CPSE ERP codes remain permanently mapped, never overwritten.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Human-in-the-Loop Governance</strong>
                <span className="text-slate-500">AI recommends candidates; authorized domain experts provide signoff.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Common National Material Code (CNMC)</strong>
                <span className="text-slate-500">Standard 6-digit CNMC format adopted across all unified catalog entries.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 block">Non-Disruptive ERP Integration</strong>
                <span className="text-slate-500">Integration layer supports SAP ECC, S/4HANA, Oracle and open APIs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleResetSampleData}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Representative Sample Dataset
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
