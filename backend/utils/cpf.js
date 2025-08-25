// util de validação de CPF
// exporta uma função validateCPF que retorna true se o CPF for válido
function validateCPF(cpf) {
  if (!cpf) return false;
  // remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  // rejeita CPFs com todos dígitos iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split('').map(d => parseInt(d, 10));

  // validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let rev = (sum * 10) % 11;
  if (rev === 10) rev = 0;
  if (rev !== digits[9]) return false;

  // validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  rev = (sum * 10) % 11;
  if (rev === 10) rev = 0;
  if (rev !== digits[10]) return false;

  return true;
}

module.exports = { validateCPF };
