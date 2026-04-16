require('dotenv').config();
const mysql = require('mysql2/promise');

const conn = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "skill_link_db"
});

// log connection status
async function checkConnection() {
    try {
        const connection = await conn.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

checkConnection();
module.exports = conn;
