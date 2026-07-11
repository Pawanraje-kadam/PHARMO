import { api } from '../../../core/api';

export const getDashboardSummaryMetrics = async () => {
  const response = await api.get('/api/dashboard/summary');
  return response.data;
};

export const getDashboardAlertsRegistry = async () => {
  const response = await api.get('/api/dashboard/alerts');
  return response.data;
};