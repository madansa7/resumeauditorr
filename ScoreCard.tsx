import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  comment: string;
  isGrade?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, maxScore = 100, comment, isGrade = false, className = '', style }) => {
  const percentage = isGrade ? 0 : (score / maxScore) * 100;
  
  const getRingColor = () => {
      if(isGrade) return 'stroke-purple-500';
      if (percentage >= 80) return 'stroke-green-500';
      if (percentage >= 50) return 'stroke-yellow-500';
      return 'stroke-red-500';
  }

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl flex items-center gap-4 border border-slate-200 dark:border-slate-700 ${className}`} style={style}>
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 70 70">
          <circle
            className="text-slate-200 dark:text-slate-600"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="35"
            cy="35"
          />
          {!isGrade && <circle
            className={`transition-all duration-1000 ease-out ${getRingColor()}`}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="35"
            cy="35"
            transform="rotate(-90 35 35)"
          />}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${getRingColor().replace('stroke-', 'text-')}`}>
                {score}
            </span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{comment}</p>
      </div>
    </div>
  );
};