import mysql from 'mysql2/promise';

// Use environment variables for better security
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql.mysql.database.azure.com',
    user: process.env.DB_USER || 'tekhnologia@mysql',
    password: process.env.DB_PASSWORD || 'Royal@123',
    database: process.env.DB_NAME || 'tpm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
});

// Test the connection when the application starts
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the Azure MySQL database');
        connection.release();
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
})();

const query = async (sql, values) => {
    try {
        const [results] = await pool.query(sql, values);
        return results;
    } catch (err) {
        throw err;
    }
};

export { query, pool };
