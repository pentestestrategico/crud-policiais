# CRUD Policiais

> Aplicação de exemplo para cadastro e listagem de policiais.

![status-build](https://img.shields.io/badge/build-pendente-lightgrey)
![license](https://img.shields.io/badge/license-ISC-blue)

Descrição
---------
Projeto fullstack (backend Node/Express + frontend Angular) criado para avaliação. Permite cadastrar policiais com campos sensíveis (matrícula é cifrada) e listar os registros. O frontend usa componentes standalone e um modal para cadastro; o backend valida CPF, criptografa matrícula e armazena em MySQL.

Stack
-----
- Backend: Node.js, Express, mysql2, Sequelize (config mínima), dotenv
- Frontend: Angular (standalone components), HttpClient, ngx-mask para máscara de CPF
- Banco: MySQL (schema em `backend/banco.sql`)

Principais funcionalidades
-------------------------
- Cadastro de policial: campos RG civil, RG militar, CPF, data de nascimento, matrícula
- Validação de CPF (frontend + backend)
- Máscara de CPF no formulário (formato 000.000.000-00)
- Criptografia AES-256-CBC da matrícula (campo armazenado em VARBINARY)
- Listagem de policiais (GET) com descriptografia da matrícula (quando possível)
- Layout responsivo simples, modal para cadastro, feedback de sucesso/erro

Estrutura do repositório (resumo)
---------------------------------
- backend/
  - server.js — servidor Express
  - routes/policiais.js — rotas /api/policiais
  - controllers/policiaisController.js — lógica de create/list, criptografia
  - db.js — pool MySQL usando mysql2
  - banco.sql — script SQL para criar tabela(s)
  - .env (exemplo em `.env.example`)
- frontend/app-web/
  - src/app/shared/cadpoliciais — componente de cadastro (standalone)
  - src/app/shared/lista-policiais — componente de listagem (standalone)
  - src/app/shared/services/policiais.service.ts — serviço HttpClient
  - uso de `ngx-mask` para máscara CPF

Variáveis de ambiente (backend)
-------------------------------
Crie um arquivo `.env` na pasta `backend/` com as seguintes chaves (exemplo no `.env.example`):

```
DB_HOST=localhost
DB_USER=root
DB_PASS=123456
DB_NAME=seguranca
JWT_SECRET=seusegredojwt
MATRICULA_SECRET=chaveSecreta123
PORT=3049
```

Observação de segurança: `MATRICULA_SECRET` é usada para derivar a chave AES-256. Se ela for alterada após dados terem sido gravados, registros antigos não poderão ser descriptografados (erro `bad decrypt`). Para produção, use um IV aleatório por registro em vez de um IV fixo.

Como preparar o banco
---------------------
1. Instale o MySQL e crie o usuário/DB conforme `.env`.
2. Execute o script SQL:

```powershell
mysql -u <user> -p < database_name > < backend/banco.sql
```

ou

```powershell
mysql -u root -p seguranca < backend/banco.sql
```

Como rodar o backend (Windows PowerShell)
----------------------------------------
1. Instale dependências:

```powershell
cd c:\Users\anne_\Desktop\Exercicios\avaliacaoDSI\backend
npm install
```

2. Inicie o servidor:

```powershell
npm start
# servidor deve aparecer em: http://localhost:3049
```

Endpoints principais
--------------------
- GET  /api/policiais — lista policiais (opcional ?cpf=... ou ?rg=...)
- POST /api/policiais — cadastra policial

Payload exemplo (POST /api/policiais):

```json
{
  "rg_civil": "12.345.678-9",
  "rg_militar": "123456",
  "cpf": "12345678909",
  "data_nascimento": "1980-10-26",
  "matricula": "ABC123"
}
```

Observações técnicas
--------------------
- CPF: validado tanto no frontend quanto no backend (função `validateCPF`). A função aceita strings com máscara ou sem máscara (remove caracteres não numéricos internamente).
- Máscara: o frontend usa `ngx-mask` para formatar o input de CPF no padrão `000.000.000-00`.
- Criptografia: AES-256-CBC com chave derivada de `MATRICULA_SECRET`. Atualmente o IV é fixo (Buffer.alloc(16,0)). Para produção recomendamos usar IV aleatório por registro e armazená-lo junto com o ciphertext.
- Problema conhecido: se `MATRICULA_SECRET` for alterada depois de registros gravados, a descriptografia falhará com `ERR_OSSL_BAD_DECRYPT`. O projeto já trata isso nas listagens (registros com falha retornam matrícula `null` e erro logado).

Frontend — como rodar (PowerShell)
---------------------------------
1. Instale dependências e rode dev server:

```powershell
cd c:\Users\anne_\Desktop\Exercicios\avaliacaoDSI\frontend\app-web
npm install
npm start
# abre em http://localhost:4200
```

Observações do frontend
----------------------
- O frontend comunica com o backend via `src/app/shared/services/policiais.service.ts` configurado para `http://localhost:3049/api`.
- O formulário de cadastro está disponível como modal (botão "Cadastrar Policial" abre modal). O CPF possui máscara.
- A listagem formata `data_nascimento` como `yyyy-MM-dd`.

Melhorias recomendadas / próximos passos
--------------------------------------
- Trocar IV fixo por IV aleatório por registro e armazenar IV com o ciphertext.
- Adicionar testes automatizados (unit + e2e) para endpoints e componentes.
- Melhor controle de erros no frontend (toasts) e feedbacks por campo.
- Paginação e filtros na listagem (por CPF/RG).

Diagnóstico rápido de problemas comuns
-------------------------------------
- Erro bad decrypt: verifique `MATRICULA_SECRET` no `.env` e se foi alterada após gravação dos dados.
- Erro de conexão com banco: verifique `DB_HOST`, `DB_USER`, `DB_PASS` e se o MySQL está acessível.

Contribuição
------------
Pull requests são bem-vindos. Para contribuições maiores, abra uma issue descrevendo a mudança.

Licença
-------
ISC

---
Se quiser, eu posso:
- adicionar scripts de migração para recriptografar matrículas com IV aleatório,
- fechar o modal automaticamente após cadastro bem-sucedido, e
- remover caracteres especiais do CPF antes de enviar (já há limpeza no backend).
# crud-policiais
