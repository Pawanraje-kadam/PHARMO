import { Request, Response } from 'express';
import { SafetyService, PatientProfile } from '../safety-engine/safety.service';
import { prisma } from '../../core/database';

export const analyzePatientSymptoms = async (req: Request, res: Response) => {
  try {
    const patientData: PatientProfile = req.body;
    if (!patientData.complaint) return res.status(400).json({ success: false, data: null, error: 'Complaint text required.' });

    const medicines = await prisma.medicine.findMany({
      where: { is_deleted: false },
      include: { batches: { orderBy: { expiry_date: 'asc' } }, ai_knowledge: true }
    });

    const recommendations = await SafetyService.evaluate(patientData, medicines);
    return res.json({ success: true, data: recommendations, error: null });
  } catch (error: any) {
    return res.status(500).json({ success: false, data: null, error: error.message });
  }
};