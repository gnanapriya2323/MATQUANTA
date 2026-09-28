import type { CPSEOrg, MaterialRecord, MatchCandidate, UnifiedMaterial, UploadBatch } from '../types';

export const DISCLAIMER_TEXT = "Representative Sample Data (Simulated for Demonstration Only — Not Real CPSE Production Data)";

export const SAMPLE_CPSES: CPSEOrg[] = [
  { id: 'cpse-1', code: 'CPSE-A', name: 'CPSE-A (Heavy Engineering Corp)', sector: 'Heavy Engineering & Fabrication', totalRecords: 4850, contactPerson: 'Dir. Materials (K. Sharma)' },
  { id: 'cpse-2', code: 'CPSE-B', name: 'CPSE-B (Thermal & Hydro Energy)', sector: 'Power Generation & Renewables', totalRecords: 6240, contactPerson: 'Chief Procurement Off. (R. Varma)' },
  { id: 'cpse-3', code: 'CPSE-C', name: 'CPSE-C (National Steel & Mining)', sector: 'Metallurgy & Minerals', totalRecords: 5120, contactPerson: 'GM Supply Chain (S. Sen)' },
  { id: 'cpse-4', code: 'CPSE-D', name: 'CPSE-D (Rail Transit & Infrastructure)', sector: 'Transport & Infrastructure', totalRecords: 3910, contactPerson: 'Stores Controller (A. Patel)' },
];

