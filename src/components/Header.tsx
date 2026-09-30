import React from 'react';
import {
  Workflow,
  Sparkles,
  ExternalLink,
  Activity,
  History,
  Code2,
  FileCheck2,
} from 'lucide-react';
import { N8nHealthStatus } from '../types.ts';

interface HeaderProps {
  activeTab: 'analyzer' | 'report' | 'workflow' | 'history';
  setActiveTab: (tab: 'analyzer' | 'report' | 'workflow' | 'history') => void;
  n8nHealth: N8nHealthStatus | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
  hasReport: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  n8nHealth,
  checkingHealth,
  onRefreshHealth,
  hasReport,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 p-[1px] shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-rose-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-pulse border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Resume Analyzer
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                  n8n Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Automated ATS Scoring & Workflow Pipeline
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'report'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>ATS Report</span>
              {hasReport && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'workflow'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden md:inline">Workflow Hub</span>
              <span className="md:hidden">n8n</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Logs</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-800 text-[10px] rounded-full text-slate-300 font-semibold border border-slate-700">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Status badge & external link */}
          <div className="flex items-center space-x-2.5">
            {/* n8n Live Ping indicator */}
            <button
              onClick={onRefreshHealth}
              disabled={checkingHealth}
              title="Click to check n8n webhook latency & status"
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs border border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 transition-all text-slate-300 group cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  n8nHealth?.success
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : n8nHealth === null
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                } ${checkingHealth ? 'animate-ping' : ''}`}
              />
              <span className="font-medium hidden lg:inline">
                {checkingHealth
                  ? 'Pinging n8n...'
                  : n8nHealth?.success
                  ? `n8n Live (${n8nHealth.latencyMs}ms)`
                  : 'n8n Offline'}
              </span>
              <Activity className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
            </button>

            {/* Direct Link to original form */}
            <a
              href="https://harshitha2006.app.n8n.cloud/form/b088764b-ff9f-47a6-a63b-8ac8156d8ce9"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-500/10 to-orange-500/10 hover:from-rose-500/20 hover:to-orange-500/20 text-rose-300 border border-rose-500/30 transition-all"
            >
              <span>Original Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
