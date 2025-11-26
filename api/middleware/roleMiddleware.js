export const managerMiddleware = (req, res, next) => {
  if (req.user && req.user.tipo === 'manager') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
};
