import { VectorService } from '../semantic-search/vector.service.js';
import { GroqService } from '../../core/groq.service.js';

export interface PatientProfile {
  complaint: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  pregnant?: boolean;
  breastfeeding?: boolean;
  known_allergies: string[];
  additional_symptoms?: string;
}

export class SafetyService {
  public static async evaluate(patient: PatientProfile, medicines: any[]): Promise<any[]> {
    const queryText = `${patient.complaint} ${patient.additional_symptoms || ''}`;
    const patientEmbedding = await VectorService.generateEmbedding(queryText);
    const results: any[] = [];

    let groqAnalysis: { analysis: string; recommendedMedicines: string[]; warnings: string[]; explanation: string } | null = null;

    if (GroqService.isAvailable()) {
      try {
        groqAnalysis = await GroqService.analyzeSymptoms(
          patient.complaint,
          patient.age,
          patient.gender,
          patient.additional_symptoms || '',
          patient.known_allergies,
          medicines
            .filter((m: any) => m.ai_knowledge)
            .map((m: any) => ({
              name: m.name,
              genericName: m.generic_name,
              category: m.ai_knowledge.therapeutic_category,
              isOtc: m.ai_knowledge.is_otc,
            }))
        );
      } catch {
        groqAnalysis = null;
      }
    }

    for (const med of medicines) {
      const knowledge = med.ai_knowledge;
      const warnings: string[] = [];
      let isSafe = true;
      let matchScore = 0;

      const totalStock = med.batches.reduce((sum: number, b: any) => {
        if (new Date(b.expiry_date) > new Date()) {
          return sum + b.quantity;
        }
        return sum;
      }, 0);
      if (totalStock <= 0) continue;

      if (knowledge) {
        const semanticScore = VectorService.cosineSimilarity(patientEmbedding, knowledge.embedding_vector);
        matchScore = Math.round(((semanticScore + 1) / 2) * 100);

        const hasAllergyConflict = patient.known_allergies.some(a =>
          knowledge.generic_ingredient.toUpperCase().includes(a.toUpperCase()) || med.name.toUpperCase().includes(a.toUpperCase())
        );
        if (hasAllergyConflict) {
          isSafe = false;
          warnings.push('CRITICAL: Matches a recorded patient drug allergy.');
        }

        if (patient.pregnant && (knowledge.pregnancy_warnings.toUpperCase().includes('AVOID') || knowledge.pregnancy_warnings.toUpperCase().includes('CONTRAINDICATED'))) {
          isSafe = false;
          warnings.push('CRITICAL: Contraindicated during pregnancy.');
        }
      } else {
        matchScore = 30;

        const hasAllergyConflict = patient.known_allergies.some(a =>
          med.name.toUpperCase().includes(a.toUpperCase()) || (med.generic_name && med.generic_name.toUpperCase().includes(a.toUpperCase()))
        );
        if (hasAllergyConflict) {
          isSafe = false;
          warnings.push('CRITICAL: Name matches a recorded patient drug allergy.');
        }
      }

      if (groqAnalysis) {
        if (groqAnalysis.recommendedMedicines.some((rec: string) => med.name.toLowerCase().includes(rec.toLowerCase()))) {
          matchScore = Math.min(100, matchScore + 25);
        } else if (groqAnalysis.recommendedMedicines.length > 0) {
          matchScore = Math.max(10, matchScore - 15);
        }
        if (groqAnalysis.warnings.some((w: string) => med.name.toLowerCase().includes(w.toLowerCase().split(' ')[0]?.toLowerCase() || ''))) {
          isSafe = false;
        }
      }

      matchScore = isSafe ? matchScore : Math.max(10, matchScore - 40);

      results.push({
        medicine_id: med.id,
        name: med.name,
        generic_name: med.generic_name,
        match_score: matchScore,
        is_safe: isSafe,
        warnings,
        groq_analysis: groqAnalysis ? { analysis: groqAnalysis.analysis, explanation: groqAnalysis.explanation } : null,
        details: {
          therapeutic_category: knowledge?.therapeutic_category || 'Unclassified',
          adult_dosage: knowledge?.adult_dosage || 'Consult physician for dosage.',
          pediatric_dosage: knowledge?.pediatric_dosage || null,
          is_otc: knowledge?.is_otc ?? true,
          important_warnings: knowledge?.important_warnings || 'Consult a healthcare professional before use.'
        },
        inventory: { stock_available: totalStock, batch_number: med.batches[0]?.batch_number || 'N/A' }
      });
    }

    return results.sort((a, b) => b.match_score - a.match_score);
  }
}
