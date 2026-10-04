import type { 
  CPSEOrg, 
  MaterialRecord, 
  MatchCandidate, 
  UnifiedMaterial, 
  UploadBatch, 
  CPSEOnboardingRequest,
  LegacyMigrationRecord,
  AuditLogRecord
} from '../types';

export const DISCLAIMER_TEXT = "Representative Sample Data — for demonstration only (SIH 2026 Problem Statement 26099: AI-Driven Standardization and Harmonization of Material Codes Across CPSEs)";

export const SAMPLE_CPSES: CPSEOrg[] = [
  {
    id: 'cpse-1',
    code: 'CPSE A',
    name: 'Heavy Engineering Corporation Ltd.',
    ministry: 'Ministry of Heavy Industries',
    sector: 'Heavy Engineering & Fabrication',
    orgIdentifier: 'CIN: U29200JH1958GOI000630',
    officialEmail: 'procurement.materials@hec.gov.in',
    headquarters: 'Ranchi, Jharkhand',
    erpSystem: 'SAP ECC 6.0',
    uploadMethod: 'SAP / ERP Integration',
    status: 'Active',
    totalRecords: 5420,
    contactPerson: 'Er. K. Sharma',
    contactDesignation: 'Executive Director (Materials Management)',
    onboardedDate: '2026-06-15'
  },
  {
    id: 'cpse-2',
    code: 'CPSE B',
    name: 'National Thermal & Hydro Power Corp.',
    ministry: 'Ministry of Power',
    sector: 'Power Generation & Renewables',
    orgIdentifier: 'CIN: L40101DL1975GOI007966',
    officialEmail: 'cpo.centralstores@nthpc.co.in',
    headquarters: 'New Delhi',
    erpSystem: 'SAP S/4HANA 2023',
    uploadMethod: 'API',
    status: 'Active',
    totalRecords: 7850,
    contactPerson: 'Dr. R. Varma',
    contactDesignation: 'Chief Procurement Officer',
    onboardedDate: '2026-07-02'
  },
  {
    id: 'cpse-3',
    code: 'CPSE C',
    name: 'National Steel & Metallurgy Authority',
    ministry: 'Ministry of Steel',
    sector: 'Metallurgy & Minerals',
    orgIdentifier: 'CIN: L27109DL1973GOI006454',
    officialEmail: 'supplychain.stores@nsma.in',
    headquarters: 'Kolkata, West Bengal',
    erpSystem: 'Oracle ERP Cloud',
    uploadMethod: 'CSV / Excel',
    status: 'Active',
    totalRecords: 6310,
    contactPerson: 'Shri S. Sen',
    contactDesignation: 'General Manager (Supply Chain & Inventory)',
    onboardedDate: '2026-08-10'
  },
  {
    id: 'cpse-4',
    code: 'CPSE D',
    name: 'Rail Transit Rolling Stock & Infra Ltd.',
    ministry: 'Ministry of Railways',
    sector: 'Transport & Infrastructure',
    orgIdentifier: 'CIN: U35200KA1964GOI001530',
    officialEmail: 'controller.stores@rtrsil.gov.in',
    headquarters: 'Bengaluru, Karnataka',
    erpSystem: 'In-House ERP (Modernized)',
    uploadMethod: 'CSV / Excel',
    status: 'Active',
    totalRecords: 4180,
    contactPerson: 'Shri A. Patel',
    contactDesignation: 'Controller of Stores',
    onboardedDate: '2026-09-01'
  }
];

export const INITIAL_ONBOARDING_REQUESTS: CPSEOnboardingRequest[] = [
  {
    id: 'ONB-2026-001',
    cpseName: 'Heavy Engineering Corporation Ltd.',
    ministry: 'Ministry of Heavy Industries',
    sector: 'Heavy Engineering & Fabrication',
    orgIdentifier: 'CIN: U29200JH1958GOI000630',
    officialEmail: 'procurement.materials@hec.gov.in',
    headquarters: 'Ranchi, Jharkhand',
    repName: 'Er. K. Sharma',
    designation: 'Executive Director (Materials Management)',
    repEmail: 'k.sharma@hec.gov.in',
    contactNumber: '+91 94311 02345',
    erpSystem: 'SAP ECC 6.0',
    materialMasterFormat: 'MARA / MARC SAP MM Extract',
    dataUploadMethod: 'SAP / ERP Integration',
    status: 'Active',
    submittedAt: '2026-06-10 10:30 AM',
    notes: 'Verified against Administrative Ministry registry. Active data exchange enabled.'
  },
  {
    id: 'ONB-2026-002',
    cpseName: 'National Thermal & Hydro Power Corp.',
    ministry: 'Ministry of Power',
    sector: 'Power Generation & Renewables',
    orgIdentifier: 'CIN: L40101DL1975GOI007966',
    officialEmail: 'cpo.centralstores@nthpc.co.in',
    headquarters: 'New Delhi',
    repName: 'Dr. R. Varma',
    designation: 'Chief Procurement Officer',
    repEmail: 'r.varma@nthpc.co.in',
    contactNumber: '+91 98100 87654',
    erpSystem: 'SAP S/4HANA 2023',
    materialMasterFormat: 'SAP Material Master API Payload',
    dataUploadMethod: 'API',
    status: 'Active',
    submittedAt: '2026-06-28 02:15 PM',
    notes: 'Direct REST API integration verified in staging sandbox.'
  },
  {
    id: 'ONB-2026-003',
    cpseName: 'National Steel & Metallurgy Authority',
    ministry: 'Ministry of Steel',
    sector: 'Metallurgy & Minerals',
    orgIdentifier: 'CIN: L27109DL1973GOI006454',
    officialEmail: 'supplychain.stores@nsma.in',
    headquarters: 'Kolkata, West Bengal',
    repName: 'Shri S. Sen',
    designation: 'General Manager (Supply Chain)',
    repEmail: 's.sen@nsma.in',
    contactNumber: '+91 93310 54321',
    erpSystem: 'Oracle ERP Cloud',
    materialMasterFormat: 'Custom Item Catalog CSV Extract',
    dataUploadMethod: 'CSV / Excel',
    status: 'Active',
    submittedAt: '2026-08-05 11:00 AM',
    notes: 'Batch ingestion schedule configured bi-weekly.'
  },
  {
    id: 'ONB-2026-004',
    cpseName: 'Bharat Petroleum Petrochemicals & Refining Ltd.',
    ministry: 'Ministry of Petroleum & Natural Gas',
    sector: 'Oil, Gas & Petrochemicals',
    orgIdentifier: 'CIN: L23201MH1952GOI008931',
    officialEmail: 'materials.refining@bpprl.gov.in',
    headquarters: 'Mumbai, Maharashtra',
    repName: 'Dr. N. Deshmukh',
    designation: 'General Manager (Procurement & Contracts)',
    repEmail: 'n.deshmukh@bpprl.gov.in',
    contactNumber: '+91 98201 11223',
    erpSystem: 'SAP S/4HANA',
    materialMasterFormat: 'SAP MESC Catalog',
    dataUploadMethod: 'SAP / ERP Integration',
    status: 'Approved',
    submittedAt: '2026-09-18 04:30 PM',
    notes: 'Authorization verified. Awaiting integration pipeline token setup.'
  },
  {
    id: 'ONB-2026-005',
    cpseName: 'Defence Electronics & Avionics Systems Ltd.',
    ministry: 'Ministry of Defence',
    sector: 'Strategic & Defence Manufacturing',
    orgIdentifier: 'CIN: L32309KA1954GOI000787',
    officialEmail: 'director.procurement@deasl.gov.in',
    headquarters: 'Hyderabad, Telangana',
    repName: 'Commodore S. K. Nair (Retd.)',
    designation: 'Executive Director (Strategic Sourcing)',
    repEmail: 'sk.nair@deasl.gov.in',
    contactNumber: '+91 94440 98765',
    erpSystem: 'In-House Secure ERP',
    materialMasterFormat: 'Encrypted JSON Schema',
    dataUploadMethod: 'API',
    status: 'Pending Verification',
    submittedAt: '2026-09-28 09:45 AM',
    notes: 'Submitted for administrative clearance from Ministry of Defence Nodal Desk.'
  }
];