export const INITIAL_MATERIAL_RECORDS: MaterialRecord[] = [
  // Pair 1: Ball Bearing 6309 C3
  {
    id: 'rec-001',
    cpseId: 'cpse-1',
    cpseName: 'CPSE-A',
    legacyCode: 'HE-BRG-6309-C3',
    description: 'DEEP GROOVE BALL BEARING 6309 C3 SINGLE ROW 45X100X25MM STEEL CAGE',
    category: 'Bearings & Power Transmission',
    unitOfMeasure: 'NOS',
    specifications: { 'Bearing Type': 'Deep Groove Ball', 'Designation': '6309', 'Clearance': 'C3', 'Bore (d)': '45mm', 'OD (D)': '100mm', 'Width (B)': '25mm' },
    status: 'matched',
    unifiedMasterId: 'unif-001',
    uploadedAt: '2026-09-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-002',
    cpseId: 'cpse-2',
    cpseName: 'CPSE-B',
    legacyCode: 'PWR-6309C3-DGBB',
    description: 'BRG RADIAL BALL 6309-C3 OPEN TYPE DIM 45 X 100 X 25 MM',
    category: 'Bearings & Power Transmission',
    unitOfMeasure: 'EA',
    specifications: { 'Type': 'Radial Ball Bearing', 'Standard Ref': 'ISO 15 / 6309-C3', 'Bore': '45 mm', 'Outer Dia': '100 mm', 'Thickness': '25 mm' },
    status: 'matched',
    unifiedMasterId: 'unif-001',
    uploadedAt: '2026-09-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-003',
    cpseId: 'cpse-3',
    cpseName: 'CPSE-C',
    legacyCode: 'STL-MNT-BRG09C3',
    description: 'BALL BRG 6309 C3 METRIC INDUSTRIAL HEAVY DUTY',
    category: 'Bearings & Power Transmission',
    unitOfMeasure: 'NOS',
    specifications: { 'Model': '6309 C3', 'Inner Dia': '45mm', 'Outer Dia': '100mm', 'Width': '25mm' },
    status: 'matched',
    unifiedMasterId: 'unif-001',
    uploadedAt: '2026-09-20T14:45:00Z',
    batchId: 'batch-03'
  },

  // Pair 2: Weld Neck Flange 4" 150# SS304
  {
    id: 'rec-004',
    cpseId: 'cpse-1',
    cpseName: 'CPSE-A',
    legacyCode: 'HE-FLG-WN-304-4IN-150',
    description: 'FLANGE WELD NECK 4" 150# RF ASME B16.5 ASTM A182 F304 SCH 40',
    category: 'Pipes & Fittings',
    unitOfMeasure: 'NOS',
    specifications: { 'Type': 'Weld Neck (WN)', 'Size': '4 Inch (DN100)', 'Rating': 'Class 150', 'Facing': 'Raised Face (RF)', 'Material': 'ASTM A182 F304', 'Standard': 'ASME B16.5' },
    status: 'matched',
    unifiedMasterId: 'unif-002',
    uploadedAt: '2026-09-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-005',
    cpseId: 'cpse-2',
    cpseName: 'CPSE-B',
    legacyCode: 'PWR-FLNG-4IN-150LB-SS304',
    description: 'FLANGE 4 INCH WELDING NECK CL150 RAISED FACE SS304 TO ASME B16.5',
    category: 'Pipes & Fittings',
    unitOfMeasure: 'EA',
    specifications: { 'Item': 'Weldneck Flange', 'Nominal Bore': '4"', 'Pressure Class': '150 LBS', 'Face Type': 'RF', 'Grade': 'AISI 304 / A182', 'Spec': 'ASME B16.5' },
    status: 'matched',
    unifiedMasterId: 'unif-002',
    uploadedAt: '2026-09-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-006',
    cpseId: 'cpse-4',
    cpseName: 'CPSE-D',
    legacyCode: 'RL-PIP-FLG-100-304',
    description: 'SS304 WELDNECK FLANGE 100MM NB CLASS 150 ASME B16.5 RF',
    category: 'Pipes & Fittings',
    unitOfMeasure: 'NOS',
    specifications: { 'Size': 'DN100 (4")', 'Rating': '150#', 'Material': 'SS 304', 'Standard': 'ASME B16.5' },
    status: 'under_review',
    uploadedAt: '2026-09-22T08:15:00Z',
    batchId: 'batch-04'
  },

  // Pair 3: Gate Valve 2" Class 800 Forged Steel A105
  {
    id: 'rec-007',
    cpseId: 'cpse-2',
    cpseName: 'CPSE-B',
    legacyCode: 'PWR-VLV-GT-02-800-FS',
    description: 'VALVE GATE 2 INCH CLASS 800 FORGED STEEL ASTM A105 NPT FEMALE ENDS TRIM 8',
    category: 'Valves & Actuators',
    unitOfMeasure: 'NOS',
    specifications: { 'Valve Type': 'Gate Valve', 'Size': '2 Inch (50NB)', 'Rating': 'Class 800', 'Body Material': 'ASTM A105', 'Trim': 'API Trim 8 (13Cr)', 'End Connection': 'NPT Threaded' },
    status: 'under_review',
    uploadedAt: '2026-09-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-008',
    cpseId: 'cpse-3',
    cpseName: 'CPSE-C',
    legacyCode: 'STL-VLV-GATE-2IN-800LB',
    description: '2" FORGED CARBON STEEL GATE VALVE CL 800 THREADED NPT A105 TRIM 8 OS&Y',
    category: 'Valves & Actuators',
    unitOfMeasure: 'EA',
    specifications: { 'Type': 'Gate Valve OS&Y', 'Bore': '2"', 'Class': '800#', 'Material': 'Forged CS A105', 'Ends': 'FNPT', 'Trim': '13% Cr' },
    status: 'under_review',
    uploadedAt: '2026-09-20T14:45:00Z',
    batchId: 'batch-03'
  },

  // Pair 4: Spiral Wound Gasket 6" 300# SS316 Graphite
  {
    id: 'rec-009',
    cpseId: 'cpse-1',
    cpseName: 'CPSE-A',
    legacyCode: 'HE-GSK-SPW-6IN-300-316',
    description: 'SPIRAL WOUND GASKET 6" CLASS 300 ASME B16.20 SS316 / GRAPHITE INNER & OUTER RING',
    category: 'Fasteners & Hardware',
    unitOfMeasure: 'NOS',
    specifications: { 'Type': 'Spiral Wound Gasket', 'Size': '6 Inch', 'Class': '300#', 'Winding': 'SS 316', 'Filler': 'Flexible Graphite', 'Rings': 'CS Outer / SS316 Inner' },
    status: 'matched',
    unifiedMasterId: 'unif-003',
    uploadedAt: '2026-09-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-010',
    cpseId: 'cpse-3',
    cpseName: 'CPSE-C',
    legacyCode: 'STL-GSK-6-300-SWG',
    description: 'GASKET METALLIC SPIRAL WOUND 6 INCH 300 LBS ASME B16.20 SS 316 / EXF GRAPHITE',
    category: 'Fasteners & Hardware',
    unitOfMeasure: 'SET',
    specifications: { 'Size': '6"', 'Rating': '300 LB', 'Metal Ring': '316 SS', 'Filler': 'Graphite' },
    status: 'matched',
    unifiedMasterId: 'unif-003',
    uploadedAt: '2026-09-20T14:45:00Z',
    batchId: 'batch-03'
  },

  // Pair 5: Hex Bolt M16 x 60mm Grade 8.8 HDG
  {
    id: 'rec-011',
    cpseId: 'cpse-1',
    cpseName: 'CPSE-A',
    legacyCode: 'HE-BLT-HEX-M16X60-8.8',
    description: 'HEXAGON HEAD BOLT M16 X 60MM FULL THREAD GRADE 8.8 HOT DIP GALVANIZED ISO 4017',
    category: 'Fasteners & Hardware',
    unitOfMeasure: 'NOS',
    specifications: { 'Thread': 'M16', 'Length': '60 mm', 'Property Class': 'Grade 8.8', 'Finish': 'Hot Dip Galvanized (HDG)', 'Standard': 'ISO 4017 / DIN 933' },
    status: 'raw',
    uploadedAt: '2026-09-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-012',
    cpseId: 'cpse-4',
    cpseName: 'CPSE-D',
    legacyCode: 'RL-FST-BLT-16X60-88',
    description: 'BOLT HEX HEAD M16X60 MM HT GR 8.8 HDG WITH NUT & WASHER DIN 933',
    category: 'Fasteners & Hardware',
    unitOfMeasure: 'SET',
    specifications: { 'Diameter': '16mm', 'Length': '60mm', 'Strength Grade': '8.8', 'Coating': 'HDG' },
    status: 'raw',
    uploadedAt: '2026-09-22T08:15:00Z',
    batchId: 'batch-04'
  },

  // Standalone distinct items
  {
    id: 'rec-013',
    cpseId: 'cpse-2',
    cpseName: 'CPSE-B',
    legacyCode: 'PWR-LUB-TURBO-VG46',
    description: 'TURBINE LUBRICATING OIL ISO VG 46 PREMIUM R&O MINERAL BASE ASTM D4304',
    category: 'Chemicals & Lubricants',
    unitOfMeasure: 'LTR',
    specifications: { 'Viscosity Grade': 'ISO VG 46', 'Base Oil': 'Group II Mineral', 'Application': 'Gas/Steam Turbines', 'Standard': 'ASTM D4304 Type I' },
    status: 'distinct',
    uploadedAt: '2026-09-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-014',
    cpseId: 'cpse-4',
    cpseName: 'CPSE-D',
    legacyCode: 'RL-ELC-CAB-4C-16SQ',
    description: 'CABLE XLPE ARMOURED COPPER CONDUCTOR 4 CORE 16 SQ MM 1.1KV IS 7098 PART 1',
    category: 'Electrical & Instrumentation',
    unitOfMeasure: 'MTR',
    specifications: { 'Conductor': 'Annealed Copper', 'Cores': '4 Core', 'Cross Section': '16 sq.mm', 'Insulation': 'XLPE', 'Armour': 'Galvanized Steel Strip', 'Voltage': '1100V' },
    status: 'distinct',
    uploadedAt: '2026-09-22T08:15:00Z',
    batchId: 'batch-04'
  }
];

