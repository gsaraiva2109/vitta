import express from 'express';
import { getAll, getById, getByPatrimonio, create, update, remove } from '../controllers/maquinaController.js';
import { create as createManutencao } from '../controllers/manutencaoController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Maquina:
 *       type: object
 *       required:
 *         - nome
 *         - patrimonio
 *       properties:
 *         idMaquina:
 *           type: integer
 *           description: ID da máquina
 *         nome:
 *           type: string
 *           description: Nome da máquina
 *         patrimonio:
 *           type: string
 *           description: Código de patrimônio
 *         dataAquisicao:
 *           type: string
 *           format: date
 *           description: Data de aquisição
 *         funcao:
 *           type: string
 *           description: Função da máquina
 *         intervaloCalibracao:
 *           type: integer
 *           description: Intervalo de calibração em dias
 *         intervaloManutencao:
 *           type: integer
 *           description: Intervalo de manutenção em dias
 *         numeroSerie:
 *           type: string
 *           description: Número de série
 *         fabricante:
 *           type: string
 *           description: Fabricante da máquina
 *         modelo:
 *           type: string
 *           description: Modelo da máquina
 *         rcOc:
 *           type: string
 *           description: Código RC/OC
 *         localizacao:
 *           type: string
 *           description: Localização da máquina
 *         observacao:
 *           type: string
 *           description: Observações adicionais
 *         justificativa:
 *           type: string
 *           description: Justificativa para aquisição ou manutenção
 *       example:
 *         nome: "Torno CNC"
 *         patrimonio: "PAT-1001"
 *         dataAquisicao: "2023-01-15"
 *         funcao: "Usinagem"
 *         intervaloCalibracao: 180
 *         intervaloManutencao: 90
 *         numeroSerie: "SN-998877"
 *         fabricante: "Romi"
 *         modelo: "D400"
 *         rcOc: "RC-001"
 *         localizacao: "Galpão A"
 */

/**
 * @swagger
 * tags:
 *   name: Maquinas
 *   description: Gerenciamento de máquinas e equipamentos
 */

/**
 * @swagger
 * /maquinas:
 *   get:
 *     summary: Lista todas as máquinas
 *     tags: [Maquinas]
 *     responses:
 *       200:
 *         description: Lista de máquinas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maquina'
 *   post:
 *     summary: Cria uma nova máquina
 *     tags: [Maquinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Maquina'
 *     responses:
 *       201:
 *         description: Máquina criada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', getAll);

/**
 * @swagger
 * /maquinas/patrimonio/{patrimonio}:
 *   get:
 *     summary: Busca máquina pelo patrimônio
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: patrimonio
 *         schema:
 *           type: string
 *         required: true
 *         description: Código do patrimônio
 *     responses:
 *       200:
 *         description: Detalhes da máquina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maquina'
 *       404:
 *         description: Máquina não encontrada
 */
router.get('/patrimonio/:patrimonio', getByPatrimonio);

/**
 * @swagger
 * /maquinas/{idMaquina}/manutencoes:
 *   post:
 *     summary: Cria uma nova manutenção para uma máquina
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: idMaquina
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da máquina
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
 *         description: Erro interno do servidor
 */
router.post('/:idMaquina/manutencoes', createManutencao);

/**
 * @swagger
 * /maquinas/{id}:
 *   get:
 *     summary: Busca máquina pelo ID
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da máquina
 *     responses:
 *       200:
 *         description: Detalhes da máquina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maquina'
 *       404:
 *         description: Máquina não encontrada
 *   put:
 *     summary: Atualiza uma máquina existente
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da máquina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Maquina'
 *     responses:
 *       200:
 *         description: Máquina atualizada com sucesso
 *       404:
 *         description: Máquina não encontrada
 *   delete:
 *     summary: Remove uma máquina
 *     tags: [Maquinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da máquina
 *     responses:
 *       200:
 *         description: Máquina removida com sucesso
 *       404:
 *         description: Máquina não encontrada
 */
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;