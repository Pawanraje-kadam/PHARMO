import { api } from '../../../core/api';

export const getSalesHistoryRegistry = async (dateFilter?: string) => {
  const url = dateFilter ? `/sales?date=${dateFilter}` : '/sales';
  const response = await api.get(url);
  return response.data;
};