export const INITIAL_MATCH_CANDIDATES: MatchCandidate[] = [
  {
    id: 'match-001',
    sourceRecord: INITIAL_MATERIAL_RECORDS[6],
    targetRecord: INITIAL_MATERIAL_RECORDS[7],
    similarityScore: 0.94,
    semanticScore: 0.96,
    attributeMatchScore: 0.92,
    confidenceLevel: 'HIGH',
    matchingAttributes: ['Valve Type: Gate Valve', 'Nominal Size: 2 Inch (DN50)', 'Pressure Rating: Class 800', 'Body Material: ASTM A105', 'Trim: API Trim 8 (13Cr)', 'End Conn: NPT Threaded'],
    differingAttributes: ['Legacy Code Naming Syntax', 'Abbreviation phrasing (CL 800 vs CLASS 800)'],
    proposedStandardizedName: 'VALVE, GATE, FORGED CARBON STEEL, 2 INCH, CLASS 800, NPT THREADED, ASTM A105, TRIM 8',
    proposedUNSPSC: '40141602',
    status: 'pending',
    matchRationale: 'Near-identical technical parameters. High cosine similarity on embedding representation (0.96) and 100% attribute convergence across size, pressure rating, material, and end connections.',
    evaluatedAt: '2026-09-24T10:15:00Z'
  },
  {
    id: 'match-002',
    sourceRecord: INITIAL_MATERIAL_RECORDS[3],
    targetRecord: INITIAL_MATERIAL_RECORDS[5],
    similarityScore: 0.89,
    semanticScore: 0.91,
    attributeMatchScore: 0.87,
    confidenceLevel: 'HIGH',
    matchingAttributes: ['Item: Weld Neck Flange', 'Size equivalence: 4" = 100mm NB', 'Pressure Rating: Class 150#', 'Material: SS 304 / A182 F304', 'Facing: Raised Face (RF)'],
    differingAttributes: ['Metric NB representation (100MM vs 4 INCH)', 'UOM package variation'],
    proposedStandardizedName: 'FLANGE, WELDING NECK, 4 INCH (DN100), CLASS 150, ASME B16.5, RAISED FACE, ASTM A182 F304',
    proposedUNSPSC: '40172401',
    status: 'pending',
    matchRationale: 'Strong semantic match with metric-imperial unit resolution (4 Inch corresponds to DN100 / 100mm NB). Material grade and ASME B16.5 flange standard are identical.',
    evaluatedAt: '2026-09-24T10:18:00Z'
  },
  {
    id: 'match-003',
    sourceRecord: INITIAL_MATERIAL_RECORDS[10],
    targetRecord: INITIAL_MATERIAL_RECORDS[11],
    similarityScore: 0.83,
    semanticScore: 0.85,
    attributeMatchScore: 0.81,
    confidenceLevel: 'MEDIUM',
    matchingAttributes: ['Fastener: Hex Head Bolt', 'Size: M16 x 60mm', 'Grade: 8.8 High Tensile', 'Surface: Hot Dip Galvanized'],
    differingAttributes: ['UOM: NOS vs SET (CPSE-D includes Nut & Washer)'],
    proposedStandardizedName: 'BOLT, HEXAGON HEAD, M16 X 60 MM, PROPERTY CLASS 8.8, HOT DIP GALVANIZED, ISO 4017 / DIN 933',
    proposedUNSPSC: '31161620',
    status: 'pending',
    matchRationale: 'Identical core fastener geometry and tensile specification. Discrepancy noted in packaging unit (individual bolt vs bolt assembly set with nut and washer).',
    evaluatedAt: '2026-09-25T14:02:00Z'
  }
];

