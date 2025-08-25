// Rotas relacionadas a policiais
// POST /api/policiais  -> cria policial (exige token + perfil ADM)
// GET  /api/policiais  -> lista policiais (exige token); aceita filtros ?cpf=... ou ?rg=...
const express = require('express');
const router = express.Router();
const policiaisController = require('../controllers/policiaisController');

// POST e GET públicos (autenticação removida)
router.post('/', policiaisController.create);
router.get('/', policiaisController.list);

module.exports = router;
