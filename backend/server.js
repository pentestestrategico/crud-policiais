// Servidor Express principal do backend
const express = require('express');
const cors = require('cors');
// Notas: sistema de autenticação removido conforme solicitado
const policiaisRoutes = require('./routes/policiais');

const app = express();
const PORT = process.env.PORT || 3049;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas de policiais (em arquivo separado)
// Nota: autenticação/authorização foi removida — todas as rotas de policiais são públicas neste momento
app.use('/api/policiais', policiaisRoutes);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor' });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
