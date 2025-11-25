
export interface KeywordAnalysis {
  present: string[];
  missing: string[];
  density: Array<{ keyword: string; count: number }>;
}

export interface AnalysisReportData {
  atsScore: number;
  atsFeedback: string;
  keywordAnalysis: KeywordAnalysis;
  contentGaps: string[];
  formattingIssues: string[];
  readabilityScore: number;
  summaryOfStrengths: string;
  actionableSuggestions: string[];
}

export interface JobTarget {
  id: string;
  title: string;
  description: string;
}
