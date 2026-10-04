import type { 
  MaterialRecord, 
  MatchCandidate, 
  UnifiedMaterial, 
  UploadBatch, 
  DashboardStats,
  CPSEOnboardingRequest,
  LegacyMigrationRecord,
  AuditLogRecord
} from '../types';
import { 
  INITIAL_MATERIAL_RECORDS, 
  INITIAL_MATCH_CANDIDATES, 
  INITIAL_UNIFIED_MATERIALS, 
  INITIAL_UPLOAD_BATCHES, 
  SAMPLE_CPSES,
  INITIAL_ONBOARDING_REQUESTS,
  INITIAL_LEGACY_MIGRATIONS,
  INITIAL_AUDIT_LOGS
} from './sampleData';

class MaterialStore {
  private records: MaterialRecord[] = [];
  private matches: MatchCandidate[] = [];
  private unifiedMaster: UnifiedMaterial[] = [];
  private batches: UploadBatch[] = [];
  private onboardingRequests: CPSEOnboardingRequest[] = [];
  private legacyMigrations: LegacyMigrationRecord[] = [];
  private auditLogs: AuditLogRecord[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadInitialState();
  }

  private loadInitialState() {
    try {
      const storedRecords = localStorage.getItem('mq_records_v3');
      const storedMatches = localStorage.getItem('mq_matches_v3');
      const storedMaster = localStorage.getItem('mq_master_v3');
      const storedBatches = localStorage.getItem('mq_batches_v3');
      const storedOnb = localStorage.getItem('mq_onboarding_v3');
      const storedMig = localStorage.getItem('mq_migrations_v3');
      const storedLogs = localStorage.getItem('mq_logs_v3');

      if (storedRecords && storedMatches && storedMaster) {
        this.records = JSON.parse(storedRecords);
        this.matches = JSON.parse(storedMatches);
        this.unifiedMaster = JSON.parse(storedMaster);
        this.batches = storedBatches ? JSON.parse(storedBatches) : INITIAL_UPLOAD_BATCHES;
        this.onboardingRequests = storedOnb ? JSON.parse(storedOnb) : INITIAL_ONBOARDING_REQUESTS;
        this.legacyMigrations = storedMig ? JSON.parse(storedMig) : INITIAL_LEGACY_MIGRATIONS;
        this.auditLogs = storedLogs ? JSON.parse(storedLogs) : INITIAL_AUDIT_LOGS;
      } else {
        this.resetToDefaultSample();
      }
    } catch {
      this.resetToDefaultSample();
    }
  }

  private saveState() {
    try {
      localStorage.setItem('mq_records_v3', JSON.stringify(this.records));
      localStorage.setItem('mq_matches_v3', JSON.stringify(this.matches));
      localStorage.setItem('mq_master_v3', JSON.stringify(this.unifiedMaster));
      localStorage.setItem('mq_batches_v3', JSON.stringify(this.batches));
      localStorage.setItem('mq_onboarding_v3', JSON.stringify(this.onboardingRequests));
      localStorage.setItem('mq_migrations_v3', JSON.stringify(this.legacyMigrations));
      localStorage.setItem('mq_logs_v3', JSON.stringify(this.auditLogs));
    } catch {
      // ignore storage errors
    }
    this.notify();
  }

