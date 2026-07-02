import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { VectorService } from '../src/modules/semantic-search/vector.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding PHARMO database variables...');

  // 1. Clear existing dataset entries to avoid conflict traces
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.medicineKnowledge.deleteMany({});
  await prisma.medicine.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Hydrate System Users
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
  const cashierPasswordHash = await bcrypt.hash('cashier123', saltRounds);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password_hash: adminPasswordHash,
      role: Role.ADMIN,
      is_active: true,
    },
  });

  await prisma.user.create({
    data: {
      username: 'cashier01',
      password_hash: cashierPasswordHash,
      role: Role.CASHIER,
      is_active: true,
    },
  });

  console.log('👥 Standard authentication user accounts seeded.');

  // 3. Define Master Medications & Mock Clinical Profiles
  const medicineData = [
    {
      name: 'Amoxicillin 500mg',
      generic_name: 'Amoxicillin',
      manufacturer: 'Sandoz',
      rack_location: 'A-12',
      min_stock_level: 20,
      knowledge: {
        generic_ingredient: 'Amoxicillin',
        therapeutic_category: 'Antibiotics',
        drug_class: 'Penicillin derivative',
        common_uses: ['Bacterial infection', 'Strep throat', 'Ear infection', 'Pneumonia'],
        adult_dosage: '500mg three times daily for 7-10 days.',
        pediatric_dosage: '20-40mg/kg/day split into three individual doses.',
        is_otc: false,
        contraindications: ['Penicillin allergy', 'Hypersensitivity'],
        common_side_effects: ['Diarrhea', 'Nausea', 'Skin rash'],
        pregnancy_warnings: 'Category B: Generally safe. Use only if clearly needed.',
        breastfeeding_warnings: 'Compatible. Excreted in trace amounts in milk.',
        important_warnings: 'Complete the full prescribed course even if symptoms disappear early.',
      }
    },
    {
      name: 'Panadol Extra',
      generic_name: 'Paracetamol / Caffeine',
      manufacturer: 'GSK',
      rack_location: 'B-04',
      min_stock_level: 50,
      knowledge: {
        generic_ingredient: 'Paracetamol',
        therapeutic_category: 'Analgesics / Antipyretics',
        drug_class: 'Non-opioid analgesic',
        common_uses: ['Fever reduction', 'Headache', 'Migraine', 'Toothache', 'Muscle pain'],
        adult_dosage: '1-2 tablets every 4-6 hours as required. Max 8 tablets daily.',
        pediatric_dosage: 'Not recommended for children under 12 years without clinical review.',
        is_otc: true,
        contraindications: ['Severe hepatic impairment', 'Active chronic alcoholism'],
        common_side_effects: ['Allergic skin reactions (rare)', 'Liver toxicity on overdose'],
        pregnancy_warnings: 'Avoid unless strictly advised by doctor due to caffeine content.',
        breastfeeding_warnings: 'Compatible. Use with caution due to transient infant alertness.',
        important_warnings: 'Do not take alongside other paracetamol-containing products.',
      }
    },
    {
      name: 'Zyrtec 10mg',
      generic_name: 'Cetirizine Hydrochloride',
      manufacturer: 'Janssen',
      rack_location: 'C-08',
      min_stock_level: 15,
      knowledge: {
        generic_ingredient: 'Cetirizine',
        therapeutic_category: 'Antihistamines',
        drug_class: 'Second-generation H1 antagonist',
        common_uses: ['Allergic rhinitis', 'Hay fever', 'Running nose', 'Itchy eyes', 'Hives'],
        adult_dosage: '10mg once daily at night.',
        pediatric_dosage: '5mg once or twice daily depending on child age boundaries.',
        is_otc: true,
        contraindications: ['Severe renal failure', 'Hypersensitivity to hydroxyzine'],
        common_side_effects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
        pregnancy_warnings: 'Category B: Generally acceptable. Low risk profile.',
        breastfeeding_warnings: 'Excreted in breast milk. Not recommended for long-term use.',
        important_warnings: 'Avoid operating heavy machinery or vehicles if experiencing drowsiness.',
      }
    }
  ];

  // 4. Populate Medicines, Generate Embeddings, and Seed Batches
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  for (const medItem of medicineData) {
    // A. Create Base Medicine Entry
    const medicine = await prisma.medicine.create({
      data: {
        name: medItem.name,
        generic_name: medItem.generic_name,
        manufacturer: medItem.manufacturer,
        rack_location: medItem.rack_location,
        min_stock_level: medItem.min_stock_level,
      }
    });

    // B. Build Custom Semantic Knowledge Vector Mapping
    const profileSearchPayload = `${medItem.knowledge.common_uses.join(' ')} ${medItem.knowledge.therapeutic_category}`;
    const embedding = await VectorService.generateEmbedding(profileSearchPayload);

    await prisma.medicineKnowledge.create({
      data: {
        medicine_id: medicine.id,
        ...medItem.knowledge,
        embedding_vector: embedding,
        enrichment_status: 'COMPLETED'
      }
    });

    // C. Add Inventory Storage Batches
    // Batch 01: Standard stable stock batch
    await prisma.batch.create({
      data: {
        medicine_id: medicine.id,
        batch_number: `BATCH-${medicine.name.slice(0,3).toUpperCase()}-01`,
        quantity: 100,
        buying_price: 2.50,
        selling_price: 5.99,
        expiry_date: oneYearFromNow,
      }
    });

    // Batch 02: Short-expiry variant to trigger dashboard warnings
    await prisma.batch.create({
      data: {
        medicine_id: medicine.id,
        batch_number: `BATCH-${medicine.name.slice(0,3).toUpperCase()}-02-CRIT`,
        quantity: 8,
        buying_price: 2.20,
        selling_price: 5.50,
        expiry_date: threeMonthsFromNow,
      }
    });
  }

  console.log('📦 Medicines, Knowledge profiles, and inventory batches generated successfully.');

  // 5. Generate a Mock Historic Sale Invoice for Analytics Dashboard
  const sampleMedicine = await prisma.medicine.findFirst({ include: { batches: true } });
  if (sampleMedicine && sampleMedicine.batches[0]) {
    const targetBatch = sampleMedicine.batches[0];
    const unitQty = 2;
    const priceVal = Number(targetBatch.selling_price);
    const sub = priceVal * unitQty;

    await prisma.sale.create({
      data: {
        user_id: admin.id,
        total_amount: sub,
        items: {
          create: [
            {
              batch_id: targetBatch.id,
              quantity: unitQty,
              unit_price: targetBatch.selling_price,
              subtotal: sub,
            }
          ]
        }
      }
    });
    console.log('💵 Sample initial retail billing transaction invoice logged.');
  }

  console.log('🚀 Seeding loop complete. PHARMO engine ready for validation testing.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding process crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });