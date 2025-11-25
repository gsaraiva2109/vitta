import { Router } from 'express';
import { getAlerts } from '../controllers/alertaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAlerts);

export default router;
