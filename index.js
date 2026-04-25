const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Servir archivos (HTML, JS)
app.use(express.static(__dirname));

// 👉 Ruta API
app.get('/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// 👉 Levantar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});