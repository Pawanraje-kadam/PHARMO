import { prisma } from '../../core/database.js';

export class SalesService {
  public static async getHistory(dateString?: string) {
    const whereClause: any = {};
    if (dateString) {
      const targetDate = new Date(dateString);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.created_at = {
        gte: targetDate,
        lt: nextDay
      };
    }

    return await prisma.sale.findMany({
      where: whereClause,
      include: {
        user: { select: { username: true } },
        items: { include: { batch: { include: { medicine: true } } } }
      },
      orderBy: { created_at: 'desc' },
      take: 200
    });
  }
}
