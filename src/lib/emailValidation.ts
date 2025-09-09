// Utilitário para validação de email
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  // Regex mais rigorosa para validação de email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  // Verificar se não tem espaços
  if (email.includes(' ')) {
    return { isValid: false, error: 'Email não pode conter espaços' };
  }
  
  // Verificar se não começa ou termina com ponto
  if (email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, error: 'Email não pode começar ou terminar com ponto' };
  }
  
  // Verificar se tem pelo menos um ponto após o @
  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    return { isValid: false, error: 'Email deve conter @' };
  }
  
  const domainPart = email.substring(atIndex + 1);
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Email deve ter formato: exemplo@dominio.com' };
  }
  
  // Verificar se a extensão tem pelo menos 2 caracteres
  const lastDotIndex = email.lastIndexOf('.');
  const extension = email.substring(lastDotIndex + 1);
  if (extension.length < 2) {
    return { isValid: false, error: 'Extensão do email deve ter pelo menos 2 caracteres' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email deve seguir o formato: exemplo@dominio.com' };
  }
  
  // Verificações adicionais
  if (email.length > 254) {
    return { isValid: false, error: 'Email muito longo (máximo 254 caracteres)' };
  }
  
  return { isValid: true };
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};