import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getBatchesByMedicine, createBatch, updateBatch, deleteBatch } from '../api/inventory.api';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { X, Plus, Trash2, Edit2, Package, Calculator, TrendingUp } from 'lucide-react';

interface BatchManagerProps {
  medicine: any;
  onStockUpdated: () => void;
  onClose: () => void;
}

type PurchaseUnit = 'tablet' | 'strip' | 'box';
type PurchaseMode = 'total' | 'per_tablet';

export const BatchManager: React.FC<BatchManagerProps> = ({ medicine, onStockUpdated, onClose }) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);

  const [batchNumber, setBatchNumber] = useState('');
  const [purchaseUnit, setPurchaseUnit] = useState<PurchaseUnit>('tablet');
  const [unitsPerTablet, setUnitsPerTablet] = useState('1');
  const [quantity, setQuantity] = useState('');
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('per_tablet');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBatchesByMedicine(medicine.id);
      if (res.success) setBatches(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [medicine.id]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const totalStock = batches.reduce((sum: number, b: any) => sum + b.quantity, 0);

  const conversionFactor = useMemo(() => {
    if (purchaseUnit === 'tablet') return 1;
    const val = Number(unitsPerTablet);
    return val > 0 ? val : 1;
  }, [purchaseUnit, unitsPerTablet]);

  const computed = useMemo(() => {
    const qty = Number(quantity) || 0;
    const price = Number(purchasePrice) || 0;
    const sell = Number(sellingPrice) || 0;
    const totalTablets = qty * conversionFactor;
    let costPerTablet = 0;
    let totalPurchasePrice = 0;

    if (purchaseMode === 'total') {
      totalPurchasePrice = price;
      costPerTablet = totalTablets > 0 ? price / totalTablets : 0;
    } else {
      costPerTablet = price;
      totalPurchasePrice = price * totalTablets;
    }

    const expectedRevenue = totalTablets * sell;
    const expectedProfit = expectedRevenue - totalPurchasePrice;
    const profitMargin = expectedRevenue > 0 ? (expectedProfit / expectedRevenue) * 100 : 0;

    return { totalTablets, costPerTablet, totalPurchasePrice, expectedRevenue, expectedProfit, profitMargin };
  }, [quantity, purchasePrice, sellingPrice, purchaseMode, conversionFactor]);

  const resetForm = () => {
    setBatchNumber('');
    setPurchaseUnit('tablet');
    setUnitsPerTablet('1');
    setQuantity('');
    setPurchaseMode('per_tablet');
    setPurchasePrice('');
    setSellingPrice('');
    setExpiryDate('');
    setEditingBatch(null);
    setShowAddForm(false);
  };

  const handleEditBatch = (batch: any) => {
    setEditingBatch(batch);
    setBatchNumber(batch.batch_number);

    const unit: PurchaseUnit = batch.purchase_unit || 'tablet';
    const factor = batch.units_per_tablet || 1;
    setPurchaseUnit(unit);
    setUnitsPerTablet(String(factor));

    const internalQty = batch.quantity;
    const displayQty = unit === 'tablet' ? internalQty : internalQty / factor;
    setQuantity(String(displayQty));

    setPurchaseMode('per_tablet');
    setPurchasePrice(String(Number(batch.buying_price)));
    setSellingPrice(String(Number(batch.selling_price)));
    setExpiryDate(new Date(batch.expiry_date).toISOString().split('T')[0]);
    setShowAddForm(true);
  };

  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNumber.trim() || !quantity || !purchasePrice || !sellingPrice || !expiryDate) return;
    if (Number(quantity) <= 0 || Number(purchasePrice) <= 0 || Number(sellingPrice) <= 0) return;

    setSubmitting(true);
    try {
      const tabletQuantity = computed.totalTablets;
      const costPerTablet = computed.costPerTablet;

      if (editingBatch) {
        await updateBatch(editingBatch.id, {
          quantity: tabletQuantity,
          buying_price: costPerTablet,
          selling_price: Number(sellingPrice),
          expiry_date: expiryDate,
          purchase_unit: purchaseUnit,
          units_per_tablet: conversionFactor
        });
      } else {
        await createBatch(medicine.id, {
          batch_number: batchNumber.trim(),
          quantity: tabletQuantity,
          buying_price: costPerTablet,
          selling_price: Number(sellingPrice),
          expiry_date: expiryDate,
          purchase_unit: purchaseUnit,
          units_per_tablet: conversionFactor
        });
      }
      resetForm();
      fetchBatches();
      onStockUpdated();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save batch.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!window.confirm('Delete this batch? Stock from this batch will be removed.')) return;
    try {
      await deleteBatch(batchId);
      fetchBatches();
      onStockUpdated();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete batch.');
    }
  };

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Batch Management — {medicine.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Total Stock: <span className={`font-bold ${totalStock === 0 ? 'text-red-600' : totalStock <= medicine.min_stock_level ? 'text-amber-600' : 'text-emerald-600'}`}>
                {totalStock} tablets
              </span>
              {' • '}Min Level: {medicine.min_stock_level} | Generic: {medicine.generic_name || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!showAddForm && (
            <Button onClick={() => { resetForm(); setShowAddForm(true); }} className="text-xs uppercase tracking-wider py-1.5">
              <Plus className="w-3 h-3 mr-1 inline" /> Add Batch
            </Button>
          )}
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmitBatch} className="p-5 bg-blue-50/30 border-b border-slate-200 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              {editingBatch ? 'Edit Batch' : 'New Batch'}
            </h4>
            <button type="button" onClick={resetForm} className="text-xs font-semibold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input label="Batch Number *" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} placeholder="e.g., BT-2024-001" disabled={!!editingBatch} required />
            <Input label="Expiry Date *" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Purchase Unit</label>
              <select
                value={purchaseUnit}
                onChange={(e) => {
                  const val = e.target.value as PurchaseUnit;
                  setPurchaseUnit(val);
                  if (val === 'tablet') setUnitsPerTablet('1');
                }}
                className="w-full p-2.5 border rounded-lg text-sm outline-none transition bg-white border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tablet">Tablet</option>
                <option value="strip">Strip</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>

          {purchaseUnit !== 'tablet' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Input
                label={`Units per ${purchaseUnit === 'strip' ? 'Strip' : 'Box'} *`}
                type="number"
                min="1"
                step="1"
                value={unitsPerTablet}
                onChange={(e) => setUnitsPerTablet(e.target.value)}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input
              label={`Quantity (${purchaseUnit === 'tablet' ? 'Tablets' : purchaseUnit === 'strip' ? 'Strips' : 'Boxes'}) *`}
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Purchase Price Mode</label>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPurchaseMode('per_tablet')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    purchaseMode === 'per_tablet'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Price / Tablet
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseMode('total')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    purchaseMode === 'total'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Total Price
                </button>
              </div>
            </div>
            <Input
              label={purchaseMode === 'per_tablet' ? 'Price Per Tablet (₹) *' : 'Total Purchase Price (₹) *'}
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Input
              label="Selling Price Per Tablet (₹) *"
              type="number"
              step="0.01"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">Purchase Summary</h5>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Tablets</p>
                <p className="text-sm font-bold text-slate-800">{computed.totalTablets.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Cost Per Tablet</p>
                <p className="text-sm font-bold text-slate-800">₹{fmt(computed.costPerTablet)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Purchase Price</p>
                <p className="text-sm font-bold text-slate-800">₹{fmt(computed.totalPurchasePrice)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Expected Revenue</p>
                <p className="text-sm font-bold text-emerald-700">₹{fmt(computed.expectedRevenue)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Expected Profit</p>
                <p className={`text-sm font-bold ${computed.expectedProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  ₹{fmt(computed.expectedProfit)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Profit Margin</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-slate-400" />
                  <p className={`text-sm font-bold ${computed.profitMargin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {fmt(computed.profitMargin)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" isLoading={submitting} className="text-xs uppercase tracking-wider py-2">
              {editingBatch ? 'Update Batch' : 'Create Batch'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm} className="text-xs uppercase tracking-wider py-2">
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="p-5">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No batches registered for this medicine.</p>
            <p className="text-xs text-slate-300 mt-1">Click "Add Batch" above to add stock quantity.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {batches.map((batch: any) => {
              const isExpired = new Date(batch.expiry_date) <= new Date();
              const isLow = batch.quantity <= 0;
              const unit: PurchaseUnit = batch.purchase_unit || 'tablet';
              const factor = batch.units_per_tablet || 1;
              const displayQty = unit === 'tablet' ? batch.quantity : batch.quantity / factor;

              return (
                <div key={batch.id} className={`flex items-center justify-between p-3 rounded-xl border transition ${
                  isExpired ? 'border-red-200 bg-red-50/50' : isLow ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-700">{batch.batch_number}</span>
                      {isExpired && <Badge variant="danger">Expired</Badge>}
                      {isLow && !isExpired && <Badge variant="warning">Empty</Badge>}
                      {unit !== 'tablet' && (
                        <Badge variant="info">{displayQty} {unit === 'strip' ? 'Strips' : 'Boxes'} ({batch.quantity} tabs)</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                      <span>Qty: <span className={`font-bold ${isLow ? 'text-red-600' : 'text-slate-800'}`}>{batch.quantity} tablets</span></span>
                      <span>Buy: ₹{Number(batch.buying_price).toFixed(2)}/tab</span>
                      <span>Sell: ₹{Number(batch.selling_price).toFixed(2)}/tab</span>
                      <span>Exp: {new Date(batch.expiry_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleEditBatch(batch)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
