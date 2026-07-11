import { api } from '../../../core/api';

export const getSalesHistoryRegistry = async (dateFilter?: string) => {
  const url = dateFilter ? `/api/sales?date=${dateFilter}` : '/api/sales';
  const response = await api.get(url);
  return response.data;
};