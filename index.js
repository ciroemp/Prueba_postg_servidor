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

// 👉 Ruta API para AGREGAR un nuevo producto
app.post('/productos', async (req, res) => {
  try {
    // Recibimos "imagen" desde el frontend
    const { nombre, precio, stock, categoria, imagen } = req.body;
    
    // Si olvidaste llenar la casilla, le ponemos el placeholder por defecto
    const nombreImagen = imagen ? imagen : 'placeholder.jpg'; 

    const result = await db.query(
      'INSERT INTO productos (nombre, precio, stock, categoria, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, precio, stock, categoria, nombreImagen]
    );

    res.json({ mensaje: 'Producto agregado con éxito', producto: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar en la base de datos');
  }
});

// 👉 Levantar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});