export const INITIAL_MATERIAL_RECORDS: MaterialRecord[] = [
  // 1. Stainless Steel Ball Valve 50 mm (CNMC-000001 group)
  {
    id: 'rec-001',
    cpseId: 'cpse-1',
    cpseName: 'CPSE A',
    legacyCode: 'MAT1001',
    description: 'SS Ball Valve 2 Inch',
    standardizedDescription: 'Stainless Steel Ball Valve – 50 mm',
    category: 'Valves & Actuators',
    subCategory: 'Ball Valves',
    unitOfMeasure: 'NOS',
    specifications: {
      'Material': 'Stainless Steel 316',
      'Valve Type': 'Ball Valve Full Bore',
      'Nominal Size': '2 Inch (50 mm)',
      'Pressure Class': 'Class 150 (PN 20)',
      'End Connection': 'Flanged ANSI B16.5 RF',
      'Operation': 'Lever Operated'
    },
    technicalParameters: {
      'Body Grade': 'ASTM A351 CF8M',
      'Ball / Stem': 'SS 316',
      'Seat Material': 'PTFE / R-PTFE',
      'Design Standard': 'API 6D / ISO 17292'
    },
    historicalProcurement: {
      lastProcurementYear: 2025,
      annualVolume: 500,
      procurementUnit: 'NOS',
      avgUnitRateINR: 6450
    },
    dataSource: 'SAP / ERP',
    status: 'harmonized',
    cnmcCode: 'CNMC-000001',
    uploadedAt: '2026-08-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-002',
    cpseId: 'cpse-2',
    cpseName: 'CPSE B',
    legacyCode: '458721',
    description: 'Stainless Steel Ball Valve 50mm',
    standardizedDescription: 'Stainless Steel Ball Valve – 50 mm',
    category: 'Valves & Actuators',
    subCategory: 'Ball Valves',
    unitOfMeasure: 'NOS',
    specifications: {
      'Item': 'Ball Valve',
      'Body Material': 'SS316 / CF8M',
      'Bore Size': '50 mm (2")',
      'Rating': '150# Flanged',
      'Standard': 'ASME B16.5 / API 6D'
    },
    technicalParameters: {
      'Body Grade': 'ASTM A351 Gr. CF8M',
      'Trim': '316 SS',
      'Seal': 'PTFE',
      'Testing Standard': 'API 598'
    },
    historicalProcurement: {
      lastProcurementYear: 2025,
      annualVolume: 800,
      procurementUnit: 'NOS',
      avgUnitRateINR: 6300
    },
    dataSource: 'API',
    status: 'harmonized',
    cnmcCode: 'CNMC-000001',
    uploadedAt: '2026-08-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-003',
    cpseId: 'cpse-3',
    cpseName: 'CPSE C',
    legacyCode: 'PV2034',
    description: '2" SS Ball Valve',
    standardizedDescription: 'Stainless Steel Ball Valve – 50 mm',
    category: 'Valves & Actuators',
    subCategory: 'Ball Valves',
    unitOfMeasure: 'NOS',
    specifications: {
      'Commodity': 'Valves',
      'Type': 'Ball Valve',
      'Size': '2 Inch',
      'MOC': 'SS 316',
      'Rating': 'Class 150 RF'
    },
    technicalParameters: {
      'Material': 'CF8M Stainless Steel',
      'Connection': '150# Flange',
      'Application': 'Process Fluid Handling'
    },
    historicalProcurement: {
      lastProcurementYear: 2025,
      annualVolume: 700,
      procurementUnit: 'NOS',
      avgUnitRateINR: 6600
    },
    dataSource: 'CSV',
    status: 'harmonized',
    cnmcCode: 'CNMC-000001',
    uploadedAt: '2026-08-20T14:45:00Z',
    batchId: 'batch-03'
  },

  // 2. Radial Ball Bearing 6309 C3 (CNMC-000002 group)
  {
    id: 'rec-004',
    cpseId: 'cpse-1',
    cpseName: 'CPSE A',
    legacyCode: 'MAT-BRG-6309',
    description: 'DEEP GROOVE BALL BEARING 6309 C3 SINGLE ROW 45X100X25MM STEEL CAGE',
    standardizedDescription: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
    category: 'Bearings & Power Transmission',
    subCategory: 'Ball Bearings',
    unitOfMeasure: 'NOS',
    specifications: { 'Bearing Type': 'Deep Groove Ball', 'Designation': '6309', 'Clearance': 'C3', 'Bore (d)': '45mm', 'OD (D)': '100mm', 'Width (B)': '25mm' },
    technicalParameters: { 'Cage': 'Pressed Steel', 'Dynamic Load (Cr)': '55.3 kN', 'Standard': 'ISO 15' },
    historicalProcurement: { lastProcurementYear: 2025, annualVolume: 1200, procurementUnit: 'NOS', avgUnitRateINR: 1850 },
    dataSource: 'SAP / ERP',
    status: 'harmonized',
    cnmcCode: 'CNMC-000002',
    uploadedAt: '2026-08-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-005',
    cpseId: 'cpse-2',
    cpseName: 'CPSE B',
    legacyCode: '889210-6309C3',
    description: 'BRG RADIAL BALL 6309-C3 OPEN TYPE DIM 45 X 100 X 25 MM',
    standardizedDescription: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
    category: 'Bearings & Power Transmission',
    subCategory: 'Ball Bearings',
    unitOfMeasure: 'NOS',
    specifications: { 'Type': 'Radial Ball Bearing', 'Standard Ref': 'ISO 15 / 6309-C3', 'Bore': '45 mm', 'Outer Dia': '100 mm', 'Thickness': '25 mm' },
    technicalParameters: { 'Radial Clearance': 'C3 (23-43 um)', 'Limiting Speed': '8500 rpm' },
    historicalProcurement: { lastProcurementYear: 2025, annualVolume: 1500, procurementUnit: 'NOS', avgUnitRateINR: 1780 },
    dataSource: 'API',
    status: 'harmonized',
    cnmcCode: 'CNMC-000002',
    uploadedAt: '2026-08-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-006',
    cpseId: 'cpse-3',
    cpseName: 'CPSE C',
    legacyCode: 'STL-BRG-09C3',
    description: 'BALL BRG 6309 C3 METRIC INDUSTRIAL HEAVY DUTY 45X100X25',
    standardizedDescription: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
    category: 'Bearings & Power Transmission',
    subCategory: 'Ball Bearings',
    unitOfMeasure: 'NOS',
    specifications: { 'Model': '6309 C3', 'Inner Dia': '45mm', 'Outer Dia': '100mm', 'Width': '25mm' },
    technicalParameters: { 'Application': 'Heavy Drive Motors', 'Standard': 'ISO 15' },
    historicalProcurement: { lastProcurementYear: 2025, annualVolume: 1800, procurementUnit: 'NOS', avgUnitRateINR: 1820 },
    dataSource: 'CSV',
    status: 'harmonized',
    cnmcCode: 'CNMC-000002',
    uploadedAt: '2026-08-20T14:45:00Z',
    batchId: 'batch-03'
  },

  // 3. Weld Neck Flange 4" 150# SS304 (CNMC-000003 group)
  {
    id: 'rec-007',
    cpseId: 'cpse-1',
    cpseName: 'CPSE A',
    legacyCode: 'FLG-WN-304-4IN',
    description: 'FLANGE WELD NECK 4" 150# RF ASME B16.5 ASTM A182 F304 SCH 40',
    standardizedDescription: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    category: 'Pipes & Fittings',
    subCategory: 'Flanges',
    unitOfMeasure: 'NOS',
    specifications: { 'Type': 'Weld Neck (WN)', 'Size': '4 Inch (DN100)', 'Rating': 'Class 150', 'Facing': 'Raised Face (RF)', 'Material': 'ASTM A182 F304', 'Standard': 'ASME B16.5' },
    historicalProcurement: { lastProcurementYear: 2025, annualVolume: 600, procurementUnit: 'NOS', avgUnitRateINR: 3400 },
    dataSource: 'SAP / ERP',
    status: 'harmonized',
    cnmcCode: 'CNMC-000003',
    uploadedAt: '2026-08-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-008',
    cpseId: 'cpse-2',
    cpseName: 'CPSE B',
    legacyCode: 'PWR-4IN-150-SS304',
    description: 'FLANGE 4 INCH WELDING NECK CL150 RAISED FACE SS304 TO ASME B16.5',
    standardizedDescription: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    category: 'Pipes & Fittings',
    subCategory: 'Flanges',
    unitOfMeasure: 'NOS',
    specifications: { 'Item': 'Weldneck Flange', 'Nominal Bore': '4"', 'Pressure Class': '150 LBS', 'Face Type': 'RF', 'Grade': 'AISI 304 / A182', 'Spec': 'ASME B16.5' },
    historicalProcurement: { lastProcurementYear: 2025, annualVolume: 900, procurementUnit: 'NOS', avgUnitRateINR: 3350 },
    dataSource: 'API',
    status: 'harmonized',
    cnmcCode: 'CNMC-000003',
    uploadedAt: '2026-08-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-009',
    cpseId: 'cpse-4',
    cpseName: 'CPSE D',
    legacyCode: 'RL-FLG-DN100-304',
    description: 'SS304 WELDNECK FLANGE 100MM NB CLASS 150 ASME B16.5 RF',
    standardizedDescription: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    category: 'Pipes & Fittings',
    subCategory: 'Flanges',
    unitOfMeasure: 'NOS',
    specifications: { 'Size': 'DN100 (4")', 'Rating': '150#', 'Material': 'SS 304', 'Standard': 'ASME B16.5' },
    historicalProcurement: { lastProcurementYear: 2025, annualVolume: 400, procurementUnit: 'NOS', avgUnitRateINR: 3450 },
    dataSource: 'CSV',
    status: 'harmonized',
    cnmcCode: 'CNMC-000003',
    uploadedAt: '2026-09-02T08:15:00Z',
    batchId: 'batch-04'
  },

  // 4. Candidate Items for Matching demonstration
  {
    id: 'rec-010',
    cpseId: 'cpse-2',
    cpseName: 'CPSE B',
    legacyCode: 'PWR-VLV-GT-02-800',
    description: 'VALVE GATE 2 INCH CLASS 800 FORGED STEEL ASTM A105 NPT FEMALE ENDS TRIM 8',
    category: 'Valves & Actuators',
    subCategory: 'Gate Valves',
    unitOfMeasure: 'NOS',
    standardizedDescription: 'Gate Valve, Forged Carbon Steel, 2 Inch (50 mm), Class 800, NPT',
    specifications: { 'Valve Type': 'Gate Valve', 'Size': '2 Inch (50NB)', 'Rating': 'Class 800', 'Body Material': 'ASTM A105', 'Trim': 'API Trim 8 (13Cr)', 'End Connection': 'NPT Threaded' },
    dataSource: 'API',
    status: 'under_review',
    uploadedAt: '2026-09-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-011',
    cpseId: 'cpse-3',
    cpseName: 'CPSE C',
    legacyCode: 'STL-GT-2IN-800FS',
    description: '2" FORGED CARBON STEEL GATE VALVE CL 800 THREADED NPT A105 TRIM 8 OS&Y',
    category: 'Valves & Actuators',
    subCategory: 'Gate Valves',
    unitOfMeasure: 'NOS',
    standardizedDescription: 'Gate Valve, Forged Carbon Steel, 2 Inch (50 mm), Class 800, NPT',
    specifications: { 'Type': 'Gate Valve OS&Y', 'Bore': '2"', 'Class': '800#', 'Material': 'Forged CS A105', 'Ends': 'FNPT', 'Trim': '13% Cr' },
    dataSource: 'CSV',
    status: 'under_review',
    uploadedAt: '2026-09-20T14:45:00Z',
    batchId: 'batch-03'
  },
  {
    id: 'rec-012',
    cpseId: 'cpse-1',
    cpseName: 'CPSE A',
    legacyCode: 'BLT-M16X60-88',
    description: 'HEXAGON HEAD BOLT M16 X 60MM FULL THREAD GRADE 8.8 HOT DIP GALVANIZED ISO 4017',
    category: 'Fasteners & Hardware',
    subCategory: 'Bolts & Screws',
    unitOfMeasure: 'NOS',
    standardizedDescription: 'Hexagon Head Bolt, M16 x 60 mm, Property Class 8.8, Hot Dip Galvanized',
    specifications: { 'Thread': 'M16', 'Length': '60 mm', 'Property Class': 'Grade 8.8', 'Finish': 'Hot Dip Galvanized (HDG)', 'Standard': 'ISO 4017 / DIN 933' },
    dataSource: 'SAP / ERP',
    status: 'raw',
    uploadedAt: '2026-08-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-013',
    cpseId: 'cpse-4',
    cpseName: 'CPSE D',
    legacyCode: 'RL-BLT-16X60-HDG',
    description: 'BOLT HEX HEAD M16X60 MM HT GR 8.8 HDG WITH NUT & WASHER DIN 933',
    category: 'Fasteners & Hardware',
    subCategory: 'Bolts & Screws',
    unitOfMeasure: 'SET',
    standardizedDescription: 'Hexagon Head Bolt Assembly (with Nut & Washer), M16 x 60 mm, Grade 8.8, HDG',
    specifications: { 'Diameter': '16mm', 'Length': '60mm', 'Strength Grade': '8.8', 'Coating': 'HDG' },
    dataSource: 'CSV',
    status: 'raw',
    uploadedAt: '2026-09-02T08:15:00Z',
    batchId: 'batch-04'
  },
  {
    id: 'rec-014',
    cpseId: 'cpse-1',
    cpseName: 'CPSE A',
    legacyCode: 'PMP-IMP-BRZ-150',
    description: 'IMPELLER CENTRIFUGAL PUMP 150MM BRONZE ASTM B62 CLOSED TYPE 6-VANE',
    category: 'Pumps & Rotating Equipment',
    subCategory: 'Pump Spares',
    unitOfMeasure: 'NOS',
    standardizedDescription: 'Centrifugal Pump Impeller, 150 mm, Cast Bronze ASTM B62, Closed Type',
    specifications: { 'Component': 'Centrifugal Impeller', 'Diameter': '150 mm', 'Material': 'Cast Bronze ASTM B62', 'Vanes': '6 Enclosed Vanes' },
    dataSource: 'SAP / ERP',
    status: 'distinct',
    uploadedAt: '2026-08-15T09:30:00Z',
    batchId: 'batch-01'
  },
  {
    id: 'rec-015',
    cpseId: 'cpse-2',
    cpseName: 'CPSE B',
    legacyCode: 'PIP-CS-SMLS-6IN-40',
    description: 'PIPE CS SMLS 6IN SCH40 ASTM A106 GR B BEVELLED ENDS',
    category: 'Pipes & Fittings',
    subCategory: 'Seamless Pipes',
    unitOfMeasure: 'MTR',
    standardizedDescription: 'Seamless Carbon Steel Pipe, 6 Inch (DN150), Schedule 40, ASTM A106 Grade B',
    specifications: { 'Pipe Type': 'Seamless (SMLS)', 'Nominal Size': '6 Inch (150 mm NB)', 'Schedule': 'SCH 40', 'Material': 'ASTM A106 Gr. B', 'Ends': 'Bevelled Ends (BE)' },
    dataSource: 'API',
    status: 'raw',
    uploadedAt: '2026-08-18T11:20:00Z',
    batchId: 'batch-02'
  },
  {
    id: 'rec-016',
    cpseId: 'cpse-3',
    cpseName: 'CPSE C',
    legacyCode: 'GSK-SPW-6IN-300-GR',
    description: 'SPIRAL WOUND GASKET 6" CLASS 300 ASME B16.20 SS316 GRAPHITE',
    category: 'Fasteners & Hardware',
    subCategory: 'Gaskets & Seals',
    unitOfMeasure: 'NOS',
    standardizedDescription: 'Spiral Wound Gasket 6 Inch Class 300 SS316 / Graphite',
    specifications: { 'Gasket Type': 'Spiral Wound (Style CGI)', 'Size': '6 Inch (DN150)', 'Rating': 'Class 300', 'Material': 'SS 316 / Graphite', 'Standard': 'ASME B16.20' },
    dataSource: 'CSV',
    status: 'harmonized',
    cnmcCode: 'CNMC-000004',
    uploadedAt: '2026-08-20T14:45:00Z',
    batchId: 'batch-03'
  },
  {
    id: 'rec-017',
    cpseId: 'cpse-4',
    cpseName: 'CPSE D',
    legacyCode: 'RL-INST-PG-100-10B',
    description: 'PRESSURE GAUGE DIGITAL 0-10 BAR 100MM DIAL 1/2" NPT SS316',
    category: 'Electrical & Instrumentation',
    subCategory: 'Pressure Gauges',
    unitOfMeasure: 'NOS',
    standardizedDescription: 'Digital Pressure Gauge, 0-10 Bar, 100 mm Dial, 1/2 Inch NPT, SS316',
    specifications: { 'Range': '0 - 10 Bar', 'Dial Size': '100 mm (4")', 'Connection': '1/2 Inch NPT Bottom', 'Sensor Material': 'SS 316L', 'Accuracy': '±0.25% F.S.' },
    dataSource: 'CSV',
    status: 'raw',
    uploadedAt: '2026-09-02T08:15:00Z',
    batchId: 'batch-04'
  }
];