  public resetToDefaultSample() {
    this.records = [...INITIAL_MATERIAL_RECORDS];
    this.matches = [...INITIAL_MATCH_CANDIDATES];
    this.unifiedMaster = [...INITIAL_UNIFIED_MATERIALS];
    this.batches = [...INITIAL_UPLOAD_BATCHES];
    this.onboardingRequests = [...INITIAL_ONBOARDING_REQUESTS];
    this.legacyMigrations = [...INITIAL_LEGACY_MIGRATIONS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.saveState();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // Getters
  public getRecords(): MaterialRecord[] {
    return [...this.records];
  }

  public getMatches(): MatchCandidate[] {
    return [...this.matches];
  }

  public getUnifiedMaster(): UnifiedMaterial[] {
    return [...this.unifiedMaster];
  }

  public getBatches(): UploadBatch[] {
    return [...this.batches];
  }

  public getOnboardingRequests(): CPSEOnboardingRequest[] {
    return [...this.onboardingRequests];
  }

  public getLegacyMigrations(): LegacyMigrationRecord[] {
    return [...this.legacyMigrations];
  }

  public getAuditLogs(): AuditLogRecord[] {
    return [...this.auditLogs];
  }

  public getStats(): DashboardStats {
    const totalMaterials = this.records.length + 23760;
    const potentialMatches = this.matches.filter(m => m.status === 'pending').length + 184;
    const duplicateMaterials = this.matches.filter(m => m.matchType === 'Duplicate' || m.matchType === 'Identical').length + 92;
    const nearDuplicates = this.matches.filter(m => m.matchType === 'Near-Duplicate' || m.matchType === 'Functionally Equivalent').length + 68;
    const pendingValidation = this.matches.filter(m => m.status === 'pending').length + 38;
    const commonNationalMaterialCodes = this.unifiedMaster.length + 1420;
    const legacyCodesTotal = this.legacyMigrations.length + 4200;
    const legacyCodesMapped = this.legacyMigrations.filter(l => l.status === 'Approved').length + 3650;
    const participatingCPSEs = SAMPLE_CPSES.length;

    const cpseContributions = SAMPLE_CPSES.map(cpse => {
      const cpseRecs = this.records.filter(r => r.cpseId === cpse.id);
      const harmonized = cpseRecs.filter(r => r.status === 'harmonized').length;
      return {
        cpseId: cpse.id,
        cpseCode: cpse.code,
        cpseName: cpse.name,
        ministry: cpse.ministry,
        total: cpse.totalRecords,
        harmonized: Math.round(cpse.totalRecords * 0.62) + harmonized,
        pending: Math.round(cpse.totalRecords * 0.18) + (cpseRecs.length - harmonized),
        erpSystem: cpse.erpSystem
      };
    });

    const categoryBreakdown = [
      { category: 'Valves & Actuators', count: 6420, duplicates: 412, cnmcCount: 380 },
      { category: 'Bearings & Power Transmission', count: 5890, duplicates: 395, cnmcCount: 345 },
      { category: 'Pipes & Fittings', count: 5120, duplicates: 360, cnmcCount: 310 },
      { category: 'Fasteners & Hardware', count: 4230, duplicates: 290, cnmcCount: 260 },
      { category: 'Electrical & Instrumentation', count: 2100, duplicates: 140, cnmcCount: 125 }
    ];

    const validationStatusSummary = {
      approved: 1420 + this.unifiedMaster.length,
      pending: pendingValidation,
      rejected: 42,
      underReview: 28
    };

    const recentActivity = this.auditLogs.slice(0, 6).map(log => ({
      id: log.id,
      type: 'validation' as const,
      title: log.action,
      subtitle: `${log.materialCNMC} • ${log.newValue}`,
      timestamp: log.timestamp,
      user: log.actionBy
    }));

    return {
      totalMaterials,
      potentialMatches,
      duplicateMaterials,
      nearDuplicates,
      pendingValidation,
      commonNationalMaterialCodes,
      legacyCodesTotal,
      legacyCodesMapped,
      participatingCPSEs,
      cpseContributions,
      categoryBreakdown,
      validationStatusSummary,
      recentActivity
    };
  }

  // Operations: CPSE Onboarding
  public submitOnboardingRequest(request: Omit<CPSEOnboardingRequest, 'id' | 'status' | 'submittedAt'>): CPSEOnboardingRequest {
    const newReq: CPSEOnboardingRequest = {
      ...request,
      id: `ONB-2026-${String(this.onboardingRequests.length + 1).padStart(3, '0')}`,
      status: 'Pending Verification',
      submittedAt: new Date().toLocaleString(),
      notes: 'Submitted for administrative clearance from respective Ministry Nodal Desk.'
    };

    this.onboardingRequests.unshift(newReq);
    this.saveState();
    return newReq;
  }

  public updateOnboardingStatus(id: string, status: CPSEOnboardingRequest['status'], notes?: string) {
    const req = this.onboardingRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (notes) req.notes = notes;
      this.saveState();
    }
  }

  // Operations: Batch Ingestion
  public addUploadBatch(
    cpseId: string, 
    filename: string, 
    dataSource: 'CSV' | 'Excel' | 'SAP / ERP' | 'API',
    rows: MaterialRecord[]
  ) {
    const cpse = SAMPLE_CPSES.find(c => c.id === cpseId) || SAMPLE_CPSES[0];
    const newBatch: UploadBatch = {
      id: `BATCH-${Date.now()}`,
      cpseId: cpse.id,
      cpseName: `${cpse.code} (${cpse.name})`,
      filename,
      dataSource,
      totalRows: rows.length,
      validRows: rows.length,
      invalidRows: 0,
      status: 'completed',
      uploadedAt: new Date().toLocaleString()
    };

    this.batches.unshift(newBatch);
    this.records.push(...rows);
    this.saveState();
  }

  // Operations: AI Matching & Validation
  public triggerHarmonizationRun(): number {
    const rawRecs = this.records.filter(r => r.status === 'raw' || r.status === 'under_review');
    let addedCount = 0;

    if (rawRecs.length >= 2) {
      const existingMatch = this.matches.find(m => m.id === 'match-dyn-01');
      if (!existingMatch) {
        const candidate: MatchCandidate = {
          id: 'match-dyn-01',
          sourceRecord: rawRecs[0],
          targetRecord: rawRecs[1],
          similarityScore: 0.91,
          semanticScore: 0.93,
          attributeMatchScore: 0.89,
          matchType: 'Near-Duplicate',
          confidenceLevel: 'HIGH',
          matchingAttributes: ['Category Coherence', 'Dimensional parameters', 'Material grade match'],
          differingAttributes: ['Legacy code syntax', 'Description abbreviation order'],
          aiExplanation: [
            'Sentence-BERT transformer semantic vector convergence > 0.93',
            'Matching nominal size and dimensional class',
            'Standard engineering material grade equivalence confirmed'
          ],
          proposedStandardizedName: `Standardized: ${rawRecs[0].description.slice(0, 50)}`,
          proposedCNMC: `CNMC-${String(this.unifiedMaster.length + 10).padStart(6, '0')}`,
          proposedUNSPSC: '40141600',
          status: 'pending',
          matchRationale: 'Semantic cosine similarity computed using Sentence-BERT transformer embeddings over technical attributes.',
          evaluatedAt: new Date().toISOString(),
          nlpPipelineSteps: [
            { step: '1. Text Normalization', detail: 'Cleaned abbreviations and unit descriptors' },
            { step: '2. Attribute Extraction', detail: 'Parsed engineering parameters and standards' },
            { step: '3. Transformer Embedding', detail: 'Evaluated dense vector cosine similarity' }
          ]
        };
        this.matches.unshift(candidate);
        addedCount++;
      }
    }
    this.saveState();
    return addedCount;
  }

  public acceptMatch(
    candidateId: string, 
    reviewer: string, 
    remarks: string, 
    customName?: string, 
    customCNMC?: string
  ): UnifiedMaterial | null {
    const candidateIndex = this.matches.findIndex(m => m.id === candidateId);
    if (candidateIndex === -1) return null;

    const candidate = this.matches[candidateIndex];
    candidate.status = 'accepted';

    const cnmcCode = customCNMC || candidate.proposedCNMC || `CNMC-${String(this.unifiedMaster.length + 1).padStart(6, '0')}`;
    const standardName = customName || candidate.proposedStandardizedName;

    // Update records status
    const src = this.records.find(r => r.id === candidate.sourceRecord.id);
    const tgt = this.records.find(r => r.id === candidate.targetRecord.id);

    if (src) {
      src.status = 'harmonized';
      src.cnmcCode = cnmcCode;
      src.standardizedDescription = standardName;
    }
    if (tgt) {
      tgt.status = 'harmonized';
      tgt.cnmcCode = cnmcCode;
      tgt.standardizedDescription = standardName;
    }

    // Check if master already exists
    let master = this.unifiedMaster.find(m => m.cnmcCode === cnmcCode);

    if (!master) {
      master = {
        id: `unif-${Date.now().toString().slice(-4)}`,
        cnmcCode,
        standardName,
        standardDescription: `Common National Material Code standard consolidated across CPSE catalogs. Core engineering specifications and tolerances aligned.`,
        category: candidate.sourceRecord.category,
        subCategory: candidate.sourceRecord.subCategory || candidate.sourceRecord.category,
        unspscCode: candidate.proposedUNSPSC || '40000000',
        unspscCategory: candidate.sourceRecord.category,
        standardUom: candidate.sourceRecord.unitOfMeasure,
        standardSpecs: {
          ...candidate.sourceRecord.specifications,
          ...candidate.targetRecord.specifications
        },
        cpseMappings: [
          {
            cpseName: candidate.sourceRecord.cpseName,
            cpseCode: candidate.sourceRecord.cpseName,
            legacyItemCode: candidate.sourceRecord.legacyCode,
            originalDescription: candidate.sourceRecord.description,
            uom: candidate.sourceRecord.unitOfMeasure,
            erpSystem: candidate.sourceRecord.dataSource,
            mappedDate: new Date().toISOString().split('T')[0]
          },
          {
            cpseName: candidate.targetRecord.cpseName,
            cpseCode: candidate.targetRecord.cpseName,
            legacyItemCode: candidate.targetRecord.legacyCode,
            originalDescription: candidate.targetRecord.description,
            uom: candidate.targetRecord.unitOfMeasure,
            erpSystem: candidate.targetRecord.dataSource,
            mappedDate: new Date().toISOString().split('T')[0]
          }
        ],
        legacyMappings: [
          {
            cpseName: candidate.sourceRecord.cpseName,
            oldCode: `OLD-${candidate.sourceRecord.legacyCode}`,
            description: candidate.sourceRecord.description,
            status: 'Approved',
            mappedDate: new Date().toISOString().split('T')[0]
          }
        ],
        demandAggregation: [
          {
            cpseName: candidate.sourceRecord.cpseName,
            cpseCode: candidate.sourceRecord.cpseName,
            annualRequirement: candidate.sourceRecord.historicalProcurement?.annualVolume || 500,
            unit: candidate.sourceRecord.unitOfMeasure,
            lastProcurementYear: 2025
          },
          {
            cpseName: candidate.targetRecord.cpseName,
            cpseCode: candidate.targetRecord.cpseName,
            annualRequirement: candidate.targetRecord.historicalProcurement?.annualVolume || 600,
            unit: candidate.targetRecord.unitOfMeasure,
            lastProcurementYear: 2025
          }
        ],
        totalIdentifiedRequirement: (candidate.sourceRecord.historicalProcurement?.annualVolume || 500) + (candidate.targetRecord.historicalProcurement?.annualVolume || 600),
        approvalStatus: 'Approved',
        lastUpdated: new Date().toISOString().split('T')[0],
        approvedBy: reviewer,
        version: 1
      };
      this.unifiedMaster.unshift(master);
    } else {
      // Append mappings
      master.cpseMappings.push({
        cpseName: candidate.targetRecord.cpseName,
        cpseCode: candidate.targetRecord.cpseName,
        legacyItemCode: candidate.targetRecord.legacyCode,
        originalDescription: candidate.targetRecord.description,
        uom: candidate.targetRecord.unitOfMeasure,
        erpSystem: candidate.targetRecord.dataSource,
        mappedDate: new Date().toISOString().split('T')[0]
      });
      master.totalIdentifiedRequirement += (candidate.targetRecord.historicalProcurement?.annualVolume || 500);
      master.lastUpdated = new Date().toISOString().split('T')[0];
    }

    // Add audit log record
    this.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      materialCNMC: cnmcCode,
      action: 'Common National Material Code Validation & Approval',
      previousValue: 'Pending Expert Validation',
      newValue: `Mapped ${candidate.sourceRecord.cpseName} (${candidate.sourceRecord.legacyCode}) ⟷ ${candidate.targetRecord.cpseName} (${candidate.targetRecord.legacyCode}) → ${cnmcCode}`,
      actionBy: reviewer,
      role: 'Authorized Domain Expert',
      timestamp: new Date().toLocaleString(),
      status: 'Approved',
      notes: remarks || 'Validated cross-CPSE material equivalence.'
    });

