"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const database_1 = require("../../core/database");
class SalesService {
    static async getHistory(dateString) {
        const whereClause = {};
        if (dateString) {
            const targetDate = new Date(dateString);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
            whereClause.created_at = {
                gte: targetDate,
                lt: nextDay
            };
        }
        return await database_1.prisma.sale.findMany({
            where: whereClause,
            include: {
                user: { select: { username: true } },
                items: { include: { batch: { include: { medicine: true } } } }
            },
            orderBy: { created_at: 'desc' }
        });
    }
}
exports.SalesService = SalesService;
