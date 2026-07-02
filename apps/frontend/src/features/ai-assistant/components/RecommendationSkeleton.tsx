import React from 'react';

export const RecommendationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((n) => (
        <div key={n} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full bg-slate-200 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};