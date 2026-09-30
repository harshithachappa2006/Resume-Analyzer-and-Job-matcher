import React, { useState } from 'react';
import {
  Workflow,
  Server,
  FileCode,
  Sparkles,
  Database,
  Mail,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Activity,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { N8nHealthStatus } from '../types.ts';

interface WorkflowVisualizerProps {
  n8nHealth: N8nHealthStatus | null;
  checkingHealth: boolean;
  onRefreshHealth: () => void;
  targetUrl: string;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  n8nHealth,
  checkingHealth,
  onRefreshHealth,
  targetUrl,
}) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const curlCommand = `curl -X POST "${targetUrl}" \\
  -F "field-0=Harshitha Chappa" \\
  -F "field-1=candidate@example.com" \\
  -F "field-2=@/path/to/resume.pdf"`;

  const payloadSample = {
    formId: 'b088764b-ff9f-47a6-a63b-8ac8156d8ce9',
    formTitle: 'resume analyzer',
    endpoint: targetUrl,
    method: 'POST',
    contentType: 'multipart/form-data',
    fields: {
      'field-0': {
        label: 'name',
        type: 'text',
        required: true,
      },
      'field-1': {
        label: 'email',
        type: 'email',
        required: true,
      },
      'field-2': {
        label: 'upload resume',
        type: 'file (binary)',
        accepts: ['.pdf', '.docx', '.doc', '.txt'],
        multiple: true,
        required: false,
      },
    },
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payloadSample, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Workflow className="w-3.5 h-3.5" />
              <span>n8n Cloud Automation Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              End-to-End Workflow Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              How submissions via{' '}
              <span className="font-mono text-rose-400 break-all">{targetUrl}</span> are
              ingested, parsed, evaluated, and synchronized through Harshitha's n8n workflow.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onRefreshHealth}
              disabled={checkingHealth}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
              <span>Ping Endpoint</span>
            </button>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-md shadow-rose-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>Open Form in n8n</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live Status Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Endpoint Health</div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                n8nHealth?.success ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-rose-400'
              }`}
            />
            <span className="text-sm font-bold text-white">
              {n8nHealth?.success ? '200 OK (Active)' : 'Reconnecting...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">harshitha2006.app.n8n.cloud</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Round-Trip Latency</div>
          <div className="flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white font-mono">
              {n8nHealth?.latencyMs || 0} ms
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Low-latency Cloudflare Edge</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Form Node UUID</div>
          <div className="text-sm font-bold text-white font-mono truncate" title="b088764b-ff9f-47a6-a63b-8ac8156d8ce9">
            b088764b...8ce9
          </div>
          <p className="text-[11px] text-slate-500">Unique Workflow Trigger</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs font-medium text-slate-400">Security & Encryption</div>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">TLS 1.3 / HTTPS</span>
          </div>
          <p className="text-[11px] text-slate-500">Cloudflare Protected</p>
        </div>
      </div>

      {/* Visual Workflow Node Pipeline */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
          <Workflow className="w-5 h-5 text-rose-400" />
          <span>Automated Pipeline Flowchart</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
          {/* Node 1 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2 relative group hover:border-rose-500/60 transition-all">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Node 1</div>
            <h3 className="text-xs font-bold text-white">n8n Form Trigger</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Listens at <code className="text-rose-300">/form/...</code> endpoint for multipart submissions.
            </p>
          </div>

          {/* Node 2 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Node 2</div>
            <h3 className="text-xs font-bold text-white">Field Parser</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Validates <code className="text-orange-300">field-0</code> (name), <code className="text-orange-300">field-1</code> (email), and binary buffer.
            </p>
          </div>

          {/* Node 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Node 3</div>
            <h3 className="text-xs font-bold text-white">Binary Extractor</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Extracts raw text and section structures from PDF and Word binaries.
            </p>
          </div>

          {/* Node 4 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Node 4</div>
            <h3 className="text-xs font-bold text-white">AI Analyzer</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Calculates ATS score, metrics density, keyword gaps, and bullet rewrites.
            </p>
          </div>

          {/* Node 5 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Node 5</div>
            <h3 className="text-xs font-bold text-white">Database Sync</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Stores candidate record, scores, and timestamp in structured database or sheet.
            </p>
          </div>

          {/* Node 6 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Node 6</div>
            <h3 className="text-xs font-bold text-white">Email Dispatcher</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Automatically emails personalized recommendations to <code className="text-purple-300">field-1</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Code & cURL Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terminal cURL */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Direct cURL Submission</span>
            </h3>
            <button
              onClick={handleCopyCurl}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy cURL</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{curlCommand}</pre>
          </div>
          <p className="text-[11px] text-slate-500">
            Execute in your local shell to verify that n8n receives the multipart POST request directly.
          </p>
        </div>

        {/* Schema Specification */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <FileCode className="w-4 h-4 text-rose-400" />
              <span>n8n Form Schema Specification</span>
            </h3>
            <button
              onClick={handleCopyJson}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-[175px]">
            <pre>{JSON.stringify(payloadSample, null, 2)}</pre>
          </div>
          <p className="text-[11px] text-slate-500">
            Official field mapping matching Harshitha's n8n form configuration.
          </p>
        </div>
      </div>
    </div>
  );
};
