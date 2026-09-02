const mysql = require('mysql2/promise');
require('dotenv').config();

// Log database configuration parameters (hiding password)
console.log('--- [DB SETUP] Initializing connection pool ---');
console.log(`DB Host: ${process.env.DB_HOST}`);
console.log(`DB Port: ${process.env.DB_PORT || 3306}`);
console.log(`DB User: ${process.env.DB_USER}`);
console.log(`DB Name: ${process.env.DB_NAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Self-executing test function to verify database connectivity on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('[DATABASE CONNECTED SUCCESS]: Successfully connected to the MySQL Database!');
        connection.release(); // Return connection to pool
    } catch (err) {
        console.error('[DATABASE ERROR]: Failed to connect to MySQL Database!');
        console.error(`Error Code: ${err.code}`);
        console.error(`Error Message: ${err.message}`);
    }
})();

module.exports = pool;