import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
//import route from './Routes/route.js';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Aaru@2205',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection when the application starts
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database');
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






// const { createPool } = require('mysql2');

// const pool = createPool({
//     connectionLimit: 10, 
//     host: 'mysql-1f18dca8-vijay-4507.l.aivencloud.com',
//     port: 26139,
//     user: 'avnadmin',
//     password: 'AVNS_vF2SnpVUvaIcVp5n0hO',
//     database: 'qpe'
// });

// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Database connection failed:', err.message);
//     } else {
//         console.log('Connected to the database');
//         connection.release();
//     }
// });

// const query = (sql, values) => {
//     return new Promise((resolve, reject) => {
//         pool.query(sql, values, (err, results) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(results);
//         });
//     });
// };

// module.exports = { query, pool };
