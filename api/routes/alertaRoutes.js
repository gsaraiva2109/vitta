import { Router } from 'express';
import { getAlerts } from '../controllers/alertaController.js';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Alertas
 *   description: API para gerenciamento de alertas
 */

/**
 * @swagger
 * /api/alertas:
 *   get:
 *     summary: Retorna uma lista de todos os alertas
 *     tags: [Alertas]
 *     responses:
 *       200:
 *         description: Lista de alertas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do alerta
 *                   message:
 *                     type: string
 *                     description: Mensagem do alerta
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Data e hora do alerta
 *       500:
 *         description: Erro no servidor
 */
router.get('/', getAlerts);

export default router;
