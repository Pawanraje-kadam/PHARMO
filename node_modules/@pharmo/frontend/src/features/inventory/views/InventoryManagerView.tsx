import React, { useState, useEffect } from 'react';
import { InventoryTable } from '../components/InventoryTable';
import { getInventoryMedicines, createNewMedicine } from '../api/inventory.api';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

export const InventoryManagerView: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [generic, setGeneric] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [rack, setRack] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await getInventoryMedicines();
      if (res.success) setMedicines(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await createNewMedicine({
        name: name.trim(),
        generic_name: generic.trim() || undefined,
        manufacturer: manufacturer.trim() || undefined,
        rack_location: rack.trim() || undefined,
        min_stock_level: Number(minStock) || 10
      });
      if (res.success) {
        setName(''); setGeneric(''); setManufacturer(''); setRack(''); setMinStock('10');
        fetchInventory(); // Reload table matrix
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create item.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
        <p className="text-sm text-slate-500 mt-1">Register formulations, inspect live quantities, and assign storage locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Form */}
        <form onSubmit={handleAddMedicine} className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b pb-2">Add New Product</h2>
          <Input label="Brand Name *" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Panadol Extra" />
          <Input label="Active Generic Name" value={generic} onChange={(e) => setGeneric(e.target.value)} placeholder="e.g., Paracetamol" />
          <Input label="Manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g., GSK" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Rack Position" value={rack} onChange={(e) => setRack(e.target.value)} placeholder="e.g., A-14" />
            <Input label="Min Alert Level" type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
          </div>
          <Button type="submit" isLoading={submitting} className="w-full text-xs uppercase tracking-wider py-2.5">
            Register Medicine
          </Button>
        </form>

        {/* Right Side Table Grid */}
        <div className="lg:col-span-8 space-y-2">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">⚠️ {error}</div>}
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-slate-200 rounded-lg"></div>
              <div className="h-40 bg-slate-200 rounded-lg"></div>
            </div>
          ) : (
            <InventoryTable medicines={medicines} />
          )}
        </div>
      </div>
    </div>
  );
};