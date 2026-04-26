require('dotenv').config(); // Carga las variables de entorno
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// 👉 Servir archivos estáticos (HTML, JS, y la carpeta public/img)
app.use(express.static(__dirname));

// 👉 Ruta API
app.get('/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos');
    
    // Mapeamos los productos para inyectarles la URL completa de la imagen
    const productosConImagen = result.rows.map(producto => {
      return {
        ...producto,
        // Si el producto tiene el nombre de la imagen en BD, lo une con la URL del .env
        // Si no tiene imagen (null), le asigna una imagen por defecto
        imagen_url: producto.imagen 
          ? `${process.env.URL_IMAGENES}${producto.imagen}` 
          : `${process.env.URL_IMAGENES}placeholder.jpg`
      };
    });

    res.json(productosConImagen);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// 👉 Levantar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});