import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Code2, 
  Layers, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldAlert, 
  Terminal
} from 'lucide-react';

export const SapErpIntegrationPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'fetch' | 'ingest' | 'sync'>('fetch');
  const [copied, setCopied] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunMockTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      if (selectedEndpoint === 'fetch') {
        setTestResponse(JSON.stringify({
          status: 200,
          cnmcCode: "CNMC-000001",
          standardName: "SS Ball Valve 50mm Class 150 Flanged Full Bore",
          unspsc: "40141600",
          mappedCPSEs: [
            { cpse: "CPSE A", erpCode: "MAT1001", syncStatus: "SYNCHRONIZED" },
            { cpse: "CPSE B", erpCode: "458721", syncStatus: "SYNCHRONIZED" },
            { cpse: "CPSE C", erpCode: "PV2034", syncStatus: "SYNCHRONIZED" }
          ],
          gatewayLatency: "18ms"
        }, null, 2));
      } else if (selectedEndpoint === 'ingest') {
        setTestResponse(JSON.stringify({
          status: 201,
          batchId: "SAP-BATCH-9942",
          recordsReceived: 120,
          validationStatus: "PASS",
          queuedForNlpStandardization: true
        }, null, 2));
      } else {
        setTestResponse(JSON.stringify({
          status: 200,
          message: "Bidirectional CNMC delta sync successfully dispatched to SAP S/4HANA staging tables.",
          affectedRecords: 14
        }, null, 2));
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Enterprise Connectivity Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                SAP / ERP Integration Layer
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SAP & Enterprise ERP Integration Gateway</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Automated ingestion pipelines, RFC / OData connectors, and bidirectional synchronization endpoints connecting heterogeneous CPSE ERP systems.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Readiness Notice */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold text-blue-950">Integration Readiness Note: </span>
          The integration architecture below reflects standard CPSE ERP interoperability (SAP ECC, SAP S/4HANA, Oracle ERP Cloud, and Custom SQL). For this SIH 26099 prototype, live connector interfaces execute against validated mock gateway endpoints.
        </div>
      </div>

      {/* Visual Pipeline Diagram */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          End-to-End Enterprise Ingestion & Synchronization Pipeline
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Architectural flow from CPSE raw catalog extraction to national CNMC distribution
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs mb-2">1</div>
              <h3 className="font-bold text-slate-900 text-xs">CPSE ERP Extract</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                SAP MARA/MAKT tables, Oracle Item Master, or CSV/API dumps.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-600">
              RFC / OData / REST
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2">2</div>
              <h3 className="font-bold text-blue-950 text-xs">Security & Ingestion</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Schema validation, attribute sanitization, and batch tokenization.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200 text-[10px] font-mono text-blue-700">
              Kafka / Celery Queue
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-2">3</div>
              <h3 className="font-bold text-indigo-950 text-xs">AI Standardization</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Sentence-BERT embeddings, unit normalizer, and cosine matching.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-200 text-[10px] font-mono text-indigo-700">
              FastAPI + SBERT
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2">4</div>
              <h3 className="font-bold text-emerald-950 text-xs">Expert Validation</h3>
              <p className="text-[11px] text-slate-600 mt-1">
                Authorized domain signoff, CNMC code assignment & governance audit.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200 text-[10px] font-mono text-emerald-700">
              Immutable Audit Log
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs mb-2">5</div>
              <h3 className="font-bold text-white text-xs">Bidirectional Sync</h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Updates CPSE ERP cross-reference tables with certified CNMC codes.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-700 text-[10px] font-mono text-emerald-400">
              National Material Master
            </div>
          </div>
        </div>
      </div>

      {/* Connected CPSE ERP Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">CPSE A (Heavy Eng.)</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">ERP System:</span>
              <span className="font-semibold text-slate-800">SAP S/4HANA (On-Prem)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connector:</span>
              <span className="font-mono text-slate-800">OData v4 Gateway</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sync Frequency:</span>
              <span className="text-slate-800">Daily Delta @ 02:00 IST</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">CPSE B (Energy)</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Connected
            </span>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">ERP System:</span>
              <span className="font-semibold text-slate-800">SAP ECC 6.0 EHP8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connector:</span>
              <span className="font-mono text-slate-800">RFC / NetWeaver BAPI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sync Frequency:</span>
              <span className="text-slate-800">Real-time Webhook</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">CPSE C (Petrochemicals)</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Clock className="w-3 h-3" />
              Pilot Active
            </span>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">ERP System:</span>
              <span className="font-semibold text-slate-800">Oracle Fusion ERP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connector:</span>
              <span className="font-mono text-slate-800">REST API Gateway</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sync Frequency:</span>
              <span className="text-slate-800">Weekly Scheduled Batch</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Console and Documentation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              REST API & Integration Endpoints Specification
            </h2>
            <p className="text-xs text-slate-500">Standardized API connectors for CPSE IT departments</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mb-4 gap-2">
          <button
            onClick={() => { setSelectedEndpoint('fetch'); setTestResponse(null); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${selectedEndpoint === 'fetch' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            GET /api/v1/cnmc/{'{cnmcCode}'}
          </button>
          <button
            onClick={() => { setSelectedEndpoint('ingest'); setTestResponse(null); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${selectedEndpoint === 'ingest' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            POST /api/v1/material/ingest
          </button>
          <button
            onClick={() => { setSelectedEndpoint('sync'); setTestResponse(null); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${selectedEndpoint === 'sync' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            POST /api/v1/sync/sap-delta
          </button>
        </div>

        {/* Code Snippet */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto relative">
          <button
            onClick={() => handleCopy(selectedEndpoint === 'fetch' ? 'curl -X GET https://api.matquanta.gov.in/api/v1/cnmc/CNMC-000001 -H "Authorization: Bearer <API_KEY>"' : selectedEndpoint === 'ingest' ? 'curl -X POST https://api.matquanta.gov.in/api/v1/material/ingest -H "Content-Type: application/json" -d \'{"cpseCode":"CPSE-A","records":[...]}\'' : 'curl -X POST https://api.matquanta.gov.in/api/v1/sync/sap-delta -H "Authorization: Bearer <API_KEY>"')}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Copy snippet"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {selectedEndpoint === 'fetch' && (
            <div className="space-y-2">
              <div className="text-slate-400">// Fetch standardized material details by CNMC code</div>
              <div className="text-emerald-400">curl -X GET https://api.matquanta.gov.in/api/v1/cnmc/CNMC-000001 \</div>
              <div className="text-slate-300 ml-4">-H "Authorization: Bearer CPSE_SECRET_TOKEN" \</div>
              <div className="text-slate-300 ml-4">-H "Accept: application/json"</div>
            </div>
          )}

          {selectedEndpoint === 'ingest' && (
            <div className="space-y-2">
              <div className="text-slate-400">// Batch ingest catalog items from CPSE SAP extractor</div>
              <div className="text-emerald-400">curl -X POST https://api.matquanta.gov.in/api/v1/material/ingest \</div>
              <div className="text-slate-300 ml-4">-H "Content-Type: application/json" \</div>
              <div className="text-slate-300 ml-4">-H "Authorization: Bearer CPSE_SECRET_TOKEN" \</div>
              <div className="text-slate-300 ml-4">-d '&#123; "cpseCode": "CPSE-A", "batchSize": 100, "items": [...] &#125;'</div>
            </div>
          )}

          {selectedEndpoint === 'sync' && (
            <div className="space-y-2">
              <div className="text-slate-400">// Push validated CNMC master mapping back into SAP cross-walk table</div>
              <div className="text-emerald-400">curl -X POST https://api.matquanta.gov.in/api/v1/sync/sap-delta \</div>
              <div className="text-slate-300 ml-4">-H "Authorization: Bearer CPSE_SECRET_TOKEN" \</div>
              <div className="text-slate-300 ml-4">-d '&#123; "targetSystem": "SAP_S4HANA", "destinationTable": "ZMAT_CNMC_MAP" &#125;'</div>
            </div>
          )}
        </div>

        {/* Test Console */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            Interactive Mock Endpoint Simulator
          </div>
          <button
            onClick={handleRunMockTest}
            disabled={testing}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            {testing ? 'Executing Gateway Call...' : 'Execute Test Request'}
          </button>
        </div>

        {/* Test Response Output */}
        {testResponse && (
          <div className="mt-4 bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Gateway Response (HTTP 200 OK)
            </div>
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto">{testResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
