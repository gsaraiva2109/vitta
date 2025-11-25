import { Router } from 'express';
import { getAlerts } from '../controllers/alertaController.js';

const router = Router();

router.get('/', getAlerts);

export default router;
