import React from 'react';
import { Button } from '../../../shared/ui/Button';

interface BillingSummaryProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isLoading: boolean;
}

export const BillingSummary: React.FC<BillingSummaryProps> = ({ total, itemCount, onCheckout, isLoading }) => {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4 shadow-md mt-auto">
      <div className="space-y-2 text-xs font-medium text-slate-400">
        <div className="flex justify-between">
          <span>Total Distinct Items</span>
          <span className="text-white font-semibold">{itemCount} items</span>
        </div>
        <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-bold text-slate-300">
          <span>Amount Payable</span>
          <span className="text-emerald-400 text-xl font-extrabold">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        isLoading={isLoading}
        disabled={itemCount === 0}
        onClick={onCheckout}
        className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 font-bold py-3 uppercase tracking-wider text-xs shadow-lg"
      >
        Process Checkout (F9)
      </Button>
    </div>
  );
};