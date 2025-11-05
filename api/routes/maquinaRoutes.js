import express from 'express';
import { getAll, getById, getByPatrimonio, create, update, remove } from '../controllers/maquinaController.js';

const router = express.Router();

router.get('/', getAll);
router.get('/patrimonio/:patrimonio', getByPatrimonio);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;