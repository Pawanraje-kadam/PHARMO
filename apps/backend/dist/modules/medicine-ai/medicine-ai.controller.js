"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePatientSymptoms = void 0;
const safety_service_1 = require("../safety-engine/safety.service");
const database_1 = require("../../core/database");
const analyzePatientSymptoms = async (req, res) => {
    try {
        const patientData = req.body;
        if (!patientData.complaint)
            return res.status(400).json({ success: false, data: null, error: 'Complaint text required.' });
        const medicines = await database_1.prisma.medicine.findMany({
            where: { is_deleted: false },
            include: { batches: { orderBy: { expiry_date: 'asc' } }, ai_knowledge: true }
        });
        const recommendations = await safety_service_1.SafetyService.evaluate(patientData, medicines);
        return res.json({ success: true, data: recommendations, error: null });
    }
    catch (error) {
        return res.status(500).json({ success: false, data: null, error: error.message });
    }
};
exports.analyzePatientSymptoms = analyzePatientSymptoms;
