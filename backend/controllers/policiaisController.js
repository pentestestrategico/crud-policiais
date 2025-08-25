// Controller para endpoints relacionados a policiais
const pool = require('../db');
const crypto = require('crypto');
require('dotenv').config();
const { validateCPF } = require('../utils/cpf');

// Configuração de criptografia (AES-256-CBC). A chave é derivada de MATRICULA_SECRET.
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.MATRICULA_SECRET || 'chavePadrao123', 'salt', 32);
const iv = Buffer.alloc(16, 0); // IV fixo aqui; para produção usar IV aleatório por registro

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(enc) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(enc, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Cria um policial: valida campos e CPF antes de tentar inserir
exports.create = async (req, res) => {
  const { rg_civil, rg_militar, cpf, data_nascimento, matricula } = req.body;
  // Validação básica de presença de campos
  if (!rg_civil || !rg_militar || !cpf || !data_nascimento || !matricula) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
  }

  // Validação de CPF no backend (mesma regra da trigger do banco)
  if (!validateCPF(cpf)) {
    return res.status(400).json({ message: 'CPF inválido' });
  }

  try {
    const matriculaEnc = encrypt(matricula);
    // Armazenamos como VARBINARY no banco; convertemos string hex para Buffer
    await pool.execute(
      'INSERT INTO policiais (rg_civil, rg_militar, cpf, data_nascimento, matricula) VALUES (?, ?, ?, ?, ?)',
      [rg_civil, rg_militar, cpf, data_nascimento, Buffer.from(matriculaEnc, 'hex')]
    );
    return res.status(201).json({ message: 'Policial cadastrado' });
  } catch (err) {
    // Tratamento de erros mais claro: duplicidade de campos únicos e outros
    console.error('Erro ao inserir policial:', err);
    if (err && err.errno === 1062) {
      return res.status(400).json({ message: 'Registro duplicado (cpf, rg_civil ou rg_militar já existe)' });
    }
    return res.status(500).json({ message: 'Erro ao salvar policial', error: err.message });
  }
};

// Lista policiais com opção de filtro por cpf ou rg; descriptografa matrícula antes de retornar
exports.list = async (req, res) => {
  const { cpf, rg } = req.query;
  try {
    let sql = 'SELECT id, rg_civil, rg_militar, cpf, data_nascimento, matricula FROM policiais';
    const params = [];
    if (cpf) {
      sql += ' WHERE cpf = ?';
      params.push(cpf);
    } else if (rg) {
      sql += ' WHERE rg_civil = ? OR rg_militar = ?';
      params.push(rg, rg);
    }

    const [rows] = await pool.execute(sql, params);
    const result = rows.map(r => {
      // matricula está armazenada como VARBINARY; convertemos para hex e depois tentamos descriptografar
      let matriculaDesc = null;
      if (r.matricula) {
        try {
          const matriculaHex = Buffer.from(r.matricula).toString('hex');
          matriculaDesc = matriculaHex ? decrypt(matriculaHex) : null;
        } catch (e) {
          // Em caso de erro de descriptografia (ex: chave/iv incorreto ou dados corrompidos),
          // não lançamos a exceção para não quebrar a listagem; registramos e retornamos null.
          console.error('Erro ao descriptografar matrícula para id', r.id, e);
          matriculaDesc = null;
        }
      }
      return { ...r, matricula: matriculaDesc };
    });
    return res.json(result);
  } catch (err) {
    console.error('Erro ao listar policiais:', err);
    return res.status(500).json({ message: 'Erro ao listar policiais', error: err.message });
  }
};

