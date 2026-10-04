import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  FileSpreadsheet,
  Building2,
  Check
} from 'lucide-react';
import type { LegacyMigrationRecord } from '../types';
import { materialStore } from '../services/materialStore';

export const LegacyMigrationPage: React.FC = () => {
  const [migrations, setMigrations] = useState<LegacyMigrationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpse, setSelectedCpse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<LegacyMigrationRecord | null>(null);
  const [customCnmc, setCustomCnmc] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setMigrations(materialStore.getLegacyMigrations());
    };
    update();
    return materialStore.subscribe(update);
  }, []);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleStatusChange = (id: string, newStatus: LegacyMigrationRecord['status']) => {
    materialStore.updateLegacyMigrationStatus(id, newStatus, 'Domain Expert (SIH Nodal Desk)');
    showNotification(`Migration status updated to ${newStatus}`);
  };

  const handleManualAssign = () => {
    if (!selectedRecord) return;
    if (!customCnmc.trim()) return;

    const record = migrations.find(m => m.id === selectedRecord.id);
    if (record) {
      record.mappedCNMC = customCnmc.trim().toUpperCase();
      materialStore.updateLegacyMigrationStatus(selectedRecord.id, 'Approved', 'Domain Expert (SIH Nodal Desk)');
      showNotification(`Assigned ${customCnmc.trim().toUpperCase()} to ${selectedRecord.legacyCode}`);
    }
    setShowAssignModal(false);
    setSelectedRecord(null);
    setCustomCnmc('');
  };

  // Filter calculations
  const filtered = migrations.filter(item => {
    const matchesSearch = 
      item.legacyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mappedCNMC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cpseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCpse = selectedCpse === 'all' || item.cpseName === selectedCpse;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesCpse && matchesStatus;
  });

  const cpseList = Array.from(new Set(migrations.map(m => m.cpseName)));

  // Summary counts
  const totalCount = migrations.length;
  const approvedCount = migrations.filter(m => m.status === 'Approved').length;
  const suggestedCount = migrations.filter(m => m.status === 'Suggested').length;
  const pendingCount = migrations.filter(m => m.status === 'Pending Validation').length;
  const unmappedCount = migrations.filter(m => m.status === 'Unmapped').length;

  const getStatusBadge = (status: LegacyMigrationRecord['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'Suggested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <GitFork className="w-3.5 h-3.5" />
            AI Suggested
          </span>
        );
      case 'Pending Validation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Validation
          </span>
        );
      case 'Unmapped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <AlertCircle className="w-3.5 h-3.5" />
            Unmapped
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B192C] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-400/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Step 8 of SIH 26099 Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Representative Sample Data
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Legacy Material Code Migration</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Cross-walk legacy CPSE material codes to the standardized <strong>Common National Material Code (CNMC)</strong> framework. 
              Historical ERP codes remain permanently mapped without altering legacy database records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold">Overall Mapping Rate</div>
              <div className="text-2xl font-bold text-emerald-400">
                {totalCount > 0 ? `${Math.round((approvedCount / totalCount) * 100)}%` : '0%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preservation Principle Card */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 flex items-start gap-3">
        <GitFork className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-blue-950">Core SIH 26099 Preservation Principle: </span>
          Original CPSE item codes (e.g., <code className="bg-white px-1.5 py-0.5 rounded border border-blue-300 font-mono text-xs">OLD-12345</code> or <code className="bg-white px-1.5 py-0.5 rounded border border-blue-300 font-mono text-xs">MAT1001</code>) are never replaced or deleted in CPSE enterprise databases. MatQuanta acts as an intelligent overlay translating legacy catalog nomenclatures to national CNMC standards.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Legacy Items</div>
          <div className="text-2xl font-bold text-[#0B192C] mt-1">{totalCount}</div>
          <div className="text-xs text-slate-400 mt-1">Across 3 pilot CPSEs</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Approved CNMC</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</div>
          <div className="text-xs text-emerald-500 mt-1">Verified & Active</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">AI Suggested</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{suggestedCount}</div>
          <div className="text-xs text-blue-500 mt-1">Confidence &gt; 85%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-amber-600 uppercase tracking-wider">Pending Validation</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-xs text-amber-500 mt-1">Awaiting signoff</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">Unmapped</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">{unmappedCount}</div>
          <div className="text-xs text-slate-400 mt-1">Under investigation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search legacy code, description, CNMC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCpse}
              onChange={(e) => setSelectedCpse(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All CPSEs</option>
              {cpseList.map(cpse => (
                <option key={cpse} value={cpse}>{cpse}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Suggested">AI Suggested</option>
              <option value="Pending Validation">Pending Validation</option>
              <option value="Unmapped">Unmapped</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Migration Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Legacy CPSE Code</th>
                <th className="px-5 py-3">Source CPSE</th>
                <th className="px-5 py-3">Original Description</th>
                <th className="px-5 py-3">Mapped CNMC</th>
                <th className="px-5 py-3">Confidence</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    No legacy migration records found matching the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-slate-800">{item.legacyCode}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {item.cpseName}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-900 font-medium max-w-md truncate" title={item.originalDescription}>
                        {item.originalDescription}
                      </div>
                      {item.standardName && item.standardName !== '-' && (
                        <div className="text-xs text-blue-700 mt-0.5 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.standardName}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.mappedCNMC && item.mappedCNMC !== '-' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {item.mappedCNMC}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.confidence ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.confidence >= 0.9 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.round(item.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'Suggested' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(item.id, 'Approved')}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1"
                              title="Accept AI Suggested CNMC Mapping"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(item.id, 'Rejected')}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Reject Suggestion"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.status === 'Pending Validation' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            Verify & Map
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedRecord(item);
                            setCustomCnmc(item.mappedCNMC !== '-' ? item.mappedCNMC : 'CNMC-000001');
                            setShowAssignModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          Manual Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Assign Modal */}
      {showAssignModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <h3 className="text-lg font-bold text-[#0B192C]">Manual Legacy Code CNMC Mapping</h3>
            <p className="text-xs text-slate-500 mt-1">
              Assign or update the Common National Material Code for this legacy catalog item.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Legacy Code:</span>
                <span className="font-mono font-bold text-slate-800">{selectedRecord.legacyCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CPSE:</span>
                <span className="font-semibold text-slate-800">{selectedRecord.cpseName}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Description:</span>
                <span className="font-medium text-slate-900">{selectedRecord.originalDescription}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Target CNMC Code
              </label>
              <input
                type="text"
                placeholder="e.g. CNMC-000001"
                value={customCnmc}
                onChange={(e) => setCustomCnmc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Standard format: <code className="font-mono">CNMC-XXXXXX</code> (6 digits)
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRecord(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAssign}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                Save & Approve Mapping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
