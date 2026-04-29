require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./routes/Services/db');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 1. OBTENER PRODUCTOS
app.get('/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY id DESC');
    const productosConImagen = result.rows.map(p => ({
      ...p,
      imagen_url: p.imagen ? `${process.env.URL_IMAGENES}${p.imagen}` : `${process.env.URL_IMAGENES}placeholder.jpg`
    }));
    res.json(productosConImagen);
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

 // listar productos
app.get('/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY id DESC');
    const productos = result.rows.map(p => ({
      ...p,
      // Construimos la URL; si no hay imagen, usamos el placeholder
      imagen_url: p.imagen ? `${process.env.URL_IMAGENES}${p.imagen}` : `${process.env.URL_IMAGENES}placeholder.jpg`
    }));
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el inventario');
  }
});

// 2. AGREGAR PRODUCTO
app.post('/productos', async (req, res) => {
  const { nombre, precio, stock, categoria, imagen } = req.body;
  try {
    await db.query(
      'INSERT INTO productos (nombre, precio, stock, categoria, imagen) VALUES ($1, $2, $3, $4, $5)',
      [nombre, precio, stock, categoria, imagen || 'placeholder.jpg']
    );
    res.json({ mensaje: 'Creado' });
  } catch (error) {
    res.status(500).send('Error al crear');
  }
});

// 3. EDITAR PRODUCTO
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, categoria } = req.body;
  if (req.headers.rol !== 'admin') return res.status(403).send('No autorizado');
  
  try {
    await db.query(
      'UPDATE productos SET nombre=$1, precio=$2, stock=$3, categoria=$4 WHERE id=$5',
      [nombre, precio, stock, categoria, id]
    );
    res.json({ mensaje: 'Actualizado' });
  } catch (error) {
    res.status(500).send('Error al editar');
  }
});

// 4. ELIMINAR PRODUCTO
app.delete('/productos/:id', async (req, res) => {
  const { id } = req.params;
  if (req.headers.rol !== 'admin') return res.status(403).send('No autorizado');
  try {
    await db.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).send('Error al eliminar');
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));