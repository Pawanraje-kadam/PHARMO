import { api } from '../../../core/api';

export interface CreateMedicineInput {
  name: string;
  generic_name?: string;
  manufacturer?: string;
  rack_location?: string;
  min_stock_level: number;
}

export interface UpdateMedicineInput {
  name?: string;
  generic_name?: string;
  manufacturer?: string;
  rack_location?: string;
  min_stock_level?: number;
}

export interface CreateBatchInput {
  batch_number: string;
  quantity: number;
  buying_price: number;
  selling_price: number;
  expiry_date: string;
  purchase_unit?: string;
  units_per_tablet?: number;
}

export interface UpdateBatchInput {
  quantity?: number;
  buying_price?: number;
  selling_price?: number;
  expiry_date?: string;
  purchase_unit?: string;
  units_per_tablet?: number;
}

export const getInventoryMedicines = async () => {
  const response = await api.get('/api/inventory');
  return response.data;
};

export const getMedicineById = async (id: string) => {
  const response = await api.get(`/api/inventory/${id}`);
  return response.data;
};

export const createNewMedicine = async (payload: CreateMedicineInput) => {
  const response = await api.post('/api/inventory', payload);
  return response.data;
};

export const updateMedicine = async (id: string, payload: UpdateMedicineInput) => {
  const response = await api.put(`/api/inventory/${id}`, payload);
  return response.data;
};

export const deleteMedicine = async (id: string) => {
  const response = await api.delete(`/api/inventory/${id}`);
  return response.data;
};

export const getBatchesByMedicine = async (medicineId: string) => {
  const response = await api.get(`/api/inventory/${medicineId}/batches`);
  return response.data;
};

export const createBatch = async (medicineId: string, payload: CreateBatchInput) => {
  const response = await api.post(`/api/inventory/${medicineId}/batches`, payload);
  return response.data;
};

export const updateBatch = async (batchId: string, payload: UpdateBatchInput) => {
  const response = await api.put(`/api/inventory/batches/${batchId}`, payload);
  return response.data;
};

export const deleteBatch = async (batchId: string) => {
  const response = await api.delete(`/api/inventory/batches/${batchId}`);
  return response.data;
};
