const express = require('express');
const router = express.Router();
const pool = require('../Services/db');

// GET TODOS
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { nombre, precio, stock, categoria } = req.body;

    const result = await pool.query(
      'INSERT INTO productos(nombre, precio, stock, categoria) VALUES($1,$2,$3,$4) RETURNING *',
      [nombre, precio, stock, categoria]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM productos WHERE id=$1', [id]);

    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;