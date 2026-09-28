import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/UploadPage';
import { MaterialRecordsPage } from './pages/MaterialRecordsPage';
import { AiMatchingPage } from './pages/AiMatchingPage';
import { ExpertValidationPage } from './pages/ExpertValidationPage';
import { UnifiedMasterPage } from './pages/UnifiedMasterPage';
import type { NavigationPage } from './types';
import { materialStore } from './services/materialStore';

export function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [records, setRecords] = useState(materialStore.getRecords());
  const [matches, setMatches] = useState(materialStore.getMatches());
  const [unifiedMaster, setUnifiedMaster] = useState(materialStore.getUnifiedMaster());
  const [batches, setBatches] = useState(materialStore.getBatches());
  const [stats, setStats] = useState(materialStore.getStats());
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Subscribe to reactive store changes
  useEffect(() => {
    const syncState = () => {
      setRecords(materialStore.getRecords());
      setMatches(materialStore.getMatches());
      setUnifiedMaster(materialStore.getUnifiedMaster());
      setBatches(materialStore.getBatches());
      setStats(materialStore.getStats());
    };

    const unsubscribe = materialStore.subscribe(syncState);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleResetData = () => {
    if (window.confirm('Reset representative sample dataset to default state?')) {
      materialStore.resetToDefaultSample();
    }
  };

  const handleTriggerMatching = () => {
    materialStore.triggerHarmonizationRun();
  };

  const handleSelectCandidateForValidation = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };

  const handleAcceptMatch = (
    candidateId: string, 
    reviewer: string, 
    remarks: string, 
    customName?: string, 
    customCode?: string
  ) => {
    return materialStore.acceptMatch(candidateId, reviewer, remarks, customName, customCode);
  };

  const handleRejectMatch = (candidateId: string, reviewer: string, remarks: string) => {
    materialStore.rejectMatch(candidateId, reviewer, remarks);
  };

  const pendingValidationCount = matches.filter(m => m.status === 'pending').length;

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onResetData={handleResetData}
      pendingValidationCount={pendingValidationCount}
    >
      {currentPage === 'dashboard' && (
        <Dashboard
          stats={stats}
          onNavigate={setCurrentPage}
          onTriggerMatching={handleTriggerMatching}
        />
      )}

      {currentPage === 'upload' && (
        <UploadPage
          batches={batches}
          onUploadSuccess={() => {
            // refresh
          }}
        />
      )}

      {currentPage === 'records' && (
        <MaterialRecordsPage
          records={records}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'matching' && (
        <AiMatchingPage
          candidates={matches}
          onNavigate={setCurrentPage}
          onTriggerRun={handleTriggerMatching}
          onSelectForValidation={handleSelectCandidateForValidation}
        />
      )}

      {currentPage === 'validation' && (
        <ExpertValidationPage
          candidates={matches}
          selectedCandidateId={selectedCandidateId}
          onAcceptMatch={handleAcceptMatch}
          onRejectMatch={handleRejectMatch}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'master' && (
        <UnifiedMasterPage
          masterRecords={unifiedMaster}
          onNavigate={setCurrentPage}
        />
      )}
    </Layout>
  );
}

export default App;
