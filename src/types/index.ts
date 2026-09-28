export interface CPSEOrg {
  id: string;
  code: string;
  name: string;
  sector: string;
  totalRecords: number;
  contactPerson: string;
}

export interface MaterialRecord {
  id: string;
  cpseId: string;
  cpseName: string;
  legacyCode: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  specifications: Record<string, string>;
  status: 'raw' | 'matched' | 'harmonized' | 'under_review' | 'distinct';
  unifiedMasterId?: string;
  uploadedAt: string;
  batchId: string;
}

export interface MatchCandidate {
  id: string;
  sourceRecord: MaterialRecord;
  targetRecord: MaterialRecord;
  similarityScore: number; // 0.0 to 1.0 (e.g., 0.94)
  semanticScore: number;
  attributeMatchScore: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  matchingAttributes: string[];
  differingAttributes: string[];
  proposedStandardizedName: string;
  proposedUNSPSC: string;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  matchRationale: string;
  evaluatedAt: string;
}

export interface UnifiedMaterial {
  id: string;
  unifiedCode: string;
  standardName: string;
  standardDescription: string;
  category: string;
  unspscCode: string;
  unspscCategory: string;
  standardUom: string;
  standardSpecs: Record<string, string>;
  mappedLegacyRecords: MaterialRecord[];
  participatingCPSEs: string[];
  duplicationCount: number;
  harmonizationDate: string;
  harmonizedBy: string;
  version: number;
  status: 'active' | 'under_review' | 'deprecated';
}

export interface ValidationAction {
  id: string;
  candidateId: string;
  actionType: 'accept' | 'reject' | 'override' | 'merge_cluster';
  reviewer: string;
  reviewerRole: string;
  timestamp: string;
  remarks: string;
  resultingMasterId?: string;
}

export interface UploadBatch {
  id: string;
  cpseId: string;
  cpseName: string;
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  status: 'completed' | 'processing' | 'failed';
  uploadedAt: string;
}

export interface DashboardStats {
  totalMaterials: number;
  potentialDuplicates: number;
  pendingReviews: number;
  unifiedMaterials: number;
  cpseContributions: {
    cpseId: string;
    cpseName: string;
    total: number;
    harmonized: number;
    pending: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    duplicates: number;
  }[];
  recentActivity: {
    id: string;
    type: 'upload' | 'match' | 'validation' | 'unification';
    title: string;
    subtitle: string;
    timestamp: string;
    user: string;
  }[];
}

export type NavigationPage = 
  | 'dashboard'
  | 'upload'
  | 'records'
  | 'matching'
  | 'validation'
  | 'master';
