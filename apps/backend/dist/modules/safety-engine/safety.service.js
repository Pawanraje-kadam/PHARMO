"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyService = void 0;
const vector_service_1 = require("../semantic-search/vector.service");
const groq_service_1 = require("../../core/groq.service");
class SafetyService {
    static async evaluate(patient, medicines) {
        const queryText = `${patient.complaint} ${patient.additional_symptoms || ''}`;
        const patientEmbedding = await vector_service_1.VectorService.generateEmbedding(queryText);
        const results = [];
        let groqAnalysis = null;
        if (groq_service_1.GroqService.isAvailable()) {
            try {
                groqAnalysis = await groq_service_1.GroqService.analyzeSymptoms(patient.complaint, patient.age, patient.gender, patient.additional_symptoms || '', patient.known_allergies, medicines
                    .filter((m) => m.ai_knowledge)
                    .map((m) => ({
                    name: m.name,
                    genericName: m.generic_name,
                    category: m.ai_knowledge.therapeutic_category,
                    isOtc: m.ai_knowledge.is_otc,
                })));
            }
            catch {
                groqAnalysis = null;
            }
        }
        for (const med of medicines) {
            if (!med.ai_knowledge)
                continue;
            const knowledge = med.ai_knowledge;
            const warnings = [];
            let isSafe = true;
            const totalStock = med.batches.reduce((sum, b) => sum + (new Date(b.expiry_date) > new Date() ? b.quantity : 0), 0);
            if (totalStock <= 0)
                continue;
            const semanticScore = vector_service_1.VectorService.cosineSimilarity(patientEmbedding, knowledge.embedding_vector);
            let matchScore = Math.round(((semanticScore + 1) / 2) * 100);
            const hasAllergyConflict = patient.known_allergies.some(a => knowledge.generic_ingredient.toUpperCase().includes(a.toUpperCase()) || med.name.toUpperCase().includes(a.toUpperCase()));
            if (hasAllergyConflict) {
                isSafe = false;
                warnings.push('CRITICAL: Matches a recorded patient drug allergy.');
            }
            if (patient.pregnant && (knowledge.pregnancy_warnings.toUpperCase().includes('AVOID') || knowledge.pregnancy_warnings.toUpperCase().includes('CONTRAINDICATED'))) {
                isSafe = false;
                warnings.push('CRITICAL: Contraindicated during pregnancy.');
            }
            if (groqAnalysis) {
                if (groqAnalysis.warnings.some((w) => med.name.toLowerCase().includes(w.toLowerCase().split(' ')[0]?.toLowerCase() || ''))) {
                    isSafe = false;
                }
                if (!groqAnalysis.recommendedMedicines.includes(med.name)) {
                    matchScore = Math.max(10, matchScore - 20);
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
exports.SafetyService = SafetyService;
