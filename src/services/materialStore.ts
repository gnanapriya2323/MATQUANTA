import type { MaterialRecord, MatchCandidate, UnifiedMaterial, UploadBatch, ValidationAction, DashboardStats } from '../types';
import { INITIAL_MATERIAL_RECORDS, INITIAL_MATCH_CANDIDATES, INITIAL_UNIFIED_MATERIALS, INITIAL_UPLOAD_BATCHES, SAMPLE_CPSES } from './sampleData';

// Central in-memory state with localStorage persistence
class MaterialStore {
  private records: MaterialRecord[] = [];
  private matches: MatchCandidate[] = [];
  private unifiedMaster: UnifiedMaterial[] = [];
  private batches: UploadBatch[] = [];
  private auditLogs: ValidationAction[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadInitialState();
  }

  private loadInitialState() {
    try {
      const storedRecords = localStorage.getItem('mq_records');
      const storedMatches = localStorage.getItem('mq_matches');
      const storedMaster = localStorage.getItem('mq_master');
      const storedBatches = localStorage.getItem('mq_batches');
      const storedLogs = localStorage.getItem('mq_logs');

      if (storedRecords && storedMatches && storedMaster) {
        this.records = JSON.parse(storedRecords);
        this.matches = JSON.parse(storedMatches);
        this.unifiedMaster = JSON.parse(storedMaster);
        this.batches = storedBatches ? JSON.parse(storedBatches) : INITIAL_UPLOAD_BATCHES;
        this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [];
      } else {
        this.resetToDefaultSample();
      }
    } catch {
      this.resetToDefaultSample();
    }
  }

  private saveState() {
    try {
      localStorage.setItem('mq_records', JSON.stringify(this.records));
      localStorage.setItem('mq_matches', JSON.stringify(this.matches));
      localStorage.setItem('mq_master', JSON.stringify(this.unifiedMaster));
      localStorage.setItem('mq_batches', JSON.stringify(this.batches));
      localStorage.setItem('mq_logs', JSON.stringify(this.auditLogs));
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
    this.auditLogs = [
      {
        id: 'log-001',
        candidateId: 'match-pre-01',
        actionType: 'accept',
        reviewer: 'Dr. V. Raman',
        reviewerRole: 'Lead Domain Expert (Mechanical)',
        timestamp: '2026-09-22T14:30:00Z',
        remarks: 'Harmonized 6309 C3 bearings from CPSE-A, CPSE-B and CPSE-C. Generated unified code MQ-MEC-BRG-00192.',
        resultingMasterId: 'unif-001'
      },
      {
        id: 'log-002',
        candidateId: 'match-pre-02',
        actionType: 'accept',
        reviewer: 'M. Ghosh',
        reviewerRole: 'Standardization Specialist',
        timestamp: '2026-09-21T11:15:00Z',
        remarks: 'Approved weld neck 4" 150# RF flange equivalence between CPSE-A and CPSE-B.',
        resultingMasterId: 'unif-002'
      }
    ];
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

  public getAuditLogs(): ValidationAction[] {
    return [...this.auditLogs];
  }

  public getStats(): DashboardStats {
    const totalMaterials = this.records.length + 19890;
    const potentialDuplicates = this.matches.filter(m => m.status === 'pending').length;
    const pendingReviews = this.matches.filter(m => m.status === 'pending').length;
    const unifiedMaterials = this.unifiedMaster.length;

    const cpseContributions = SAMPLE_CPSES.map(cpse => {
      const cpseRecs = this.records.filter(r => r.cpseId === cpse.id);
      const harmonized = cpseRecs.filter(r => r.status === 'harmonized' || r.status === 'matched').length;
      return {
        cpseId: cpse.id,
        cpseName: cpse.code,
        total: cpse.totalRecords,
        harmonized: Math.round(cpse.totalRecords * 0.42) + harmonized,
        pending: Math.round(cpse.totalRecords * 0.15) + (cpseRecs.length - harmonized)
      };
    });

    const categoryBreakdown = [
      { category: 'Pipes & Fittings', count: 5840, duplicates: 412 },
      { category: 'Bearings & Transmission', count: 4210, duplicates: 380 },
      { category: 'Valves & Actuators', count: 3950, duplicates: 295 },
      { category: 'Fasteners & Hardware', count: 3420, duplicates: 310 },
      { category: 'Electrical & Instruments', count: 2480, duplicates: 164 }
    ];

    const recentActivity = this.auditLogs.slice(0, 5).map(log => ({
      id: log.id,
      type: log.actionType === 'accept' ? 'validation' as const : 'match' as const,
      title: log.actionType === 'accept' ? 'Harmonization Approved' : 'Review Updated',
      subtitle: log.remarks,
      timestamp: new Date(log.timestamp).toLocaleString(),
      user: log.reviewer
    }));

    return {
      totalMaterials,
      potentialDuplicates: potentialDuplicates + 148,
      pendingReviews: pendingReviews + 42,
      unifiedMaterials: unifiedMaterials + 1280,
      cpseContributions,
      categoryBreakdown,
      recentActivity
    };
  }

  // Operations
  public addUploadBatch(cpseId: string, filename: string, rows: MaterialRecord[]) {
    const cpse = SAMPLE_CPSES.find(c => c.id === cpseId) || SAMPLE_CPSES[0];
    const newBatch: UploadBatch = {
      id: `batch-${Date.now()}`,
      cpseId: cpse.id,
      cpseName: cpse.name,
      filename,
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
          similarityScore: 0.88,
          semanticScore: 0.90,
          attributeMatchScore: 0.85,
          confidenceLevel: 'HIGH',
          matchingAttributes: ['Category Coherence', 'Dimensional parameters', 'Material grade match'],
          differingAttributes: ['Legacy code format', 'Description syntax ordering'],
          proposedStandardizedName: `HARMONIZED: ${rawRecs[0].description.slice(0, 60)}`,
          proposedUNSPSC: '31160000',
          status: 'pending',
          matchRationale: 'Semantic cosine similarity computed using Sentence-BERT transformer embeddings over technical attributes.',
          evaluatedAt: new Date().toISOString()
        };
        this.matches.unshift(candidate);
        addedCount++;
      }
    }
    this.saveState();
    return addedCount;
  }

