export type UserRole = 'procurement' | 'expert' | 'admin';

export interface UserSession {
  email: string;
  role: UserRole;
  name: string;
  title: string;
}

export type NavigationPage = 
  | 'dashboard'
  | 'records'         // Material Explorer
  | 'matching'        // Harmonization Center
  | 'master'          // Standard Catalog
  | 'onboarding'      // Organizations
  | 'explorer'
  | 'harmonization'
  | 'catalog'
  | 'organizations'
  | 'standardization'
  | 'validation'
  | 'legacy-migration'
  | 'collaborative-procurement'
  | 'procurement-insights'
  | 'analytics'
  | 'audit-trail'
  | 'sap-erp-integration'
  | 'administration';

export interface CPSEOrg {
  id: string;
  code: string;
  name: string;
  ministry: string;
  sector: string;
  orgIdentifier: string;
  officialEmail: string;
  headquarters: string;
  erpSystem: string;
  uploadMethod: 'CSV / Excel' | 'SAP / ERP Integration' | 'API';
  status: 'Active' | 'Approved' | 'Pending Verification';
  totalRecords: number;
  contactPerson: string;
  contactDesignation: string;
  onboardedDate: string;
}

export interface CPSEOnboardingRequest {
  id: string;
  cpseName: string;
  ministry: string;
  sector: string;
  orgIdentifier: string;
  officialEmail: string;
  headquarters: string;
  repName: string;
  designation: string;
  repEmail: string;
  contactNumber: string;
  erpSystem: string;
  materialMasterFormat: string;
  dataUploadMethod: 'CSV / Excel' | 'SAP / ERP Integration' | 'API';
  status: 'Pending Verification' | 'Approved' | 'Active';
  submittedAt: string;
  notes?: string;
}

export interface MaterialRecord {
  id: string;
  cpseId: string;
  cpseName: string;
  legacyCode: string;
  description: string;
  standardizedDescription?: string;
  category: string;
  subCategory?: string;
  unitOfMeasure: string;
  specifications: Record<string, string>;
  technicalParameters?: Record<string, string>;
  historicalProcurement?: {
    lastProcurementYear: number;
    annualVolume: number;
    procurementUnit: string;
    avgUnitRateINR?: number;
  };
  dataSource: 'CSV' | 'Excel' | 'SAP / ERP' | 'API';
  status: 'raw' | 'matched' | 'harmonized' | 'under_review' | 'distinct';
  cnmcCode?: string; // Common National Material Code (e.g., CNMC-000001)
  uploadedAt: string;
  batchId: string;
}

export type MatchType = 
  | 'Identical'
  | 'Duplicate'
  | 'Near-Duplicate'
  | 'Functionally Equivalent'
  | 'No Significant Match';

export interface MatchCandidate {
  id: string;
  sourceRecord: MaterialRecord;
  targetRecord: MaterialRecord;
  similarityScore: number; // 0.0 to 1.0 (e.g., 0.96)
  semanticScore: number;
  attributeMatchScore: number;
  matchType: MatchType;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  matchingAttributes: string[];
  differingAttributes: string[];
  aiExplanation: string[];
  proposedStandardizedName: string;
  proposedCNMC: string; // e.g. CNMC-000001
  proposedUNSPSC: string;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  matchRationale: string;
  evaluatedAt: string;
  nlpPipelineSteps?: {
    step: string;
    detail: string;
  }[];
}

export interface CPSEMappingEntry {
  cpseName: string;
  cpseCode: string;
  legacyItemCode: string;
  originalDescription: string;
  uom: string;
  erpSystem: string;
  mappedDate: string;
}

export interface LegacyMappingEntry {
  cpseName: string;
  oldCode: string;
  description: string;
  status: 'Approved' | 'Suggested' | 'Pending Validation' | 'Unmapped' | 'Rejected';
  mappedDate: string;
}

export interface DemandAggregationEntry {
  cpseName: string;
  cpseCode: string;
  annualRequirement: number;
  unit: string;
  lastProcurementYear: number;
}

export interface UnifiedMaterial {
  id: string;
  cnmcCode: string; // e.g. CNMC-000001
  standardName: string;
  standardDescription: string;
  category: string;
  subCategory?: string;
  unspscCode: string;
  unspscCategory: string;
  standardUom: string;
  standardSpecs: Record<string, string>;
  cpseMappings: CPSEMappingEntry[];
  legacyMappings: LegacyMappingEntry[];
  demandAggregation: DemandAggregationEntry[];
  totalIdentifiedRequirement: number;
  approvalStatus: 'Approved' | 'Pending Expert Approval' | 'Under Review' | 'Draft';
  lastUpdated: string;
  approvedBy: string;
  version: number;
}

export interface LegacyMigrationRecord {
  id: string;
  legacyCode: string;
  cpseName: string;
  cpseCode: string;
  originalDescription: string;
  category: string;
  mappedCNMC: string;
  standardName: string;
  status: 'Unmapped' | 'Suggested' | 'Pending Validation' | 'Approved' | 'Rejected';
  confidence?: number;
  lastModified: string;
  reviewedBy?: string;
}

export interface AuditLogRecord {
  id: string;
  materialCNMC: string;
  action: string;
  previousValue: string;
  newValue: string;
  actionBy: string;
  role: string;
  timestamp: string;
  status: 'Approved' | 'Recorded' | 'Pending Review';
  notes?: string;
}

export interface ValidationAction {
  id: string;
  candidateId: string;
  actionType: 'accept' | 'reject' | 'override' | 'merge_cluster';
  reviewer: string;
  reviewerRole: string;
  timestamp: string;
  remarks: string;
  resultingCNMC?: string;
}

export interface UploadBatch {
  id: string;
  cpseId: string;
  cpseName: string;
  filename: string;
  dataSource: 'CSV' | 'Excel' | 'SAP / ERP' | 'API';
  totalRows: number;
  validRows: number;
  invalidRows: number;
  status: 'completed' | 'processing' | 'failed';
  uploadedAt: string;
}

export interface DashboardStats {
  totalMaterials: number;
  potentialMatches: number;
  duplicateMaterials: number;
  nearDuplicates: number;
  pendingValidation: number;
  commonNationalMaterialCodes: number;
  legacyCodesTotal: number;
  legacyCodesMapped: number;
  participatingCPSEs: number;
  cpseContributions: {
    cpseId: string;
    cpseCode: string;
    cpseName: string;
    ministry: string;
    total: number;
    harmonized: number;
    pending: number;
    erpSystem: string;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    duplicates: number;
    cnmcCount: number;
  }[];
  validationStatusSummary: {
    approved: number;
    pending: number;
    rejected: number;
    underReview: number;
  };
  recentActivity: {
    id: string;
    type: 'upload' | 'match' | 'validation' | 'unification' | 'onboarding' | 'migration';
    title: string;
    subtitle: string;
    timestamp: string;
    user: string;
  }[];
}
