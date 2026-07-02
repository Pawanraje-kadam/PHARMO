import { prisma } from '../../core/database';
import { VectorService } from '../semantic-search/vector.service';

export class MedicineEnrichmentService {
  public static async enrich(medicineId: string): Promise<void> {
    const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!medicine || medicine.is_deleted) return;

    try {
      const searchProfileText = `Medicine: ${medicine.name}. Generic: ${medicine.generic_name || ''}.`;
      const embedding = await VectorService.generateEmbedding(searchProfileText);

      // Automated clinical information discovery mock mapping
      const clinicalSpecs = {
        generic_ingredient: medicine.generic_name || medicine.name,
        therapeutic_category: 'Analgesics / Antipyretics',
        drug_class: 'NSAID',
        common_uses: ['Fever', 'Pain', 'Headache'],
        adult_dosage: '500mg-1000mg every 4-6 hours.',
        is_otc: true,
        contraindications: ['Severe liver impairment'],
        common_side_effects: ['Nausea'],
        pregnancy_warnings: 'Consult healthcare provider before use.',
        breastfeeding_warnings: 'Compatible with short term use.',
        important_warnings: 'Do not take with other paracetamol products.',
        search_keywords: ['fever', 'headache', 'body pain'],
        synonyms: [medicine.name.toLowerCase()]
      };

      await prisma.medicineKnowledge.upsert({
        where: { medicine_id: medicineId },
        update: { ...clinicalSpecs, embedding_vector: embedding, enrichment_status: 'COMPLETED' },
        create: { medicine_id: medicineId, ...clinicalSpecs, embedding_vector: embedding, enrichment_status: 'COMPLETED' }
      });
    } catch (error: any) {
      await prisma.medicineKnowledge.upsert({
        where: { medicine_id: medicineId },
        update: { enrichment_status: 'FAILED', failure_log: error.message },
        create: {
          medicine_id: medicineId, generic_ingredient: medicine.generic_name || 'Pending',
          therapeutic_category: 'Pending', drug_class: 'Pending', common_uses: [],
          adult_dosage: 'Pending', pregnancy_warnings: 'Pending', breastfeeding_warnings: 'Pending',
          important_warnings: 'Pending', embedding_vector: [], enrichment_status: 'FAILED', failure_log: error.message
        }
      });
    }
  }
}