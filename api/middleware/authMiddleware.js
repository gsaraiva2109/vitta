import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Middleware simples para validar JWT no header Authorization: Bearer <token>
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization || req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não informado' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato do token inválido' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // popular req.user para uso nos controllers
    req.user = payload;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
