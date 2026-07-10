import { Prisma } from '@prisma/client';
import { prisma } from '../../core/database.js';

export interface BillingItemInput {
  batch_id: string;
  quantity: number;
}

export class BillingService {
  public static async processCheckout(cashierId: string, items: BillingItemInput[]) {
    if (items.length === 0) throw new Error('Cannot process an invoice with zero items.');

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let grandTotal = 0;
      const saleItemsData = [];

      for (const item of items) {
        const batch = await tx.batch.findUnique({
          where: { id: item.batch_id },
          include: { medicine: true }
        });

        if (!batch) throw new Error(`Batch ID ${item.batch_id} not found.`);
        if (batch.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${batch.medicine.name}. Available: ${batch.quantity}`);
        }
        if (new Date(batch.expiry_date) <= new Date()) {
          throw new Error(`Critical Safety Alert: Batch ${batch.batch_number} has expired.`);
        }

        const lineSubtotal = Number(batch.selling_price) * item.quantity;
        grandTotal += lineSubtotal;

        await tx.batch.update({
          where: { id: batch.id },
          data: { quantity: { decrement: item.quantity } }
        });

        saleItemsData.push({
          batch_id: batch.id,
          quantity: item.quantity,
          unit_price: batch.selling_price,
          subtotal: lineSubtotal
        });
      }

      return await tx.sale.create({
        data: {
          user_id: cashierId,
          total_amount: grandTotal,
          items: { create: saleItemsData }
        },
        include: { items: true }
      });
    });
  }
}