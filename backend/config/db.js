const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
  user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'sima_db',
  port:     process.env.MYSQLPORT     || process.env.DB_PORT     || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database terhubung');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal konek database:', err.message);
    throw err;
  }
}

module.exports = { pool, initDB };
