import { Router } from 'express';
import { getAlerts, listarAlertas } from '../controllers/alertaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAlerts);

export default router;
s