import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  ArrowRight,
  Search,
  CheckCircle2,
  Copy,
  Tag,
  Zap,
  Layers,
  Info,
  Check
} from 'lucide-react';
import type { NavigationPage } from '../types';

interface StandardizationPageProps {
  onNavigate: (page: NavigationPage) => void;
}

interface StandardizedItem {
  original: string;
  standardized: string;
  category: string;
  subCategory: string;
  uom: string;
  attributes: Record<string, string>;
  abbreviationsApplied: { raw: string; std: string }[];
}

export const StandardizationPage: React.FC<StandardizationPageProps> = ({
  onNavigate
}) => {
  const [testInput, setTestInput] = useState('SS BV 2IN FLG');
  const [searchTableQuery, setSearchTableQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Pre-configured canonical catalog showing user's required example and key CPSE items
  const sampleStandardizedCatalog: StandardizedItem[] = [
    {
      original: 'SS BV 2IN FLG',
      standardized: 'Stainless Steel Ball Valve – 50 mm',
      category: 'Valves & Actuators',
      subCategory: 'Ball Valves',
      uom: 'NOS',
      attributes: {
        'Material': 'Stainless Steel 316 (ASTM A351 CF8M)',
        'Valve Type': 'Ball Valve (Full Bore)',
        'Nominal Size': '50 mm (2 Inch / DN50)',
        'Pressure Class': 'Class 150 (PN 20)',
        'End Connection': 'Flanged Raised Face (ASME B16.5 RF)'
      },
      abbreviationsApplied: [
        { raw: 'SS', std: 'Stainless Steel' },
        { raw: 'BV', std: 'Ball Valve' },
        { raw: '2IN', std: '50 mm (2 Inch / DN50)' },
        { raw: 'FLG', std: 'Flanged Raised Face' }
      ]
    },
    {
      original: 'BRG RAD 6309 C3 45X100X25',
      standardized: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
      category: 'Bearings & Power Transmission',
      subCategory: 'Ball Bearings',
      uom: 'NOS',
      attributes: {
        'Bearing Type': 'Deep Groove Radial Ball Bearing',
        'Designation': '6309 C3',
        'Dimensions': '45 mm (d) x 100 mm (D) x 25 mm (B)',
        'Clearance': 'C3 (23 - 43 µm)',
        'Standard': 'ISO 15 / DIN 625'
      },
      abbreviationsApplied: [
        { raw: 'BRG', std: 'Ball Bearing' },
        { raw: 'RAD', std: 'Radial' },
        { raw: 'C3', std: 'Internal Clearance C3' },
        { raw: '45X100X25', std: '45x100x25 mm' }
      ]
    },
    {
      original: 'FLG WN 4IN 150LB SS304 SCH40',
      standardized: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
      category: 'Pipes & Fittings',
      subCategory: 'Flanges',
      uom: 'NOS',
      attributes: {
        'Flange Type': 'Weld Neck (WN)',
        'Nominal Size': '4 Inch (DN100 / 100 mm NB)',
        'Pressure Class': 'Class 150 (PN 20)',
        'Facing': 'Raised Face (RF)',
        'Material': 'ASTM A182 Grade F304',
        'Pipe Schedule': 'Schedule 40 (Standard Wall)'
      },
      abbreviationsApplied: [
        { raw: 'FLG', std: 'Flange' },
        { raw: 'WN', std: 'Weld Neck' },
        { raw: '4IN', std: '4 Inch (DN100)' },
        { raw: '150LB', std: 'Class 150' },
        { raw: 'SS304', std: 'ASTM A182 F304' }
      ]
    },
    {
      original: 'BLT HEX M16X60 HT 8.8 HDG',
      standardized: 'Hexagon Head Bolt, M16 x 60 mm, Property Class 8.8, Hot Dip Galvanized',
      category: 'Fasteners & Hardware',
      subCategory: 'Bolts & Screws',
      uom: 'NOS',
      attributes: {
        'Fastener Type': 'Hexagon Head Bolt',
        'Thread Diameter': 'M16 (Metric ISO Thread)',
        'Length': '60 mm',
        'Property Class': 'Grade 8.8 High Tensile',
        'Finish': 'Hot Dip Galvanized (HDG)',
        'Standard': 'ISO 4017 / DIN 933'
      },
      abbreviationsApplied: [
        { raw: 'BLT', std: 'Bolt' },
        { raw: 'HEX', std: 'Hexagon Head' },
        { raw: 'HT', std: 'High Tensile' },
        { raw: '8.8', std: 'Property Class 8.8' },
        { raw: 'HDG', std: 'Hot Dip Galvanized' }
      ]
    },
    {
      original: 'CS PIPE SMLS 6IN SCH40 A106B',
      standardized: 'Seamless Carbon Steel Pipe, 6 Inch (DN150), Schedule 40, ASTM A106 Grade B',
      category: 'Pipes & Fittings',
      subCategory: 'Seamless Pipes',
      uom: 'MTR',
      attributes: {
        'Pipe Type': 'Seamless (SMLS)',
        'Nominal Size': '6 Inch (DN150 / 150 mm NB)',
        'Schedule': 'Schedule 40',
        'Material': 'Carbon Steel ASTM A106 Gr. B',
        'Ends': 'Bevelled Ends (BE)'
      },
      abbreviationsApplied: [
        { raw: 'CS', std: 'Carbon Steel' },
        { raw: 'SMLS', std: 'Seamless' },
        { raw: '6IN', std: '6 Inch (DN150)' },
        { raw: 'SCH40', std: 'Schedule 40' },
        { raw: 'A106B', std: 'ASTM A106 Grade B' }
      ]
    },
    {
      original: 'GSK SPW 6IN 300# SS316 GRAPH',
      standardized: 'Spiral Wound Gasket 6 Inch Class 300 SS316 / Graphite (ASME B16.20)',
      category: 'Fasteners & Hardware',
      subCategory: 'Gaskets & Seals',
      uom: 'NOS',
      attributes: {
        'Gasket Type': 'Spiral Wound (Style CGI)',
        'Nominal Size': '6 Inch (DN150)',
        'Rating': 'Class 300',
        'Winding': 'SS 316 (ASTM A240)',
        'Filler': 'Flexible Exfoliated Graphite',
        'Standard': 'ASME B16.20'
      },
      abbreviationsApplied: [
        { raw: 'GSK', std: 'Gasket' },
        { raw: 'SPW', std: 'Spiral Wound' },
        { raw: '6IN', std: '6 Inch' },
        { raw: '300#', std: 'Class 300' },
        { raw: 'GRAPH', std: 'Graphite Filler' }
      ]
    }
  ];

  const [normalizedResult, setNormalizedResult] = useState<StandardizedItem>(sampleStandardizedCatalog[0]);

  const handleTestStandardize = (inputString?: string) => {
    const raw = (inputString !== undefined ? inputString : testInput).trim();
    const low = raw.toLowerCase();

    // Check if input matches one of our catalog templates
    const catalogMatch = sampleStandardizedCatalog.find(
      c => c.original.toLowerCase() === low
    );

    if (catalogMatch) {
      setNormalizedResult(catalogMatch);
      return;
    }

    // Dynamic heuristic parsing for interactive demo
    if (low.includes('bearing') || low.includes('brg')) {
      setNormalizedResult({
        original: raw,
        standardized: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
        category: 'Bearings & Power Transmission',
        subCategory: 'Ball Bearings',
        uom: 'NOS',
        attributes: {
          'Bearing Type': 'Deep Groove Radial Ball Bearing',
          'Designation': '6309 C3',
          'Dimensions': '45x100x25 mm',
          'Clearance': 'C3 (Radial Clearance)',
          'Standard': 'ISO 15'
        },
        abbreviationsApplied: [
          { raw: 'BRG', std: 'Ball Bearing' },
          { raw: 'RAD', std: 'Radial' },
          { raw: 'C3', std: 'Clearance C3' }
        ]
      });
    } else if (low.includes('flg') || low.includes('flange')) {
      setNormalizedResult({
        original: raw,
        standardized: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
        category: 'Pipes & Fittings',
        subCategory: 'Flanges',
        uom: 'NOS',
        attributes: {
          'Flange Type': 'Weld Neck (WN)',
          'Size': '4 Inch (DN100)',
          'Rating': 'Class 150 (PN 20)',
          'Facing': 'Raised Face (RF)',
          'Material': 'ASTM A182 F304'
        },
        abbreviationsApplied: [
          { raw: 'FLG', std: 'Flange' },
          { raw: 'WN', std: 'Weld Neck' },
          { raw: '4IN', std: '4 Inch (DN100)' },
          { raw: '150LB', std: 'Class 150' }
        ]
      });
    } else if (low.includes('blt') || low.includes('bolt')) {
      setNormalizedResult({
        original: raw,
        standardized: 'Hexagon Head Bolt, M16 x 60 mm, Property Class 8.8, Hot Dip Galvanized',
        category: 'Fasteners & Hardware',
        subCategory: 'Bolts & Screws',
        uom: 'NOS',
        attributes: {
          'Fastener Type': 'Hexagon Head Bolt',
          'Thread': 'M16',
          'Length': '60 mm',
          'Property Class': 'Grade 8.8 High Tensile',
          'Coating': 'Hot Dip Galvanized (HDG)'
        },
        abbreviationsApplied: [
          { raw: 'BLT', std: 'Bolt' },
          { raw: 'HEX', std: 'Hexagon Head' },
          { raw: 'HT', std: 'High Tensile' },
          { raw: 'HDG', std: 'Hot Dip Galvanized' }
        ]
      });
    } else if (low.includes('pipe')) {
      setNormalizedResult({
        original: raw,
        standardized: 'Seamless Carbon Steel Pipe, 6 Inch (DN150), Schedule 40, ASTM A106 Grade B',
        category: 'Pipes & Fittings',
        subCategory: 'Seamless Pipes',
        uom: 'MTR',
        attributes: {
          'Pipe Type': 'Seamless (SMLS)',
          'Nominal Size': '6 Inch (DN150)',
          'Schedule': 'Schedule 40',
          'Material': 'Carbon Steel ASTM A106 Gr. B'
        },
        abbreviationsApplied: [
          { raw: 'CS', std: 'Carbon Steel' },
          { raw: 'SMLS', std: 'Seamless' },
          { raw: 'SCH40', std: 'Schedule 40' }
        ]
      });
    } else {
      // Default: Stainless Steel Ball Valve
      setNormalizedResult({
        original: raw,
        standardized: 'Stainless Steel Ball Valve – 50 mm',
        category: 'Valves & Actuators',
        subCategory: 'Ball Valves',
        uom: 'NOS',
        attributes: {
          'Material': 'Stainless Steel 316 (ASTM A351 CF8M)',
          'Valve Type': 'Ball Valve (Full Bore)',
          'Nominal Size': '50 mm (2 Inch / DN50)',
          'Pressure Class': 'Class 150 (PN 20)',
          'End Connection': 'Flanged Raised Face (ASME B16.5 RF)'
        },
        abbreviationsApplied: [
          { raw: 'SS', std: 'Stainless Steel' },
          { raw: 'BV', std: 'Ball Valve' },
          { raw: '2IN', std: '50 mm (2 Inch)' },
          { raw: 'FLG', std: 'Flanged Ends' }
        ]
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const categories = Array.from(new Set(sampleStandardizedCatalog.map(item => item.category)));

  const filteredCatalog = sampleStandardizedCatalog.filter((item) => {
    const q = searchTableQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.original.toLowerCase().includes(q) ||
      item.standardized.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.subCategory.toLowerCase().includes(q) ||
      item.uom.toLowerCase().includes(q) ||
      Object.entries(item.attributes).some(([k, v]) => `${k} ${v}`.toLowerCase().includes(q))
    );

    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Enterprise Demonstration Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                Material Standardization & Classification Engine
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-blue-600 text-white rounded">
                Demonstration / Sample Results
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Transforms unstructured legacy CPSE catalog descriptions into standardized canonical descriptions and extracts structured technical attributes.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('matching')}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 self-start sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
        >
          <span>View AI Matches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Pillar Normalization Architecture Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>1. Abbreviation Normalizer</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Maps heterogeneous legacy CPSE acronyms (e.g. <strong>SS</strong> → Stainless Steel, <strong>BV</strong> → Ball Valve, <strong>WN</strong> → Weld Neck).
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>2. Dimension & Unit Resolver</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Performs bi-directional conversion between Imperial and Metric standards (e.g. <strong>2 IN</strong> = 50 mm DN50, <strong>150#</strong> = Class 150).
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>3. Technical Attribute Extraction (NER)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Named Entity Recognition extracts structured parameters (Material MOC, Pressure Class, ASME/ISO codes, End Connections, UOM).
          </p>
        </div>
      </div>

      {/* Interactive NLP Standardization Playground */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Interactive NLP Standardization & Extraction Playground</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Test how raw legacy CPSE strings are transformed into canonical standardized descriptions with extracted technical attributes.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded self-start sm:self-auto">
            AI Sample Demonstration
          </span>
        </div>

        {/* Input Bar & Preset Chips */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTestStandardize()}
                placeholder="Type raw CPSE material description (e.g. SS BV 2IN FLG, BRG RAD 6309 C3)..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
              />
            </div>
            <button
              onClick={() => handleTestStandardize()}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Standardize & Extract</span>
            </button>
          </div>

          {/* Quick Preset Buttons (Prominently featuring "SS BV 2IN FLG") */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
            {sampleStandardizedCatalog.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTestInput(item.original);
                  handleTestStandardize(item.original);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                  testInput === item.original
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                "{item.original}"
              </button>
            ))}
          </div>
        </div>

        {/* Live Transformation Output Showcase Card */}
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Normalization & Classification Result (Sample Output)</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
              Sample Demonstration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Box: Original vs Standardized Description */}
            <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Original Description (Input)
                </span>
                <div className="font-mono text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>"{normalizedResult.original}"</span>
                  <button
                    onClick={() => handleCopy(normalizedResult.original)}
                    className="text-slate-400 hover:text-slate-600"
                    title="Copy original"
                  >
                    {copiedText === normalizedResult.original ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1 flex items-center gap-1">
                  <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
                  <span>Standardized Description (Canonical Title)</span>
                </span>
                <div className="text-xs font-bold text-blue-950 bg-blue-50/80 p-3 rounded-lg border border-blue-200 leading-snug flex items-center justify-between">
                  <span>{normalizedResult.standardized}</span>
                  <button
                    onClick={() => handleCopy(normalizedResult.standardized)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Copy standardized"
                  >
                    {copiedText === normalizedResult.standardized ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Category, Subcategory & UOM */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Category</span>
                  <p className="font-bold text-slate-800 mt-0.5">{normalizedResult.category}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Subcategory</span>
                  <p className="font-bold text-slate-800 mt-0.5">{normalizedResult.subCategory}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">UOM</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs inline-block mt-0.5">
                    {normalizedResult.uom}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Box: Extracted Technical Attributes & Tokens */}
            <div className="space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Extracted Technical Attributes:</span>
                </span>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden text-xs">
                  {Object.entries(normalizedResult.attributes).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-2">
                      <span className="font-medium text-slate-500 text-[11px]">{key}:</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applied Normalization Tokens */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Applied Abbreviation Normalizations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {normalizedResult.abbreviationsApplied.map((ab, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-mono font-semibold">
                      {ab.raw} → {ab.std}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Standardization & Classification Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Standardization & Classification Catalog
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 rounded border border-blue-200">
                Sample Demonstration Results
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Canonical standardized nomenclature and extracted engineering parameters across CPSE domains.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Filter by Category */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTableQuery}
                onChange={(e) => setSearchTableQuery(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
              />
            </div>
          </div>
        </div>

        {/* The Professional Table showing:
            Original Description
            Standardized Description
            Extracted Technical Attributes
            Category
            Subcategory
            UOM
        */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5 whitespace-nowrap min-w-[170px]">Original Description</th>
                <th className="p-3.5 min-w-[240px]">Standardized Description</th>
                <th className="p-3.5 min-w-[280px]">Extracted Technical Attributes</th>
                <th className="p-3.5 whitespace-nowrap">Category</th>
                <th className="p-3.5 whitespace-nowrap">Subcategory</th>
                <th className="p-3.5 whitespace-nowrap text-center">UOM</th>
                <th className="p-3.5 text-right pr-5 whitespace-nowrap">AI Demonstration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCatalog.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Info className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    No standardization records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCatalog.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    {/* 1. Original Description */}
                    <td className="p-3.5 pl-5 font-mono text-slate-900 font-bold align-top">
                      <div className="bg-slate-100 px-2.5 py-1.5 rounded border border-slate-200 inline-block">
                        "{item.original}"
                      </div>
                    </td>

                    {/* 2. Standardized Description */}
                    <td className="p-3.5 align-top">
                      <div className="font-bold text-slate-900 leading-snug">
                        {item.standardized}
                      </div>
                    </td>

                    {/* 3. Extracted Technical Attributes */}
                    <td className="p-3.5 align-top">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {Object.entries(item.attributes).map(([k, v]) => (
                          <span 
                            key={k} 
                            className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-medium"
                          >
                            <strong className="text-slate-500">{k}:</strong> {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 4. Category */}
                    <td className="p-3.5 align-top font-bold text-slate-800 whitespace-nowrap">
                      {item.category}
                    </td>

                    {/* 5. Subcategory */}
                    <td className="p-3.5 align-top text-slate-600 whitespace-nowrap">
                      {item.subCategory}
                    </td>

                    {/* 6. UOM */}
                    <td className="p-3.5 align-top text-center">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs border border-blue-200 inline-block">
                        {item.uom}
                      </span>
                    </td>

                    {/* 7. AI Demonstration Label */}
                    <td className="p-3.5 text-right pr-5 align-top whitespace-nowrap">
                      <button
                        onClick={() => {
                          setTestInput(item.original);
                          handleTestStandardize(item.original);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 rounded-md text-[11px] font-semibold shadow-2xs transition-colors inline-flex items-center gap-1"
                        title="Load into Interactive Playground"
                      >
                        <Sparkles className="w-3 h-3 text-blue-600" />
                        <span>Sample Result</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