export const INITIAL_MATCH_CANDIDATES: MatchCandidate[] = [
  {
    id: 'match-000',
    sourceRecord: INITIAL_MATERIAL_RECORDS[6], // CPSE A FLG-WN-304-4IN
    targetRecord: INITIAL_MATERIAL_RECORDS[7], // CPSE B PWR-4IN-150-SS304
    similarityScore: 0.99,
    semanticScore: 1.00,
    attributeMatchScore: 0.98,
    matchType: 'Identical',
    confidenceLevel: 'HIGH',
    matchingAttributes: [
      'Flange Standard: ASME B16.5',
      'Flange Type: Weld Neck (WN)',
      'Nominal Size: 4 Inch (DN100 / 100NB)',
      'Pressure Class: Class 150 (PN 20)',
      'Facing: Raised Face (RF)',
      'Material Specification: ASTM A182 Grade F304 (SS 304)'
    ],
    differingAttributes: [
      'Store Item Code Syntax: FLG-WN-304-4IN vs PWR-4IN-150-SS304'
    ],
    aiExplanation: [
      'Exact 100% semantic and technical parameter alignment across participating CPSEs',
      'Identical metallurgical grade ASTM A182 F304 forged stainless steel',
      'Matching dimensional standard ASME B16.5 Class 150 Raised Face',
      'Zero technical variation across physical properties or operational limits'
    ],
    proposedStandardizedName: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    proposedCNMC: 'CNMC-000003',
    proposedUNSPSC: '40172401',
    status: 'pending',
    matchRationale: 'Identical standard engineering component across CPSE A and CPSE B. Ready for immediate master record harmonization.',
    evaluatedAt: '2026-09-22T08:30:00Z',
    nlpPipelineSteps: [
      { step: '1. Text Standardization', detail: 'Normalized abbreviations "WN" → "Weld Neck", "4IN" → "4 Inch (DN100)", "150#" → "Class 150"' },
      { step: '2. Technical Attribute Extraction', detail: 'Extracted: Type=Weld Neck, Standard=ASME B16.5, Rating=150#, Material=A182 F304' },
      { step: '3. Semantic Embedding (SBERT)', detail: 'Cosine Similarity = 0.998' },
      { step: '4. Attribute Matrix Comparison', detail: '6 of 6 specifications identical (100% equivalence)' }
    ]
  },
  {
    id: 'match-001',
    sourceRecord: INITIAL_MATERIAL_RECORDS[0], // CPSE A MAT1001 (SS Ball Valve 2 Inch)
    targetRecord: INITIAL_MATERIAL_RECORDS[1], // CPSE B 458721 (Stainless Steel Ball Valve 50mm)
    similarityScore: 0.96,
    semanticScore: 0.98,
    attributeMatchScore: 0.94,
    matchType: 'Duplicate',
    confidenceLevel: 'HIGH',
    matchingAttributes: [
      'Valve Type: Ball Valve Full Bore',
      'Nominal Size Equivalence: 2 Inch = 50 mm',
      'Pressure Class: Class 150 (PN 20)',
      'Body Material: ASTM A351 CF8M / SS 316',
      'Facing: Raised Face (RF) to ASME B16.5'
    ],
    differingAttributes: [
      'Catalog Code Syntax: MAT1001 vs 458721',
      'Dimension Notation: Imperial ("2 Inch") vs Metric ("50mm")'
    ],
    aiExplanation: [
      'Similar semantic meaning across transformer embedding vector space (0.98 cosine similarity)',
      'Same material of construction (ASTM A351 CF8M / AISI 316 Stainless Steel)',
      'Same nominal pipe bore size (2 Inch is functionally identical to 50 mm DN50)',
      'Convergent technical parameters across ASME B16.5 flange rating and API 6D design codes'
    ],
    proposedStandardizedName: 'Stainless Steel Ball Valve – 50 mm',
    proposedCNMC: 'CNMC-000001',
    proposedUNSPSC: '40141607',
    status: 'accepted',
    matchRationale: 'Near-identical technical parameters. Sentence-BERT semantic representation and attribute extraction confirm identical functional and physical specifications.',
    evaluatedAt: '2026-09-20T10:15:00Z',
    nlpPipelineSteps: [
      { step: '1. Text Standardization', detail: 'Normalized abbreviations "SS" → "Stainless Steel", "BV" → "Ball Valve", "2 IN" → "50 mm"' },
      { step: '2. Technical Attribute Extraction', detail: 'Extracted parameters: MOC=SS316, Size=50mm, Rating=150#, Ends=Flanged' },
      { step: '3. Semantic Embedding (SBERT)', detail: 'Generated 768-dim dense embedding vectors; Cosine Similarity = 0.982' },
      { step: '4. Attribute Matrix Comparison', detail: '5 of 5 core engineering parameters matched with 100% equivalence' }
    ]
  },
  {
    id: 'match-002',
    sourceRecord: INITIAL_MATERIAL_RECORDS[9], // CPSE B (Gate Valve 2" Class 800)
    targetRecord: INITIAL_MATERIAL_RECORDS[10], // CPSE C (Gate Valve 2" Class 800)
    similarityScore: 0.94,
    semanticScore: 0.96,
    attributeMatchScore: 0.92,
    matchType: 'Near-Duplicate',
    confidenceLevel: 'HIGH',
    matchingAttributes: [
      'Valve Type: Gate Valve OS&Y',
      'Nominal Size: 2 Inch (DN50)',
      'Pressure Rating: Class 800 (Forged)',
      'Body Material: ASTM A105 Carbon Steel',
      'Trim: API Trim 8 (13% Cr)',
      'End Connection: NPT Female Threaded'
    ],
    differingAttributes: [
      'Legacy Code Syntax: PWR-VLV-GT-02-800 vs STL-GT-2IN-800FS',
      'Abbreviation: "CLASS 800" vs "CL 800"'
    ],
    aiExplanation: [
      'Identical core forging material (ASTM A105 carbon steel body)',
      'Same high pressure rating class (800#) for process steam/hydrocarbon service',
      'Matching API Trim 8 stainless internal components and FNPT connections',
      'Minor phrasing discrepancy in store catalogue descriptions resolved via NLP'
    ],
    proposedStandardizedName: 'Gate Valve, Forged Carbon Steel, 2 Inch (50 mm), Class 800, NPT, ASTM A105, Trim 8',
    proposedCNMC: 'CNMC-000006',
    proposedUNSPSC: '40141602',
    status: 'pending',
    matchRationale: 'High cosine similarity on dense embeddings (0.96) and 100% attribute convergence across size, pressure rating, material, and end connections.',
    evaluatedAt: '2026-09-24T10:15:00Z',
    nlpPipelineSteps: [
      { step: '1. Text Standardization', detail: 'Normalized "CL 800" → "Class 800", "2IN" → "2 Inch", "FS" → "Forged Steel"' },
      { step: '2. Technical Attribute Extraction', detail: 'Extracted: Type=Gate Valve, Material=ASTM A105, Trim=Trim 8, Rating=800#' },
      { step: '3. Semantic Embedding (SBERT)', detail: 'Domain Transformer Vector Distance: Cosine Similarity = 0.961' },
      { step: '4. Attribute Matrix Comparison', detail: '6 of 6 technical specifications matched' }
    ]
  },
  {
    id: 'match-003',
    sourceRecord: INITIAL_MATERIAL_RECORDS[11], // CPSE A (Hex Bolt M16x60 Gr 8.8)
    targetRecord: INITIAL_MATERIAL_RECORDS[12], // CPSE D (Hex Bolt M16x60 Gr 8.8)
    similarityScore: 0.84,
    semanticScore: 0.88,
    attributeMatchScore: 0.80,
    matchType: 'Functionally Equivalent',
    confidenceLevel: 'MEDIUM',
    matchingAttributes: [
      'Fastener Type: Hexagon Head Bolt',
      'Nominal Thread & Length: M16 x 60 mm',
      'Property Class: Grade 8.8 High Tensile',
      'Surface Coating: Hot Dip Galvanized (HDG)',
      'Standard: ISO 4017 / DIN 933'
    ],
    differingAttributes: [
      'Packaging UOM: Individual Bolt (NOS) vs Assembly Set with Nut & Washer (SET)'
    ],
    aiExplanation: [
      'Identical core mechanical fastener geometry and tensile strength',
      'Matching hot-dip galvanized corrosion protection specification',
      'Discrepancy noted in packaging unit (individual fastener vs bolt assembly set)'
    ],
    proposedStandardizedName: 'Hexagon Head Bolt, M16 x 60 mm, Property Class 8.8, Hot Dip Galvanized, ISO 4017',
    proposedCNMC: 'CNMC-000005',
    proposedUNSPSC: '31161620',
    status: 'pending',
    matchRationale: 'Identical core fastener geometry and tensile specification. Domain expert review advised to confirm UOM standard.',
    evaluatedAt: '2026-09-25T14:02:00Z',
    nlpPipelineSteps: [
      { step: '1. Text Standardization', detail: 'Extracted standard metric fastener tokens "M16X60", "GR 8.8", "HDG"' },
      { step: '2. Technical Attribute Extraction', detail: 'Extracted: Diameter=16mm, Length=60mm, Grade=8.8, Finish=HDG' },
      { step: '3. Semantic Embedding (SBERT)', detail: 'Cosine Similarity = 0.880' },
      { step: '4. Attribute Matrix Comparison', detail: 'Core specs match; UOM difference flagged for Expert review' }
    ]
  },
  {
    id: 'match-004',
    sourceRecord: INITIAL_MATERIAL_RECORDS[13], // CPSE A Centrifugal Pump Impeller
    targetRecord: INITIAL_MATERIAL_RECORDS[10], // CPSE C Gate Valve 2"
    similarityScore: 0.24,
    semanticScore: 0.28,
    attributeMatchScore: 0.20,
    matchType: 'No Significant Match',
    confidenceLevel: 'LOW',
    matchingAttributes: [
      'Industrial Process Equipment Domain'
    ],
    differingAttributes: [
      'Commodity Classification: Pumps & Rotating Spares vs Valves & Actuators',
      'Operational Function: Dynamic Kinetic Fluid Transfer vs Static Flow Isolation',
      'Metallurgy & Material: Cast Bronze ASTM B62 vs Forged Carbon Steel ASTM A105',
      'Geometry: 150mm 6-Vane Impeller Rotor vs 2 Inch Class 800 Gate Valve'
    ],
    aiExplanation: [
      'Low vector similarity (0.28) across Sentence-BERT dense embedding space',
      'Fundamental taxonomy divergence between rotating machine spare and pipeline isolation valve',
      'Non-compatible metallurgical and mechanical specifications',
      'AI Recommendation: Distinct items with zero functional overlap. No CNMC consolidation recommended.'
    ],
    proposedStandardizedName: 'No Consolidated Master Code (Distinct Items)',
    proposedCNMC: 'N/A (Distinct Item)',
    proposedUNSPSC: 'N/A',
    status: 'rejected',
    matchRationale: 'System evaluated candidate pair and established complete physical and functional divergence. Categorized under No Significant Match.',
    evaluatedAt: '2026-09-26T16:45:00Z',
    nlpPipelineSteps: [
      { step: '1. Text Standardization', detail: 'Tokens parsed: "Impeller", "Bronze" vs "Gate Valve", "Forged Steel"' },
      { step: '2. Technical Attribute Extraction', detail: 'Incompatible attribute sets detected (Radial Vanes vs Valve Trim)' },
      { step: '3. Semantic Embedding (SBERT)', detail: 'Cosine Similarity = 0.284 (Below clustering threshold of 0.75)' },
      { step: '4. Attribute Matrix Comparison', detail: 'Zero attribute convergence; flagged as distinct' }
    ]
  }
];

