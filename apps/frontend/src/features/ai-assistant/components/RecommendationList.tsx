import React from 'react';
import { Badge } from '../../../shared/ui/Badge';

interface RecommendationItem {
  medicine_id: string;
  name: string;
  generic_name: string;
  match_score: number;
  is_safe: boolean;
  warnings: string[];
  details: {
    therapeutic_category: string;
    adult_dosage: string;
    pediatric_dosage?: string;
    is_otc: boolean;
    important_warnings: string;
  };
  inventory: {
    stock_available: number;
    batch_number: string;
  };
}

interface RecommendationListProps {
  data: RecommendationItem[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <p className="text-sm text-slate-500 font-medium">No inventory matches found for the parsed query criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div 
          key={item.medicine_id}
          className={`p-5 rounded-xl border transition shadow-sm bg-white hover:shadow-md ${
            item.is_safe ? 'border-slate-200' : 'border-red-200 bg-red-50/10'
          }`}
        >
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                <Badge variant={item.details.is_otc ? 'success' : 'warning'}>
                  {item.details.is_otc ? 'OTC' : 'Rx - Prescription'}
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-500 italic mt-0.5">🧑‍🔬 {item.generic_name}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <span className={`inline-flex items-center justify-center font-bold text-sm px-2.5 py-1 rounded-lg ${
                item.match_score >= 80 ? 'bg-emerald-500 text-white' : item.match_score >= 50 ? 'bg-blue-600 text-white' : 'bg-slate-600 text-white'
              }`}>
                {item.match_score}% Match
              </span>
            </div>
          </div>

          {!item.is_safe && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-700 space-y-1">
              {item.warnings.map((warn, index) => (
                <p key={index} className="font-semibold flex items-center gap-1.5">⚠️ {warn}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs mt-3 border-t border-slate-100 pt-3">
            <div>
              <p className="text-slate-500 font-medium mb-0.5">Classification</p>
              <p className="text-slate-800 font-semibold">{item.details.therapeutic_category}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium mb-0.5">Available Stock</p>
              <p className={`font-bold ${item.inventory.stock_available <= 15 ? 'text-amber-600' : 'text-slate-800'}`}>
                {item.inventory.stock_available} units
              </p>
            </div>
          </div>

          <div className="text-xs mt-3 bg-slate-50 p-3 rounded-lg space-y-1.5">
            <p className="text-slate-700"><strong className="text-slate-900 font-medium">Adult Dosage Ref:</strong> {item.details.adult_dosage}</p>
            {item.details.pediatric_dosage && (
              <p className="text-slate-700"><strong className="text-slate-900 font-medium">Pediatric Dosage Ref:</strong> {item.details.pediatric_dosage}</p>
            )}
            <p className="text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 mt-2">
              <strong className="text-slate-800 font-medium">Safety Note:</strong> {item.details.important_warnings}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};