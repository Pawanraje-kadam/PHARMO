import React, { useState } from 'react';
import { BillingSearch } from '../components/BillingSearch';
import { BillingCart } from '../components/BillingCart';
import { BillingSummary } from '../components/BillingSummary';
import { useBillingHotkeys } from '../hooks/useBillingHotkeys';
import { submitCheckoutInvoice } from '../api/billing.api';

export const BillingDashboardView: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSelectItem = (batch: any) => {
    setStatus(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === batch.id);
      if (existing) {
        if (existing.quantity >= batch.quantity) return prev;
        return prev.map((item) => item.id === batch.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: batch.id,
        name: batch.medicine.name,
        batch_number: batch.batch_number,
        selling_price: Number(batch.selling_price),
        quantity: 1,
        max_stock: batch.quantity
      }];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) { handleRemoveItem(id); return; }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.min(qty, item.max_stock) } : item));
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0 || loading) return;
    setLoading(true);
    setStatus(null);
    try {
      const payload = cart.map((i) => ({ batch_id: i.id, quantity: i.quantity }));
      const res = await submitCheckoutInvoice(payload);
      if (res.success) {
        setCart([]);
        setStatus({ success: true, msg: `Invoice #${res.data.id.slice(0,8).toUpperCase()} processed successfully!` });
      } else {
        setStatus({ success: false, msg: res.error || 'Transaction rejected.' });
      }
    } catch (err: any) {
      setStatus({ success: false, msg: err.response?.data?.error || 'Server processing connection timeout.' });
    } finally {
      setLoading(false);
    }
  };

  // Bind key sequences to high speed hotkeys
  useBillingHotkeys([
    { key: 'F1', callback: () => document.getElementById('billing-search-input')?.focus() },
    { key: 'F9', callback: handleCheckoutSubmit },
    { key: 'Escape', callback: () => setCart([]) }
  ]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing Counter</h1>
        <p className="text-sm text-slate-500 mt-1">
          POS Cashier Outpost. Press <kbd className="bg-slate-200 px-1 rounded text-xs font-bold">F1</kbd> to search, <kbd className="bg-slate-200 px-1 rounded text-xs font-bold">F9</kbd> to pay, <kbd className="bg-slate-200 px-1 rounded text-xs font-bold">ESC</kbd> to purge.
        </p>
      </div>

      {status && (
        <div className={`p-4 rounded-lg text-sm font-semibold animate-fadeIn border ${
          status.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {status.success ? '✨ ' : '❌ Alert: '}{status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col min-h-[450px]">
          <BillingSearch onSelectItem={handleSelectItem} />
          <BillingCart cart={cart} onUpdateQty={handleUpdateQty} onRemoveItem={handleRemoveItem} />
        </div>
        <div className="lg:col-span-5 h-full">
          <BillingSummary total={cartTotal} itemCount={cart.length} onCheckout={handleCheckoutSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};