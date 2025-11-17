import { authService } from '../services/authService.js';

export async function login(req, res) {
  const { matricula, senha } = req.body;

  try {
    const result = await authService.loginUser(matricula, senha);
    res.json(result);
  } catch (error) {
    // Usa o statusCode definido no serviço ou um padrão 500
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
}
