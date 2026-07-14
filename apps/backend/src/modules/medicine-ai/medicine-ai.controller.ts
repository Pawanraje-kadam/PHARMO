import { Request, Response } from 'express';
import { SafetyService, PatientProfile } from '../safety-engine/safety.service.js';
import { prisma } from '../../core/database.js';

export const analyzePatientSymptoms = async (req: Request, res: Response) => {
  try {
    const patientData: PatientProfile = req.body;
    if (!patientData.complaint) { res.status(400).json({ success: false, data: null, error: 'Complaint text required.' }); return; }
    if (!patientData.age || patientData.age <= 0) { res.status(400).json({ success: false, data: null, error: 'Valid patient age required.' }); return; }

    const medicines = await prisma.medicine.findMany({
      where: { is_deleted: false },
      include: { batches: { orderBy: { expiry_date: 'asc' } }, ai_knowledge: true }
    });

    if (medicines.length === 0) {
      res.json({ success: true, data: [], error: null });
      return;
    }

    const recommendations = await SafetyService.evaluate(patientData, medicines);
    res.json({ success: true, data: recommendations, error: null });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, error: error.message });
  }
};
