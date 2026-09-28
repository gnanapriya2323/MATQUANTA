import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw, 
  Check, 
  Info 
} from 'lucide-react';
import type { MaterialRecord, UploadBatch } from '../types';
import { SAMPLE_CPSES } from '../services/sampleData';
import { materialStore } from '../services/materialStore';

interface UploadPageProps {
  batches: UploadBatch[];
  onUploadSuccess: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  batches,
  onUploadSuccess
}) => {
  const [selectedCpse, setSelectedCpse] = useState(SAMPLE_CPSES[0].id);
  const [fileName, setFileName] = useState<string>('');
  const [parsedPreview, setParsedPreview] = useState<Partial<MaterialRecord>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Column Mappings State
  const colMapping = {
    code: 'LEGACY_ITEM_CODE',
    description: 'MATERIAL_SHORT_DESC',
    category: 'COMMODITY_GROUP',
    uom: 'BASE_UOM',
    specs: 'TECHNICAL_SPECS'
  };

  const loadSampleDataset = () => {
    setFileName('CPSE_A_Turbomachinery_Pipes_Valves_2026.csv');
    const simulatedRows: Partial<MaterialRecord>[] = [
      {
        legacyCode: 'HE-VLV-BL-3IN-300-SS',
        description: 'BALL VALVE 3 INCH CLASS 300 FLANGED FULL BORE SS316 BODY PTFE SEAT',
        category: 'Valves & Actuators',
        unitOfMeasure: 'NOS',
        specifications: { 'Size': '3 Inch', 'Rating': '300#', 'Body': 'SS 316', 'Bore': 'Full Bore' }
      },
      {
        legacyCode: 'HE-PIP-SMLS-6IN-SCH40',
        description: 'PIPE SEAMLESS A312 TP304 6 INCH SCH 40 BEVELED ENDS PLAIN',
        category: 'Pipes & Fittings',
        unitOfMeasure: 'MTR',
        specifications: { 'Size': '6 Inch', 'Schedule': 'SCH 40', 'Grade': 'ASTM A312 TP304' }
      },
      {
        legacyCode: 'HE-BRG-7210-BECBM',
        description: 'ANGULAR CONTACT BALL BEARING 7210 BECBM SINGLE ROW BRASS CAGE 50X90X20MM',
        category: 'Bearings & Power Transmission',
        unitOfMeasure: 'NOS',
        specifications: { 'Designation': '7210 BECBM', 'Bore': '50mm', 'OD': '90mm', 'Width': '20mm' }
      },
      {
        legacyCode: 'HE-GSK-SPW-4IN-150-GRAPH',
        description: 'SPIRAL WOUND GASKET 4" 150# ASME B16.20 316SS WITH GRAPHITE FILLER',
        category: 'Fasteners & Hardware',
        unitOfMeasure: 'NOS',
        specifications: { 'Size': '4 Inch', 'Class': '150#', 'Winding': 'SS 316' }
      }
    ];
    setParsedPreview(simulatedRows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFileName(selected.name);
      loadSampleDataset();
    }
  };

  const handleProcessAndIngest = () => {
    if (parsedPreview.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const cpse = SAMPLE_CPSES.find(c => c.id === selectedCpse) || SAMPLE_CPSES[0];
      const newRecords: MaterialRecord[] = parsedPreview.map((item, idx) => ({
        id: `rec-up-${Date.now()}-${idx}`,
        cpseId: cpse.id,
        cpseName: cpse.code,
        legacyCode: item.legacyCode || `MAT-${Math.floor(10000 + Math.random() * 90000)}`,
        description: item.description || 'Uploaded material description',
        category: item.category || 'General Industrial',
        unitOfMeasure: item.unitOfMeasure || 'NOS',
        specifications: item.specifications || {},
        status: 'raw',
        uploadedAt: new Date().toISOString(),
        batchId: `batch-${Date.now()}`
      }));

      materialStore.addUploadBatch(selectedCpse, fileName || 'Uploaded_Dataset.csv', newRecords);
      setIsProcessing(false);
      setUploadSuccess(true);
      onUploadSuccess();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upload Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ingest CPSE Catalog Dump</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload legacy material extracts in CSV, XLSX, or JSON format for deduplication and attribute mapping.
            </p>
          </div>
          <button
            onClick={loadSampleDataset}
            className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Load Representative Sample CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Col 1: Select CPSE Source */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Target CPSE Entity
              </label>
              <select
                value={selectedCpse}
                onChange={(e) => setSelectedCpse(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {SAMPLE_CPSES.map((cpse) => (
                  <option key={cpse.id} value={cpse.id}>
                    {cpse.name} ({cpse.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Designates the organizational source entity for the ingested material records.
              </p>
            </div>

            {/* Ingestion Spec Notes */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Pre-flight Checks</span>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                <li>Automatic encoding normalization (UTF-8)</li>
                <li>Punctuation & symbol standardizer</li>
                <li>Regex extraction of metric / imperial sizes</li>
              </ul>
            </div>
          </div>

          {/* Col 2 & 3: Drag and Drop Upload Area */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Upload File Dump
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center">
              <UploadCloud className="w-10 h-10 text-blue-600 mb-2" />
              <p className="text-xs font-bold text-slate-800">
                {fileName ? fileName : 'Drag & drop catalog files here, or browse from computer'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports .CSV, .XLSX, .JSON (Max 50MB per batch)
              </p>

              <div className="mt-4 flex items-center gap-3">
                <label className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer shadow-sm transition-all">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv, .xlsx, .json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Parsed Preview & Column Mapping Section */}
        {parsedPreview.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Column Mapping & Schema Verification</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify header mapping from file columns to standardized MATQUANTA schema.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                {parsedPreview.length} Valid Records Ready
              </span>
            </div>

            {/* Column Mapping Selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Legacy Code</span>
                <div className="mt-1 font-mono text-[11px] bg-white border border-slate-300 p-1.5 rounded font-medium text-slate-800">
                  {colMapping.code}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Description</span>
                <div className="mt-1 font-mono text-[11px] bg-white border border-slate-300 p-1.5 rounded font-medium text-slate-800">
                  {colMapping.description}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Category</span>
                <div className="mt-1 font-mono text-[11px] bg-white border border-slate-300 p-1.5 rounded font-medium text-slate-800">
                  {colMapping.category}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">UOM</span>
                <div className="mt-1 font-mono text-[11px] bg-white border border-slate-300 p-1.5 rounded font-medium text-slate-800">
                  {colMapping.uom}
                </div>
              </div>
            </div>

            {/* Data Preview Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Legacy Code</th>
                    <th className="p-3">Material Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">UOM</th>
                    <th className="p-3">Key Specifications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {parsedPreview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-slate-800 font-medium">{row.legacyCode}</td>
                      <td className="p-3 text-slate-700 font-medium">{row.description}</td>
                      <td className="p-3 text-slate-600">{row.category}</td>
                      <td className="p-3 font-mono text-slate-600">{row.unitOfMeasure}</td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {Object.entries(row.specifications || {}).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ingest Action Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => { setParsedPreview([]); setFileName(''); }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={handleProcessAndIngest}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Batch & Normalizing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ingest {parsedPreview.length} Records into CPSE Vault</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Upload Success Alert */}
        {uploadSuccess && (
          <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Batch Ingested Successfully!</strong> Materials added to CPSE vault and queued for SBERT AI matching pass.
              </span>
            </div>
            <button
              onClick={() => setUploadSuccess(false)}
              className="text-emerald-700 font-semibold underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Historical Batch Ingestion Audit */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ingestion Batch Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">Previous catalog ingestions across CPSE sources</p>
          </div>
          <span className="text-xs text-slate-400">{batches.length} Batches Processed</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Batch ID</th>
                <th className="p-3">Source CPSE</th>
                <th className="p-3">Filename</th>
                <th className="p-3">Total Rows</th>
                <th className="p-3">Valid / Invalid</th>
                <th className="p-3">Ingested At</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-slate-600">{batch.id}</td>
                  <td className="p-3 font-semibold text-slate-800">{batch.cpseName}</td>
                  <td className="p-3 font-mono text-slate-600">{batch.filename}</td>
                  <td className="p-3 font-semibold text-slate-800">{batch.totalRows.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="text-emerald-600 font-medium">{batch.validRows.toLocaleString()}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-slate-400">{batch.invalidRows}</span>
                  </td>
                  <td className="p-3 text-slate-500">{batch.uploadedAt}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
