import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { FormStudio } from './components/FormStudio.tsx';
import { AnalysisReport } from './components/AnalysisReport.tsx';
import { WorkflowVisualizer } from './components/WorkflowVisualizer.tsx';
import { HistoryLog } from './components/HistoryLog.tsx';
import {
  ResumeAnalysis,
  N8nSubmissionResult,
  N8nHealthStatus,
  HistoryRecord,
} from './types.ts';
import { DEFAULT_N8N_URL } from './constants.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'report' | 'workflow' | 'history'>(
    'analyzer'
  );
  const [targetUrl, setTargetUrl] = useState<string>(
    DEFAULT_N8N_URL ||
      'https://harshitha2006.app.n8n.cloud/form/b088764b-ff9f-47a6-a63b-8ac8156d8ce9'
  );
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [lastSubmission, setLastSubmission] = useState<N8nSubmissionResult | null>(null);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('resume_analyzer_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [n8nHealth, setN8nHealth] = useState<N8nHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(false);

  // Ping n8n health on startup & whenever requested
  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch(`/api/n8n/health?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();
      setN8nHealth(data);
    } catch (err: any) {
      setN8nHealth({
        success: false,
        url: targetUrl,
        latencyMs: 0,
        isDefault: true,
        error: err.message,
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, [targetUrl]);

  // Persist history records
  useEffect(() => {
    try {
      localStorage.setItem('resume_analyzer_history', JSON.stringify(historyRecords));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [historyRecords]);

  const handleSuccess = (
    analysis: ResumeAnalysis,
    submission: N8nSubmissionResult | null
  ) => {
    setCurrentAnalysis(analysis);
    setLastSubmission(submission);

    // Add to history
    const record: HistoryRecord = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      candidateName: analysis.candidateName,
      candidateEmail: analysis.candidateEmail,
      role: analysis.targetRole,
      n8nStatus: submission?.statusCode || 200,
      n8nLatencyMs: submission?.latencyMs || 45,
      atsScore: analysis.atsScore,
      analysis,
    };

    setHistoryRecords((prev) => [record, ...prev.slice(0, 19)]);
    setActiveTab('report');
  };

  const handleSelectRecord = (record: HistoryRecord) => {
    setCurrentAnalysis(record.analysis);
    setLastSubmission({
      success: true,
      statusCode: record.n8nStatus,
      latencyMs: record.n8nLatencyMs,
      targetUrl,
      submittedAt: record.timestamp,
    });
    setActiveTab('report');
  };

  const handleClearRecords = () => {
    setHistoryRecords([]);
    localStorage.removeItem('resume_analyzer_history');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        n8nHealth={n8nHealth}
        checkingHealth={checkingHealth}
        onRefreshHealth={checkHealth}
        hasReport={Boolean(currentAnalysis)}
        historyCount={historyRecords.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'analyzer' && (
          <FormStudio
            onSuccess={handleSuccess}
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
          />
        )}

        {activeTab === 'report' && (
          <>
            {currentAnalysis ? (
              <AnalysisReport
                analysis={currentAnalysis}
                n8nSubmission={lastSubmission}
                onNewScan={() => setActiveTab('analyzer')}
              />
            ) : (
              <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No Report Generated Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Select a sample candidate or upload a resume in the Studio to generate a complete ATS analysis.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('analyzer')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                >
                  Start First Scan
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'workflow' && (
          <WorkflowVisualizer
            n8nHealth={n8nHealth}
            checkingHealth={checkingHealth}
            onRefreshHealth={checkHealth}
            targetUrl={targetUrl}
          />
        )}

        {activeTab === 'history' && (
          <HistoryLog
            records={historyRecords}
            onSelectRecord={handleSelectRecord}
            onClearRecords={handleClearRecords}
            onGoToStudio={() => setActiveTab('analyzer')}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-400 font-medium">Resume Analyzer</span>
            <span>•</span>
            <span>Connected to n8n Cloud Webhook</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://harshitha2006.app.n8n.cloud/form/b088764b-ff9f-47a6-a63b-8ac8156d8ce9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-rose-400 transition-colors"
            >
              Original n8n Form
            </a>
            <span>•</span>
            <button
              onClick={() => setActiveTab('workflow')}
              className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Pipeline Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
