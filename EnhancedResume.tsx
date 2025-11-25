import React from 'react';
import { DownloadIcon } from './Icons';

interface EnhancedResumeProps {
  resumeText: string | null;
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
}

export const EnhancedResume: React.FC<EnhancedResumeProps> = ({ resumeText, onDownloadDocx, onDownloadPdf }) => {
  if (!resumeText) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">Your enhanced resume will appear here.</p>
      </div>
    );
  }

  const renderContent = () => {
    return resumeText.split('\n').filter(line => line.trim() !== '').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-2 text-slate-800 dark:text-slate-200 border-b-2 border-blue-500 pb-1">{line.substring(3)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <p key={index} className="my-1 text-slate-600 dark:text-slate-300 ml-6 relative before:content-['•'] before:absolute before:left-[-1.2rem] before:text-blue-500">{line.substring(2)}</p>;
      }
      return <p key={index} className="my-1 text-slate-600 dark:text-slate-300">{line}</p>;
    });
  };

  return (
    <div className="space-y-4">
      <div className="prose prose-slate dark:prose-invert max-w-none p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 h-[60vh] overflow-y-auto">
        {renderContent()}
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
            onClick={onDownloadDocx}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
            <DownloadIcon className="w-5 h-5"/>
            Download as .docx
        </button>
        <button
            onClick={onDownloadPdf}
            className="w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
            <DownloadIcon className="w-5 h-5"/>
            Download as .pdf
        </button>
       </div>
    </div>
  );
};