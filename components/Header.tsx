import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <LogoIcon className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white ml-3">
              ATS Resume Optimizer
            </h1>
          </div>
          <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
            Make Your Resume ATS-Friendly
          </p>
        </div>
      </div>
    </header>
  );
};
