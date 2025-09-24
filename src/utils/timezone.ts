/**
 * Utilitários para trabalhar com timestamps no fuso horário de São Paulo
 */

export const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

/**
 * Retorna a data/hora atual no fuso horário de São Paulo
 */
export function getCurrentTimestampSP(): string {
  return new Date().toLocaleString('pt-BR', { 
    timeZone: SAO_PAULO_TIMEZONE 
  });
}

/**
 * Retorna a data/hora atual no formato ISO com fuso horário de São Paulo
 */
export function getCurrentISOTimestampSP(): string {
  const now = new Date();
  // Converte para o fuso horário de São Paulo e formata como ISO
  return now.toLocaleString('sv-SE', { 
    timeZone: SAO_PAULO_TIMEZONE 
  }).replace(' ', 'T') + '-03:00';
}

/**
 * Formata uma data para exibição no padrão brasileiro com fuso horário de São Paulo
 */
export function formatDateTimeBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: SAO_PAULO_TIMEZONE
  }).replace(',', ' -');
}

/**
 * Formata apenas o horário no padrão brasileiro com fuso horário de São Paulo
 */
export function formatTimeBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: SAO_PAULO_TIMEZONE
  });
}

/**
 * Converte uma data para o fuso horário de São Paulo
 */
export function toSaoPauloTimezone(date: string | Date): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Cria uma nova data ajustada para o fuso horário de São Paulo
  const spTime = new Date(dateObj.toLocaleString('en-US', { 
    timeZone: SAO_PAULO_TIMEZONE 
  }));
  
  return spTime;
}