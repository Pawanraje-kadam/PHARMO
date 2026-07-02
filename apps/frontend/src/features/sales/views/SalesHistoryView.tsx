import React, { useState, useEffect } from 'react';
import { SalesTable } from '../components/SalesTable';
import { SalesFilters } from '../components/SalesFilters';
import { getSalesHistoryRegistry } from '../api/sales.api';

export const SalesHistoryView: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await getSalesHistoryRegistry(dateFilter || undefined);
        if (res.success) setSales(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to retrieve sales logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [dateFilter]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales Transactions Ledger</h1>
        <p className="text-sm text-slate-500 mt-1">Audit historic retail invoices, audit cashier checkouts, and unpack itemized line sets.</p>
      </div>

      <SalesFilters selectedDate={dateFilter} onDateChange={setDateFilter} />

      <div className="space-y-2">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">⚠️ {error}</div>}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-12 bg-slate-200 rounded-xl"></div>
            <div className="h-48 bg-slate-200 rounded-xl"></div>
          </div>
        ) : (
          <SalesTable sales={sales} />
        )}
      </div>
    </div>
  );
};