/**
 * Utilitários para trabalhar com timestamps UTC e exibição no fuso horário de São Paulo
 * 
 * PADRÃO ADOTADO:
 * - Armazenamento: UTC puro (timestamptz DEFAULT now())
 * - Exibição: Convertido para America/Sao_Paulo no frontend
 */

export const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';

/**
 * Retorna o timestamp atual em UTC no formato ISO 8601
 * Usado para inserção no banco de dados e representação interna
 */
export function getCurrentTimestampUTC(): string {
  return new Date().toISOString();
}

/**
 * Formata uma data UTC para exibição no padrão brasileiro com fuso horário de São Paulo
 * @param date - String ISO UTC ou objeto Date
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
 * @param date - String ISO UTC ou objeto Date
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
 * Converte uma data UTC para o fuso horário de São Paulo
 * @param date - String ISO UTC ou objeto Date
 */
export function toSaoPauloTimezone(date: string | Date): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Cria uma nova data ajustada para o fuso horário de São Paulo
  const spTime = new Date(dateObj.toLocaleString('en-US', { 
    timeZone: SAO_PAULO_TIMEZONE 
  }));
  
  return spTime;
}

/**
 * Verifica se uma data é válida
 * @param date - String ISO UTC ou objeto Date
 */
export function isValidDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}