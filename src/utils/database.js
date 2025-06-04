import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'tekhnologia-mysql.mysql.database.azure.com',
    user: process.env.DB_USER || 'tekhnologia@tekhnologia-mysql',
    password: process.env.DB_PASSWORD || 'Royal@123',
    database: process.env.DB_NAME || 'tpm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the Azure MySQL database');
        connection.release();
    } catch (err) {
        console.error(' Database connection failed:', err.message);
    }
})();

// Export query and pool
const query = async (sql, values) => {
    try {
        const [results] = await pool.query(sql, values);
        return results;
    } catch (err) {
