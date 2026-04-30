/* Este script es para crear un usuario administrador en tu base de datos PostgreSQL.
Solo debes ejecutarlo una vez, y luego puedes eliminarlo o comentarlo para evitar crear múltiples admins.
Asegúrate de tener tu base de datos corriendo y la conexión configurada correctamente en tu archivo db.js.
*/



require('dotenv').config();
const db = require('./routes/Services/db'); // Usamos tu conexión actual
const bcrypt = require('bcryptjs');

async function generarAdmin() {
  const username = 'ciro'; // Pon aquí el nombre de usuario que quieras usar
  const passwordPlana = '8358'; // Pon aquí la contraseña que quieras usar
  
  try {
    // 1. Encriptamos la contraseña (el 10 es el "costo" o nivel de seguridad)
    const hash = await bcrypt.hash(passwordPlana, 10);

    // 2. La guardamos en la base de datos
    await db.query(
      'INSERT INTO usuarios (username, password, rol) VALUES ($1, $2, $3)',
      [username, hash, 'admin']
    );
    
    console.log('✅ Usuario administrador creado con éxito en PostgreSQL');
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    process.exit(); // Cierra el script
  }
}

generarAdmin();