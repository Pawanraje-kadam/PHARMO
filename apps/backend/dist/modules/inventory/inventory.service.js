"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const database_1 = require("../../core/database");
class InventoryService {
    static async getAll() {
        return await database_1.prisma.medicine.findMany({
            where: { is_deleted: false },
            include: { batches: true }
        });
    }
    static async search(query) {
        return await database_1.prisma.batch.findMany({
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
exports.InventoryService = InventoryService;