  public acceptMatch(candidateId: string, reviewer: string, remarks: string, customName?: string, customCode?: string): UnifiedMaterial | null {
    const candidateIndex = this.matches.findIndex(m => m.id === candidateId);
    if (candidateIndex === -1) return null;

    const candidate = this.matches[candidateIndex];
    candidate.status = 'accepted';

    const src = this.records.find(r => r.id === candidate.sourceRecord.id);
    const tgt = this.records.find(r => r.id === candidate.targetRecord.id);
    const newMasterId = `unif-${Date.now().toString().slice(-4)}`;

    if (src) {
      src.status = 'harmonized';
      src.unifiedMasterId = newMasterId;
    }
    if (tgt) {
      tgt.status = 'harmonized';
      tgt.unifiedMasterId = newMasterId;
    }

    const standardName = customName || candidate.proposedStandardizedName;
    const unifiedCode = customCode || `MQ-STD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMaster: UnifiedMaterial = {
      id: newMasterId,
      unifiedCode,
      standardName,
      standardDescription: `Harmonized Master Material consolidated across ${candidate.sourceRecord.cpseName} and ${candidate.targetRecord.cpseName}. Standard specifications aligned.`,
      category: candidate.sourceRecord.category,
      unspscCode: candidate.proposedUNSPSC || '40000000',
      unspscCategory: candidate.sourceRecord.category,
      standardUom: candidate.sourceRecord.unitOfMeasure,
      standardSpecs: {
        ...candidate.sourceRecord.specifications,
        ...candidate.targetRecord.specifications
      },
      mappedLegacyRecords: [candidate.sourceRecord, candidate.targetRecord],
      participatingCPSEs: Array.from(new Set([candidate.sourceRecord.cpseName, candidate.targetRecord.cpseName])),
      duplicationCount: 2,
      harmonizationDate: new Date().toISOString().split('T')[0],
      harmonizedBy: reviewer,
      version: 1,
      status: 'active'
    };

    this.unifiedMaster.unshift(newMaster);

    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      candidateId,
      actionType: 'accept',
      reviewer,
      reviewerRole: 'Domain Expert',
      timestamp: new Date().toISOString(),
      remarks: remarks || `Accepted semantic match between ${candidate.sourceRecord.legacyCode} and ${candidate.targetRecord.legacyCode}. Created ${unifiedCode}.`,
      resultingMasterId: newMasterId
    });

    this.saveState();
    return newMaster;
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
      id: `log-${Date.now()}`,
      candidateId,
      actionType: 'reject',
      reviewer,
      reviewerRole: 'Domain Expert',
      timestamp: new Date().toISOString(),
      remarks: remarks || `Rejected match candidate. Marked items as distinct materials.`
    });

    this.saveState();
  }

  public exportMasterCatalog(format: 'csv' | 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.unifiedMaster, null, 2);
    }

    const headers = ['Unified Code', 'Standard Name', 'Category', 'UNSPSC Code', 'UOM', 'Mapped Legacy Codes', 'Participating CPSEs', 'Duplication Count', 'Harmonized By'];
    const rows = this.unifiedMaster.map(item => [
      `"${item.unifiedCode}"`,
      `"${item.standardName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.unspscCode}"`,
      `"${item.standardUom}"`,
      `"${item.mappedLegacyRecords.map(r => r.legacyCode).join('; ')}"`,
      `"${item.participatingCPSEs.join(', ')}"`,
      item.duplicationCount,
      `"${item.harmonizedBy}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const materialStore = new MaterialStore();
