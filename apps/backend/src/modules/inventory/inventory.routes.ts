import { Router } from 'express';
import { getInventory, searchInventory, createMedicine } from './inventory.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();
router.use(requireAuth);

router.get('/', getInventory);
router.get('/search', searchInventory);
router.post('/', createMedicine);

export default router;