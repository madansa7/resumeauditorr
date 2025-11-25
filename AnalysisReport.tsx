import React from 'react';
import type { AnalysisReportData } from '../types';
import { ScoreCard } from './ScoreCard';
import { KeywordDisplay } from './KeywordDisplay';
import { ThumbsUpIcon, ThumbsDownIcon, DocumentTextIcon, SparklesIcon } from './Icons';

interface AnalysisReportProps {
  analysis: AnalysisReportData | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const ReportCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">{title}</h3>
        {children}
    </div>
);


const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-3">
    <div className="w-5 h-5 flex-shrink-0 mt-1 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
    </div>
    <span className="text-slate-600 dark:text-slate-300">{children}</span>
  </li>
);

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis, onGenerate, isLoading }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ScoreCard title="ATS Score" score={analysis.atsScore} maxScore={100} comment="Higher is better" className="animate-fade-in-up" />
        <ScoreCard title="Readability" score={analysis.readabilityScore} comment="Grade Level" isGrade={true} className="animate-fade-in-up" style={{ animationDelay: '150ms', opacity: 0 }} />
      </div>

      <ReportCard title="Keyword Analysis">
        <KeywordDisplay analysis={analysis.keywordAnalysis} />
      </ReportCard>
      
      <ReportCard title="Summary of Strengths">
        <p className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300 flex items-start gap-3">
            <ThumbsUpIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{analysis.summaryOfStrengths}</span>
        </p>
      </ReportCard>

      <ReportCard title="Actionable Suggestions">
        <ul className="space-y-3">
          {analysis.actionableSuggestions.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
        </ul>
      </ReportCard>

      <ReportCard title="Content & Formatting Gaps">
        <ul className="space-y-3">
          {[...analysis.contentGaps, ...analysis.formattingIssues].map((item, index) => <ListItem key={index}>{item}</ListItem>)}
        </ul>
      </ReportCard>
      
       <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
            onClick={onGenerate}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none ${isLoading ? 'animate-pulse' : ''}`}
        >
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
            ) : (
            <>
                <SparklesIcon className="w-5 h-5" />
                Generate Enhanced Resume
            </>
            )}
        </button>
       </div>
    </div>
  );
};