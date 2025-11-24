import express from 'express';
import { getAll, getById, create, update, remove } from '../controllers/manutencaoController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Manutencao:
 *       type: object
 *       required:
 *         - idMaquina
 *         - valor
 *         - status
 *       properties:
 *         idManutencao:
 *           type: integer
 *           description: ID da manutenção
 *         idMaquina:
 *           type: integer
 *           description: ID da máquina associada
 *         valor:
 *           type: number
 *           format: float
 *           description: Valor da manutenção
 *         status:
 *           type: string
 *           description: Status da manutenção (ex. Pendente, Concluída)
 *         responsavel:
 *           type: string
 *           description: Responsável pela manutenção
 *         dataManutencao:
 *           type: string
 *           format: date
 *           description: Data da realização
 *         empresaResponsavel:
 *           type: string
 *           description: Empresa contratada
 *         rcOc:
 *           type: string
 *           description: Código RC/OC
 *         modelo:
 *           type: string
 *           description: Modelo de referência
 *         observacao:
 *           type: string
 *           description: Observações adicionais
 *       example:
 *         idMaquina: 1
 *         valor: 1500.50
 *         status: "Concluída"
 *         responsavel: "Carlos Souza"
 *         dataManutencao: "2023-06-20"
 *         empresaResponsavel: "TechFix Ltda"
 *         rcOc: "RC-500"
 *         observacao: "Troca de rolamentos"
 */

/**
 * @swagger
 * tags:
 *   name: Manutencoes
 *   description: Gerenciamento de manutenções
 */

/**
 * @swagger
 * /manutencoes:
 *   get:
 *     summary: Lista todas as manutenções
 *     tags: [Manutencoes]
 *     responses:
 *       200:
 *         description: Lista de manutenções
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Manutencao'
 *   post:
 *     summary: Registra uma nova manutenção
 *     tags: [Manutencoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Manutencao'
 *     responses:
 *       201:
 *         description: Manutenção criada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/', getAll);
router.post('/', create);

/**
 * @swagger
 * /manutencoes/{id}:
 *   get:
 *     summary: Busca manutenção pelo ID
 *     tags: [Manutencoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da manutenção
 *     responses:
 *       200:
 *         description: Detalhes da manutenção
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Manutencao'
 *       404:
 *         description: Manutenção não encontrada
 *   put:
 *     summary: Atualiza uma manutenção existente
 *     tags: [Manutencoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da manutenção
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Manutencao'
 *     responses:
 *       200:
 *         description: Manutenção atualizada com sucesso
 *       404:
 *         description: Manutenção não encontrada
 *   delete:
 *     summary: Remove uma manutenção
 *     tags: [Manutencoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da manutenção
 *     responses:
 *       200:
 *         description: Manutenção removida com sucesso
 *       404:
 *         description: Manutenção não encontrada
 */
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