export const INITIAL_UNIFIED_MATERIALS: UnifiedMaterial[] = [
  {
    id: 'unif-001',
    cnmcCode: 'CNMC-000001',
    standardName: 'Stainless Steel Ball Valve – 50 mm',
    standardDescription: 'Ball valve, full bore, nominal size 50 mm (2 Inch), ASME Class 150 pressure rating, raised face flanged ends, body material forged/cast austenitic stainless steel ASTM A351 CF8M / SS 316, PTFE seats, API 6D design.',
    category: 'Valves & Actuators',
    subCategory: 'Ball Valves',
    unspscCode: '40141607',
    unspscCategory: 'Ball valves',
    standardUom: 'NOS',
    standardSpecs: {
      'Valve Type': 'Ball Valve (Full Bore)',
      'Nominal Size': '50 mm (2 Inch / DN50)',
      'Pressure Class': 'Class 150 (PN 20)',
      'Body Material': 'ASTM A351 CF8M (SS 316)',
      'Ball & Stem': 'AISI 316 Stainless Steel',
      'Seat & Seals': 'Reinforced PTFE (R-PTFE)',
      'End Connection': 'Flanged ASME B16.5 Class 150 RF',
      'Design Standard': 'API 6D / ISO 17292 / ASME B16.34',
      'Testing Standard': 'API 598'
    },
    cpseMappings: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', legacyItemCode: 'MAT1001', originalDescription: 'SS Ball Valve 2 Inch', uom: 'NOS', erpSystem: 'SAP ECC 6.0', mappedDate: '2026-09-15' },
      { cpseName: 'National Thermal & Hydro Power Corp.', cpseCode: 'CPSE B', legacyItemCode: '458721', originalDescription: 'Stainless Steel Ball Valve 50mm', uom: 'NOS', erpSystem: 'SAP S/4HANA', mappedDate: '2026-09-18' },
      { cpseName: 'National Steel & Metallurgy Authority', cpseCode: 'CPSE C', legacyItemCode: 'PV2034', originalDescription: '2" SS Ball Valve', uom: 'NOS', erpSystem: 'Oracle ERP Cloud', mappedDate: '2026-09-20' }
    ],
    legacyMappings: [
      { cpseName: 'CPSE A', oldCode: 'OLD-12345', description: 'VALVE BALL 2IN SS316 150# FLG', status: 'Approved', mappedDate: '2026-09-16' },
      { cpseName: 'CPSE B', oldCode: 'LEG-VLV-50SS', description: '50MM BALL VALVE FLANGED SS', status: 'Approved', mappedDate: '2026-09-19' },
      { cpseName: 'CPSE C', oldCode: 'OLD-PV-02-150', description: 'BALL VALVE SS 2 INCH 150LB', status: 'Suggested', mappedDate: '2026-09-22' }
    ],
    demandAggregation: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', annualRequirement: 500, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'National Thermal & Hydro Power Corp.', cpseCode: 'CPSE B', annualRequirement: 800, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'National Steel & Metallurgy Authority', cpseCode: 'CPSE C', annualRequirement: 700, unit: 'NOS', lastProcurementYear: 2025 }
    ],
    totalIdentifiedRequirement: 2000,
    approvalStatus: 'Approved',
    lastUpdated: '2026-09-22',
    approvedBy: 'Dr. V. Raman (Lead Domain Expert - Mechanical)',
    version: 1
  },
  {
    id: 'unif-002',
    cnmcCode: 'CNMC-000002',
    standardName: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
    standardDescription: 'Deep groove radial ball bearing, single row, metric series 6309 with C3 radial internal clearance. Dimensions: 45 mm Bore (d) x 100 mm Outer Diameter (D) x 25 mm Width (B). Steel cage, open configuration conforming to ISO 15.',
    category: 'Bearings & Power Transmission',
    subCategory: 'Ball Bearings',
    unspscCode: '31171504',
    unspscCategory: 'Ball bearings',
    standardUom: 'NOS',
    standardSpecs: {
      'Bearing Type': 'Deep Groove Radial Ball Bearing',
      'Designation': '6309 C3',
      'Radial Clearance': 'C3 (23 - 43 µm)',
      'Bore Diameter (d)': '45 mm',
      'Outer Diameter (D)': '100 mm',
      'Width (B)': '25 mm',
      'Basic Dynamic Load (Cr)': '55.3 kN',
      'Basic Static Load (C0r)': '31.5 kN',
      'Standard Reference': 'ISO 15 / DIN 625'
    },
    cpseMappings: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', legacyItemCode: 'MAT-BRG-6309', originalDescription: 'DEEP GROOVE BALL BEARING 6309 C3 45X100X25MM', uom: 'NOS', erpSystem: 'SAP ECC 6.0', mappedDate: '2026-09-15' },
      { cpseName: 'National Thermal & Hydro Power Corp.', cpseCode: 'CPSE B', legacyItemCode: '889210-6309C3', originalDescription: 'BRG RADIAL BALL 6309-C3 DIM 45 X 100 X 25 MM', uom: 'NOS', erpSystem: 'SAP S/4HANA', mappedDate: '2026-09-18' },
      { cpseName: 'National Steel & Metallurgy Authority', cpseCode: 'CPSE C', legacyItemCode: 'STL-BRG-09C3', originalDescription: 'BALL BRG 6309 C3 METRIC INDUSTRIAL 45X100X25', uom: 'NOS', erpSystem: 'Oracle ERP Cloud', mappedDate: '2026-09-20' }
    ],
    legacyMappings: [
      { cpseName: 'CPSE A', oldCode: 'OLD-BRG-09C3', description: 'RADIAL BALL BEARING 6309 C3', status: 'Approved', mappedDate: '2026-09-16' },
      { cpseName: 'CPSE B', oldCode: 'OLD-6309-PWR', description: 'BEARING RADIAL 6309 C3 OPEN', status: 'Approved', mappedDate: '2026-09-19' }
    ],
    demandAggregation: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', annualRequirement: 1200, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'National Thermal & Hydro Power Corp.', cpseCode: 'CPSE B', annualRequirement: 1500, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'National Steel & Metallurgy Authority', cpseCode: 'CPSE C', annualRequirement: 1800, unit: 'NOS', lastProcurementYear: 2025 }
    ],
    totalIdentifiedRequirement: 4500,
    approvalStatus: 'Approved',
    lastUpdated: '2026-09-22',
    approvedBy: 'Dr. V. Raman (Lead Domain Expert - Mechanical)',
    version: 1
  },
  {
    id: 'unif-003',
    cnmcCode: 'CNMC-000003',
    standardName: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    standardDescription: 'Pipe flange, welding neck type, nominal pipe size 4 Inch (DN100), ASME Class 150 pressure rating, raised face (RF), manufactured from forged austenitic stainless steel ASTM A182 Grade F304, matching Schedule 40 pipe.',
    category: 'Pipes & Fittings',
    subCategory: 'Flanges',
    unspscCode: '40172401',
    unspscCategory: 'Pipe flanges',
    standardUom: 'NOS',
    standardSpecs: {
      'Flange Type': 'Weld Neck (WN)',
      'Nominal Pipe Size': '4 Inch (DN100 / 100 mm NB)',
      'Pressure Class': 'Class 150 (PN 20)',
      'Facing Type': 'Raised Face 1/16" (RF)',
      'Material Specification': 'ASTM A182 Grade F304',
      'Design & Dimensions': 'ASME B16.5',
      'Bore Schedule': 'Schedule 40 (Standard Wall)'
    },
    cpseMappings: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', legacyItemCode: 'FLG-WN-304-4IN', originalDescription: 'FLANGE WELD NECK 4" 150# RF ASME B16.5 ASTM A182 F304', uom: 'NOS', erpSystem: 'SAP ECC 6.0', mappedDate: '2026-09-15' },
      { cpseName: 'National Thermal & Hydro Power Corp.', cpseCode: 'CPSE B', legacyItemCode: 'PWR-4IN-150-SS304', originalDescription: 'FLANGE 4 INCH WELDING NECK CL150 RAISED FACE SS304', uom: 'NOS', erpSystem: 'SAP S/4HANA', mappedDate: '2026-09-18' },
      { cpseName: 'Rail Transit Rolling Stock & Infra Ltd.', cpseCode: 'CPSE D', legacyItemCode: 'RL-FLG-DN100-304', originalDescription: 'SS304 WELDNECK FLANGE 100MM NB CLASS 150 ASME B16.5 RF', uom: 'NOS', erpSystem: 'In-House ERP', mappedDate: '2026-09-22' }
    ],
    legacyMappings: [
      { cpseName: 'CPSE A', oldCode: 'OLD-FLG-4-150', description: 'FLANGE WN 4IN SS304 150#', status: 'Approved', mappedDate: '2026-09-16' },
      { cpseName: 'CPSE D', oldCode: 'RL-OLD-100-FLG', description: 'FLANGE 100MM NB 150LB SS', status: 'Suggested', mappedDate: '2026-09-23' }
    ],
    demandAggregation: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', annualRequirement: 600, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'National Thermal & Hydro Power Corp.', cpseCode: 'CPSE B', annualRequirement: 900, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'Rail Transit Rolling Stock & Infra Ltd.', cpseCode: 'CPSE D', annualRequirement: 400, unit: 'NOS', lastProcurementYear: 2025 }
    ],
    totalIdentifiedRequirement: 1900,
    approvalStatus: 'Approved',
    lastUpdated: '2026-09-23',
    approvedBy: 'Er. M. Ghosh (Materials Standardization Lead)',
    version: 1
  },
  {
    id: 'unif-004',
    cnmcCode: 'CNMC-000004',
    standardName: 'Spiral Wound Gasket 6 Inch Class 300 SS316 / Graphite',
    standardDescription: 'Spiral wound metallic gasket for ASME B16.5 flanges, size 6 Inch (DN150), Class 300#. SS316 metallic winding with flexible exfoliated graphite filler, carbon steel outer centering ring and SS316 inner ring.',
    category: 'Fasteners & Hardware',
    subCategory: 'Gaskets & Seals',
    unspscCode: '31401503',
    unspscCategory: 'Metallic and semi metallic gaskets',
    standardUom: 'NOS',
    standardSpecs: {
      'Gasket Style': 'Spiral Wound with Inner & Outer Rings (Style CGI)',
      'Nominal Size': '6 Inch (DN150)',
      'Flange Rating': 'Class 300',
      'Winding Strip': 'SS 316 (ASTM A240)',
      'Filler Material': 'Flexible Graphite',
      'Outer Ring': 'Carbon Steel (Corrosion Inhibited)',
      'Inner Ring': 'Stainless Steel 316',
      'Standard Code': 'ASME B16.20'
    },
    cpseMappings: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', legacyItemCode: 'GSK-SPW-6IN-300', originalDescription: 'SPIRAL WOUND GASKET 6" CLASS 300 ASME B16.20 SS316', uom: 'NOS', erpSystem: 'SAP ECC 6.0', mappedDate: '2026-09-15' },
      { cpseName: 'National Steel & Metallurgy Authority', cpseCode: 'CPSE C', legacyItemCode: 'STL-GSK-150-300', originalDescription: 'GASKET METALLIC SPIRAL WOUND 6 INCH 300 LBS SS 316 / GRAPHITE', uom: 'NOS', erpSystem: 'Oracle ERP Cloud', mappedDate: '2026-09-20' }
    ],
    legacyMappings: [
      { cpseName: 'CPSE A', oldCode: 'OLD-GSK-6-300', description: 'SW GASKET 6IN 300LB SS316', status: 'Approved', mappedDate: '2026-09-16' }
    ],
    demandAggregation: [
      { cpseName: 'Heavy Engineering Corporation Ltd.', cpseCode: 'CPSE A', annualRequirement: 850, unit: 'NOS', lastProcurementYear: 2025 },
      { cpseName: 'National Steel & Metallurgy Authority', cpseCode: 'CPSE C', annualRequirement: 1100, unit: 'NOS', lastProcurementYear: 2025 }
    ],
    totalIdentifiedRequirement: 1950,
    approvalStatus: 'Approved',
    lastUpdated: '2026-09-24',
    approvedBy: 'Shri P. Nair (Standardization Specialist)',
    version: 1
  }
];

