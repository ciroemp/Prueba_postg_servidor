require('dotenv').config(); // Carga las variables de entorno
const { Pool } = require('pg');

const pool = new Pool({
  user: pass.env.DB_USER,
  host: pass.env.DB_HOST,
  database: pass.env.DB_NAME,
  password: pass.env.DB_PASSWORD,
  port: pass.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL de forma segura'))
  .catch(err => console.error('Error de conexión', err));

module.exports = pool;