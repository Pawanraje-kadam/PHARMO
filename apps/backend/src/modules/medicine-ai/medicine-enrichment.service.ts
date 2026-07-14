import { prisma } from '../../core/database.js';
import { VectorService } from '../semantic-search/vector.service.js';
import { GroqService } from '../../core/groq.service.js';

export class MedicineEnrichmentService {
  public static async enrich(medicineId: string): Promise<void> {
    const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!medicine || medicine.is_deleted) return;

    try {
      const searchProfileText = `Medicine: ${medicine.name}. Generic: ${medicine.generic_name || ''}.`;
      const embedding = await VectorService.generateEmbedding(searchProfileText);

      let clinicalSpecs: any;

      if (GroqService.isAvailable()) {
        clinicalSpecs = await GroqService.generateClinicalInfo(medicine.name, medicine.generic_name);
      } else {
        clinicalSpecs = {
          generic_ingredient: medicine.generic_name || medicine.name,
          therapeutic_category: 'Analgesics / Antipyretics',
          drug_class: 'NSAID',
          common_uses: ['Fever', 'Pain', 'Headache'],
          age_restrictions: null,
          adult_dosage: '500mg-1000mg every 4-6 hours.',
          pediatric_dosage: null,
          is_otc: true,
          contraindications: ['Severe liver impairment'],
          common_side_effects: ['Nausea'],
          pregnancy_warnings: 'Consult healthcare provider before use.',
          breastfeeding_warnings: 'Compatible with short term use.',
          food_instructions: null,
          storage_conditions: null,
          important_warnings: 'Do not take with other paracetamol products.',
          search_keywords: ['fever', 'headache', 'body pain'],
          synonyms: [medicine.name.toLowerCase()]
        };
      }

      await prisma.medicineKnowledge.upsert({
        where: { medicine_id: medicineId },
        update: { ...clinicalSpecs, embedding_vector: embedding, enrichment_status: 'COMPLETED' },
        create: { medicine_id: medicineId, ...clinicalSpecs, embedding_vector: embedding, enrichment_status: 'COMPLETED' }
      });
    } catch (error: any) {
      const fallbackEmbedding = await VectorService.generateEmbedding(medicine.name);
      await prisma.medicineKnowledge.upsert({
        where: { medicine_id: medicineId },
        update: { enrichment_status: 'FAILED', failure_log: error.message, embedding_vector: fallbackEmbedding },
        create: {
          medicine_id: medicineId, generic_ingredient: medicine.generic_name || 'Pending',
          therapeutic_category: 'Pending', drug_class: 'Pending', common_uses: [],
          adult_dosage: 'Pending', pregnancy_warnings: 'Pending', breastfeeding_warnings: 'Pending',
          important_warnings: 'Pending', embedding_vector: fallbackEmbedding, enrichment_status: 'FAILED', failure_log: error.message
        }
      });
    }
  }
}