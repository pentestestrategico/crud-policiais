export function validateCPF(cpf?: string): boolean {
  if (!cpf) return false;
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  const digits = cleaned.split('').map(d => parseInt(d, 10));

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let rev = (sum * 10) % 11;
  if (rev === 10) rev = 0;
  if (rev !== digits[9]) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  rev = (sum * 10) % 11;
  if (rev === 10) rev = 0;
  if (rev !== digits[10]) return false;

  return true;
}
