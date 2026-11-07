// database/eventDb.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const isLocalhost =
  !process.env.DB_HOST ||
  process.env.DB_HOST === 'localhost' ||
  process.env.DB_HOST === '127.0.0.1';

// Cloud MySQL providers (Aiven, TiDB, Clever Cloud, etc.) typically require SSL.
// Enable SSL if explicitly requested or if connecting to an external cloud host.
const enableSSL =
  process.env.DB_SSL === 'true' ||
  (process.env.DB_SSL !== 'false' && !isLocalhost);

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '1234',
  database: process.env.DB_NAME || 'invincible',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  connectTimeout: 20000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

// If a complete connection URI is provided (e.g. DATABASE_URL)
if (process.env.DATABASE_URL) {
  poolConfig.uri = process.env.DATABASE_URL;
}

if (enableSSL) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = mysql.createPool(poolConfig);

// Diagnostic connection test on startup (non-blocking)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      `✅ MySQL Connected Successfully: host=${poolConfig.host}, db=${poolConfig.database}, port=${poolConfig.port}, ssl=${enableSSL}`
    );
    connection.release();
  } catch (err) {
    console.error('❌ MySQL Connection Failed:');
    console.error(`   Host: ${poolConfig.host}:${poolConfig.port}`);
    console.error(`   Database: ${poolConfig.database}`);
    console.error(`   User: ${poolConfig.user}`);
    console.error(`   SSL: ${enableSSL}`);
    console.error(`   Error: ${err.message}`);
    console.error('   👉 Check your environment variables and cloud database firewall/allowlist settings.');
  }
})();

module.exports = pool;
