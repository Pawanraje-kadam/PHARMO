import React from 'react';
import { Table } from '../../../shared/ui/Table';
import { Badge } from '../../../shared/ui/Badge';

interface InventoryTableProps {
  medicines: any[];
  onSelectMedicine?: (medicine: any) => void;
  selectedMedicineId?: string;
  onEditMedicine?: (medicine: any) => void;
  onDeleteMedicine?: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ 
  medicines, onSelectMedicine, selectedMedicineId, onEditMedicine, onDeleteMedicine 
}) => {
  if (medicines.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-white">
        <p className="text-sm text-slate-400 font-medium">No medicines registered in system inventory yet.</p>
        <p className="text-xs text-slate-300 mt-1">Add a medicine above, then click "Manage Stock" to add batches.</p>
      </div>
    );
  }

  return (
    <Table headers={['Brand Name', 'Active Ingredient', 'Manufacturer', 'Rack', 'Stock', 'Status', 'Actions']} minWidth="900px">
      {medicines.map((med) => {
        const totalStock = med.batches?.reduce((sum: number, b: any) => sum + b.quantity, 0) || 0;
        const isLowStock = totalStock <= med.min_stock_level;
        const isSelected = selectedMedicineId === med.id;

        return (
          <tr 
            key={med.id} 
            className={`transition text-xs sm:text-sm cursor-pointer ${
              isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-50/80'
            }`}
            onClick={() => onSelectMedicine?.(isSelected ? null : med)}
          >
            <td className="p-4 font-bold text-slate-800">{med.name}</td>
            <td className="p-4 text-slate-500 italic font-medium">{med.generic_name || 'N/A'}</td>
            <td className="p-4 text-slate-600 font-medium">{med.manufacturer || 'N/A'}</td>
            <td className="p-4 text-xs font-mono font-bold text-slate-700">
              {med.rack_location ? `${med.rack_location}` : 'Unassigned'}
            </td>
            <td className="p-4 font-bold text-slate-800">{totalStock} tablets</td>
            <td className="p-4">
              <Badge variant={totalStock === 0 ? 'danger' : isLowStock ? 'warning' : 'success'}>
                {totalStock === 0 ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
              </Badge>
            </td>
            <td className="p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectMedicine?.(med)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition ${
                    isSelected 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isSelected ? 'Close' : 'Manage Stock'}
                </button>
                {onEditMedicine && (
                  <button
                    type="button"
                    onClick={() => onEditMedicine(med)}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider px-2 py-1 rounded hover:bg-slate-100"
                  >
                    Edit
                  </button>
                )}
                {onDeleteMedicine && (
                  <button
                    type="button"
                    onClick={() => onDeleteMedicine(med.id)}
                    className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};
