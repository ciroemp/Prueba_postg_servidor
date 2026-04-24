const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // o IP servidor Ubuntu
  database: 'ferreteria',
  password: '1234',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión', err));

module.exports = pool;