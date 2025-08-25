const express = require('express');
const cors = require('cors');
const authController = require('./authController');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = 3049;

app.use(cors());
app.use(express.json());

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

app.get('/api/admin', authMiddleware.verifyToken, authMiddleware.verifyPerfil('ADM'), (req, res) => {
    res.json({ message: 'Bem-vindo, administrador!', user: req.user });
});

app.get('/api/user', authMiddleware.verifyToken, authMiddleware.verifyPerfil('USER'), (req, res) => {
    res.json({ message: 'Bem-vindo, usuário!', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
