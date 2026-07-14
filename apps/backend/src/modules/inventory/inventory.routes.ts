import { Router } from 'express';
import {
  getInventory, getMedicineById, searchInventory, createMedicine,
  updateMedicine, deleteMedicine,
  createBatch, updateBatch, deleteBatch, getBatchesByMedicine
} from './inventory.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', getInventory);
router.get('/search', searchInventory);

router.post('/:id/batches', createBatch);
router.get('/:id/batches', getBatchesByMedicine);
router.put('/batches/:batchId', updateBatch);
router.delete('/batches/:batchId', deleteBatch);

router.get('/:id', getMedicineById);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);
router.post('/', createMedicine);

export default router;