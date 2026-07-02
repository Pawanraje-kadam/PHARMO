import React from 'react';
import { Table } from '../../../shared/ui/Table';
import { Badge } from '../../../shared/ui/Badge';
import { AlertCircle, CalendarClock } from 'lucide-react';

interface SystemAlert {
  id: string;
  medicine_name: string;
  batch_number: string;
  type: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'SHORT_EXPIRY';
  details: string;
}

interface AlertsTableProps {
  alerts: SystemAlert[];
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-10 bg-white border border-slate-200 rounded-xl">
        <p className="text-sm text-slate-400 font-medium">✅ All active inventory lines are stable. No urgent alerts logged.</p>
      </div>
    );
  }

  return (
    <Table headers={['Medicine / Product', 'Batch Reference', 'Severity Rule', 'Observation Context']} minWidth="700px">
      {alerts.map((alert) => (
        <tr key={alert.id} className="hover:bg-slate-50/80 transition">
          <td className="p-4 font-bold text-slate-800">{alert.medicine_name}</td>
          <td className="p-4 text-xs font-mono font-semibold text-slate-500">{alert.batch_number}</td>
          <td className="p-4">
            <Badge 
              variant={alert.type === 'OUT_OF_STOCK' ? 'danger' : alert.type === 'SHORT_EXPIRY' ? 'warning' : 'info'}
              className="flex items-center gap-1 w-fit"
            >
              {alert.type === 'OUT_OF_STOCK' ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <CalendarClock className="w-3 h-3" />
              )}
              {alert.type.replace(/_/g, ' ')}
            </Badge>
          </td>
          <td className="p-4 text-xs font-medium text-slate-600">{alert.details}</td>
        </tr>
      ))}
    </Table>
  );
};