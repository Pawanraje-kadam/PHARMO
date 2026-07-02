import { Request, Response } from 'express';
import { SalesService } from './sales.service';

export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    const records = await SalesService.getHistory(date);
    res.json({ success: true, data: records, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};