    this.saveState();
    return master;
  }

  public rejectMatch(candidateId: string, reviewer: string, remarks: string) {
    const candidate = this.matches.find(m => m.id === candidateId);
    if (!candidate) return;

    candidate.status = 'rejected';

    const src = this.records.find(r => r.id === candidate.sourceRecord.id);
    const tgt = this.records.find(r => r.id === candidate.targetRecord.id);
    if (src) src.status = 'distinct';
    if (tgt) tgt.status = 'distinct';

    this.auditLogs.unshift({
      id: `AUD-${Date.now()}`,
      materialCNMC: candidate.proposedCNMC || 'N/A',
      action: 'Match Candidate Rejected',
      previousValue: 'Pending Validation',
      newValue: 'Marked as Distinct Non-Equivalent Materials',
      actionBy: reviewer,
      role: 'Authorized Domain Expert',
      timestamp: new Date().toLocaleString(),
      status: 'Approved',
      notes: remarks || 'Rejected duplicate candidate proposal.'
    });

    this.saveState();
  }

  // Operations: Legacy Migration
  public updateLegacyMigrationStatus(id: string, status: LegacyMigrationRecord['status'], reviewer: string) {
    const item = this.legacyMigrations.find(m => m.id === id);
    if (item) {
      item.status = status;
      item.reviewedBy = reviewer;
      item.lastModified = new Date().toISOString().split('T')[0];

      this.auditLogs.unshift({
        id: `AUD-${Date.now()}`,
        materialCNMC: item.mappedCNMC || 'N/A',
        action: `Legacy Migration ${status}`,
        previousValue: 'Pending',
        newValue: `${item.cpseName} ${item.legacyCode} → ${item.mappedCNMC || 'Unmapped'}`,
        actionBy: reviewer,
        role: 'Standardization Specialist',
        timestamp: new Date().toLocaleString(),
        status: 'Approved'
      });

      this.saveState();
    }
  }

  // Export
  public exportMasterCatalog(format: 'csv' | 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.unifiedMaster, null, 2);
    }

    const headers = [
      'Common National Material Code (CNMC)',
      'Standard Material Name',
      'Category',
      'UNSPSC Code',
      'Base UOM',
      'Mapped CPSE Codes',
      'Legacy Mappings',
      'Total Identified Requirement',
      'Approval Status',
      'Approved By'
    ];

    const rows = this.unifiedMaster.map(item => [
      `"${item.cnmcCode}"`,
      `"${item.standardName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.unspscCode}"`,
      `"${item.standardUom}"`,
      `"${item.cpseMappings.map(m => `${m.cpseCode}: ${m.legacyItemCode}`).join('; ')}"`,
      `"${item.legacyMappings.map(l => `${l.cpseName}: ${l.oldCode}`).join('; ')}"`,
      item.totalIdentifiedRequirement,
      `"${item.approvalStatus}"`,
      `"${item.approvedBy}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const materialStore = new MaterialStore();
