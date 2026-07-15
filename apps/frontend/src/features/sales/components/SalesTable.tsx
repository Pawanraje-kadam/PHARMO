import React, { useState } from 'react';
import { Table } from '../../../shared/ui/Table';

interface SalesTableProps {
  sales: any[];
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales }) => {
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  if (sales.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-white">
        <p className="text-sm text-slate-400 font-medium">No operational sales transactions logged for the given filters.</p>
      </div>
    );
  }

  return (
    <Table headers={['Invoice ID', 'Cashier Station', 'Timestamp', 'Gross Revenue', 'Actions']} minWidth="750px">
      {sales.map((sale) => {
        const isExpanded = expandedSaleId === sale.id;
        
        return (
          <React.Fragment key={sale.id}>
            <tr className="hover:bg-slate-50/80 transition">
              <td className="p-4 font-mono font-bold text-blue-600 text-xs">
                #{sale.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="p-4 font-semibold text-slate-700 uppercase text-xs">
                👤 {sale.user?.username || 'Staff Console'}
              </td>
              <td className="p-4 text-xs text-slate-500 font-medium">
                {new Date(sale.created_at).toLocaleString()}
              </td>
              <td className="p-4 font-extrabold text-slate-900">
                ₹{Number(sale.total_amount).toFixed(2)}
              </td>
              <td className="p-4">
                <button
                  type="button"
                  onClick={() => setExpandedSaleId(isExpanded ? null : sale.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                >
                  {isExpanded ? 'Hide Details' : 'View Basket Item Rows'}
                </button>
              </td>
            </tr>

            {/* Nested Item Sub-Grid Row */}
            {isExpanded && (
              <tr className="bg-slate-50/50">
                <td colSpan={5} className="p-4 border-t border-b border-slate-200">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 max-w-2xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">Invoice Item Rows Breakdown</h4>
                    <div className="divide-y divide-slate-100 text-xs">
                      {sale.items?.map((item: any) => (
                        <div key={item.id} className="py-2 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{item.batch?.medicine?.name || 'Unlinked Product'}</p>
                            <p className="text-slate-400 font-medium">Batch Num: {item.batch?.batch_number || 'N/A'}</p>
                          </div>
                          <div className="text-right font-medium text-slate-600">
                            <span>{item.quantity} units x ₹{Number(item.unit_price).toFixed(2)}</span>
                            <p className="font-bold text-slate-900">₹{Number(item.subtotal).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </Table>
  );
};