export const INITIAL_LEGACY_MIGRATIONS: LegacyMigrationRecord[] = [
  {
    id: 'MIG-001',
    legacyCode: 'OLD-12345',
    cpseName: 'Heavy Engineering Corporation Ltd.',
    cpseCode: 'CPSE A',
    originalDescription: 'VALVE BALL 2IN SS316 150# FLG LEVER',
    category: 'Valves & Actuators',
    mappedCNMC: 'CNMC-000001',
    standardName: 'Stainless Steel Ball Valve – 50 mm',
    status: 'Approved',
    confidence: 0.98,
    lastModified: '2026-09-16',
    reviewedBy: 'Dr. V. Raman'
  },
  {
    id: 'MIG-002',
    legacyCode: 'LEG-VLV-50SS',
    cpseName: 'National Thermal & Hydro Power Corp.',
    cpseCode: 'CPSE B',
    originalDescription: '50MM BALL VALVE FLANGED SS 150 LB',
    category: 'Valves & Actuators',
    mappedCNMC: 'CNMC-000001',
    standardName: 'Stainless Steel Ball Valve – 50 mm',
    status: 'Approved',
    confidence: 0.96,
    lastModified: '2026-09-19',
    reviewedBy: 'Dr. V. Raman'
  },
  {
    id: 'MIG-003',
    legacyCode: 'OLD-PV-02-150',
    cpseName: 'National Steel & Metallurgy Authority',
    cpseCode: 'CPSE C',
    originalDescription: 'BALL VALVE SS 2 INCH 150LB RF B16.5',
    category: 'Valves & Actuators',
    mappedCNMC: 'CNMC-000001',
    standardName: 'Stainless Steel Ball Valve – 50 mm',
    status: 'Suggested',
    confidence: 0.93,
    lastModified: '2026-09-22'
  },
  {
    id: 'MIG-004',
    legacyCode: 'OLD-BRG-09C3',
    cpseName: 'Heavy Engineering Corporation Ltd.',
    cpseCode: 'CPSE A',
    originalDescription: 'RADIAL BALL BEARING 6309 C3 45X100X25',
    category: 'Bearings & Power Transmission',
    mappedCNMC: 'CNMC-000002',
    standardName: 'Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
    status: 'Approved',
    confidence: 0.99,
    lastModified: '2026-09-16',
    reviewedBy: 'Er. M. Ghosh'
  },
  {
    id: 'MIG-005',
    legacyCode: 'OLD-FLG-4-150',
    cpseName: 'Heavy Engineering Corporation Ltd.',
    cpseCode: 'CPSE A',
    originalDescription: 'FLANGE WN 4IN SS304 150# SCH40 RF',
    category: 'Pipes & Fittings',
    mappedCNMC: 'CNMC-000003',
    standardName: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    status: 'Approved',
    confidence: 0.97,
    lastModified: '2026-09-16',
    reviewedBy: 'Er. M. Ghosh'
  },
  {
    id: 'MIG-006',
    legacyCode: 'RL-OLD-100-FLG',
    cpseName: 'Rail Transit Rolling Stock & Infra Ltd.',
    cpseCode: 'CPSE D',
    originalDescription: 'FLANGE 100MM NB 150LB SS304 WN',
    category: 'Pipes & Fittings',
    mappedCNMC: 'CNMC-000003',
    standardName: 'Weld Neck Flange 4 Inch (DN100) Class 150 Raised Face SS304',
    status: 'Pending Validation',
    confidence: 0.89,
    lastModified: '2026-09-23'
  },
  {
    id: 'MIG-007',
    legacyCode: 'VLV-GT-LEGACY-02',
    cpseName: 'National Thermal & Hydro Power Corp.',
    cpseCode: 'CPSE B',
    originalDescription: 'VALVE GATE 2" 800# FORGED A105 NPT',
    category: 'Valves & Actuators',
    mappedCNMC: 'CNMC-000006',
    standardName: 'Gate Valve, Forged Carbon Steel, 2 Inch, Class 800, NPT',
    status: 'Pending Validation',
    confidence: 0.94,
    lastModified: '2026-09-24'
  },
  {
    id: 'MIG-008',
    legacyCode: 'RAW-UNCAT-9982',
    cpseName: 'National Steel & Metallurgy Authority',
    cpseCode: 'CPSE C',
    originalDescription: 'SPECIAL HIGH ALLOY CASTING SLEEVE 120X40',
    category: 'Custom Castings',
    mappedCNMC: '',
    standardName: 'Unmapped Distinct Component',
    status: 'Unmapped',
    lastModified: '2026-09-25'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'AUD-2026-001',
    materialCNMC: 'CNMC-000001',
    action: 'CPSE Code Mapped',
    previousValue: 'Unmapped (New Record)',
    newValue: 'CPSE A → MAT1001 ("SS Ball Valve 2 Inch")',
    actionBy: 'Dr. V. Raman',
    role: 'Lead Domain Expert (Mechanical)',
    timestamp: '2026-09-15 14:30:22',
    status: 'Approved',
    notes: 'Established initial Common National Material Code standard for 50mm SS Ball Valve.'
  },
  {
    id: 'AUD-2026-002',
    materialCNMC: 'CNMC-000001',
    action: 'CPSE Code Mapped',
    previousValue: 'Mapped: CPSE A',
    newValue: 'CPSE B → 458721 ("Stainless Steel Ball Valve 50mm")',
    actionBy: 'Dr. V. Raman',
    role: 'Lead Domain Expert (Mechanical)',
    timestamp: '2026-09-18 16:15:10',
    status: 'Approved',
    notes: 'Validated 100% equivalence between 50mm and 2 Inch SS316 150# specification.'
  },
  {
    id: 'AUD-2026-003',
    materialCNMC: 'CNMC-000001',
    action: 'CPSE Code Mapped',
    previousValue: 'Mapped: CPSE A, CPSE B',
    newValue: 'CPSE C → PV2034 ("2\\" SS Ball Valve")',
    actionBy: 'Er. M. Ghosh',
    role: 'Standardization Specialist',
    timestamp: '2026-09-20 11:45:00',
    status: 'Approved',
    notes: 'Harmonized 3rd participating CPSE catalog code.'
  },
  {
    id: 'AUD-2026-004',
    materialCNMC: 'CNMC-000001',
    action: 'Legacy Code Migration Approved',
    previousValue: 'Unmapped Legacy Code',
    newValue: 'CPSE A → OLD-12345 mapped to CNMC-000001',
    actionBy: 'Dr. V. Raman',
    role: 'Lead Domain Expert',
    timestamp: '2026-09-22 09:20:15',
    status: 'Approved',
    notes: 'Historical ERP migration mapping approved for procurement continuity.'
  },
  {
    id: 'AUD-2026-005',
    materialCNMC: 'CNMC-000002',
    action: 'CNMC Master Record Created',
    previousValue: 'None',
    newValue: 'CNMC-000002: Deep Groove Ball Bearing 6309 C3 (45x100x25 mm)',
    actionBy: 'Dr. V. Raman',
    role: 'Lead Domain Expert',
    timestamp: '2026-09-22 14:10:00',
    status: 'Approved',
    notes: 'Harmonized radial bearings across CPSE A, CPSE B, CPSE C.'
  },
  {
    id: 'AUD-2026-006',
    materialCNMC: 'CNMC-000003',
    action: 'CPSE Code Mapped',
    previousValue: 'Mapped: CPSE A, CPSE B',
    newValue: 'CPSE D → RL-FLG-DN100-304',
    actionBy: 'Er. M. Ghosh',
    role: 'Standardization Specialist',
    timestamp: '2026-09-23 15:30:45',
    status: 'Approved',
    notes: 'Metric 100mm NB rail transit specification mapped to 4 Inch Class 150 flange.'
  }
];

