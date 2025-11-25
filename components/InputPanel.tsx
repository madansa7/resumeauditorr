
import React, { useRef, useState } from 'react';
import { readFileAsText } from '../services/fileReaderService';
import { UploadIcon, AnalyzeIcon } from './Icons';
import type { JobTarget } from '../types';

interface InputPanelProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobTargets: JobTarget[];
  selectedJobTarget: JobTarget;
  onSelectJobTarget: (id: string) => void;
  onAddJobTarget: () => void;
  onUpdateJobTarget: (id: string, updatedTarget: Partial<JobTarget>) => void;
  onDeleteJobTarget: (id: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  resumeText,
  setResumeText,
  jobTargets,
  selectedJobTarget,
  onSelectJobTarget,
  onAddJobTarget,
  onUpdateJobTarget,
  onDeleteJobTarget,
  onAnalyze,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsReadingFile(true);
      try {
        const text = await readFileAsText(file);
        setResumeText(text);
      } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        } else {
            alert('An unknown error occurred while reading the file.');
        }
      } finally {
        setIsReadingFile(false);
        if (event.target) {
          event.target.value = '';
        }
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-6 sticky top-24">
      <div>
        <label htmlFor="resume-text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Resume
        </label>
        <div className="relative">
          <textarea
            id="resume-text"
            rows={8}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Paste your resume here, or upload a file (.txt, .pdf, .docx)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isReadingFile}
          />
          {isReadingFile ? (
            <div className="absolute bottom-3 right-3 p-2">
                <svg className="animate-spin h-5 w-5 text-slate-600 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
          ) : (
            <button
                type="button"
                onClick={handleUploadClick}
                className="absolute bottom-3 right-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-600 dark:text-slate-200 p-2 rounded-full transition-colors"
                title="Upload .txt, .pdf, or .docx file"
                disabled={isLoading}
            >
                <UploadIcon className="w-5 h-5" />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Job Targets
        </label>
        <div className="flex flex-wrap gap-2">
          {jobTargets.map(target => (
            <button
              key={target.id}
              onClick={() => onSelectJobTarget(target.id)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                selectedJobTarget.id === target.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {target.title}
            </button>
          ))}
          <button
            onClick={onAddJobTarget}
            className="px-3 py-1.5 text-sm font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-green-200 dark:hover:bg-green-800"
          >
            + Add Target
          </button>
        </div>
         <div>
          <label htmlFor="job-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Target Title
          </label>
            <div className="flex gap-2">
            <input
                id="job-title"
                type="text"
                className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Senior Software Engineer"
                value={selectedJobTarget.title}
                onChange={(e) => onUpdateJobTarget(selectedJobTarget.id, { title: e.target.value })}
            />
            <button
                onClick={() => onDeleteJobTarget(selectedJobTarget.id)}
                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-lg disabled:opacity-50"
                title="Delete this target"
                disabled={jobTargets.length <= 1}
            >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
            </div>
        </div>
        <div>
            <label htmlFor="job-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Job Description
            </label>
            <textarea
            id="job-description"
            rows={8}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Paste the job description for the selected target here..."
            value={selectedJobTarget.description}
            onChange={(e) => onUpdateJobTarget(selectedJobTarget.id, { description: e.target.value })}
            />
        </div>
      </div>
      <button
        onClick={onAnalyze}
        disabled={isLoading || !resumeText || !selectedJobTarget.description}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <AnalyzeIcon className="w-5 h-5" />
            Analyze Resume
          </>
        )}
      </button>
    </div>
  );
};
