import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trendColor?: 'green' | 'amber' | 'blue';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trendColor = 'blue'
}) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4">
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight truncate">{value}</h3>
        <p className="text-xs text-slate-500 font-medium truncate">{description}</p>
      </div>
      
      <div className={`p-3 rounded-xl border flex-shrink-0 ${colorMap[trendColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};