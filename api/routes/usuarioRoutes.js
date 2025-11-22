import express from 'express';
import { getAll, getById, getByMatricula, create, update, remove } from '../controllers/usuarioController.js';

const publicUserRouter = express.Router();
const protectedUserRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado do usuário
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         matricula:
 *           type: string
 *           description: Matrícula do usuário
 *       example:
 *         nome: João Silva
 *         email: joao@example.com
 *         matricula: "12345"
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna a lista de todos os usuários
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       500:
 *         description: Erro no servidor
 */

// Rotas Públicas
publicUserRouter.get('/', getAll); // GET /usuarios
publicUserRouter.post('/', create); // POST /usuarios

/**
 * @swagger
 * /usuarios/matricula/{matricula}:
 *   get:
 *     summary: Busca usuário pela matrícula
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: matricula
 *         schema:
 *           type: string
 *         required: true
 *         description: Matrícula do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca usuário pelo ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

// Rotas Protegidas
protectedUserRouter.get('/matricula/:matricula', getByMatricula);
protectedUserRouter.get('/:id', getById);
protectedUserRouter.put('/:id', update);
protectedUserRouter.delete('/:id', remove);

export { publicUserRouter, protectedUserRouter };