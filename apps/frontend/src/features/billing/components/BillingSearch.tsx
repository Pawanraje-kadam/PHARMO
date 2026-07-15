import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../../../shared/ui/Input';
import { searchInventoryMedicines } from '../api/billing.api';

interface BillingSearchProps {
  onSelectItem: (item: any) => void;
}

export const BillingSearch: React.FC<BillingSearchProps> = ({ onSelectItem }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await searchInventoryMedicines(query);
        if (res.success) setResults(res.data);
      } catch (err) {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full">
      <Input
        ref={searchRef}
        label="Search Medicine / Batch (F1)"
        id="billing-search-input"
        placeholder="Type medicine brand or generic active ingredient name..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-50">
          {results.map((batch) => (
            <button
              key={batch.id}
              type="button"
              onClick={() => { onSelectItem(batch); setQuery(''); setIsOpen(false); }}
              className="w-full text-left p-3 hover:bg-slate-50 transition flex justify-between items-center text-xs"
            >
              <div>
                <p className="font-bold text-slate-800 text-sm">{batch.medicine.name}</p>
                <p className="text-slate-400 font-medium">
                  Batch: {batch.batch_number} • Exp: {new Date(batch.expiry_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-sm">₹{Number(batch.selling_price).toFixed(2)}</p>
                <p className={`font-semibold ${batch.quantity <= 10 ? 'text-amber-600' : 'text-slate-400'}`}>
                  Stock: {batch.quantity} units
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};