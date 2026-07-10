import { Router } from 'express';
import { analyzePatientSymptoms } from './medicine-ai.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();
router.post('/analyze', requireAuth, analyzePatientSymptoms);

export default router;