module.exports = function (req, res, next) {
  const rol = req.headers['rol'];

  if (!rol) {
    return res.status(401).json({ error: 'No se envió rol' });
  }

  if (rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  next();
};