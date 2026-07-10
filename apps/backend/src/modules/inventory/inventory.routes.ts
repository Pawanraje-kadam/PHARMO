import { Router } from 'express';
import { getInventory, searchInventory, createMedicine } from './inventory.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', getInventory);
router.get('/search', searchInventory);
router.post('/', createMedicine);

export default router;