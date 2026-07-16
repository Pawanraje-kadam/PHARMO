import { prisma } from '../../core/database.js';

export interface BatchInput {
  batch_number: string;
  quantity: number;
  buying_price: number;
  selling_price: number;
  expiry_date: string;
  purchase_unit?: string;
  units_per_tablet?: number;
}

export class InventoryService {
  public static async getAll() {
    return await prisma.medicine.findMany({
      where: { is_deleted: false },
      include: { batches: { orderBy: { created_at: 'desc' } } }
    });
  }

  public static async getById(id: string) {
    return await prisma.medicine.findUnique({
      where: { id, is_deleted: false },
      include: { batches: { orderBy: { created_at: 'desc' } } }
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

  public static async update(id: string, data: {
    name?: string;
    generic_name?: string;
    manufacturer?: string;
    rack_location?: string;
    min_stock_level?: number;
  }) {
    return await prisma.medicine.update({
      where: { id },
      data
    });
  }

  public static async softDelete(id: string) {
    return await prisma.medicine.update({
      where: { id },
      data: { is_deleted: true }
    });
  }

  public static async addBatch(medicineId: string, data: BatchInput) {
    return await prisma.batch.create({
      data: {
        medicine_id: medicineId,
        batch_number: data.batch_number,
        quantity: data.quantity,
        buying_price: data.buying_price,
        selling_price: data.selling_price,
        expiry_date: new Date(data.expiry_date),
        purchase_unit: data.purchase_unit || 'tablet',
        units_per_tablet: data.units_per_tablet ?? 1
      },
      include: { medicine: true }
    });
  }

  public static async updateBatch(id: string, data: Partial<BatchInput & { quantity: number }>) {
    const updateData: Record<string, unknown> = {};
    if (data.quantity != null) updateData.quantity = data.quantity;
    if (data.buying_price != null) updateData.buying_price = data.buying_price;
    if (data.selling_price != null) updateData.selling_price = data.selling_price;
    if (data.expiry_date) updateData.expiry_date = new Date(data.expiry_date);
    if (data.purchase_unit != null) updateData.purchase_unit = data.purchase_unit;
    if (data.units_per_tablet != null) updateData.units_per_tablet = data.units_per_tablet;
    return await prisma.batch.update({
      where: { id },
      data: updateData
    });
  }

  public static async deleteBatch(id: string) {
    return await prisma.batch.delete({ where: { id } });
  }

  public static async getBatchesByMedicine(medicineId: string) {
    return await prisma.batch.findMany({
      where: { medicine_id: medicineId },
      orderBy: { created_at: 'desc' },
      include: { medicine: true }
    });
  }
}