import { api } from '../../../core/api';

export interface CheckoutItem {
  batch_id: string;
  quantity: number;
}

export const searchInventoryMedicines = async (query: string) => {
  // Query active medicine batches that have current available stock balances
  const response = await api.get(`/api/inventory/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const submitCheckoutInvoice = async (items: CheckoutItem[]) => {
  const response = await api.post('/api/billing/checkout', { items });
  return response.data;
};