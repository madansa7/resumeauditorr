import React from 'react';
import { LogoIcon } from './Icons';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
            <LogoIcon className="w-16 h-16 text-blue-500" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-slate-500 dark:text-slate-400">AI is analyzing...</p>
    </div>
  );
};