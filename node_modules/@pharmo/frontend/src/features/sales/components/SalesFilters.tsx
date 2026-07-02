import React from 'react';

interface SalesFiltersProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 select-none">
      <div className="flex items-center gap-2">
        <label htmlFor="sales-date-filter" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Filter Settlement Date:
        </label>
        <input
          id="sales-date-filter"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="p-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {selectedDate && (
        <button
          type="button"
          onClick={() => onDateChange('')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 uppercase tracking-wide"
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};