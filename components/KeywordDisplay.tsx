
import React from 'react';
import type { KeywordAnalysis } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface KeywordDisplayProps {
  analysis: KeywordAnalysis;
}

const KeywordTag: React.FC<{ text: string; type: 'present' | 'missing' }> = ({ text, type }) => {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium';
  const presentClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  const missingClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  
  return (
    <span className={`${baseClasses} ${type === 'present' ? presentClasses : missingClasses}`}>
      {type === 'present' ? <CheckCircleIcon className="w-3.5 h-3.5"/> : <XCircleIcon className="w-3.5 h-3.5"/>}
      {text}
    </span>
  );
};

export const KeywordDisplay: React.FC<KeywordDisplayProps> = ({ analysis }) => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
      <div>
        <h5 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Keywords Found</h5>
        <div className="flex flex-wrap gap-2">
            {analysis.present.length > 0 ? analysis.present.map(kw => <KeywordTag key={kw} text={kw} type="present" />) : <p className="text-sm text-slate-500">No strong keyword matches found.</p>}
        </div>
      </div>
      <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
        <h5 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Missing Keywords</h5>
        <div className="flex flex-wrap gap-2">
            {analysis.missing.length > 0 ? analysis.missing.map(kw => <KeywordTag key={kw} text={kw} type="missing" />) : <p className="text-sm text-slate-500">Great job! No critical keywords seem to be missing.</p>}
        </div>
      </div>
    </div>
  );
};
