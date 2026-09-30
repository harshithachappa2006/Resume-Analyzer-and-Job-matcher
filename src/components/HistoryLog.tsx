import React from 'react';
import {
  History,
  FileCheck2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { HistoryRecord } from '../types.ts';

interface HistoryLogProps {
  records: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onClearRecords: () => void;
  onGoToStudio: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  records,
  onSelectRecord,
  onClearRecords,
  onGoToStudio,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Submission & Audit Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Audit Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Records of resumes submitted to n8n Cloud and evaluated in this session.
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={onClearRecords}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Audits Performed Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Submit your first candidate resume in the Studio to trigger the n8n automation workflow and view the audit logs.
            </p>
          </div>
          <button
            onClick={onGoToStudio}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-md shadow-rose-500/20 transition-all cursor-pointer inline-flex items-center space-x-1.5"
          >
            <span>Go to Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-6">Target Role</th>
                  <th className="py-3.5 px-6">ATS Score</th>
                  <th className="py-3.5 px-6">n8n Status</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-white">
                      <div>{rec.candidateName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {rec.candidateEmail}
                      </div>
                    </td>
                    <td className="py-4 px-6">{rec.role}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          rec.atsScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : rec.atsScore >= 70
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {rec.atsScore} / 100
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-mono">HTTP {rec.n8nStatus || 200}</span>
                        <span className="text-[10px] text-slate-400">
                          ({rec.n8nLatencyMs}ms)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(rec.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectRecord(rec)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
