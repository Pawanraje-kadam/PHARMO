import React, { useState } from 'react';
import { PatientSubmission } from '../api/ai-assistant.api';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

interface PatientFormProps {
  onSubmit: (data: PatientSubmission) => void;
  isLoading: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, isLoading }) => {
  const [complaint, setComplaint] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [weight, setWeight] = useState<number | ''>('');
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');

  const handleAddAllergy = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allergyInput.trim()) {
      e.preventDefault();
      if (!allergies.includes(allergyInput.trim().toUpperCase())) {
        setAllergies([...allergies, allergyInput.trim().toUpperCase()]);
      }
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (indexToRemove: number) => {
    setAllergies(allergies.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint || !age) return;

    onSubmit({
      complaint,
      age: Number(age),
      gender,
      weight: weight ? Number(weight) : undefined,
      pregnant: gender === 'FEMALE' ? pregnant : false,
      breastfeeding: gender === 'FEMALE' ? breastfeeding : false,
      known_allergies: allergies,
      additional_symptoms: additionalSymptoms || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Patient Profile & Symptoms</h2>
      
      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Primary Complaint *</label>
        <textarea
          required
          rows={3}
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="e.g., Severe stomach ache radiating down right side, loose motions"
          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Age (Years) *"
          type="number"
          required
          min={0}
          value={age}
          onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
        />
        <Input
          label="Weight (kg - Optional)"
          type="number"
          min={0}
          value={weight}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Gender</label>
        <div className="grid grid-cols-2 gap-2">
          {['MALE', 'FEMALE'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => { setGender(g as 'MALE' | 'FEMALE'); if (g === 'MALE') { setPregnant(false); setBreastfeeding(false); } }}
              className={`py-2 px-4 rounded-lg border text-sm font-medium transition ${
                gender === g 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {gender === 'FEMALE' && (
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 animate-fadeIn">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pregnant}
              onChange={(e) => setPregnant(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Patient is pregnant</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={breastfeeding}
              onChange={(e) => setBreastfeeding(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Patient is breastfeeding</span>
          </label>
        </div>
      )}

      <Input
        label="Known Drug Allergies"
        placeholder="Type name and press Enter (e.g., Paracetamol)"
        value={allergyInput}
        onChange={(e) => setAllergyInput(e.target.value)}
        onKeyDown={handleAddAllergy}
      />
      
      {allergies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {allergies.map((allergy, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs font-medium">
              {allergy}
              <button type="button" onClick={() => handleRemoveAllergy(idx)} className="text-red-500 hover:text-red-900 font-bold ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Additional Remarks / Symptoms</label>
        <textarea
          rows={2}
          value={additionalSymptoms}
          onChange={(e) => setAdditionalSymptoms(e.target.value)}
          placeholder="Optional notes regarding medical history..."
          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none resize-none transition"
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!complaint || !age}
        className="w-full py-3 tracking-wide uppercase text-xs"
      >
        Analyze Recommendations
      </Button>
    </form>
  );
};