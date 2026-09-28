import type { MaterialRecord, MatchCandidate, UnifiedMaterial, DashboardStats } from '../types';
import { materialStore } from './materialStore';

/**
 * Backend API Client Layer
 * Modular design allowing direct plug-in of Python FastAPI + SBERT microservices.
 * Currently backed by materialStore in-memory/localStorage layer.
 */

export const apiClient = {
  // Health & System Info
  async getSystemStatus(): Promise<{ status: string; engine: string; version: string; mode: string }> {
    return {
      status: 'healthy',
      engine: 'MatQuanta Material SBERT Model (Ready for FastAPI hook)',
      version: '1.0.0-mvp',
      mode: 'Client-Side Semantic Evaluator'
    };
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return materialStore.getStats();
  },

  // Material Records
  async getMaterials(params?: { cpseId?: string; category?: string; query?: string }): Promise<MaterialRecord[]> {
    let recs = materialStore.getRecords();
    if (params?.cpseId && params.cpseId !== 'all') {
      recs = recs.filter(r => r.cpseId === params.cpseId);
    }
    if (params?.category && params.category !== 'all') {
      recs = recs.filter(r => r.category === params.category);
    }
    if (params?.query) {
      const q = params.query.toLowerCase();
      recs = recs.filter(r => 
        r.legacyCode.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.cpseName.toLowerCase().includes(q)
      );
    }
    return recs;
  },

  // Match Candidates
  async getMatchCandidates(status?: string): Promise<MatchCandidate[]> {
    const matches = materialStore.getMatches();
    if (status && status !== 'all') {
      return matches.filter(m => m.status === status);
    }
    return matches;
  },

  // Trigger SBERT AI Matching Batch
  async runHarmonizationJob(): Promise<{ matchesFound: number; message: string }> {
    const count = materialStore.triggerHarmonizationRun();
    return {
      matchesFound: count,
      message: `Harmonization pipeline executed. Identified ${count} new candidate pair(s).`
    };
  },

  // Validation Actions
  async acceptMatchCandidate(
    candidateId: string, 
    reviewer: string, 
    remarks: string,
    customName?: string,
    customCode?: string
  ): Promise<UnifiedMaterial | null> {
    return materialStore.acceptMatch(candidateId, reviewer, remarks, customName, customCode);
  },

  async rejectMatchCandidate(candidateId: string, reviewer: string, remarks: string): Promise<void> {
    materialStore.rejectMatch(candidateId, reviewer, remarks);
  },

  // Unified Master Records
  async getUnifiedMasterCatalog(query?: string): Promise<UnifiedMaterial[]> {
    let master = materialStore.getUnifiedMaster();
    if (query) {
      const q = query.toLowerCase();
      master = master.filter(m => 
        m.unifiedCode.toLowerCase().includes(q) || 
        m.standardName.toLowerCase().includes(q) ||
        m.unspscCode.includes(q)
      );
    }
    return master;
  },

  // Export
  exportCatalog(format: 'csv' | 'json'): string {
    return materialStore.exportMasterCatalog(format);
  }
};
