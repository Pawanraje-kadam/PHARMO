import { Request, Response } from 'express';
import { InventoryService } from './inventory.service.js';
import { prisma } from '../../core/database.js';
import { MedicineEnrichmentService } from '../medicine-ai/medicine-enrichment.service.js';

export const getInventory = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await InventoryService.getAll();
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const getMedicineById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await InventoryService.getById(req.params.id);
    if (!data) { res.status(404).json({ success: false, data: null, error: 'Medicine not found.' }); return; }
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const searchInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const data = await InventoryService.search(query || '');
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const createMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, generic_name, manufacturer, rack_location, min_stock_level } = req.body;
    if (!name) { res.status(400).json({ success: false, data: null, error: 'Brand name is required' }); return; }

    const medicine = await prisma.medicine.create({
      data: { name, generic_name, manufacturer, rack_location, min_stock_level: Number(min_stock_level) || 10 }
    });

    MedicineEnrichmentService.enrich(medicine.id).catch(console.error);
    res.json({ success: true, data: medicine, error: null });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, data: null, error: 'A medicine with this name already exists.' }); return;
    }
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, generic_name, manufacturer, rack_location, min_stock_level } = req.body;
    const data = await InventoryService.update(req.params.id, {
      name, generic_name, manufacturer, rack_location,
      min_stock_level: min_stock_level ? Number(min_stock_level) : undefined
    });
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, data: null, error: 'Medicine not found.' }); return;
    }
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    await InventoryService.softDelete(req.params.id);
    res.json({ success: true, data: null, error: null });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, data: null, error: 'Medicine not found.' }); return;
    }
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batch_number, quantity, buying_price, selling_price, expiry_date } = req.body;
    if (!batch_number || quantity == null || !buying_price || !selling_price || !expiry_date) {
      res.status(400).json({ success: false, data: null, error: 'batch_number, quantity, buying_price, selling_price, and expiry_date are required.' }); return;
    }

    const medicine = await prisma.medicine.findUnique({ where: { id: req.params.id, is_deleted: false } });
    if (!medicine) { res.status(404).json({ success: false, data: null, error: 'Medicine not found.' }); return; }

    const batch = await InventoryService.addBatch(req.params.id, {
      batch_number, quantity: Number(quantity), buying_price: Number(buying_price),
      selling_price: Number(selling_price), expiry_date
    });
    res.status(201).json({ success: true, data: batch, error: null });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, data: null, error: 'A batch with this number already exists for this medicine.' }); return;
    }
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const updateBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity, buying_price, selling_price, expiry_date } = req.body;
    const data = await InventoryService.updateBatch(req.params.batchId, {
      quantity: quantity != null ? Number(quantity) : undefined,
      buying_price: buying_price != null ? Number(buying_price) : undefined,
      selling_price: selling_price != null ? Number(selling_price) : undefined,
      expiry_date: expiry_date || undefined
    });
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, data: null, error: 'Batch not found.' }); return;
    }
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const deleteBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    await InventoryService.deleteBatch(req.params.batchId);
    res.json({ success: true, data: null, error: null });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, data: null, error: 'Batch not found.' }); return;
    }
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};

export const getBatchesByMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await InventoryService.getBatchesByMedicine(req.params.id);
    res.json({ success: true, data, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};