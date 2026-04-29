require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Forzamos string para evitar el error anterior
  port: parseInt(process.env.DB_PORT),       // Forzamos que sea un número
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL de forma segura'))
  .catch(err => console.error('Error de conexión', err));

module.exports = pool;