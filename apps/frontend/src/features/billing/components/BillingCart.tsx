import React from 'react';

interface CartItem {
  id: string; // Batch ID
  name: string;
  batch_number: string;
  selling_price: number;
  quantity: number;
  max_stock: number;
}

interface BillingCartProps {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export const BillingCart: React.FC<BillingCartProps> = ({ cart, onUpdateQty, onRemoveItem }) => {
  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <span className="text-3xl mb-2">🛒</span>
        <p className="text-sm text-slate-500 font-medium">Retail item basket is completely empty.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
      {cart.map((item) => (
        <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-sm">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-slate-800 truncate">{item.name}</h4>
            <p className="text-[11px] text-slate-400 font-medium">Batch: {item.batch_number} • ₹{item.selling_price.toFixed(2)}/unit</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-slate-600"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md font-bold text-slate-600"
            >
              +
            </button>
          </div>

          <div className="text-right min-w-[70px]">
            <p className="text-sm font-bold text-slate-800">₹{(item.selling_price * item.quantity).toFixed(2)}</p>
            <button
              type="button"
              onClick={() => onRemoveItem(item.id)}
              className="text-[10px] text-red-500 hover:text-red-700 font-semibold uppercase tracking-wide mt-0.5"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};