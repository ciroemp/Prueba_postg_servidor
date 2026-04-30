
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./routes/Services/db');


// NUEVO: Importamos herramientas para verificar archivos físicos
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --- RUTA DE AUTENTICACIÓN ---
// --- RUTA DE AUTENTICACIÓN ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Verificar si el usuario existe en la tabla
    const result = await db.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const usuario = result.rows[0];

    // 2. Comparar la contraseña plana con el hash de la base de datos
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // 3. Generar el Token (Pase VIP) que dura 2 horas
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Respondemos con el token
    res.json({ 
      mensaje: 'Autenticación exitosa', 
      token: token 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 1. OBTENER PRODUCTOS (Actualizado con validación de archivos)
app.get('/productos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY id DESC');
    
    const productosConImagen = result.rows.map(p => {
      // Por defecto, asumimos que no tiene imagen válida
      let urlFinal = '/public/img/placeholder.jpg';

      if (p.imagen) {
        // Construimos la ruta exacta en tu computadora donde debería estar la foto
        const rutaFisica = path.join(__dirname, 'public', 'img', p.imagen);
        
        // Verificamos si el archivo realmente existe en esa carpeta
        if (fs.existsSync(rutaFisica)) {
          urlFinal = `/public/img/${p.imagen}`;
        }
      }

      return {
        ...p,
        imagen_url: urlFinal
      };
    });

    res.json(productosConImagen);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send('Error al obtener productos');
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

// 3. EDITAR PRODUCTO (Actualizado para guardar la imagen)
app.put('/productos/:id', async (req, res) => {
  const { id } = req.params;
  // Extraemos también la variable 'imagen' que enviaremos desde el navegador
  const { nombre, precio, stock, categoria, imagen } = req.body;
  if (req.headers.rol !== 'admin') return res.status(403).send('No autorizado');
  
  try {
    // Agregamos imagen=$5 a la consulta SQL y movemos el id a $6
    await db.query(
      'UPDATE productos SET nombre=$1, precio=$2, stock=$3, categoria=$4, imagen=$5 WHERE id=$6',
      [nombre, precio, stock, categoria, imagen, id]
    );
    res.json({ mensaje: 'Actualizado' });
  } catch (error) {
    console.error(error);
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

// 5. EDITAR CATEGORÍAS MASIVAMENTE
app.put('/categorias/:vieja', async (req, res) => {
  const { vieja } = req.params;
  const { nueva } = req.body;
  
  if (req.headers.rol !== 'admin') return res.status(403).send('No autorizado');
  
  try {
    // Busca todos los productos con la categoría vieja y les pone la nueva
    await db.query(
      'UPDATE productos SET categoria = $1 WHERE categoria = $2',
      [nueva, vieja]
    );
    res.json({ mensaje: 'Categoría actualizada en todos los productos' });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).send('Error al actualizar categoría');
  }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));