export const INITIAL_UNIFIED_MATERIALS: UnifiedMaterial[] = [
  {
    id: 'unif-001',
    unifiedCode: 'MQ-MEC-BRG-00192',
    standardName: 'BEARING, RADIAL DEEP GROOVE BALL, 6309 C3, 45X100X25 MM',
    standardDescription: 'Deep groove ball bearing, single row, metric series 6309 with C3 radial internal clearance. Dimensions 45mm ID x 100mm OD x 25mm Width. Steel cage, open configuration conforming to ISO 15.',
    category: 'Bearings & Power Transmission',
    unspscCode: '31171504',
    unspscCategory: 'Ball bearings',
    standardUom: 'NOS',
    standardSpecs: {
      'Type': 'Deep Groove Ball Bearing',
      'Designation': '6309 C3',
      'Internal Clearance': 'C3 (23 - 43 µm)',
      'Bore Diameter': '45 mm',
      'Outer Diameter': '100 mm',
      'Width': '25 mm',
      'Basic Dynamic Load (Cr)': '55.3 kN',
      'Standard Ref': 'ISO 15'
    },
    mappedLegacyRecords: [
      INITIAL_MATERIAL_RECORDS[0],
      INITIAL_MATERIAL_RECORDS[1],
      INITIAL_MATERIAL_RECORDS[2]
    ],
    participatingCPSEs: ['CPSE-A', 'CPSE-B', 'CPSE-C'],
    duplicationCount: 3,
    harmonizationDate: '2026-09-22',
    harmonizedBy: 'Dr. V. Raman (Domain Expert - Mechanical)',
    version: 2,
    status: 'active'
  },
  {
    id: 'unif-002',
    unifiedCode: 'MQ-PIP-FLG-00418',
    standardName: 'FLANGE, WELD NECK, 4 INCH (DN100), CLASS 150#, RF, ASME B16.5, ASTM A182 F304',
    standardDescription: 'Pipe flange, welding neck type, nominal pipe size 4 inch (DN 100), ASME Class 150 pressure rating, raised face (RF), manufactured from forged austenitic stainless steel ASTM A182 Grade F304.',
    category: 'Pipes & Fittings',
    unspscCode: '40172401',
    unspscCategory: 'Pipe flanges',
    standardUom: 'NOS',
    standardSpecs: {
      'Flange Type': 'Weld Neck (WN)',
      'Nominal Size': '4 Inch (DN100)',
      'Pressure Class': '150# (PN 20)',
      'Facing': 'Raised Face 1/16"',
      'Material Spec': 'ASTM A182 / F304',
      'Design Code': 'ASME B16.5'
    },
    mappedLegacyRecords: [
      INITIAL_MATERIAL_RECORDS[3],
      INITIAL_MATERIAL_RECORDS[4]
    ],
    participatingCPSEs: ['CPSE-A', 'CPSE-B'],
    duplicationCount: 2,
    harmonizationDate: '2026-09-21',
    harmonizedBy: 'M. Ghosh (Materials Standardization Lead)',
    version: 1,
    status: 'active'
  },
  {
    id: 'unif-003',
    unifiedCode: 'MQ-FST-GSK-00781',
    standardName: 'GASKET, SPIRAL WOUND, 6 INCH, CLASS 300#, ASME B16.20, SS316 / GRAPHITE',
    standardDescription: 'Spiral wound gasket for ASME B16.5 flanges, size 6 inch nominal bore, pressure class 300#. Stainless steel 316 winding with flexible graphite filler, carbon steel outer centering ring and SS316 inner ring.',
    category: 'Fasteners & Hardware',
    unspscCode: '31401503',
    unspscCategory: 'Metallic and semi metallic gaskets',
    standardUom: 'NOS',
    standardSpecs: {
      'Gasket Type': 'Spiral Wound (Style CGI)',
      'Nominal Pipe Size': '6 Inch (DN150)',
      'Flange Rating': 'Class 300',
      'Winding Material': 'SS 316',
      'Filler': 'Expanded Flexible Graphite',
      'Guide Rings': 'CS Outer Ring / SS 316 Inner Ring',
      'Standard': 'ASME B16.20'
    },
    mappedLegacyRecords: [
      INITIAL_MATERIAL_RECORDS[8],
      INITIAL_MATERIAL_RECORDS[9]
    ],
    participatingCPSEs: ['CPSE-A', 'CPSE-C'],
    duplicationCount: 2,
    harmonizationDate: '2026-09-23',
    harmonizedBy: 'P. Nair (Standardization Specialist)',
    version: 1,
    status: 'active'
  }
];

