import express from 'express';
import { getAll, getById, getByMatricula, create, update, remove } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getAll);
router.get('/matricula/:matricula', getByMatricula); 
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;