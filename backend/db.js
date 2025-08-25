// Conexão com o banco MySQL usando mysql2/promise
const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexões configurado via variáveis de ambiente
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'seguranca',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Exporta o pool para uso pelos controllers
module.exports = pool;
