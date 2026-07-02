import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { prisma } from '../../core/database';
import { MedicineEnrichmentService } from '../medicine-ai/medicine-enrichment.service';

export const getInventory = async (_req: Request, res: Response) => {
  const data = await InventoryService.getAll();
  res.json({ success: true, data, error: null });
};

export const searchInventory = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const data = await InventoryService.search(query || '');
  res.json({ success: true, data, error: null });
};

export const createMedicine = async (req: Request, res: Response) => {
  const { name, generic_name, manufacturer, rack_location, min_stock_level } = req.body;
  if (!name) return res.status(400).json({ success: false, data: null, error: 'Brand name is required' });

  const medicine = await prisma.medicine.create({
    data: { name, generic_name, manufacturer, rack_location, min_stock_level: Number(min_stock_level) || 10 }
  });

  MedicineEnrichmentService.enrich(medicine.id).catch(console.error);
  return res.json({ success: true, data: medicine, error: null });
};