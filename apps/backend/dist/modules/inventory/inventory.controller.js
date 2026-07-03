"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicine = exports.searchInventory = exports.getInventory = void 0;
const inventory_service_1 = require("./inventory.service");
const database_1 = require("../../core/database");
const medicine_enrichment_service_1 = require("../medicine-ai/medicine-enrichment.service");
const getInventory = async (_req, res) => {
    const data = await inventory_service_1.InventoryService.getAll();
    res.json({ success: true, data, error: null });
};
exports.getInventory = getInventory;
const searchInventory = async (req, res) => {
    const query = req.query.q;
    const data = await inventory_service_1.InventoryService.search(query || '');
    res.json({ success: true, data, error: null });
};
exports.searchInventory = searchInventory;
const createMedicine = async (req, res) => {
    const { name, generic_name, manufacturer, rack_location, min_stock_level } = req.body;
    if (!name)
        return res.status(400).json({ success: false, data: null, error: 'Brand name is required' });
    const medicine = await database_1.prisma.medicine.create({
        data: { name, generic_name, manufacturer, rack_location, min_stock_level: Number(min_stock_level) || 10 }
    });
    medicine_enrichment_service_1.MedicineEnrichmentService.enrich(medicine.id).catch(console.error);
    return res.json({ success: true, data: medicine, error: null });
};
exports.createMedicine = createMedicine;
