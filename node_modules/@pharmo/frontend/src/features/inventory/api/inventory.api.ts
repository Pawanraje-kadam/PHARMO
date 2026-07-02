import { api } from '../../../core/api';

export interface CreateMedicineInput {
  name: string;
  generic_name?: string;
  manufacturer?: string;
  rack_location?: string;
  min_stock_level: number;
}

export const getInventoryMedicines = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

export const createNewMedicine = async (payload: CreateMedicineInput) => {
  const response = await api.post('/inventory', payload);
  return response.data;
};