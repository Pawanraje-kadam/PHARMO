import { api } from '../../../core/api';

export const getDashboardSummaryMetrics = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getDashboardAlertsRegistry = async () => {
  const response = await api.get('/dashboard/alerts');
  return response.data;
};