export const INITIAL_UPLOAD_BATCHES: UploadBatch[] = [
  {
    id: 'BATCH-2026-01',
    cpseId: 'cpse-1',
    cpseName: 'CPSE A (Heavy Engineering)',
    filename: 'HEC_SAP_MM_Catalog_Extract_Q3_2026.csv',
    dataSource: 'SAP / ERP',
    totalRows: 5420,
    validRows: 5385,
    invalidRows: 35,
    status: 'completed',
    uploadedAt: '2026-08-15 09:30 AM'
  },
  {
    id: 'BATCH-2026-02',
    cpseId: 'cpse-2',
    cpseName: 'CPSE B (Thermal & Hydro Power)',
    filename: 'NTPC_S4HANA_Materials_API_Ingest.json',
    dataSource: 'API',
    totalRows: 7850,
    validRows: 7810,
    invalidRows: 40,
    status: 'completed',
    uploadedAt: '2026-08-18 11:20 AM'
  },
  {
    id: 'BATCH-2026-03',
    cpseId: 'cpse-3',
    cpseName: 'CPSE C (National Steel)',
    filename: 'Steel_Mining_Stores_Inventory_Extract.xlsx',
    dataSource: 'Excel',
    totalRows: 6310,
    validRows: 6270,
    invalidRows: 40,
    status: 'completed',
    uploadedAt: '2026-08-20 02:45 PM'
  },
  {
    id: 'BATCH-2026-04',
    cpseId: 'cpse-4',
    cpseName: 'CPSE D (Rail Transit)',
    filename: 'RailTrans_RollingStock_Components.csv',
    dataSource: 'CSV',
    totalRows: 4180,
    validRows: 4162,
    invalidRows: 18,
    status: 'completed',
    uploadedAt: '2026-09-02 08:15 AM'
  }
];
