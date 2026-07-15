import React, { useState, useEffect } from 'react';
import { MetricCard } from '../components/MetricCard';
import { AlertsTable } from '../components/AlertsTable';
import { getDashboardSummaryMetrics, getDashboardAlertsRegistry } from '../api/dashboard.api';
import { DollarSign, Pill, ShieldAlert, ShoppingBag } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardState = async () => {
      try {
        setError(null);
        // Execute analytics tracking endpoints concurrently
        const [metricsRes, alertsRes] = await Promise.all([
          getDashboardSummaryMetrics(),
          getDashboardAlertsRegistry()
        ]);

        if (metricsRes.success && alertsRes.success) {
          setMetrics(metricsRes.data);
          setAlerts(alertsRes.data);
        } else {
          setError('Failed to extract active processing metrics summary data.');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'System lost access to backend monitoring nodes.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardState();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => <div key={n} className="h-28 bg-slate-200 rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Operations Control</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time store summaries, ledger statistics, and active supply warnings.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          ⚠️ Analytics Compromised: {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Gross Income"
          value={`₹${Number(metrics?.grossRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description="Total billing gross income logged today"
          icon={DollarSign}
          trendColor="green"
        />
        <MetricCard
          title="Sales Count"
          value={metrics?.totalSalesCount || 0}
          description="Completed point-of-sale invoices"
          icon={ShoppingBag}
          trendColor="blue"
        />
        <MetricCard
          title="Monitored Lines"
          value={metrics?.totalMedicinesCount || 0}
          description="Unique formulations registered"
          icon={Pill}
          trendColor="blue"
        />
        <MetricCard
          title="Critical Alerts"
          value={alerts.length}
          description="Batches requiring immediate action"
          icon={ShieldAlert}
          trendColor={alerts.length > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Dynamic Inventory Warnings Tracking Panel */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>Active Operations Alerts</span>
          {alerts.length > 0 && (
            <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          )}
        </h2>
        <AlertsTable alerts={alerts} />
      </div>
    </div>
  );
};