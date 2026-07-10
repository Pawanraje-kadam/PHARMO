import { prisma } from '../../core/database.js';

export class InventoryService {
  public static async getAll() {
    return await prisma.medicine.findMany({
      where: { is_deleted: false },
      include: { batches: true }
    });
  }

  public static async search(query: string) {
    return await prisma.batch.findMany({
      where: {
        quantity: { gt: 0 },
        expiry_date: { gt: new Date() },
        medicine: {
          is_deleted: false,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { generic_name: { contains: query, mode: 'insensitive' } }
          ]
        }
      },
      include: { medicine: true }
    });
  }
}