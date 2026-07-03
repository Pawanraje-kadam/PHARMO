"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const database_1 = require("../../core/database");
class DashboardService {
    static async getSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const salesToday = await database_1.prisma.sale.findMany({
            where: { created_at: { gte: today } }
        });
        const grossRevenue = salesToday.reduce((sum, s) => sum + Number(s.total_amount), 0);
        const totalSalesCount = salesToday.length;
        const totalMedicinesCount = await database_1.prisma.medicine.count({ where: { is_deleted: false } });
        return { grossRevenue, totalSalesCount, totalMedicinesCount };
    }
    static async getAlerts() {
        const medicines = await database_1.prisma.medicine.findMany({
            where: { is_deleted: false },
            include: { batches: true }
        });
        const alerts = [];
        const criticalExpiryFence = new Date();
        criticalExpiryFence.setMonth(criticalExpiryFence.getMonth() + 3);
        for (const med of medicines) {
            const aggregateStock = med.batches.reduce((sum, b) => sum + b.quantity, 0);
            if (aggregateStock === 0) {
                alerts.push({
                    id: `out-${med.id}`,
                    medicine_name: med.name,
                    batch_number: 'N/A',
                    type: 'OUT_OF_STOCK',
                    details: 'Formulation stock count has hit zero absolute units.'
                });
            }
            else if (aggregateStock <= med.min_stock_level) {
                alerts.push({
                    id: `low-${med.id}`,
                    medicine_name: med.name,
                    batch_number: 'COMBINED',
                    type: 'LOW_STOCK',
                    details: `Current stock (${aggregateStock}) is below the set alert baseline (${med.min_stock_level}).`
                });
            }
            for (const batch of med.batches) {
                if (batch.quantity > 0 && new Date(batch.expiry_date) <= criticalExpiryFence) {
                    alerts.push({
                        id: `exp-${batch.id}`,
                        medicine_name: med.name,
                        batch_number: batch.batch_number,
                        type: 'SHORT_EXPIRY',
                        details: `Batch expires on ${new Date(batch.expiry_date).toLocaleDateString()}. Short shelf-life warning.`
                    });
                }
            }
        }
        return alerts;
    }
}
exports.DashboardService = DashboardService;
