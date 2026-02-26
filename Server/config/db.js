const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
};

// Create a single connection
let connection;

const connectDB = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ MySQL Database connected successfully to ' + process.env.DB_HOST);
        return connection;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
};

// Function to get the connection instance for models
const getDB = () => {
    if (!connection) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return connection;
};

module.exports = { connectDB, getDB };
