import express from 'express';
const router = express.Router();

// rota de exemplo: listar / testar
router.get('/', (req, res) => {
  res.json({ ok: true, mensagem: 'rota de usuarios funcionando' });
});

// export
export default router;