import React, { useState } from 'react';
import { RequestTrace } from '../../types/simulation';
import { Search, Filter, ChevronLeft, ChevronRight, CheckCircle2, XCircle, ArrowUpDown } from 'lucide-react';
import { RequestDetailModal } from './RequestDetailModal';

interface RequestTableProps {
  traces: RequestTrace[];
  model1Name: string;
  model2Name: string;
}

export const RequestTable: React.FC<RequestTableProps> = ({
  traces,
  model1Name,
  model2Name,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'fail'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RequestTrace | null>(null);
  const pageSize = 8;

  // Filter traces
  const filtered = traces.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.model1Decision.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.model2Decision.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'success'
        ? t.model2Decision.success
        : !t.model2Decision.success;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedTraces = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Request-Level Trace Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect granular task execution decisions, routing latency, and per-task carbon footprint. Click any row to inspect.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID / Node..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-carbon-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-carbon-500"
            >
              <option value="all">All Outcomes</option>
              <option value="success">Met Deadline (SLA)</option>
              <option value="fail">Violated Deadline</option>
            </select>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Request ID</th>
                <th className="py-3 px-3">Arrival</th>
                <th className="py-3 px-3">CPU MIPS</th>
                <th className="py-3 px-3">Deadline</th>
                <th className="py-3 px-3 text-slate-600 dark:text-slate-300 font-bold">
                  {model1Name.split(' ')[0]} Decision
                </th>
                <th className="py-3 px-3 text-carbon-600 dark:text-carbon-400 font-bold">
                  {model2Name.split(' ')[0]} Decision
                </th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-3">Carbon</th>
                <th className="py-3 px-3">Energy</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedTraces.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedRequest(t)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="text-carbon-600 dark:text-carbon-400">#</span>
                    <span>{t.id}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{t.arrivalTimeMs}ms</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{t.cpuMips}</td>
                  <td className="py-2.5 px-3 text-slate-500">{t.deadlineMs}ms</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                    {t.model1Decision.location}
                  </td>
                  <td className="py-2.5 px-3 text-carbon-700 dark:text-carbon-300 font-semibold truncate max-w-[130px]">
                    {t.model2Decision.location}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {t.model2Decision.latencyMs}ms
                  </td>
                  <td className="py-2.5 px-3 text-carbon-600 dark:text-carbon-400 font-bold">
                    {t.model2Decision.carbonKg}kg
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{t.model2Decision.energyKwh}kWh</td>
                  <td className="py-2.5 px-3 text-center">
                    {t.model2Decision.success ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Met
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        <XCircle className="w-3 h-3" /> Breached
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} requests
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Granular Task Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        m1Name={model1Name}
        m2Name={model2Name}
      />
    </>
  );
};
