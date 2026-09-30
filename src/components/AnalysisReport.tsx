import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Zap,
  Target,
  FileText,
  BadgeCheck,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { ResumeAnalysis, N8nSubmissionResult } from '../types.ts';

interface AnalysisReportProps {
  analysis: ResumeAnalysis;
  n8nSubmission: N8nSubmissionResult | null;
  onNewScan: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({
  analysis,
  n8nSubmission,
  onNewScan,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-400';
    if (score >= 70) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  const handleCopyRewrite = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyFullReport = () => {
    const summary = `
RESUME ATS AUDIT REPORT
Candidate: ${analysis.candidateName} (${analysis.candidateEmail})
Target Role: ${analysis.targetRole}
Overall ATS Score: ${analysis.atsScore}/100 (Grade: ${analysis.scoreGrade})
Job Match Score: ${analysis.jobMatchScore}/100

Recruiter Impression:
${analysis.recruiterImpression}

Score Breakdown:
- Impact & Metrics: ${analysis.scoreBreakdown.impactAndMetrics}/100
- ATS Readability: ${analysis.scoreBreakdown.atsReadability}/100
- Skills Alignment: ${analysis.scoreBreakdown.skillsAlignment}/100
- Brevity & Structure: ${analysis.scoreBreakdown.brevityAndStructure}/100
- Action Verbs: ${analysis.scoreBreakdown.actionVerbs}/100

Top Strengths:
${analysis.topStrengths.map((s) => `• ${s}`).join('\n')}

Critical Fixes:
${analysis.criticalFixes.map((f) => `• [${f.issue}]: ${f.recommendation}`).join('\n')}

Missing Keywords:
${analysis.missingKeywords.join(', ')}
`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:text-black">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white">
              {analysis.candidateName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {analysis.targetRole}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center space-x-2">
            <span>{analysis.candidateEmail}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              ATS Audit Complete
            </span>
            {n8nSubmission && (
              <>
                <span>•</span>
                <span className="text-rose-400 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  Synced with n8n ({n8nSubmission.latencyMs}ms)
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyFullReport}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onNewScan}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-md shadow-rose-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Hero Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Scorecard */}
        <div className="md:col-span-4 bg-slate-900/60 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            ATS Readiness Score
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            {/* Circular Ring background */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * analysis.atsScore) / 100}
                strokeLinecap="round"
                className={
                  analysis.atsScore >= 85
                    ? 'text-emerald-400'
                    : analysis.atsScore >= 70
                    ? 'text-amber-400'
                    : 'text-rose-500'
                }
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{analysis.atsScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(
                analysis.atsScore
              )}`}
            >
              Grade {analysis.scoreGrade}
            </span>
            <span className="text-xs text-slate-400">
              Match: <strong className="text-white">{analysis.jobMatchScore}%</strong>
            </span>
          </div>

          <p className="mt-4 text-xs text-slate-400 max-w-xs leading-relaxed">
            {analysis.atsScore >= 80
              ? 'High probability of passing algorithmic resume parsers & recruiter screens.'
              : 'Requires targeted metrics & keyword additions to avoid automated rejection filters.'}
          </p>
        </div>

        {/* 5-Pillar Score Breakdown */}
        <div className="md:col-span-8 bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <span>Core Audit Pillars</span>
            </h2>
            <span className="text-xs text-slate-400">Industry ATS Benchmark: 75+</span>
          </div>

          <div className="space-y-4">
            {/* Impact & Metrics */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Quantifiable Impact & Metrics</span>
                <span className="text-white font-mono">
                  {analysis.scoreBreakdown.impactAndMetrics}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(
                    analysis.scoreBreakdown.impactAndMetrics
                  )}`}
                  style={{ width: `${analysis.scoreBreakdown.impactAndMetrics}%` }}
                />
              </div>
            </div>

            {/* ATS Readability & Parsing */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">ATS Parsing & Structural Health</span>
                <span className="text-white font-mono">
                  {analysis.scoreBreakdown.atsReadability}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(
                    analysis.scoreBreakdown.atsReadability
                  )}`}
                  style={{ width: `${analysis.scoreBreakdown.atsReadability}%` }}
                />
              </div>
            </div>

            {/* Skills Alignment */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Skill Alignment & Density</span>
                <span className="text-white font-mono">
                  {analysis.scoreBreakdown.skillsAlignment}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(
                    analysis.scoreBreakdown.skillsAlignment
                  )}`}
                  style={{ width: `${analysis.scoreBreakdown.skillsAlignment}%` }}
                />
              </div>
            </div>

            {/* Brevity & Hierarchy */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Brevity & Information Hierarchy</span>
                <span className="text-white font-mono">
                  {analysis.scoreBreakdown.brevityAndStructure}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(
                    analysis.scoreBreakdown.brevityAndStructure
                  )}`}
                  style={{ width: `${analysis.scoreBreakdown.brevityAndStructure}%` }}
                />
              </div>
            </div>

            {/* Action Verbs */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Active Leadership & Power Verbs</span>
                <span className="text-white font-mono">
                  {analysis.scoreBreakdown.actionVerbs}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(
                    analysis.scoreBreakdown.actionVerbs
                  )}`}
                  style={{ width: `${analysis.scoreBreakdown.actionVerbs}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Impression Quote */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 rounded-3xl border border-rose-500/20 shadow-lg">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              30-Second Recruiter Impression
            </span>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{analysis.recruiterImpression}"
            </p>
          </div>
        </div>
      </div>

      {/* Strengths & Critical Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <BadgeCheck className="w-5 h-5 text-emerald-400" />
            <span>Top Strengths Detected</span>
          </h2>
          <ul className="space-y-3">
            {analysis.topStrengths.map((strength, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Fixes */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Critical ATS Action Items</span>
          </h2>
          <div className="space-y-3">
            {analysis.criticalFixes.map((fix, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">{fix.issue}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    {fix.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{fix.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google XYZ Formula Rewriter Studio */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Google XYZ Bullet Point Rewriter</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transforms passive duties into executive formula: "Accomplished [X] as measured by [Y], by doing [Z]"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.bulletPointRewrites.map((rewrite, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Original (Passive)
                </span>
                <p className="text-xs text-slate-400 line-through decoration-rose-500/50">
                  {rewrite.original}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Optimized Accomplishment</span>
                  </span>
                  <button
                    onClick={() => handleCopyRewrite(rewrite.improved, idx)}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                  {rewrite.improved}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  💡 <strong>Recruiter Note:</strong> {rewrite.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Matrix & Keyword Matching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Skills */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Skills Detected in Resume</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {analysis.identifiedSkills.length} found
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.identifiedSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing High-Value Keywords */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-orange-400" />
              <span>Recommended Keywords to Add</span>
            </h3>
            <span className="text-xs text-orange-400 font-semibold">Priority</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-300 border border-orange-500/20"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ATS Compliance Checklist */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Algorithmic ATS Compliance Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {analysis.checklist.hasQuantifiableResults ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-medium">Quantifiable % & $ Metrics</span>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {analysis.checklist.hasContactInfo ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-medium">Direct Email & Contact Info</span>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {analysis.checklist.hasLinkedInOrGitHub ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-medium">LinkedIn or GitHub Profile</span>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {analysis.checklist.atsStandardHeadings ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-medium">Standard Section Headings</span>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {analysis.checklist.cleanFormatting ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-medium">Parser-Safe Layout Structure</span>
          </div>

          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            {analysis.checklist.hasActiveVerbs ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs text-slate-300 font-medium">Action & Leadership Verbs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
