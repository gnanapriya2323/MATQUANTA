import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { CPSEOnboardingPage } from './pages/CPSEOnboardingPage';
import { MaterialRecordsPage } from './pages/MaterialRecordsPage';
import { AiMatchingPage } from './pages/AiMatchingPage';
import { StandardizationPage } from './pages/StandardizationPage';
import { ExpertValidationPage } from './pages/ExpertValidationPage';
import { UnifiedMasterPage } from './pages/UnifiedMasterPage';
import { LegacyMigrationPage } from './pages/LegacyMigrationPage';
import { ProcurementInsightsPage } from './pages/ProcurementInsightsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { SapErpIntegrationPage } from './pages/SapErpIntegrationPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { CollaborativeProcurementPage } from './pages/CollaborativeProcurementPage';
import type { NavigationPage, UserRole, UserSession } from './types';
import { materialStore } from './services/materialStore';

export function App() {
  // Website must always show the Login page first upon opening
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('expert');
  const [records, setRecords] = useState(materialStore.getRecords());
  const [matches, setMatches] = useState(materialStore.getMatches());
  const [stats, setStats] = useState(materialStore.getStats());
  const [selectedCandidateId] = useState<string | null>(null);

  // Keep role in sync with logged in user
  useEffect(() => {
    if (currentUser) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  // Subscribe to reactive store changes
  useEffect(() => {
    const syncState = () => {
      setRecords(materialStore.getRecords());
      setMatches(materialStore.getMatches());
      setStats(materialStore.getStats());
    };

    const unsubscribe = materialStore.subscribe(syncState);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = (user: UserSession) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.setItem('matquanta_user_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('matquanta_user_session');
    setCurrentPage('dashboard');
  };

  const handleTriggerMatching = () => {
    materialStore.triggerHarmonizationRun();
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

  // Unauthenticated user must first see the Login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      pendingValidationCount={pendingValidationCount}
      currentRole={currentRole}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {currentPage === 'dashboard' && (
        <Dashboard
          stats={stats}
          currentRole={currentRole}
          onNavigate={setCurrentPage}
          onTriggerMatching={handleTriggerMatching}
        />
      )}

      {currentPage === 'onboarding' && (
        <CPSEOnboardingPage
          currentRole={currentRole}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'records' && (
        <MaterialRecordsPage
          records={records}
          currentRole={currentRole}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'matching' && (
        <AiMatchingPage
          currentRole={currentRole}
          onNavigate={setCurrentPage}
          onTriggerRun={handleTriggerMatching}
        />
      )}

      {currentPage === 'standardization' && (
        <StandardizationPage
          onNavigate={setCurrentPage}
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
          currentRole={currentRole}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'legacy-migration' && (
        <LegacyMigrationPage />
      )}

      {currentPage === 'collaborative-procurement' && (
        <CollaborativeProcurementPage
          currentRole={currentRole}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'procurement-insights' && (
        <ProcurementInsightsPage
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'analytics' && (
        <AnalyticsPage />
      )}

      {currentPage === 'audit-trail' && (
        <AuditTrailPage />
      )}

      {currentPage === 'sap-erp-integration' && (
        <SapErpIntegrationPage />
      )}

      {currentPage === 'administration' && (
        <AdministrationPage />
      )}
    </Layout>
  );
}

export default App;
