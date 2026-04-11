const mysql = require('mysql2/promise');

const conn = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'asdf@1234',
    database: 'skill_link_db'
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