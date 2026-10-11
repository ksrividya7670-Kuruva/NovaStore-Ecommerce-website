import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, requireAdmin, getAdminStats);

export default router;
