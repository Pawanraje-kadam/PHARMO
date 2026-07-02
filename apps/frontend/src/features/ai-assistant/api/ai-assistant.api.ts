import { api } from '../../../core/api';

export interface PatientSubmission {
  complaint: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  weight?: number;
  pregnant?: boolean;
  breastfeeding?: boolean;
  known_allergies: string[];
  additional_symptoms?: string;
}

export const analyzeSymptoms = async (payload: PatientSubmission) => {
  const response = await api.post('/medicine-ai/analyze', payload);
  return response.data;
};