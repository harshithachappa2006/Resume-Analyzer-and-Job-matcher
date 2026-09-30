import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  User,
  Mail,
  Briefcase,
  Target,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SAMPLE_PROFILES, SampleProfile } from '../data/samples.ts';
import { ResumeAnalysis, N8nSubmissionResult } from '../types.ts';

interface FormStudioProps {
  onSuccess: (analysis: ResumeAnalysis, submission: N8nSubmissionResult | null) => void;
  targetUrl: string;
  setTargetUrl: (url: string) => void;
}

export const FormStudio: React.FC<FormStudioProps> = ({
  onSuccess,
  targetUrl,
  setTargetUrl,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [showConfig, setShowConfig] = useState(false);
  const [showJd, setShowJd] = useState(false);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>('');
  const [lastSubmissionStatus, setLastSubmissionStatus] = useState<{
    success: boolean;
    message: string;
    details?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!name) {
        // Infer name from filename if possible
        const inferred = droppedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setName(inferred);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!name) {
        const inferred = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setName(inferred);
      }
    }
  };

  const handleSelectSample = (sample: SampleProfile) => {
    setName(sample.name);
    setEmail(sample.email);
    setTargetRole(sample.role);
    setJobDescription(sample.jobDescription);
    setResumeText(sample.resumeText);
    setInputMode('paste');
    setFile(null);
    setLastSubmissionStatus(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async (actionType: 'both' | 'n8n-only' | 'analyze-only') => {
    if (!name.trim()) {
      alert('Please provide the candidate name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please provide a valid candidate email.');
      return;
    }
    if (inputMode === 'upload' && !file && !resumeText.trim()) {
      alert('Please upload a resume file (PDF/DOCX/TXT) or switch to Paste mode.');
      return;
    }
    if (inputMode === 'paste' && !resumeText.trim()) {
      alert('Please paste resume text into the text area.');
      return;
    }

    setIsSubmitting(true);
    setLastSubmissionStatus(null);

    let n8nSubmissionResult: N8nSubmissionResult | null = null;
    let analysisResult: ResumeAnalysis | null = null;

    try {
      // Step 1: Submit to n8n if requested
      if (actionType === 'both' || actionType === 'n8n-only') {
        setSubmitStep('Forwarding payload to n8n Cloud Webhook...');
        const formData = new FormData();
        formData.append('targetUrl', targetUrl);
        formData.append('name', name);
        formData.append('email', email);

        if (file) {
          formData.append('resume', file);
        } else if (resumeText) {
          formData.append('resumeText', resumeText);
        }

        const n8nRes = await fetch('/api/n8n/submit', {
          method: 'POST',
          body: formData,
        });

        const n8nData = await n8nRes.json();
        n8nSubmissionResult = n8nData;

        if (!n8nRes.ok || !n8nData.success) {
          console.warn('n8n submission returned non-200:', n8nData);
        }
      }

      // Step 2: Run AI ATS Analysis if requested
      if (actionType === 'both' || actionType === 'analyze-only') {
        setSubmitStep('Synthesizing deep ATS scorecard & keyword audit with Gemini AI...');
        const aiFormData = new FormData();
        aiFormData.append('name', name);
        aiFormData.append('email', email);
        aiFormData.append('targetRole', targetRole);
        aiFormData.append('jobDescription', jobDescription);

        if (file) {
          aiFormData.append('resume', file);
        }
        if (resumeText) {
          aiFormData.append('resumeText', resumeText);
        }

        const aiRes = await fetch('/api/ai/analyze-resume', {
          method: 'POST',
          body: aiFormData,
        });

        const aiData = await aiRes.json();
        if (aiData.success && aiData.analysis) {
          analysisResult = aiData.analysis;
        } else {
          throw new Error(aiData.error || 'Failed to complete resume analysis');
        }
      }

      setSubmitStep('Finalizing results...');

      if (actionType === 'n8n-only') {
        setLastSubmissionStatus({
          success: true,
          message: 'Payload successfully received by n8n workflow!',
          details: `Webhook executed in ${n8nSubmissionResult?.latencyMs || 0}ms with HTTP 200.`,
        });
      } else if (analysisResult) {
        onSuccess(analysisResult, n8nSubmissionResult);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setLastSubmissionStatus({
        success: false,
        message: 'Submission failed',
        details: err.message || 'Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
      setSubmitStep('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Connected to n8n Automation Cloud</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI Resume Analyzer & ATS Optimization Engine
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Submit your resume directly to Harshitha’s automated{' '}
            <span className="text-rose-400 font-semibold">n8n workflow pipeline</span> to trigger
            instant ATS score audits, action verb revisions, missing keyword detection, and job description alignment.
          </p>

          {/* Quick preset chips */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Quick Test Samples:
              </span>
              {SAMPLE_PROFILES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 text-slate-300 border border-slate-700/80 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>{sample.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({sample.badge})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details & File Upload */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-base">Candidate Information</h2>
                  <p className="text-xs text-slate-400">Matches n8n form fields (field-0 & field-1)</p>
                </div>
              </div>

              {/* Mode switch */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    inputMode === 'upload'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    inputMode === 'paste'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Inputs: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harshitha Chappa"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. harshitha@example.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Role / Industry
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer, Product Manager, Data Scientist"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            {/* Resume Upload / Paste Zone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Resume Content (field-2) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">PDF, DOCX, DOC or TXT up to 15MB</span>
              </div>

              {inputMode === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {file ? (
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-rose-500/40 shadow-inner">
                      <div className="flex items-center space-x-3 truncate">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-rose-500/60 hover:bg-slate-900/50 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-rose-500/20 text-slate-400 group-hover:text-rose-400 flex items-center justify-center mx-auto mb-3 transition-colors">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        Drag and drop your resume file here, or{' '}
                        <span className="text-rose-400 underline underline-offset-2">browse files</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5">
                        Accepts Adobe PDF, Microsoft Word (.docx), or Text file
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the plain text of your resume here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition-all"
                  />
                  <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
                    <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                    <button
                      type="button"
                      onClick={() => setResumeText('')}
                      className="hover:text-rose-400 transition-colors"
                    >
                      Clear text
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Job Description Accordion */}
            <div className="border border-slate-800/80 rounded-xl bg-slate-950/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowJd(!showJd)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    Target Job Description Matcher (Optional)
                  </span>
                  {jobDescription && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
                      Active
                    </span>
                  )}
                </div>
                {showJd ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showJd && (
                <div className="p-4 border-t border-slate-800/80 space-y-2">
                  <p className="text-xs text-slate-400">
                    Paste the target job posting to scan for missing keywords and calculate ATS match probability.
                  </p>
                  <textarea
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job requirements, responsibilities, or keywords here..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Submission Status banner if any */}
            {lastSubmissionStatus && (
              <div
                className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  lastSubmissionStatus.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {lastSubmissionStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold">{lastSubmissionStatus.message}</p>
                  {lastSubmissionStatus.details && (
                    <p className="text-xs mt-1 text-slate-300 font-mono">
                      {lastSubmissionStatus.details}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('both')}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{submitStep || 'Processing Workflow & Analysis...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze & Submit to n8n Workflow</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit('analyze-only')}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Run ATS Scan Only</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit('n8n-only')}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-rose-400" />
                  <span>Submit Webhook Only</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: n8n Workflow Connection & Endpoint Specs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Webhook Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>n8n Webhook Target</span>
              </span>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showConfig ? 'Hide' : 'Configure'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Endpoint URL</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  POST
                </span>
              </div>
              <p className="text-xs font-mono text-slate-300 break-all select-all">
                {targetUrl}
              </p>
            </div>

            {showConfig && (
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Custom Webhook Endpoint</label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTargetUrl(
                      'https://harshitha2006.app.n8n.cloud/form/b088764b-ff9f-47a6-a63b-8ac8156d8ce9'
                    )
                  }
                  className="text-rose-400 hover:text-rose-300 underline underline-offset-2"
                >
                  Reset to Harshitha's Cloud URL
                </button>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-semibold text-slate-300">n8n Form Field Mapping:</div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/60 font-mono">
                  <span className="text-rose-400">field-0</span>
                  <span className="text-slate-300">Candidate Name</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/60 font-mono">
                  <span className="text-rose-400">field-1</span>
                  <span className="text-slate-300">Email Address</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/60 font-mono">
                  <span className="text-rose-400">field-2</span>
                  <span className="text-slate-300">Resume File / Binary</span>
                </div>
              </div>
            </div>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Test in Original n8n Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Value Props & ATS Compliance Card */}
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              ATS Scoring Dimensions
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Impact & Metrics:</strong> Evaluates quantified business outcomes ($ saved, % lift, users scaled).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Parsing Health:</strong> Checks compatibility with Workday, Greenhouse, Taleo, and Lever ATS schemas.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Google XYZ Rewrites:</strong> Upgrades passive duty statements into high-impact accomplishments.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Keyword Density:</strong> Detects missing critical hard and soft skills for your domain.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
