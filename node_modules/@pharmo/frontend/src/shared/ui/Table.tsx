import React from 'react';
import { clsx } from 'clsx';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  minWidth?: string; // e.g., '800px'
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  className,
  minWidth = '800px'
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table 
        className={clsx('w-full text-left border-collapse text-sm', className)}
        style={{ minWidth }}
      >
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 select-none">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};