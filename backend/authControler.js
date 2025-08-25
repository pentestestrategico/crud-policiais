// bycript - jwt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

//rota de cadastro
exports.register = async (req, res) => {
    const { usuario, senha, perfil } = req.body
    try{
        const [rows] = await pool.execute('select * from usuarios where usuario = ?', [usuario])
        if(rows.length > 0){
            return res.status(400).json({ message: 'Usuário já existe'})
        }

        const salt = await bcrypt.genSalt(10)
        const senhaHash = await bcrypt.hash(senha, salt)

        await pool.execute('insert into usuarios (usuario, senha, perfil) values (?, ? , ?)', 
        [usuario, senhaHash, perfil]);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
        
    } catch(error){
        res.status(500).json({ error: 'Erro no servidor!' })
    }
}

//rota de login
exports.login = async (req, res) => {
    const {usuario, senha} = req.body
    try{
        const [rows] = await pool.execute('select * from usuarios where usuario = ?', [usuario])
        if(rows.length === 0){
            return res.status(400).json({ message: 'Credenciais inválidas!'})
        }
        const user = rows[0]
        const isMatch = await bcrypt.compare(senha, user.senha)
        if(!isMatch){
            return res.status(400).json({ message: 'Credenciais inválidas!'})
        }
        const token = jwt.sign({ id: user.id, perfil: user.perfil }, 
        process.env.JWT_SECRET, {expiresIn: '1h'})
        res.json({ token, perfil: user.perfil })

    }catch(error){
        res.status(500).json({ error: 'Erro no servidor!' })
    }
}