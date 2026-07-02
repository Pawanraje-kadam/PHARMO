import { Router } from 'express';
import { analyzePatientSymptoms } from './medicine-ai.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
router.post('/analyze', requireAuth, analyzePatientSymptoms);

export default router;