export const INITIAL_UPLOAD_BATCHES: UploadBatch[] = [
  {
    id: 'batch-01',
    cpseId: 'cpse-1',
    cpseName: 'CPSE-A (Heavy Engineering)',
    filename: 'CPSE_A_Master_Catalog_Q3_2026.csv',
    totalRows: 4850,
    validRows: 4812,
    invalidRows: 38,
    status: 'completed',
    uploadedAt: '2026-09-15 09:30 AM'
  },
  {
    id: 'batch-02',
    cpseId: 'cpse-2',
    cpseName: 'CPSE-B (Energy & Power)',
    filename: 'PowerGen_ERP_Materials_Extract.xlsx',
    totalRows: 6240,
    validRows: 6205,
    invalidRows: 35,
    status: 'completed',
    uploadedAt: '2026-09-18 11:20 AM'
  },
  {
    id: 'batch-03',
    cpseId: 'cpse-3',
    cpseName: 'CPSE-C (National Steel)',
    filename: 'Steel_Mining_Stores_Inventory_2026.csv',
    totalRows: 5120,
    validRows: 5080,
    invalidRows: 40,
    status: 'completed',
    uploadedAt: '2026-09-20 02:45 PM'
  },
  {
    id: 'batch-04',
    cpseId: 'cpse-4',
    cpseName: 'CPSE-D (Rail Transit)',
    filename: 'RailTrans_RollingStock_Components.csv',
    totalRows: 3910,
    validRows: 3892,
    invalidRows: 18,
    status: 'completed',
    uploadedAt: '2026-09-22 08:15 AM'
  }
];
