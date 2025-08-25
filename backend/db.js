const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'seguranca'
})
//testar conexão
pool.getConnection()
.then(conecta => {
    console.log('conexão com banco de dados bem-sucedida!')
    conecta.release()//liberar a conexão
})
.catch(err => {
    console.log('Erro ao se conectar ao banco de dados: ', err.message)
})
module.exports = pool
