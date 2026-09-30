export interface N8nHealthStatus {
  success: boolean;
  url: string;
  status?: number;
  statusText?: string;
  latencyMs: number;
  isDefault: boolean;
  formTitle?: string;
  headers?: {
    server?: string | null;
    cfRay?: string | null;
  };
  error?: string;
}

export interface N8nSubmissionResult {
  success: boolean;
  statusCode?: number;
  latencyMs: number;
  targetUrl: string;
  response?: any;
  submittedAt: string;
  candidate?: {
    name: string;
    email: string;
    fileName: string;
    fileSizeBytes: number;
  };
  error?: string;
}

export interface ScoreBreakdown {
  impactAndMetrics: number;
  atsReadability: number;
  skillsAlignment: number;
  brevityAndStructure: number;
  actionVerbs: number;
}

export interface CriticalFix {
  issue: string;
  impact: string;
  recommendation: string;
}

export interface BulletPointRewrite {
  original: string;
  improved: string;
  why: string;
}

export interface ATSChecklist {
  hasQuantifiableResults: boolean;
  hasContactInfo: boolean;
  hasLinkedInOrGitHub: boolean;
  atsStandardHeadings: boolean;
  cleanFormatting: boolean;
  hasActiveVerbs: boolean;
}

export interface ResumeAnalysis {
  candidateName: string;
  candidateEmail: string;
  targetRole: string;
  atsScore: number;
  scoreGrade: string;
  recruiterImpression: string;
  scoreBreakdown: ScoreBreakdown;
  topStrengths: string[];
  criticalFixes: CriticalFix[];
  identifiedSkills: string[];
  missingKeywords: string[];
  bulletPointRewrites: BulletPointRewrite[];
  jobMatchScore: number;
  checklist: ATSChecklist;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  candidateName: string;
  candidateEmail: string;
  fileName?: string;
  role: string;
  n8nStatus: number;
  n8nLatencyMs: number;
  atsScore: number;
  analysis: ResumeAnalysis;
}
