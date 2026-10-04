import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  FileSpreadsheet, 
  CheckCircle2
} from 'lucide-react';
import type { AuditLogRecord } from '../types';
import { materialStore } from '../services/materialStore';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const update = () => {
      setLogs(materialStore.getAuditLogs());
    };
    update();
    return materialStore.subscribe(update);
  }, []);

  const filtered = logs.filter(log => {
    const matchesSearch = 
      log.materialCNMC.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.newValue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || log.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roles = Array.from(new Set(logs.map(l => l.role)));

  const handleExportLogs = () => {
    const headers = ['Audit ID', 'Material CNMC', 'Action', 'Previous State', 'New State / Details', 'Action By', 'Role', 'Timestamp', 'Status'];
    const rows = filtered.map(l => [
      `"${l.id}"`,
      `"${l.materialCNMC}"`,
      `"${l.action}"`,
      `"${l.previousValue.replace(/"/g, '""')}"`,
      `"${l.newValue.replace(/"/g, '""')}"`,
      `"${l.actionBy}"`,
      `"${l.role}"`,
      `"${l.timestamp}"`,
      `"${l.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `matquanta-audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Governance & Accountability
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Representative Sample Data
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Trail & Traceability Register</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Immutable logging of all AI duplicate recommendations, domain expert validations, manual code overrides, and legacy migrations.
            </p>
          </div>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            Export Audit Log (CSV)
          </button>
        </div>
      </div>

      {/* Governance Motto Alert */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-sm text-blue-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold text-blue-950">Statutory Compliance & Non-Repudiation: </span>
          In strict accordance with SIH 26099 mandates, all standardization actions, CPSE mapping approvals, and manual catalog adjustments are immutably timestamped with user credentials and domain authority designations.
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search CNMC, action, or reviewer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles & Authorities</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Audit ID & CNMC</th>
                <th className="px-5 py-3">Action Performed</th>
                <th className="px-5 py-3">Previous State</th>
                <th className="px-5 py-3">New State / Result</th>
                <th className="px-5 py-3">Authorized Signoff</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    No audit log records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-slate-400 text-[11px]">{log.id}</div>
                      <div className="font-mono font-bold text-blue-700 mt-0.5">{log.materialCNMC}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900 block">{log.action}</span>
                      {log.notes && (
                        <span className="text-[11px] text-slate-500 italic block mt-0.5">{log.notes}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {log.previousValue}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800 max-w-sm">
                      {log.newValue}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {log.actionBy}
                      </div>
                      <div className="text-[11px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
