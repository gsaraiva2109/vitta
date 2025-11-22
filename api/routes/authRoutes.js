import express from 'express';
import { login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/authValidator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticacao
 *   description: Gerenciamento de login e autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *             example:
 *               email: "usuario@exemplo.com"
 *               senha: "123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 user:
 *                   $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post('/login', validate(loginSchema), login);

export default router;
