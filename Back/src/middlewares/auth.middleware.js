const jwt = require('jsonwebtoken');

// Verifica que el usuario tenga sesión activa
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Verifica que el usuario sea admin
const verificarAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado, se requiere rol admin' });
  }
  next();
};

// Verifica que el usuario sea cliente
const verificarCliente = (req, res, next) => {
  if (req.user?.rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado, se requiere rol cliente' });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin, verificarCliente };