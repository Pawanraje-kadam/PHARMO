import React from 'react';
import { Table } from '../../../shared/ui/Table';
import { Badge } from '../../../shared/ui/Badge';

interface InventoryTableProps {
  medicines: any[];
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ medicines }) => {
  if (medicines.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-white">
        <p className="text-sm text-slate-400 font-medium">No medicines registered in system inventory yet.</p>
      </div>
    );
  }

  return (
    <Table headers={['Brand Name', 'Active Ingredient', 'Manufacturer', 'Rack Location', 'Available Stock', 'Status']} minWidth="800px">
      {medicines.map((med) => {
        // Compute total quantity across active stock batches
        const totalStock = med.batches?.reduce((sum: number, b: any) => sum + b.quantity, 0) || 0;
        const isLowStock = totalStock <= med.min_stock_level;

        return (
          <tr key={med.id} className="hover:bg-slate-50/80 transition text-xs sm:text-sm">
            <td className="p-4 font-bold text-slate-800">{med.name}</td>
            <td className="p-4 text-slate-500 italic font-medium">{med.generic_name || 'N/A'}</td>
            <td className="p-4 text-slate-600 font-medium">{med.manufacturer || 'N/A'}</td>
            <td className="p-4 text-xs font-mono font-bold text-slate-700">
              {med.rack_location ? `📍 ${med.rack_location}` : 'Unassigned'}
            </td>
            <td className="p-4 font-bold text-slate-800">{totalStock} units</td>
            <td className="p-4">
              <Badge variant={totalStock === 0 ? 'danger' : isLowStock ? 'warning' : 'success'}>
                {totalStock === 0 ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Stable'}
              </Badge>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};