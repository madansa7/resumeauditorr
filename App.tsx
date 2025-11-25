
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { AnalysisReport } from './components/AnalysisReport';
import { EnhancedResume } from './components/EnhancedResume';
import { Loader } from './components/Loader';
import { analyzeResume, generateEnhancedResume } from './services/geminiService';
import { generateDocxFromText } from './services/docService';
import { generatePdfFromText } from './services/pdfService';
import type { AnalysisReportData, JobTarget } from './types';

const defaultJobTarget: JobTarget = {
  id: crypto.randomUUID(),
  title: 'Example Job Target',
  description: '',
};

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobTargets, setJobTargets] = useState<JobTarget[]>([defaultJobTarget]);
  const [selectedJobTargetId, setSelectedJobTargetId] = useState<string>(defaultJobTarget.id);
  
  const [analysisCache, setAnalysisCache] = useState<Record<string, AnalysisReportData | null>>({});
  const [enhancedResume, setEnhancedResume] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState({ analysis: false, generation: false });
  const [error, setError] = useState<string | null>(null);

  const selectedJobTarget = useMemo(
    () => jobTargets.find(t => t.id === selectedJobTargetId) ?? jobTargets[0],
    [jobTargets, selectedJobTargetId]
  );
  
  const analysis = analysisCache[selectedJobTargetId] ?? null;

  const handleAnalyze = useCallback(async () => {
    if (!resumeText || !selectedJobTarget?.description) {
      setError('Please provide your resume and the job description for the selected target.');
      return;
    }
    setError(null);
    setAnalysisCache(prev => ({ ...prev, [selectedJobTarget.id]: null }));
    setEnhancedResume(null);
    setLoadingState({ analysis: true, generation: false });

    try {
      const result = await analyzeResume(resumeText, selectedJobTarget.description);
      setAnalysisCache(prev => ({ ...prev, [selectedJobTarget.id]: result }));
    } catch (e) {
      console.error(e);
      setError('Failed to analyze resume. Please check your API key and try again.');
    } finally {
      setLoadingState({ analysis: false, generation: false });
    }
  }, [resumeText, selectedJobTarget]);

  const handleGenerate = useCallback(async () => {
    if (!resumeText || !selectedJobTarget?.description || !analysis) {
      setError('Please analyze the resume first before generating an enhanced version.');
      return;
    }
    setError(null);
    setEnhancedResume(null);
    setLoadingState({ analysis: false, generation: true });

    try {
      const result = await generateEnhancedResume(resumeText, selectedJobTarget.description, analysis);
      setEnhancedResume(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate enhanced resume. Please try again.');
    } finally {
      setLoadingState({ analysis: false, generation: false });
    }
  }, [resumeText, selectedJobTarget, analysis]);
  
  const handleDownloadDocx = useCallback(async () => {
    if (enhancedResume) {
      await generateDocxFromText(enhancedResume);
    }
  }, [enhancedResume]);

  const handleDownloadPdf = useCallback(async () => {
    if (enhancedResume) {
      await generatePdfFromText(enhancedResume);
    }
  }, [enhancedResume]);

  const handleSelectJobTarget = useCallback((id: string) => {
    setSelectedJobTargetId(id);
    setEnhancedResume(null); // Clear enhanced resume when switching targets
    setError(null);
  }, []);

  const handleAddJobTarget = useCallback(() => {
    setJobTargets(prev => {
        const newTarget: JobTarget = {
            id: crypto.randomUUID(),
            title: `New Job Target ${prev.length + 1}`,
            description: '',
        };
        setSelectedJobTargetId(newTarget.id);
        setEnhancedResume(null);
        return [...prev, newTarget];
    });
  }, []);
  
  const handleUpdateJobTarget = useCallback((id: string, updatedTarget: Partial<JobTarget>) => {
    setJobTargets(prev => prev.map(t => t.id === id ? { ...t, ...updatedTarget } : t));
  }, []);

  const handleDeleteJobTarget = useCallback((id: string) => {
    if (jobTargets.length <= 1) {
        setError("You must have at least one job target.");
        return;
    }
    const newTargets = jobTargets.filter(t => t.id !== id);
    setJobTargets(newTargets);

    if (selectedJobTargetId === id) {
        setSelectedJobTargetId(newTargets[0].id);
        setEnhancedResume(null);
    }
  }, [jobTargets, selectedJobTargetId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <span className="font-bold text-xl">×</span>
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <InputPanel
              resumeText={resumeText}
              setResumeText={setResumeText}
              jobTargets={jobTargets}
              selectedJobTarget={selectedJobTarget}
              onSelectJobTarget={handleSelectJobTarget}
              onAddJobTarget={handleAddJobTarget}
              onUpdateJobTarget={handleUpdateJobTarget}
              onDeleteJobTarget={handleDeleteJobTarget}
              onAnalyze={handleAnalyze}
              isLoading={loadingState.analysis}
            />
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
               {(loadingState.analysis || analysis) && (
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Analysis Report for <span className="text-blue-600 dark:text-blue-500">{selectedJobTarget.title}</span></h2>
                    {loadingState.analysis ? <div className="flex justify-center items-center h-64"><Loader /></div> :
                     <AnalysisReport 
                        analysis={analysis} 
                        onGenerate={handleGenerate}
                        isLoading={loadingState.generation}
                     />
                    }
                 </div>
               )}
            </div>

            <div className="md:col-span-2">
                 {(loadingState.generation || enhancedResume) && (
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Enhanced Resume for <span className="text-blue-600 dark:text-blue-500">{selectedJobTarget.title}</span></h2>
                    {loadingState.generation ? <div className="flex justify-center items-center h-64"><Loader /></div> :
                      <EnhancedResume 
                        resumeText={enhancedResume}
                        onDownloadDocx={handleDownloadDocx}
                        onDownloadPdf={handleDownloadPdf}
                      />
                    }
                  </div>
                 )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
