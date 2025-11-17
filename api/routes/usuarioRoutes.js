import express from 'express';
import { getAll, getById, getByMatricula, create, update, remove } from '../controllers/usuarioController.js';

const publicUserRouter = express.Router();
const protectedUserRouter = express.Router();

// Rotas Públicas
publicUserRouter.get('/', getAll); // GET /usuarios
publicUserRouter.post('/', create); // POST /usuarios

// Rotas Protegidas
protectedUserRouter.get('/matricula/:matricula', getByMatricula);
protectedUserRouter.get('/:id', getById);
protectedUserRouter.put('/:id', update);
protectedUserRouter.delete('/:id', remove);

export { publicUserRouter, protectedUserRouter };