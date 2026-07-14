import React, { useState, useEffect, useCallback } from 'react';
import { InventoryTable } from '../components/InventoryTable';
import { BatchManager } from '../components/BatchManager';
import { 
  getInventoryMedicines, createNewMedicine, updateMedicine, deleteMedicine 
} from '../api/inventory.api';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

export const InventoryManagerView: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);

  const [name, setName] = useState('');
  const [generic, setGeneric] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [rack, setRack] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInventoryMedicines();
      if (res.success) setMedicines(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const resetForm = () => {
    setName(''); setGeneric(''); setManufacturer(''); setRack(''); setMinStock('10');
    setEditingMedicine(null);
    setShowAddForm(false);
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      let res;
      if (editingMedicine) {
        res = await updateMedicine(editingMedicine.id, {
          name: name.trim(),
          generic_name: generic.trim() || undefined,
          manufacturer: manufacturer.trim() || undefined,
          rack_location: rack.trim() || undefined,
          min_stock_level: Number(minStock) || 10
        });
      } else {
        res = await createNewMedicine({
          name: name.trim(),
          generic_name: generic.trim() || undefined,
          manufacturer: manufacturer.trim() || undefined,
          rack_location: rack.trim() || undefined,
          min_stock_level: Number(minStock) || 10
        });
      }
      if (res.success) {
        resetForm();
        fetchInventory();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save medicine.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMedicine = (med: any) => {
    setEditingMedicine(med);
    setName(med.name);
    setGeneric(med.generic_name || '');
    setManufacturer(med.manufacturer || '');
    setRack(med.rack_location || '');
    setMinStock(String(med.min_stock_level || 10));
    setShowAddForm(true);
    setSelectedMedicine(null);
  };

  const handleDeleteMedicine = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this medicine from inventory?')) return;
    try {
      await deleteMedicine(id);
      setSelectedMedicine(null);
      fetchInventory();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete medicine.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-sm text-slate-500 mt-1">Register formulations, manage stock batches, and assign storage locations.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => { resetForm(); setShowAddForm(true); }} className="text-xs uppercase tracking-wider">
            + Add Medicine
          </Button>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">⚠️ {error}</div>}

      {showAddForm && (
        <form onSubmit={handleAddMedicine} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              {editingMedicine ? 'Edit Medicine' : 'Add New Product'}
            </h2>
            <button type="button" onClick={resetForm} className="text-xs font-semibold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Brand Name *" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Panadol Extra" />
            <Input label="Active Generic Name" value={generic} onChange={(e) => setGeneric(e.target.value)} placeholder="e.g., Paracetamol" />
            <Input label="Manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g., GSK" />
            <Input label="Rack Position" value={rack} onChange={(e) => setRack(e.target.value)} placeholder="e.g., A-14" />
            <Input label="Min Alert Level" type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" isLoading={submitting} className="text-xs uppercase tracking-wider py-2.5">
              {editingMedicine ? 'Update Medicine' : 'Register Medicine'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm} className="text-xs uppercase tracking-wider py-2.5">
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg"></div>
            <div className="h-40 bg-slate-200 rounded-lg"></div>
          </div>
        ) : (
          <InventoryTable 
            medicines={medicines} 
            onSelectMedicine={setSelectedMedicine}
            selectedMedicineId={selectedMedicine?.id}
            onEditMedicine={handleEditMedicine}
            onDeleteMedicine={handleDeleteMedicine}
          />
        )}
      </div>

      {selectedMedicine && (
        <BatchManager 
          medicine={selectedMedicine} 
          onStockUpdated={fetchInventory}
          onClose={() => setSelectedMedicine(null)}
        />
      )}
    </div>
  );
};
