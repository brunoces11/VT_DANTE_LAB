// Utilitário para validação de email
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  // Regex para validação de email seguindo padrão universal
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email deve seguir o formato: exemplo@dominio.com' };
  }
  
  // Verificações adicionais
  if (email.length > 254) {
    return { isValid: false, error: 'Email muito longo (máximo 254 caracteres)' };
  }
  
  // Verificar se não tem espaços
  if (email.includes(' ')) {
    return { isValid: false, error: 'Email não pode conter espaços' };
  }
  
  // Verificar se não começa ou termina com ponto
  if (email.startsWith('.') || email.endsWith('.')) {
    return { isValid: false, error: 'Email não pode começar ou terminar com ponto' };
  }
  
  return { isValid: true };
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};