import { VectorService } from '../semantic-search/vector.service';

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

    for (const med of medicines) {
      if (!med.ai_knowledge) continue;

      const knowledge = med.ai_knowledge;
      const warnings: string[] = [];
      let isSafe = true;

      const totalStock = med.batches.reduce((sum: number, b: any) => sum + (new Date(b.expiry_date) > new Date() ? b.quantity : 0), 0);
      if (totalStock <= 0) continue;

      const semanticScore = VectorService.cosineSimilarity(patientEmbedding, knowledge.embedding_vector);
      let matchScore = Math.round(((semanticScore + 1) / 2) * 100);

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

      matchScore = isSafe ? matchScore : Math.max(10, matchScore - 40);

      results.push({
        medicine_id: med.id,
        name: med.name,
        generic_name: med.generic_name,
        match_score: matchScore,
        is_safe: isSafe,
        warnings,
        details: {
          therapeutic_category: knowledge.therapeutic_category,
          adult_dosage: knowledge.adult_dosage,
          pediatric_dosage: knowledge.pediatric_dosage,
          is_otc: knowledge.is_otc,
          important_warnings: knowledge.important_warnings
        },
        inventory: { stock_available: totalStock, batch_number: med.batches[0]?.batch_number || 'N/A' }
      });
    }

    return results.sort((a, b) => b.match_score - a.match_score);
  }
}